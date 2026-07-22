import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getForecast } from '../services/openMeteo';
import { NotificationSettings } from '../types';
import {
  cancelAllNotifications,
  DEFAULT_NOTIFICATION_SETTINGS,
  hasNotificationPermission,
  requestNotificationPermission,
  syncNotifications,
} from '../utils/notifications';
import { usePlaces } from './PlacesContext';

const STORAGE_NOTIFICATIONS = 'tiempo.notifications';

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
  permissionGranted: boolean;
  /** Mensaje para la interfaz: explica qué está pasando o por qué no hay avisos. */
  status: string;
  updateSettings: (partial: Partial<NotificationSettings>) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { places } = usePlaces();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [status, setStatus] = useState('');
  const [loaded, setLoaded] = useState(false);
  const placesRef = useRef(places);
  placesRef.current = places;

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_NOTIFICATIONS);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<NotificationSettings>;
          setSettings({ ...DEFAULT_NOTIFICATION_SETTINGS, ...parsed });
        } catch {
          // ajustes corruptos: se quedan los valores por defecto
        }
      }
      setPermissionGranted(await hasNotificationPermission());
      setLoaded(true);
    };
    void load();
  }, []);

  // Reprograma los avisos con datos frescos: al cargar los ajustes, al cambiarlos y cada
  // vez que la app vuelve a primer plano (que es cuando se renueva la reserva de días).
  const resync = useCallback(async (next: NotificationSettings) => {
    if (!next.dailyEnabled && !next.thresholdEnabled) {
      await cancelAllNotifications();
      setStatus('Los avisos están desactivados.');
      return;
    }

    const place = placesRef.current.find((p) => p.id === next.placeId);
    if (!place) {
      await cancelAllNotifications();
      setStatus('Elige un lugar para los avisos.');
      return;
    }
    if (!(await hasNotificationPermission())) {
      setStatus('Falta el permiso de notificaciones del sistema.');
      return;
    }

    try {
      const forecast = await getForecast(place.lat, place.lon);
      await syncNotifications(next, place, forecast);
      setStatus(`Avisos programados para ${place.name}.`);
    } catch (error) {
      setStatus(`No se han podido programar los avisos: ${String((error as Error).message ?? error)}`);
    }
  }, []);

  // Se incluye `places` porque los lugares guardados se cargan de forma asíncrona: sin esto,
  // la primera programación podría ejecutarse antes de que exista el lugar elegido.
  useEffect(() => {
    if (!loaded) {
      return;
    }
    void resync(settings);
  }, [loaded, settings, places, resync]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && loaded) {
        void resync(settings);
      }
    });
    return () => sub.remove();
  }, [loaded, settings, resync]);

  const updateSettings = useCallback(
    async (partial: Partial<NotificationSettings>) => {
      const next = { ...settings, ...partial };

      // El permiso solo se pide cuando el usuario activa un aviso a propósito.
      const activating =
        (partial.dailyEnabled === true && !settings.dailyEnabled) ||
        (partial.thresholdEnabled === true && !settings.thresholdEnabled);
      if (activating && !(await hasNotificationPermission())) {
        const granted = await requestNotificationPermission();
        setPermissionGranted(granted);
        if (!granted) {
          setStatus('Sin permiso de notificaciones no se pueden enviar avisos.');
        }
      }

      setSettings(next);
      await AsyncStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(next));
    },
    [settings]
  );

  const value: NotificationsContextValue = { settings, permissionGranted, status, updateSettings };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider');
  }
  return context;
}
