import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Alert, AppState } from 'react-native';
import { getForecast } from '../services/openMeteo';
import { Forecast, Place } from '../types';

const STORAGE_PLACES = 'tiempo.places';
const STORAGE_CURRENT_LOCATION = 'tiempo.currentLocation';
// v2: se añadieron sensación térmica, humedad, rachas, dirección, UV y precipitación;
// versionar la clave descarta cachés antiguas sin esos campos.
const STORAGE_FORECAST_PREFIX = 'tiempo.forecast.v2.';
const STORAGE_FORECAST_TS_PREFIX = 'tiempo.forecast.ts.v2.';
const FORECAST_TTL_MS = 30 * 60 * 1000;
// No se vuelve a consultar el GPS más de una vez cada 2 minutos, para no gastar batería
// cuando se cambia de pestaña; y solo se considera que el usuario se ha movido de sitio
// si se ha desplazado más de 1,5 km (dentro de la misma ciudad la previsión es la misma).
const LOCATION_RECHECK_MS = 2 * 60 * 1000;
const LOCATION_CHANGED_METERS = 1500;

export const CURRENT_LOCATION_ID = 'current';

function distanceMeters(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

interface PlacesContextValue {
  places: Place[];
  currentLocationPlace: Place | undefined;
  activeId: string;
  activePlace: Place | undefined;
  forecast: Forecast | undefined;
  /** Momento (epoch ms) en que se obtuvieron los datos que se están mostrando. */
  forecastUpdatedAt: number | undefined;
  loadingForecast: boolean;
  loadingLocation: boolean;
  message: string;
  setActiveId: (id: string) => void;
  refreshCurrentLocation: () => Promise<void>;
  /** Comprueba en silencio si el usuario ha cambiado de ubicación (no pide permiso). */
  detectCurrentLocation: () => Promise<void>;
  reloadForecast: (silent?: boolean) => void;
  viewPlace: (place: Place) => void;
  addPlace: (place: Place) => Promise<void>;
  removePlace: (id: string) => Promise<void>;
}

const PlacesContext = createContext<PlacesContextValue | undefined>(undefined);

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentLocationPlace, setCurrentLocationPlace] = useState<Place | undefined>(undefined);
  // Lugar buscado que se está consultando sin haberlo guardado en "Mis lugares".
  const [previewPlace, setPreviewPlace] = useState<Place | undefined>(undefined);
  const [activeId, setActiveId] = useState<string>(CURRENT_LOCATION_ID);
  const [forecast, setForecast] = useState<Forecast | undefined>(undefined);
  const [forecastUpdatedAt, setForecastUpdatedAt] = useState<number | undefined>(undefined);
  const [forecastReloadTick, setForecastReloadTick] = useState(0);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [message, setMessage] = useState('Actualiza tu ubicación para empezar.');
  const forceReloadRef = useRef(false);
  // Una recarga "silenciosa" (al abrir la app, volver de segundo plano o entrar en
  // la pestaña Hoy) refresca los datos sin indicador ni anuncios de VoiceOver, salvo
  // que aún no haya nada en pantalla (primera carga), donde sí se muestra el indicador.
  const silentReloadRef = useRef(false);
  const forecastRef = useRef<Forecast | undefined>(undefined);
  forecastRef.current = forecast;
  // Espejos en refs para poder consultarlos desde los listeners sin cerrar sobre valores viejos.
  const currentLocationRef = useRef<Place | undefined>(undefined);
  currentLocationRef.current = currentLocationPlace;
  const activeIdRef = useRef<string>(activeId);
  activeIdRef.current = activeId;
  const lastLocationCheckRef = useRef(0);

  // Detecta en segundo plano si el usuario se ha movido de ciudad y, si es así, cambia la
  // previsión a su ubicación actual. No pide permiso nunca: si aún no está concedido, no
  // hace nada (para eso está el botón "Actualizar mi ubicación", que sí lo solicita). Solo
  // actúa cuando se está viendo "mi ubicación", para no pisar un lugar elegido a mano.
  const detectCurrentLocation = useCallback(async () => {
    if (activeIdRef.current !== CURRENT_LOCATION_ID) {
      return;
    }
    if (Date.now() - lastLocationCheckRef.current < LOCATION_RECHECK_MS) {
      return;
    }

    try {
      const permissions = await Location.getForegroundPermissionsAsync();
      if (permissions.status !== 'granted') {
        return;
      }
      lastLocationCheckRef.current = Date.now();

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { lat: position.coords.latitude, lon: position.coords.longitude };
      const previous = currentLocationRef.current;
      if (previous && distanceMeters(previous, coords) < LOCATION_CHANGED_METERS) {
        return;
      }

      const geocoded = await Location.reverseGeocodeAsync({
        latitude: coords.lat,
        longitude: coords.lon,
      });
      const name = geocoded[0]?.city ?? geocoded[0]?.subregion ?? 'Mi ubicación';
      const admin1 = geocoded[0]?.region ?? undefined;
      const place: Place = { id: CURRENT_LOCATION_ID, name, admin1, lat: coords.lat, lon: coords.lon };

      setCurrentLocationPlace(place);
      currentLocationRef.current = place;
      await AsyncStorage.setItem(STORAGE_CURRENT_LOCATION, JSON.stringify(place));
      // Obligatorio forzar: la previsión guardada bajo la clave "current" es la de la
      // ciudad anterior, así que sin esto se mostrarían datos del sitio equivocado.
      forceReloadRef.current = true;
      setForecastReloadTick((v) => v + 1);
      // Solo se avisa cuando de verdad cambia de sitio; un refresco normal sigue siendo silencioso.
      if (previous && previous.name !== name) {
        setMessage(`Ahora estás en ${name}${admin1 ? `, ${admin1}` : ''}`);
      }
    } catch {
      // Si el GPS falla se mantiene la última ubicación conocida, sin molestar al usuario.
    }
  }, []);

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
            // También en la ref, para que la detección posterior compare con el valor
            // real y no vuelva a geocodificar si el usuario sigue en el mismo sitio.
            currentLocationRef.current = parsed;
          }
        } catch {
          // ignora cache corrupta
        }
      }
    };

    // Al abrir la app se comprueba la ubicación por si el usuario ha viajado.
    void loadStored().then(() => detectCurrentLocation());
  }, [detectCurrentLocation]);

  useEffect(() => {
    if (!message.trim()) {
      return;
    }
    void AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  useEffect(() => {
    const place =
      activeId === CURRENT_LOCATION_ID
        ? currentLocationPlace
        : places.find((p) => p.id === activeId) ?? (previewPlace?.id === activeId ? previewPlace : undefined);

    if (!place) {
      setForecast(undefined);
      setForecastUpdatedAt(undefined);
      return;
    }

    const loadForecast = async (force: boolean, silent: boolean) => {
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
              setForecastUpdatedAt(tsRaw ? Number(tsRaw) : undefined);
              if (!silent) {
                setMessage(`Previsión de ${place.name}`);
              }
              return;
            }
          } catch {
            // datos guardados corruptos, sigue con la petición remota
          }
        }
      }

      if (!silent) {
        setLoadingForecast(true);
        setMessage(`Cargando previsión para ${place.name}...`);
      }
      try {
        const data = await getForecast(place.lat, place.lon);
        const now = Date.now();
        setForecast(data);
        setForecastUpdatedAt(now);
        await Promise.all([
          AsyncStorage.setItem(`${STORAGE_FORECAST_PREFIX}${activeId}`, JSON.stringify(data)),
          AsyncStorage.setItem(`${STORAGE_FORECAST_TS_PREFIX}${activeId}`, String(now)),
        ]);
        if (!silent) {
          setMessage(`Previsión actualizada para ${place.name}`);
        }
      } catch (error) {
        // En una recarga silenciosa en segundo plano mantenemos los datos actuales
        // sin molestar con un error.
        if (silent) {
          return;
        }
        const rawError = String((error as Error).message ?? error);
        const [cached, cachedTs] = await Promise.all([
          AsyncStorage.getItem(`${STORAGE_FORECAST_PREFIX}${activeId}`),
          AsyncStorage.getItem(`${STORAGE_FORECAST_TS_PREFIX}${activeId}`),
        ]);
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as Forecast;
            if (parsed?.days?.length > 0) {
              setForecast(parsed);
              setForecastUpdatedAt(cachedTs ? Number(cachedTs) : undefined);
              setMessage('Sin conexión. Mostrando los últimos datos disponibles.');
              return;
            }
          } catch {
            // sigue con el error normal
          }
        }
        setForecast(undefined);
        setForecastUpdatedAt(undefined);
        setMessage(`Error de previsión: ${rawError}`);
      } finally {
        if (!silent) {
          setLoadingForecast(false);
        }
      }
    };

    const force = forceReloadRef.current;
    forceReloadRef.current = false;
    const silentRequested = silentReloadRef.current;
    silentReloadRef.current = false;
    // Silencioso solo si ya hay datos que mantener en pantalla; en la primera carga
    // sí mostramos indicador aunque la recarga venga de un evento automático.
    const silent = silentRequested && forecastRef.current !== undefined;
    void loadForecast(force, silent);
  }, [activeId, currentLocationPlace, previewPlace, places, forecastReloadTick]);

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
      // Acaba de comprobarse el GPS a mano: la comprobación automática puede esperar.
      lastLocationCheckRef.current = Date.now();
      forceReloadRef.current = true;
      setForecastReloadTick((v) => v + 1);
      setMessage(`Ubicación actualizada: ${name}${admin1 ? `, ${admin1}` : ''}`);
    } catch (error) {
      setMessage(`Error con ubicación: ${String((error as Error).message ?? error)}`);
    } finally {
      setLoadingLocation(false);
    }
  };

  const reloadForecast = useCallback((silent = false) => {
    forceReloadRef.current = true;
    silentReloadRef.current = silent;
    setForecastReloadTick((v) => v + 1);
  }, []);

  // Consulta la previsión de un lugar buscado sin necesidad de guardarlo antes.
  const viewPlace = useCallback((place: Place) => {
    setPreviewPlace(place);
    setActiveId(place.id);
    forceReloadRef.current = true;
    setForecastReloadTick((v) => v + 1);
  }, []);

  // Al volver la app a primer plano se comprueba si el usuario se ha movido de ciudad
  // y, en cualquier caso, se refresca la previsión.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void detectCurrentLocation();
        reloadForecast(true);
      }
    });
    return () => sub.remove();
  }, [detectCurrentLocation, reloadForecast]);

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

  const activePlace =
    activeId === CURRENT_LOCATION_ID
      ? currentLocationPlace
      : places.find((p) => p.id === activeId) ?? (previewPlace?.id === activeId ? previewPlace : undefined);

  const value: PlacesContextValue = {
    places,
    currentLocationPlace,
    activeId,
    activePlace,
    forecast,
    forecastUpdatedAt,
    loadingForecast,
    loadingLocation,
    message,
    setActiveId,
    refreshCurrentLocation,
    detectCurrentLocation,
    reloadForecast,
    viewPlace,
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
