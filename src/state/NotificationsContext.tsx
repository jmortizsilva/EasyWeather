import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
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
import {
  AvisosOficialesAlert,
  NotificationSettings,
  Place,
  SummaryAlert,
  ThresholdAlert,
} from '../types';
import {
  completarAjustes,
  DEFAULT_NOTIFICATION_SETTINGS,
  isValidSettings,
} from '../utils/ajustesAvisos';
import {
  canAskForNotificationPermission,
  cancelAllNotifications,
  explainNotificationsBeforeAsking,
  hasNotificationPermission,
  requestNotificationPermission,
} from '../utils/notifications';
import {
  ResumenServidor,
  SincronizacionAvisos,
  sincronizarAvisos,
  sendTestNotification,
} from '../utils/push';
import {
  detenerSeguimientoUbicacion,
  iniciarSeguimientoUbicacion,
  leerUbicacionActual,
  pedirPermisoUbicacionSiempre,
} from '../utils/ubicacionFondo';
import { ubicacionParaEnviar, UbicacionConNombre } from '../utils/ubicacionAvisos';
import { vibrarConfirmacion, vibrarError } from '../utils/haptica';
import { CURRENT_LOCATION_ID, usePlaces } from './PlacesContext';

// Construye el estado completo de avisos para el servidor a partir de los ajustes. Los resumenes de
// "mi ubicacion" van con seguirUbicacion=true (el servidor usa la ubicacion viva del telefono); los
// de una ciudad fija llevan su lat/lon. Un resumen sin lugar resoluble (ubicacion aun desconocida)
// se omite; se registrara cuando se sepa la ubicacion.
function construirPayload(
  next: NotificationSettings,
  resolvePlace: (id: string) => Place | undefined,
  ubicacionActual: UbicacionConNombre | null,
): SincronizacionAvisos {
  const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const resumenes: ResumenServidor[] = [];
  for (const s of next.summaries) {
    if (!s.enabled) {
      continue;
    }
    const place = resolvePlace(s.placeId);
    if (!place) {
      continue;
    }
    resumenes.push({
      id: s.id,
      hora: s.hour,
      minuto: s.minute,
      campos: s.fields,
      seguirUbicacion: s.placeId === CURRENT_LOCATION_ID,
      lat: place.lat,
      lon: place.lon,
      nombre: place.name,
    });
  }
  return {
    zonaHoraria,
    ubicacion: ubicacionActual,
    umbral: next.threshold.enabled
      ? { maxThreshold: next.threshold.maxThreshold, minThreshold: next.threshold.minThreshold }
      : null,
    resumenes,
    avisosOficiales: next.avisosOficiales?.enabled
      ? {
          nivelMinimo: next.avisosOficiales.nivelMinimo,
          fenomenosSilenciados: next.avisosOficiales.fenomenosSilenciados ?? [],
        }
      : null,
  };
}

const STORAGE_NOTIFICATIONS = 'tiempo.notifications.v2';

