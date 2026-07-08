import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Alert } from 'react-native';
import { getForecast } from '../services/openMeteo';
import { Forecast, Place } from '../types';

const STORAGE_PLACES = 'tiempo.places';
const STORAGE_CURRENT_LOCATION = 'tiempo.currentLocation';
// v2: se añadieron sensación térmica, humedad, rachas, dirección, UV y precipitación;
// versionar la clave descarta cachés antiguas sin esos campos.
const STORAGE_FORECAST_PREFIX = 'tiempo.forecast.v2.';
const STORAGE_FORECAST_TS_PREFIX = 'tiempo.forecast.ts.v2.';
const FORECAST_TTL_MS = 30 * 60 * 1000;

export const CURRENT_LOCATION_ID = 'current';

interface PlacesContextValue {
  places: Place[];
  currentLocationPlace: Place | undefined;
  activeId: string;
  activePlace: Place | undefined;
  forecast: Forecast | undefined;
  loadingForecast: boolean;
  loadingLocation: boolean;
  message: string;
  setActiveId: (id: string) => void;
  refreshCurrentLocation: () => Promise<void>;
  reloadForecast: () => void;
  addPlace: (place: Place) => Promise<void>;
  removePlace: (id: string) => Promise<void>;
}

const PlacesContext = createContext<PlacesContextValue | undefined>(undefined);

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentLocationPlace, setCurrentLocationPlace] = useState<Place | undefined>(undefined);
  const [activeId, setActiveId] = useState<string>(CURRENT_LOCATION_ID);
  const [forecast, setForecast] = useState<Forecast | undefined>(undefined);
  const [forecastReloadTick, setForecastReloadTick] = useState(0);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [message, setMessage] = useState('Actualiza tu ubicación para empezar.');
  const forceReloadRef = useRef(false);

  useEffect(() => {
    const loadStored = async () => {
      const [storedPlaces, storedLocation] = await Promise.all([
        AsyncStorage.getItem(STORAGE_PLACES),
        AsyncStorage.getItem(STORAGE_CURRENT_LOCATION),
      ]);

      if (storedPlaces) {
        try {
          const parsed = JSON.parse(storedPlaces) as Place[];
          if (Array.isArray(parsed)) {
            setPlaces(parsed);
          }
        } catch {
          // ignora cache corrupta
        }
      }

      if (storedLocation) {
        try {
          const parsed = JSON.parse(storedLocation) as Place;
          if (parsed?.lat !== undefined && parsed?.lon !== undefined) {
            setCurrentLocationPlace(parsed);
          }
        } catch {
          // ignora cache corrupta
        }
      }
    };

    void loadStored();
  }, []);

  useEffect(() => {
    if (!message.trim()) {
      return;
    }
    void AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  useEffect(() => {
    const place = activeId === CURRENT_LOCATION_ID ? currentLocationPlace : places.find((p) => p.id === activeId);

    if (!place) {
      setForecast(undefined);
      return;
    }

    const loadForecast = async (force: boolean) => {
      if (!force) {
        const [cachedRaw, tsRaw] = await Promise.all([
          AsyncStorage.getItem(`${STORAGE_FORECAST_PREFIX}${activeId}`),
          AsyncStorage.getItem(`${STORAGE_FORECAST_TS_PREFIX}${activeId}`),
        ]);
        const age = tsRaw ? Date.now() - Number(tsRaw) : Infinity;
        if (cachedRaw && age < FORECAST_TTL_MS) {
          try {
            const parsed = JSON.parse(cachedRaw) as Forecast;
            if (parsed?.days?.length > 0) {
              setForecast(parsed);
              const mins = Math.floor(age / 60000);
              setMessage(`Previsión en caché (hace ${mins} min) para ${place.name}`);
              return;
            }
          } catch {
            // cache corrupta, sigue con la petición remota
          }
        }
      }

      setLoadingForecast(true);
      setMessage(`Cargando previsión para ${place.name}...`);
      try {
        const data = await getForecast(place.lat, place.lon);
        setForecast(data);
        await Promise.all([
          AsyncStorage.setItem(`${STORAGE_FORECAST_PREFIX}${activeId}`, JSON.stringify(data)),
          AsyncStorage.setItem(`${STORAGE_FORECAST_TS_PREFIX}${activeId}`, String(Date.now())),
        ]);
        setMessage(`Previsión actualizada para ${place.name}`);
      } catch (error) {
        const rawError = String((error as Error).message ?? error);
        const cached = await AsyncStorage.getItem(`${STORAGE_FORECAST_PREFIX}${activeId}`);
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as Forecast;
            if (parsed?.days?.length > 0) {
              setForecast(parsed);
              setMessage(`Error de red (${rawError}). Mostrando previsión en caché.`);
              return;
            }
          } catch {
            // sigue con el error normal
          }
        }
        setForecast(undefined);
        setMessage(`Error de previsión: ${rawError}`);
      } finally {
        setLoadingForecast(false);
      }
    };

    const force = forceReloadRef.current;
    forceReloadRef.current = false;
    void loadForecast(force);
  }, [activeId, currentLocationPlace, places, forecastReloadTick]);

  const refreshCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const permissions = await Location.requestForegroundPermissionsAsync();
      if (permissions.status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesito permiso de ubicación para dar la previsión de tu zona.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const geocoded = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const name = geocoded[0]?.city ?? geocoded[0]?.subregion ?? 'Mi ubicación';
      const admin1 = geocoded[0]?.region ?? undefined;

      const place: Place = {
        id: CURRENT_LOCATION_ID,
        name,
        admin1,
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };

      setCurrentLocationPlace(place);
      await AsyncStorage.setItem(STORAGE_CURRENT_LOCATION, JSON.stringify(place));
      setActiveId(CURRENT_LOCATION_ID);
      forceReloadRef.current = true;
      setForecastReloadTick((v) => v + 1);
      setMessage(`Ubicación actualizada: ${name}${admin1 ? `, ${admin1}` : ''}`);
    } catch (error) {
      setMessage(`Error con ubicación: ${String((error as Error).message ?? error)}`);
    } finally {
      setLoadingLocation(false);
    }
  };

  const reloadForecast = () => {
    forceReloadRef.current = true;
    setForecastReloadTick((v) => v + 1);
  };

  const addPlace = async (place: Place) => {
    const next = [place, ...places.filter((p) => p.id !== place.id)];
    setPlaces(next);
    await AsyncStorage.setItem(STORAGE_PLACES, JSON.stringify(next));
    setActiveId(place.id);
    setMessage(`${place.name} añadido a tus lugares.`);
  };

  const removePlace = async (id: string) => {
    const removed = places.find((p) => p.id === id);
    const next = places.filter((p) => p.id !== id);
    setPlaces(next);
    await AsyncStorage.setItem(STORAGE_PLACES, JSON.stringify(next));
    if (activeId === id) {
      setActiveId(CURRENT_LOCATION_ID);
    }
    if (removed) {
      setMessage(`${removed.name} eliminado de tus lugares.`);
    }
  };

  const activePlace = activeId === CURRENT_LOCATION_ID ? currentLocationPlace : places.find((p) => p.id === activeId);

  const value: PlacesContextValue = {
    places,
    currentLocationPlace,
    activeId,
    activePlace,
    forecast,
    loadingForecast,
    loadingLocation,
    message,
    setActiveId,
    refreshCurrentLocation,
    reloadForecast,
    addPlace,
    removePlace,
  };

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
}

export function usePlaces(): PlacesContextValue {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces debe usarse dentro de PlacesProvider');
  }
  return context;
}
