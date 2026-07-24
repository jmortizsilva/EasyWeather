import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { getForecast } from '../services/openMeteo';
import { DayForecast, NotificationSettings, Place, SummaryAlert, ThresholdAlert } from '../types';
import { buildDayDetails } from './dayDetails';
import { describeWeatherCode } from './weatherCodes';

// Títulos tal y como los genera buildDayDetails; el usuario elige cuáles quiere en el resumen.
export const DAILY_FIELD_OPTIONS = [
  'Temperatura',
  'Sensación térmica',
  'Humedad media',
  'Viento',
  'Índice UV máximo',
  'Precipitación',
  'Sol',
  'Luna',
  'Salida y puesta de la luna',
];

// iOS solo mantiene 64 notificaciones pendientes; se limita el resumen para no pasarse.
const MAX_SUMMARY_DAYS = 7;

export const DEFAULT_THRESHOLD: ThresholdAlert = {
  enabled: false,
  maxThreshold: 30,
  minThreshold: 3,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  summaries: [],
  threshold: DEFAULT_THRESHOLD,
};

export function createSummaryAlert(placeId: string): SummaryAlert {
  return {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    placeId,
    hour: 8,
    minute: 0,
    fields: ['Temperatura', 'Precipitación'],
    enabled: true,
  };
}

export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function isValidSettings(value: unknown): value is NotificationSettings {
  const v = value as NotificationSettings;
  return !!v && Array.isArray(v.summaries) && typeof v.threshold === 'object' && v.threshold !== null;
}

// Las notificaciones se leen en voz alta, así que se usa el texto "hablado" de cada dato
// (dice "grados" en vez de º, que VoiceOver leería como ordinal).
function buildDailyBody(day: DayForecast, fields: string[]): string {
  const info = describeWeatherCode(day.weatherCode);
  const details = buildDayDetails(day)
    .filter((line) => fields.includes(line.title))
    .map((line) => `${line.title}: ${line.spoken}`);
  return [info.label, ...details].join('. ');
}

export async function hasNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

/** Si iOS ya denegó el permiso, no vuelve a preguntar: hay que ir a Ajustes. */
export async function canAskForNotificationPermission(): Promise<boolean> {
  const { canAskAgain } = await Notifications.getPermissionsAsync();
  return canAskAgain;
}

/**
 * iOS no permite personalizar el texto del diálogo de permiso de notificaciones (a diferencia
 * del de ubicación), así que antes de lanzarlo se explica con nuestras palabras cómo funcionan
 * los avisos. Lo importante que debe saber el usuario es que tiene que abrir la app cada pocos
 * días para que se sigan programando. Devuelve si quiere continuar.
 */
export function explainNotificationsBeforeAsking(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      'Cómo funcionan los avisos',
      'Los avisos se preparan dentro de tu propio iPhone, así que no se envía ningún dato tuyo a ' +
        'ningún sitio.\n\n' +
        'Para que sigan llegando necesitas abrir la app cada pocos días: cada vez que la abres, ' +
        'deja preparados los avisos de los días siguientes. Si pasas mucho tiempo sin abrirla, ' +
        'dejarán de llegar hasta que vuelvas a entrar.\n\n' +
        'A continuación iOS te preguntará si permites las notificaciones.',
      [
        { text: 'Ahora no', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Continuar', onPress: () => resolve(true) },
      ],
      { cancelable: false }
    );
  });
}

/** Solo se llama cuando el usuario activa un aviso a propósito, nunca de fondo. */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Programa un resumen (tipo 1): una notificación por cada día futuro, a la hora elegida.
async function scheduleSummary(summary: SummaryAlert, place: Place, now: number): Promise<number> {
  let count = 0;
  const forecast = await getForecast(place.lat, place.lon);
  for (const day of forecast.days) {
    if (count >= MAX_SUMMARY_DAYS) {
      break;
    }
    const trigger = new Date(`${day.date}T00:00:00`);
    if (Number.isNaN(trigger.getTime())) {
      continue;
    }
    trigger.setHours(summary.hour, summary.minute, 0, 0);
    if (trigger.getTime() <= now) {
      continue;
    }
    await Notifications.scheduleNotificationAsync({
      content: { title: `El tiempo en ${place.name}`, body: buildDailyBody(day, summary.fields) },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
    });
    count += 1;
  }
  return count;
}

/**
 * Reprograma los avisos de RESUMEN (tipo 1) como notificaciones locales del teléfono. El aviso
 * de temperatura NO se programa aquí: lo gestiona el servidor por push (ver utils/push.ts). iOS
 * no garantiza cuándo despierta a una app en segundo plano, así que se aprovechan los días que
 * da Open-Meteo y se reprograman en cada refresco. Si el usuario pasa muchos días sin abrir la
 * app, los resúmenes se agotan (el aviso de temperatura, al ser del servidor, no).
 */
export async function syncNotifications(
  settings: NotificationSettings,
  resolvePlace: (id: string) => Place | undefined
): Promise<number> {
  await cancelAllNotifications();

  if (!settings.summaries.some((s) => s.enabled) || !(await hasNotificationPermission())) {
    return 0;
  }

  const now = Date.now();
  let scheduled = 0;

  for (const summary of settings.summaries) {
    if (!summary.enabled) {
      continue;
    }
    const place = resolvePlace(summary.placeId);
    if (!place) {
      continue;
    }
    try {
      scheduled += await scheduleSummary(summary, place, now);
    } catch {
      // Si falla la previsión de un lugar, se sigue con los demás avisos.
    }
  }

  return scheduled;
}
