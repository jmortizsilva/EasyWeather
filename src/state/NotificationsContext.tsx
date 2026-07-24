import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';
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
import { registerThresholdDevice, unregisterThresholdDevice } from '../utils/push';
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
  /** Mensaje para la interfaz: confirma un guardado o explica por qué no hay avisos. */
  status: string;
  saveSummary: (summary: SummaryAlert) => Promise<void>;
  deleteSummary: (id: string) => Promise<void>;
  saveThreshold: (threshold: ThresholdAlert) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { places, currentLocationPlace } = usePlaces();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [status, setStatus] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Espejos en refs para que los listeners (segundo plano) usen siempre lo último.
  const placesRef = useRef(places);
  placesRef.current = places;
  const currentLocationRef = useRef(currentLocationPlace);
  currentLocationRef.current = currentLocationPlace;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

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

  // Reprograma todos los avisos con datos frescos.
  const resync = useCallback(
    async (next: NotificationSettings, announce = false) => {
      const anyEnabled = next.summaries.some((s) => s.enabled) || next.threshold.enabled;
      if (!anyEnabled) {
        await cancelAllNotifications();
        setStatus('No tienes ningún aviso activo.');
        return;
      }
      if (!(await hasNotificationPermission())) {
        setStatus('Falta el permiso de notificaciones del sistema.');
        return;
      }

      try {
        await syncNotifications(next, resolvePlace);
        const message = 'Avisos guardados.';
        setStatus(message);
        if (announce) {
          AccessibilityInfo.announceForAccessibility(message);
        }
      } catch (error) {
        setStatus(`No se han podido programar los avisos: ${String((error as Error).message ?? error)}`);
      }
    },
    [resolvePlace]
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
  const ensurePermissionForActivation = useCallback(async (willBeEnabled: boolean): Promise<boolean> => {
    if (!willBeEnabled || (await hasNotificationPermission())) {
      return true;
    }
    if (!(await canAskForNotificationPermission())) {
      setStatus(
        'iOS tiene bloqueadas las notificaciones de EasyWeather. Puedes permitirlas en Ajustes de iOS, ' +
          'en EasyWeather, Notificaciones.'
      );
      return false;
    }
    if (!(await explainNotificationsBeforeAsking())) {
      setStatus('El aviso se ha guardado desactivado. Puedes activarlo cuando quieras.');
      return false;
    }
    const granted = await requestNotificationPermission();
    if (!granted) {
      setStatus('Sin permiso de notificaciones no se pueden enviar avisos.');
    }
    return granted;
  }, []);

  const persist = useCallback(
    async (next: NotificationSettings) => {
      setSettings(next);
      settingsRef.current = next;
      await AsyncStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(next));
      await resync(next, true);
      await syncThresholdServer(next.threshold);
    },
    [resync, syncThresholdServer]
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
    [ensurePermissionForActivation, persist]
  );

  const deleteSummary = useCallback(
    async (id: string) => {
      const current = settingsRef.current;
      await persist({ ...current, summaries: current.summaries.filter((s) => s.id !== id) });
      AccessibilityInfo.announceForAccessibility('Aviso eliminado.');
    },
    [persist]
  );

  const saveThreshold = useCallback(
    async (threshold: ThresholdAlert) => {
      const enabled = threshold.enabled && (await ensurePermissionForActivation(threshold.enabled));
      const current = settingsRef.current;
      await persist({ ...current, threshold: { ...threshold, enabled } });
    },
    [ensurePermissionForActivation, persist]
  );

  const value: NotificationsContextValue = { settings, status, saveSummary, deleteSummary, saveThreshold };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider');
  }
  return context;
}
