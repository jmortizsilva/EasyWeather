import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { getForecast, getHourlyTemperatures, HourlyTemperature } from '../services/openMeteo';
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

// iOS solo mantiene 64 notificaciones pendientes; se limita cada tipo para no pasarse.
const MAX_SUMMARY_DAYS = 7;
const MAX_THRESHOLD_EVENTS = 12;

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

// Detecta el momento en que la previsión horaria cruza un límite. Solo el instante del cruce
// (la hora anterior estaba al otro lado), para no repetir el aviso mientras dura el episodio.
function findThresholdCrossings(
  hours: HourlyTemperature[],
  threshold: ThresholdAlert,
  place: Place,
  now: number
): { date: Date; body: string }[] {
  const events: { date: Date; body: string }[] = [];
  for (let i = 1; i < hours.length; i += 1) {
    const prev = hours[i - 1].temperature;
    const cur = hours[i].temperature;
    const date = new Date(hours[i].time);
    if (prev === undefined || cur === undefined || Number.isNaN(date.getTime()) || date.getTime() <= now) {
      continue;
    }
    if (prev < threshold.maxThreshold && cur >= threshold.maxThreshold) {
      events.push({
        date,
        body: `Ahora en ${place.name} se alcanzan ${cur} grados, por encima de tu aviso de ${threshold.maxThreshold} grados.`,
      });
    } else if (prev > threshold.minThreshold && cur <= threshold.minThreshold) {
      events.push({
        date,
        body: `Ahora en ${place.name} se baja a ${cur} grados, por debajo de tu aviso de ${threshold.minThreshold} grados.`,
      });
    }
  }
  return events.slice(0, MAX_THRESHOLD_EVENTS);
}

async function scheduleThreshold(threshold: ThresholdAlert, place: Place, now: number): Promise<number> {
  const hours = await getHourlyTemperatures(place.lat, place.lon, 3);
  const events = findThresholdCrossings(hours, threshold, place, now);
  for (const event of events) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Aviso de temperatura', body: event.body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: event.date },
    });
  }
  return events.length;
}

/**
 * Reprograma todos los avisos con datos frescos. iOS no garantiza cuándo despierta a una app en
 * segundo plano, así que en vez de depender de eso se aprovechan los días que da Open-Meteo:
 * los resúmenes se programan a su hora y el aviso de temperatura a la hora en que la previsión
 * horaria prevé el cruce. Se reprograma en cada refresco. Si el usuario pasa muchos días sin
 * abrir la app, los avisos se agotan.
 */
export async function syncNotifications(
  settings: NotificationSettings,
  resolvePlace: (id: string) => Place | undefined,
  currentLocationPlace: Place | undefined
): Promise<number> {
  await cancelAllNotifications();

  const anyEnabled = settings.summaries.some((s) => s.enabled) || settings.threshold.enabled;
  if (!anyEnabled || !(await hasNotificationPermission())) {
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

  if (settings.threshold.enabled && currentLocationPlace) {
    try {
      scheduled += await scheduleThreshold(settings.threshold, currentLocationPlace, now);
    } catch {
      // Sin previsión horaria no se programan cruces, pero no se rompe el resto.
    }
  }

  return scheduled;
}
