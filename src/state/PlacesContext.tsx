import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AccessibilityInfo, Alert, AppState } from 'react-native';
import { getObservacion } from '../services/observacion';
import { getCurrentByPlaces, getForecast } from '../services/openMeteo';
import { CurrentObservation, Forecast, Place } from '../types';
import { nombreUbicacion } from '../utils/geocode';
import { TempGuardada } from '../utils/tempActual';

const STORAGE_PLACES = 'tiempo.places';
const STORAGE_CURRENT_LOCATION = 'tiempo.currentLocation';
// v2: se añadieron sensación térmica, humedad, rachas, dirección, UV y precipitación;
// versionar la clave descarta cachés antiguas sin esos campos.
const STORAGE_FORECAST_PREFIX = 'tiempo.forecast.v2.';
const STORAGE_FORECAST_TS_PREFIX = 'tiempo.forecast.ts.v2.';
// Temperatura actual de todos los lugares (lista de "Mis lugares" y selector de "Hoy"), cada una
// con la hora en que se obtuvo para poder anunciar su antiguedad.
const STORAGE_CURRENT_TEMPS = 'tiempo.currentTemps.v1';
const FORECAST_TTL_MS = 30 * 60 * 1000;
// No se piden las temperaturas de todos los lugares mas de una vez cada 3 min al cambiar de
// pestana; es una sola llamada, pero no hace falta repetirla en cada foco.
const TEMPS_RECHECK_MS = 3 * 60 * 1000;
// No se vuelve a consultar el GPS más de una vez cada 2 minutos, para no gastar batería
// cuando se cambia de pestaña; y solo se considera que el usuario se ha movido de sitio
// si se ha desplazado más de 1,5 km (dentro de la misma ciudad la previsión es la misma).
const LOCATION_RECHECK_MS = 2 * 60 * 1000;
const LOCATION_CHANGED_METERS = 1500;
// La observacion medida no se vuelve a pedir mas de una vez cada 10 min por lugar: AEMET publica
// el parte una vez por hora (y con ~85 min de retraso), asi que insistir mas no trae nada nuevo.
const OBSERVACION_RECHECK_MS = 10 * 60 * 1000;

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

export interface PrevisionGuardada {
  forecast: Forecast;
  updatedAt: number | undefined;
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
  /** Temperatura actual de cada lugar (por id), con la hora en que se obtuvo. */
  currentByPlace: Record<string, TempGuardada>;
  /**
   * Previsión ya cargada de cada lugar, para que las páginas de "Hoy" puedan pintarse mientras
   * se desliza sin pedir nada. Se llena con lo que se va visitando; NO dispara consultas extra.
   */
  forecastByPlace: Record<string, PrevisionGuardada>;
  /**
   * Observacion MEDIDA de cada lugar (por id), cuando hay una estacion que lo represente. Que falte
   * un lugar es normal: fuera de España no hay red, y dentro puede no haber estacion lo bastante
   * cerca o a la misma cota. No se guarda en disco a proposito: una medicion vieja no vale, y sin
   * red es preferible enseñar solo la prevision a resucitar la de anteayer.
   */
  observacionByPlace: Record<string, CurrentObservation>;
  /** Refresca en una sola llamada la temperatura actual de todos los lugares. Con throttle. */
  refreshCurrentTemps: (force?: boolean) => Promise<void>;
  setActiveId: (id: string) => void;
  refreshCurrentLocation: () => Promise<void>;
  /** Comprueba en silencio si el usuario ha cambiado de ubicación (no pide permiso). */
  detectCurrentLocation: () => Promise<void>;
  reloadForecast: (silent?: boolean) => void;
  /**
   * Carga la previsión de un lugar CUALQUIERA (por ejemplo uno recién buscado y sin guardar) y la
   * deja en forecastByPlace, sin tocar el lugar activo ni la pantalla Hoy.
   */
  cargarPrevision: (place: Place) => Promise<void>;
  addPlace: (place: Place) => Promise<void>;
  removePlace: (id: string) => Promise<void>;
}

