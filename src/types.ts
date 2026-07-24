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

// Tipo 1: resumen que programa el usuario. Puede haber varios independientes.
export interface SummaryAlert {
  id: string;
  /** CURRENT_LOCATION_ID para la ubicación actual, o el id de un lugar guardado. */
  placeId: string;
  hour: number;
  minute: number;
  /** Títulos de los datos a incluir, tal y como los devuelve buildDayDetails. */
  fields: string[];
  enabled: boolean;
}

// Tipo 2: aviso automático de temperatura, siempre de la ubicación actual. La app lo dispara
// a la hora en que la previsión horaria prevé que se cruza el límite.
export interface ThresholdAlert {
  enabled: boolean;
  /** Avisa si la temperatura llega o supera este valor. */
  maxThreshold: number;
  /** Avisa si la temperatura llega o baja de este valor. */
  minThreshold: number;
}

export interface NotificationSettings {
  summaries: SummaryAlert[];
  threshold: ThresholdAlert;
}

export interface HourlyForecast {
  time: string;
  temperature?: number;
  weatherCode?: number;
  rainProbability?: number;
  windSpeed?: number;
}
