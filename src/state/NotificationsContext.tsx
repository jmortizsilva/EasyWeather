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
import { NotificationSettings, Place, SummaryAlert, ThresholdAlert } from '../types';
import {
  canAskForNotificationPermission,
  cancelAllNotifications,
  DEFAULT_NOTIFICATION_SETTINGS,
  explainNotificationsBeforeAsking,
  hasNotificationPermission,
  isValidSettings,
  requestNotificationPermission,
  syncNotifications,
} from '../utils/notifications';
import {
  registerThresholdDevice,
  sendTestNotification,
  unregisterThresholdDevice,
} from '../utils/push';
import { CURRENT_LOCATION_ID, usePlaces } from './PlacesContext';

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

  // Confirma una accion del usuario por los dos canales a la vez: VoiceOver (announceForAccessibility)
  // y un aviso visible en pantalla. Antes solo se anunciaba por voz y quien ve no tenia feedback.
  const notify = useCallback((text: string) => {
    AccessibilityInfo.announceForAccessibility(text);
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
      const stored = await AsyncStorage.getItem(STORAGE_NOTIFICATIONS);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (isValidSettings(parsed)) {
            setSettings(parsed);
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

  // Reprograma todos los avisos con datos frescos. `announce` es true solo cuando lo dispara una
  // acción del usuario (guardar), para confirmarlo por voz sin dejar ningún texto fijo en pantalla.
  const resync = useCallback(
    async (next: NotificationSettings, announce = false) => {
      const anyEnabled = next.summaries.some((s) => s.enabled) || next.threshold.enabled;
      if (!anyEnabled) {
        await cancelAllNotifications();
        if (announce) {
          notify('No tienes ningún aviso activo.');
        }
        return;
      }
      if (!(await hasNotificationPermission())) {
        if (announce) {
          notify('Falta el permiso de notificaciones del sistema.');
        }
        return;
      }

      try {
        await syncNotifications(next, resolvePlace);
        if (announce) {
          notify('Avisos guardados.');
        }
      } catch {
        if (announce) {
          notify('No se han podido programar los avisos.');
        }
      }
    },
    [resolvePlace, notify],
  );

  // El aviso de temperatura lo gestiona el servidor: se (re)suscribe este teléfono con su
  // ubicación actual y sus umbrales, o se da de baja. Se ejecuta al guardar y cuando cambia la
  // ubicación (para que el servidor vigile siempre el sitio donde estás).
  const syncThresholdServer = useCallback(async (threshold: NotificationSettings['threshold']) => {
    const place = currentLocationRef.current;
    if (threshold.enabled && place) {
      await registerThresholdDevice({
        lat: place.lat,
        lon: place.lon,
        placeName: place.name,
        maxThreshold: threshold.maxThreshold,
        minThreshold: threshold.minThreshold,
      });
    } else if (!threshold.enabled) {
      await unregisterThresholdDevice();
    }
  }, []);

  // Reprograma al cargar y cuando cambian los lugares o la ubicación (afecta a qué previsión usar
  // en los resúmenes y a qué lugar vigila el servidor para el aviso de temperatura).
  useEffect(() => {
    if (!loaded) {
      return;
    }
    void resync(settingsRef.current);
    void syncThresholdServer(settingsRef.current.threshold);
  }, [loaded, places, currentLocationPlace, resync, syncThresholdServer]);

  // Al volver a primer plano se renueva la reserva de días.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && loaded) {
        void resync(settingsRef.current);
      }
    });
    return () => sub.remove();
  }, [loaded, resync]);

  // Pide el permiso (con explicación previa) solo si se está activando un aviso y aún no se tiene.
  const ensurePermissionForActivation = useCallback(
    async (willBeEnabled: boolean): Promise<boolean> => {
      if (!willBeEnabled || (await hasNotificationPermission())) {
        return true;
      }
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
      const granted = await requestNotificationPermission();
      if (!granted) {
        notify('Sin permiso de notificaciones no se pueden enviar avisos.');
      }
      return granted;
    },
    [notify],
  );

  const persist = useCallback(
    async (next: NotificationSettings) => {
      setSettings(next);
      settingsRef.current = next;
      await AsyncStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(next));
      await resync(next, true);
      await syncThresholdServer(next.threshold);
    },
    [resync, syncThresholdServer],
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

  const testNotification = useCallback(async () => {
    const ok = await sendTestNotification();
    Alert.alert(
      'Notificación de prueba',
      ok
        ? 'Enviada. Debería llegarte en unos segundos.'
        : 'No se ha podido enviar. Comprueba que has dado permiso de notificaciones.',
    );
  }, []);

  const value: NotificationsContextValue = {
    settings,
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