const PlacesContext = createContext<PlacesContextValue | undefined>(undefined);

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentLocationPlace, setCurrentLocationPlace] = useState<Place | undefined>(undefined);
  const [activeId, setActiveId] = useState<string>(CURRENT_LOCATION_ID);
  const [forecast, setForecast] = useState<Forecast | undefined>(undefined);
  const [forecastUpdatedAt, setForecastUpdatedAt] = useState<number | undefined>(undefined);
  const [forecastReloadTick, setForecastReloadTick] = useState(0);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [message, setMessage] = useState('Actualiza tu ubicación para empezar.');
  const [currentByPlace, setCurrentByPlace] = useState<Record<string, TempGuardada>>({});
  const [forecastByPlace, setForecastByPlace] = useState<Record<string, PrevisionGuardada>>({});
  const [observacionByPlace, setObservacionByPlace] = useState<Record<string, CurrentObservation>>(
    {},
  );
  const ultimaObservacionRef = useRef<Record<string, number>>({});
  const forceReloadRef = useRef(false);
  // Una recarga "silenciosa" (al abrir la app, volver de segundo plano o entrar en
  // la pestaña Hoy) refresca los datos sin indicador ni anuncios de VoiceOver, salvo
  // que aún no haya nada en pantalla (primera carga), donde sí se muestra el indicador.
  const silentReloadRef = useRef(false);
  const forecastRef = useRef<Forecast | undefined>(undefined);
  const currentLocationRef = useRef<Place | undefined>(undefined);
  const activeIdRef = useRef<string>(activeId);
  const placesRef = useRef<Place[]>(places);
  const currentByPlaceRef = useRef<Record<string, TempGuardada>>(currentByPlace);
  const lastLocationCheckRef = useRef(0);
  const lastTempsFetchRef = useRef(0);
  // Espejos en refs para consultarlos desde los listeners de segundo plano sin cerrar sobre
  // valores viejos. Se escriben en render a proposito: moverlo a un efecto retrasaria la
  // actualizacion y un listener que dispara entre el render y el efecto leeria el valor anterior.
  /* eslint-disable react-hooks/refs */
  forecastRef.current = forecast;
  currentLocationRef.current = currentLocationPlace;
  activeIdRef.current = activeId;
  placesRef.current = places;
  currentByPlaceRef.current = currentByPlace;
  /* eslint-enable react-hooks/refs */

  // Comprueba en segundo plano la ubicación actual: refresca su NOMBRE (barrio incluido) siempre, y
  // recarga la PREVISIÓN solo si te has movido de zona (más de 1,5 km). No pide permiso nunca: si aún
  // no está concedido, no hace nada (para eso está el botón "Actualizar mi ubicación", que sí lo
  // solicita). Solo actúa cuando se está viendo "mi ubicación", para no pisar un lugar elegido a mano.
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

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = { lat: position.coords.latitude, lon: position.coords.longitude };
      const previous = currentLocationRef.current;
      const moved = !previous || distanceMeters(previous, coords) >= LOCATION_CHANGED_METERS;

      // El nombre (barrio) se re-geocodifica SIEMPRE, no solo al moverse de ciudad: un barrio es más
      // pequeño que el umbral de 1,5 km, y el nombre guardado puede ser viejo (p. ej. justo tras
      // actualizar la app, cuando aún no se ha vuelto a geocodificar). El TIEMPO, en cambio, solo se
      // recarga si de verdad te has movido de zona; dentro de la ciudad la previsión es la misma.
      const geocoded = await Location.reverseGeocodeAsync({
        latitude: coords.lat,
        longitude: coords.lon,
      });
      const name = nombreUbicacion(geocoded[0]) ?? previous?.name ?? 'Mi ubicación';
      const admin1 = geocoded[0]?.region ?? previous?.admin1;
      const nameChanged = previous?.name !== name || previous?.admin1 !== admin1;
      if (!moved && !nameChanged) {
        return;
      }

      const place: Place = {
        id: CURRENT_LOCATION_ID,
        name,
        admin1,
        // Para poner delante los resultados de búsqueda de tu propio país. Se guarda el código ISO
        // porque es lo único comparable con lo que devuelve Open-Meteo; el nombre va como respaldo
        // por si iOS no diera el código.
        country: geocoded[0]?.country ?? previous?.country,
        countryCode: geocoded[0]?.isoCountryCode ?? previous?.countryCode,
        // Si no te has movido se conservan las coordenadas anteriores: así unos metros de deriva del
        // GPS no invalidan la caché del tiempo.
        lat: moved ? coords.lat : (previous?.lat ?? coords.lat),
        lon: moved ? coords.lon : (previous?.lon ?? coords.lon),
      };

      setCurrentLocationPlace(place);
      currentLocationRef.current = place;
      await AsyncStorage.setItem(STORAGE_CURRENT_LOCATION, JSON.stringify(place));

      if (moved) {
        // Obligatorio forzar: la previsión guardada bajo la clave "current" es la de la zona
        // anterior, así que sin esto se mostrarían datos del sitio equivocado.
        forceReloadRef.current = true;
        setForecastReloadTick((v) => v + 1);
        // Solo se avisa cuando de verdad cambias de sitio; un refresco de nombre es silencioso.
        if (previous && previous.name !== name) {
          setMessage(`Ahora estás en ${name}${admin1 ? `, ${admin1}` : ''}`);
        }
      } else {
        // Mismo sitio, solo cambió el nombre (p. ej. el barrio): la previsión es la misma. El cambio
        // de estado dispara el efecto de carga; que use la caché y no reanuncie nada.
        silentReloadRef.current = true;
      }
    } catch {
      // Si el GPS falla se mantiene la última ubicación conocida, sin molestar al usuario.
    }
  }, []);

  // Refresca la temperatura actual de todos los lugares (ubicación actual + guardados) en una sola
  // llamada. Silenciosa: si falla, se conservan los últimos valores conocidos (que quedarán marcados
  // como viejos por su hora). El throttle evita repetir la llamada al cambiar de pestaña.
  const refreshCurrentTemps = useCallback(async (force = false) => {
    if (!force && Date.now() - lastTempsFetchRef.current < TEMPS_RECHECK_MS) {
      return;
    }

    const candidatos = [currentLocationRef.current, ...placesRef.current].filter((p): p is Place =>
      Boolean(p),
    );
    // La ubicación actual y un lugar guardado podrían compartir id; se consulta cada uno una vez.
    const vistos = new Set<string>();
    const consulta = candidatos.filter((p) =>
      vistos.has(p.id) ? false : (vistos.add(p.id), true),
    );
    if (consulta.length === 0) {
      return;
    }

    lastTempsFetchRef.current = Date.now();
    try {
      const res = await getCurrentByPlaces(
        consulta.map((p) => ({ id: p.id, lat: p.lat, lon: p.lon })),
      );
      const ahora = Date.now();
      const next: Record<string, TempGuardada> = { ...currentByPlaceRef.current };
      for (const p of consulta) {
        const temperature = res[p.id]?.temperature;
        // Si un lugar no devuelve temperatura se conserva la anterior; no se pisa con un hueco.
        if (temperature !== undefined) {
          next[p.id] = { temperature, fetchedAt: ahora };
        }
      }
      setCurrentByPlace(next);
      currentByPlaceRef.current = next;
      await AsyncStorage.setItem(STORAGE_CURRENT_TEMPS, JSON.stringify(next));
    } catch {
      // Sin red: se mantienen los últimos valores. Se permite reintentar antes del throttle.
      lastTempsFetchRef.current = 0;
    }
  }, []);

  // Pide la observación MEDIDA de un lugar. Va aparte de la previsión y falla aparte: si no hay
  // estación, si el servidor está caído o si no hay red, la pantalla se queda con la previsión y
  // no se enseña ningún error. La medición es un extra; la previsión es el contenido.
  const cargarObservacion = useCallback(
    async (id: string, lat: number, lon: number, elevacion?: number) => {
      if (Date.now() - (ultimaObservacionRef.current[id] ?? 0) < OBSERVACION_RECHECK_MS) {
        return;
      }
      ultimaObservacionRef.current[id] = Date.now();

      const observacion = await getObservacion(lat, lon, elevacion);
      if (!observacion) {
        // Se permite reintentar antes del throttle: puede haber sido un fallo de red pasajero.
        ultimaObservacionRef.current[id] = 0;
        // Y se retira la anterior, si la había: sin dato nuevo, dejar el viejo en pantalla sería
        // enseñar la medición de otro momento (o de otro sitio, si el lugar activo cambió).
        setObservacionByPlace((previo) => {
          if (previo[id] === undefined) {
            return previo; // nada que quitar: se evita un render de más
          }
          const siguiente = { ...previo };
          delete siguiente[id];
          return siguiente;
        });
        return;
      }
      setObservacionByPlace((previo) => ({ ...previo, [id]: observacion }));
    },
    [],
  );

  useEffect(() => {
    const loadStored = async () => {
      const [storedPlaces, storedLocation, storedTemps] = await Promise.all([
        AsyncStorage.getItem(STORAGE_PLACES),
        AsyncStorage.getItem(STORAGE_CURRENT_LOCATION),
        AsyncStorage.getItem(STORAGE_CURRENT_TEMPS),
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

      if (storedTemps) {
        try {
          const parsed = JSON.parse(storedTemps) as Record<string, TempGuardada>;
          if (parsed && typeof parsed === 'object') {
            setCurrentByPlace(parsed);
            currentByPlaceRef.current = parsed;
          }
        } catch {
          // ignora cache corrupta
        }
      }
    };

    // Permiso de ubicación en la PRIMERA apertura. Antes no se pedía nunca al arrancar: la app
    // solo lo solicitaba desde el botón "Actualizar mi ubicación", desde la búsqueda o al montar un
    // aviso, así que quien entraba a mirar el tiempo se encontraba la pantalla vacía sin saber por
    // qué. Solo se pide si iOS aún no ha preguntado ('undetermined'); si ya se denegó, insistir no
    // muestra ningún diálogo y solo estorbaría (para eso está el botón, que lleva a Ajustes).
    const pedirPermisoLaPrimeraVez = async () => {
      try {
        const actual = await Location.getForegroundPermissionsAsync();
        if (actual.status === 'undetermined' && actual.canAskAgain) {
          await Location.requestForegroundPermissionsAsync();
        }
      } catch {
        // Si la consulta del permiso falla, se sigue igual: detectCurrentLocation ya no hace nada
        // sin permiso concedido.
      }
    };

    // Al abrir la app se comprueba la ubicación por si el usuario ha viajado.
    void loadStored()
      .then(pedirPermisoLaPrimeraVez)
      .then(() => detectCurrentLocation());
  }, [detectCurrentLocation]);

  useEffect(() => {
    if (!message.trim()) {
      return;
    }
    // queue: true (iOS) encola el anuncio tras el que esté sonando —p. ej. la activación del botón
    // al seleccionar un lugar en el ajustable—. Con announceForAccessibility a secas, el anuncio
    // competía con esa activación y VoiceOver lo descartaba a veces ("no siempre lo dice").
    AccessibilityInfo.announceForAccessibilityWithOptions(message, { queue: true });
  }, [message]);

  // Mantiene al día la temperatura de todos los lugares. Se fuerza cuando aparece uno sin dato
  // (lugar recién añadido, o la ubicación actual al terminar de detectarse en el arranque); si no,
  // el throttle decide. Las pantallas también lo piden al recibir el foco.
  useEffect(() => {
    const ids = [currentLocationPlace, ...places]
      .filter((p): p is Place => Boolean(p))
      .map((p) => p.id);
    const faltaAlguno = ids.some((id) => currentByPlaceRef.current[id] === undefined);
    void refreshCurrentTemps(faltaAlguno);
  }, [places, currentLocationPlace, refreshCurrentTemps]);

  useEffect(() => {
    const place =
      activeId === CURRENT_LOCATION_ID
        ? currentLocationPlace
        : places.find((p) => p.id === activeId);

    if (!place) {
      // Limpia la prevision cuando no hay lugar activo; sync de estado, no cascada.
      /* eslint-disable react-hooks/set-state-in-effect */
      setForecast(undefined);
      setForecastUpdatedAt(undefined);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    // Muestra la previsión y la guarda además en el mapa por lugar, del que se pintan las páginas
    // de "Hoy" al deslizar. El mapa solo recoge lo ya cargado: no provoca ninguna consulta extra.
    const aplicarPrevision = (data: Forecast, updatedAt: number | undefined) => {
      setForecast(data);
      setForecastUpdatedAt(updatedAt);
      setForecastByPlace((previo) => ({ ...previo, [activeId]: { forecast: data, updatedAt } }));
      // La medición se pide también cuando la previsión sale de la caché: la previsión aguanta 30
      // min, pero la observación tiene su propio ritmo. `elevation` viaja dentro de la previsión
      // (incluida la guardada), y sirve para descartar estaciones a otra cota.
      void cargarObservacion(activeId, place.lat, place.lon, data.elevation);
    };

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
              aplicarPrevision(parsed, tsRaw ? Number(tsRaw) : undefined);
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
        aplicarPrevision(data, now);
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
              aplicarPrevision(parsed, cachedTs ? Number(cachedTs) : undefined);
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
  }, [activeId, currentLocationPlace, places, forecastReloadTick, cargarObservacion]);

  const refreshCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const permissions = await Location.requestForegroundPermissionsAsync();
      if (permissions.status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesito permiso de ubicación para dar la previsión de tu zona.',
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const geocoded = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const name = nombreUbicacion(geocoded[0]) ?? 'Mi ubicación';
      const admin1 = geocoded[0]?.region ?? undefined;

      const place: Place = {
        id: CURRENT_LOCATION_ID,
        name,
        admin1,
        country: geocoded[0]?.country ?? undefined,
        countryCode: geocoded[0]?.isoCountryCode ?? undefined,
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

  // Previsión de un lugar cualquiera (p. ej. uno buscado y aún sin guardar), SIN convertirlo en el
  // lugar activo. Antes, consultar un lugar buscado lo metía como activo en "Hoy" y, al no estar en
  // la lista, no había forma de volver: se quedaba uno encerrado en esa previsión.
  const cargarPrevision = useCallback(
    async (place: Place) => {
      const [cachedRaw, tsRaw] = await Promise.all([
        AsyncStorage.getItem(`${STORAGE_FORECAST_PREFIX}${place.id}`),
        AsyncStorage.getItem(`${STORAGE_FORECAST_TS_PREFIX}${place.id}`),
      ]);
      const edad = tsRaw ? Date.now() - Number(tsRaw) : Infinity;
      if (cachedRaw && edad < FORECAST_TTL_MS) {
        try {
          const guardada = JSON.parse(cachedRaw) as Forecast;
          if (guardada?.days?.length > 0) {
            setForecastByPlace((previo) => ({
              ...previo,
              [place.id]: { forecast: guardada, updatedAt: tsRaw ? Number(tsRaw) : undefined },
            }));
            void cargarObservacion(place.id, place.lat, place.lon, guardada.elevation);
            return;
          }
        } catch {
          // cache corrupta: se pide de nuevo
        }
      }

      const data = await getForecast(place.lat, place.lon);
      const ahora = Date.now();
      setForecastByPlace((previo) => ({
        ...previo,
        [place.id]: { forecast: data, updatedAt: ahora },
      }));
      void cargarObservacion(place.id, place.lat, place.lon, data.elevation);
      // Se guarda en disco igual que la del lugar activo: si luego se guarda el lugar, ya está lista.
      await Promise.all([
        AsyncStorage.setItem(`${STORAGE_FORECAST_PREFIX}${place.id}`, JSON.stringify(data)),
        AsyncStorage.setItem(`${STORAGE_FORECAST_TS_PREFIX}${place.id}`, String(ahora)),
      ]);
    },
    [cargarObservacion],
  );

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
    activeId === CURRENT_LOCATION_ID ? currentLocationPlace : places.find((p) => p.id === activeId);

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
    currentByPlace,
    forecastByPlace,
    observacionByPlace,
    refreshCurrentTemps,
    setActiveId,
    refreshCurrentLocation,
    detectCurrentLocation,
    reloadForecast,
    cargarPrevision,
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
