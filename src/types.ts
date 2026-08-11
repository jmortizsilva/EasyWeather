export interface Place {
  id: string;
  name: string;
  /** Region (comunidad, estado, condado...). Es el dato que se muestra bajo el nombre. */
  admin1?: string;
  /**
   * Niveles administrativos mas finos. Solo se usan para DISTINGUIR resultados de busqueda que se
   * llamarian igual (ver utils/resultadosBusqueda). Son opcionales: los lugares guardados antes de
   * que existieran estos campos siguen valiendo.
   */
  admin2?: string;
  admin3?: string;
  /** Pais, ya traducido. Se muestra SIEMPRE en los resultados de busqueda. */
  country?: string;
  /**
   * Codigo ISO del pais ("ES", "MX"). Se compara este y no el nombre para saber que resultados son
   * del pais donde estas: el nombre viene traducido por dos proveedores distintos (Open-Meteo y la
   * geocodificacion de iOS) y no tiene por que coincidir letra a letra.
   */
  countryCode?: string;
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
