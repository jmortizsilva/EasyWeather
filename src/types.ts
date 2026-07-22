export interface Place {
  id: string;
  name: string;
  admin1?: string;
  lat: number;
  lon: number;
}

export interface DayForecast {
  date: string;
  tMin?: number;
  tMax?: number;
  weatherCode?: number;
  rainProbability?: number;
  windMax?: number;
  windGusts?: number;
  windDirection?: number;
  apparentMin?: number;
  apparentMax?: number;
  humidity?: number;
  uvMax?: number;
  precipitationSum?: number;
  sunrise?: string;
  sunset?: string;
  // Datos lunares calculados en local con suncalc (Open-Meteo no los ofrece).
  moonrise?: string;
  moonset?: string;
  /** Fase 0-1: 0 luna nueva, 0.25 cuarto creciente, 0.5 llena, 0.75 cuarto menguante. */
  moonPhase?: number;
  /** Fracción iluminada 0-1. */
  moonIllumination?: number;
  moonAlwaysUp?: boolean;
  moonAlwaysDown?: boolean;
}

export interface CurrentConditions {
  temperature?: number;
  weatherCode?: number;
}

export interface Forecast {
  current?: CurrentConditions;
  days: DayForecast[];
}

export interface NotificationSettings {
  /** Lugar fijo (id de Mis lugares) del que hablan las notificaciones. */
  placeId?: string;
  dailyEnabled: boolean;
  dailyHour: number;
  dailyMinute: number;
  /** Títulos de los datos a incluir en el resumen, tal y como los devuelve buildDayDetails. */
  dailyFields: string[];
  thresholdEnabled: boolean;
  /** Avisa si la máxima llega o supera este valor. */
  maxThreshold: number;
  /** Avisa si la mínima llega o baja de este valor. */
  minThreshold: number;
}

export interface HourlyForecast {
  time: string;
  temperature?: number;
  weatherCode?: number;
  rainProbability?: number;
  windSpeed?: number;
}
