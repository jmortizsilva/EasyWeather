// Modelo de los ajustes de avisos: valores por defecto, validacion y migracion.
//
// Va aparte de notifications.ts porque esto es logica pura y aquello es fontaneria: notifications.ts
// habla con expo-notifications y con Open-Meteo, y basta con importarlo para que expo-notifications
// suelte avisos por consola. Separandolo, esta parte se prueba sin arrastrar nada de eso.

import { AvisosOficialesAlert, NotificationSettings, SummaryAlert, ThresholdAlert } from '../types';

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

export const DEFAULT_THRESHOLD: ThresholdAlert = {
  enabled: false,
  maxThreshold: 30,
  minThreshold: 3,
};

// Nacen apagados: nadie recibe una notificacion que no ha pedido, igual que el umbral y el resumen.
// El anuncio en la pantalla del lugar se ve igual sin activar nada; esto solo son las push.
//
// Cuando se encienden, el minimo arranca en NARANJA. El amarillo es muy frecuente (45 avisos
// activos en Espana un dia cualquiera de agosto de 2026, frente a 5 naranjas) y llenar el telefono
// de avisos amarillos acaba en que se silencian todos, incluido el que importaba.
export const DEFAULT_AVISOS_OFICIALES: AvisosOficialesAlert = {
  enabled: false,
  nivelMinimo: 'naranja',
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  summaries: [],
  threshold: DEFAULT_THRESHOLD,
  avisosOficiales: DEFAULT_AVISOS_OFICIALES,
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
  return (
    !!v && Array.isArray(v.summaries) && typeof v.threshold === 'object' && v.threshold !== null
  );
}

/**
 * Completa lo leido del disco con lo que falte. Hace falta porque `avisosOficiales` se anadio
 * despues: quien ya tenia la app guardo sus ajustes sin ese campo, y sin esto la pantalla se
 * quedaria leyendo `undefined.enabled`. No se sube la version de la clave de almacenamiento a
 * proposito: eso borraria los avisos que la gente ya tiene configurados.
 */
export function completarAjustes(settings: NotificationSettings): NotificationSettings {
  return {
    ...settings,
    avisosOficiales: settings.avisosOficiales ?? DEFAULT_AVISOS_OFICIALES,
  };
}