// Que los avisos también se vean si la app está abierta.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface NotificationsContextValue {
  settings: NotificationSettings;
  saveSummary: (summary: SummaryAlert) => Promise<void>;
  deleteSummary: (id: string) => Promise<void>;
  saveThreshold: (threshold: ThresholdAlert) => Promise<void>;
  saveAvisosOficiales: (avisos: AvisosOficialesAlert) => Promise<void>;
  testNotification: () => Promise<void>;
  // Ultima confirmacion para mostrar tambien en pantalla (no solo VoiceOver). El `id` cambia en
  // cada aviso para que la pantalla lo detecte aunque el texto se repita.
  notice?: { id: number; text: string };
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { places, currentLocationPlace } = usePlaces();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState<{ id: number; text: string } | undefined>(undefined);
  const noticeSeq = useRef(0);

  // Confirma una accion del usuario por TRES canales a la vez: VoiceOver (announceForAccessibility),
  // un aviso visible en pantalla y una vibracion. La vibracion es el canal mas fiable: el anuncio de
  // VoiceOver se pierde a veces al competir con el gesto, y no todos ven el banner.
  const notify = useCallback((text: string, kind: 'ok' | 'error' = 'ok') => {
    // queue: true (iOS) encola el anuncio para que no lo pise el sonido de activar el botón.
    AccessibilityInfo.announceForAccessibilityWithOptions(text, { queue: true });
    if (kind === 'error') {
      vibrarError();
    } else {
      vibrarConfirmacion();
    }
    noticeSeq.current += 1;
    setNotice({ id: noticeSeq.current, text });
  }, []);

  // Espejos en refs para que los listeners (segundo plano) usen siempre lo último. Se escriben en
  // render a proposito (ver PlacesContext): moverlo a un efecto retrasaria la actualizacion.
  const placesRef = useRef(places);
  const currentLocationRef = useRef(currentLocationPlace);
  const settingsRef = useRef(settings);
  /* eslint-disable react-hooks/refs */
  placesRef.current = places;
  currentLocationRef.current = currentLocationPlace;
  settingsRef.current = settings;
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    const load = async () => {
      // Migracion: en versiones anteriores los resumenes eran notificaciones locales programadas.
      // Ahora los envia el servidor, asi que se limpian las que quedaran pendientes en iOS.
      await cancelAllNotifications();
      const stored = await AsyncStorage.getItem(STORAGE_NOTIFICATIONS);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (isValidSettings(parsed)) {
            // completarAjustes rellena lo que se anadio despues (los avisos oficiales): quien ya
            // tenia la app guardo sus ajustes sin ese campo.
            setSettings(completarAjustes(parsed));
          }
        } catch {
          // ajustes corruptos: se quedan los valores por defecto
        }
      }
      setLoaded(true);
    };
    void load();
  }, []);

  const resolvePlace = useCallback((id: string): Place | undefined => {
    if (id === CURRENT_LOCATION_ID) {
      return currentLocationRef.current;
    }
    return placesRef.current.find((p) => p.id === id);
  }, []);

  // Sube al servidor el estado completo de avisos (umbral + resumenes) con la ubicacion actual, y
  // arranca o para las geovallas segun haya o no algun aviso activo. Todos los avisos los envia el
  // servidor por push; ya no se programan localmente. `announce` es true solo cuando lo dispara una
  // accion del usuario (guardar), para confirmarlo por voz.
  const sincronizarServidor = useCallback(
    async (next: NotificationSettings, announce = false) => {
      // Los avisos oficiales CUENTAN para esto: el servidor necesita saber donde estas para saber
      // que zona te toca, asi que si estan encendidos hay que seguir la ubicacion igual.
      const anyEnabled =
        next.summaries.some((s) => s.enabled) ||
        next.threshold.enabled ||
        next.avisosOficiales.enabled;
      // La ubicacion se lee AHORA, no se coge la cacheada de la pantalla Hoy. Esa se congela
      // mientras estas viendo un lugar guardado (PlacesContext no re-detecta si el lugar activo no
      // es "mi ubicacion"), y al subirla se pisaba en el servidor la ubicacion buena que habia
      // dejado la geovalla: de ahi que el aviso de temperatura acabase nombrando la ciudad
      // anterior. La misma lectura se reaprovecha para la geovalla, para no encender el GPS dos
      // veces. Solo se lee si hay algun aviso: sin avisos no hay nada que ubicar.
      const fresca = anyEnabled ? await leerUbicacionActual() : undefined;
      const cacheada = currentLocationRef.current;
      const payload = construirPayload(
        next,
        resolvePlace,
        ubicacionParaEnviar(
          fresca,
          cacheada && { lat: cacheada.lat, lon: cacheada.lon, nombre: cacheada.name },
        ),
      );
      const ok = await sincronizarAvisos(payload);

      // Seguir la ubicacion (geovallas) mientras haya algun aviso; si no, dejar de seguirla.
      if (anyEnabled) {
        await iniciarSeguimientoUbicacion(fresca);
      } else {
        await detenerSeguimientoUbicacion();
      }

      if (announce) {
        if (!anyEnabled) {
          notify('No tienes ningún aviso activo.');
        } else {
          notify(
            ok ? 'Avisos guardados.' : 'No se han podido guardar los avisos.',
            ok ? 'ok' : 'error',
          );
        }
      }
    },
    [resolvePlace, notify],
  );

  // Resincroniza al cargar y cuando cambian los lugares o la ubicación: el servidor necesita la
  // ubicación al día y los lugares resueltos de cada resumen.
  useEffect(() => {
    if (!loaded) {
      return;
    }
    void sincronizarServidor(settingsRef.current);
  }, [loaded, places, currentLocationPlace, sincronizarServidor]);

  // Al volver a primer plano se reenvía la ubicación actual al servidor.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && loaded) {
        void sincronizarServidor(settingsRef.current);
      }
    });
    return () => sub.remove();
  }, [loaded, sincronizarServidor]);

  // Al activar un aviso se necesitan DOS permisos: notificaciones (para el push) y ubicación
  // "Siempre" (para que los avisos sigan al usuario con la app cerrada). La explicación previa
  // cubre ambos. Sin notificaciones no se puede activar; sin ubicación "Siempre" se activa igual,
  // pero los avisos usarán la última ubicación conocida (se avisa de ello).
  const ensurePermissionForActivation = useCallback(
    async (willBeEnabled: boolean): Promise<boolean> => {
      if (!willBeEnabled) {
        return true;
      }
      if (!(await hasNotificationPermission())) {
        if (!(await canAskForNotificationPermission())) {
          Alert.alert(
            'Notificaciones bloqueadas',
            'iOS tiene bloqueadas las notificaciones de EasyWeather. Puedes permitirlas en Ajustes de iOS, ' +
              'en EasyWeather, Notificaciones.',
          );
          return false;
        }
        if (!(await explainNotificationsBeforeAsking())) {
          return false;
        }
        if (!(await requestNotificationPermission())) {
          notify('Sin permiso de notificaciones no se pueden enviar avisos.', 'error');
          return false;
        }
      }
      // Ubicación en segundo plano: si se rechaza, no se bloquea (degrada a última conocida).
      if (!(await pedirPermisoUbicacionSiempre())) {
        notify(
          'Sin permiso de ubicación siempre, los avisos usarán tu última ubicación conocida.',
          'error',
        );
      }
      return true;
    },
    [notify],
  );

  const persist = useCallback(
    async (next: NotificationSettings) => {
      setSettings(next);
      settingsRef.current = next;
      await AsyncStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(next));
      await sincronizarServidor(next, true);
    },
    [sincronizarServidor],
  );

  const saveSummary = useCallback(
    async (summary: SummaryAlert) => {
      // Si no se concede el permiso, se guarda desactivado para no aparentar que funciona.
      const enabled = summary.enabled && (await ensurePermissionForActivation(summary.enabled));
      const saved = { ...summary, enabled };
      const current = settingsRef.current;
      const exists = current.summaries.some((s) => s.id === saved.id);
      const summaries = exists
        ? current.summaries.map((s) => (s.id === saved.id ? saved : s))
        : [...current.summaries, saved];
      await persist({ ...current, summaries });
    },
    [ensurePermissionForActivation, persist],
  );

  const deleteSummary = useCallback(
    async (id: string) => {
      const current = settingsRef.current;
      await persist({ ...current, summaries: current.summaries.filter((s) => s.id !== id) });
      notify('Aviso eliminado.');
    },
    [persist, notify],
  );

  const saveThreshold = useCallback(
    async (threshold: ThresholdAlert) => {
      const enabled = threshold.enabled && (await ensurePermissionForActivation(threshold.enabled));
      const current = settingsRef.current;
      await persist({ ...current, threshold: { ...threshold, enabled } });
    },
    [ensurePermissionForActivation, persist],
  );

  const saveAvisosOficiales = useCallback(
    async (avisos: AvisosOficialesAlert) => {
      const enabled = avisos.enabled && (await ensurePermissionForActivation(avisos.enabled));
      const current = settingsRef.current;
      await persist({ ...current, avisosOficiales: { ...avisos, enabled } });
    },
    [ensurePermissionForActivation, persist],
  );

  const testNotification = useCallback(async () => {
    const ok = await sendTestNotification();
    if (ok) {
      vibrarConfirmacion();
    } else {
      vibrarError();
    }
    Alert.alert(
      'Notificación de prueba',
      ok
        ? 'Enviada. Debería llegarte en unos segundos.'
        : 'No se ha podido enviar. Comprueba que has dado permiso de notificaciones.',
    );
  }, []);

  const value: NotificationsContextValue = {
    settings,
    saveAvisosOficiales,
    saveSummary,
    deleteSummary,
    saveThreshold,
    testNotification,
    notice,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider');
  }
  return context;
}
