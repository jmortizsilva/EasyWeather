import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { DayForecast, Forecast, NotificationSettings, Place } from '../types';
import { buildDayDetails, formatFullDate } from './dayDetails';
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

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  dailyEnabled: false,
  dailyHour: 8,
  dailyMinute: 0,
  dailyFields: ['Temperatura', 'Precipitación'],
  thresholdEnabled: false,
  maxThreshold: 40,
  minThreshold: 0,
};

export function formatDailyTime(settings: NotificationSettings): string {
  const hour = String(settings.dailyHour).padStart(2, '0');
  const minute = String(settings.dailyMinute).padStart(2, '0');
  return `${hour}:${minute}`;
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

function buildThresholdBody(day: DayForecast, settings: NotificationSettings): string | undefined {
  const warnings: string[] = [];
  if (day.tMax !== undefined && day.tMax >= settings.maxThreshold) {
    warnings.push(`se esperan ${day.tMax} grados de máxima`);
  }
  if (day.tMin !== undefined && day.tMin <= settings.minThreshold) {
    warnings.push(`se esperan ${day.tMin} grados de mínima`);
  }
  if (warnings.length === 0) {
    return undefined;
  }
  return `${formatFullDate(day.date)}: ${warnings.join(' y ')}.`;
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

/**
 * Programa por adelantado los avisos de los días que ya conocemos. iOS no garantiza cuándo
 * despierta a una app en segundo plano, así que en vez de depender de eso se aprovecha que
 * Open-Meteo devuelve varios días de golpe: cada vez que la app refresca la previsión se
 * reprograman los avisos con el contenido ya calculado, y a iOS solo le queda mostrarlos
 * a su hora. Si el usuario pasa muchos días sin abrir la app, los avisos se agotan.
 */
export async function syncNotifications(
  settings: NotificationSettings,
  place: Place | undefined,
  forecast: Forecast | undefined
): Promise<void> {
  await cancelAllNotifications();

  if (!place || !forecast || (!settings.dailyEnabled && !settings.thresholdEnabled)) {
    return;
  }
  if (!(await hasNotificationPermission())) {
    return;
  }

  const now = Date.now();

  for (const day of forecast.days) {
    const trigger = new Date(`${day.date}T00:00:00`);
    if (Number.isNaN(trigger.getTime())) {
      continue;
    }
    trigger.setHours(settings.dailyHour, settings.dailyMinute, 0, 0);
    if (trigger.getTime() <= now) {
      continue;
    }

    if (settings.dailyEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `El tiempo en ${place.name}`,
          body: buildDailyBody(day, settings.dailyFields),
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
      });
    }

    if (settings.thresholdEnabled) {
      const body = buildThresholdBody(day, settings);
      if (body) {
        await Notifications.scheduleNotificationAsync({
          content: { title: `Aviso de temperatura en ${place.name}`, body },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
        });
      }
    }
  }
}
