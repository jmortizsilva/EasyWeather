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

/**
 * Condiciones de AHORA MISMO segun el MODELO de Open-Meteo. Ojo: es una prevision para la hora en
 * curso, no una medicion. Se llama `Current` porque asi lo llama Open-Meteo, pero al enseñarlo hay
 * que decir que es previsto; para el dato medido esta `CurrentObservation`.
 */
export interface CurrentConditions {
  temperature?: number;
  weatherCode?: number;
  /**
   * Sensación térmica. Es TAN prevista como la temperatura de al lado, y por eso vive aquí y no en
   * `CurrentObservation`: AEMET no la publica, y calcularla a partir de la medición para enseñarla
   * bajo el rótulo "Medido" sería presentar una cuenta nuestra como una medición.
   */
  apparent?: number;
}

/**
 * Dato MEDIDO por una estacion meteorologica real, con su procedencia a cuestas. Nunca se mezcla
 * con la prevision: son cosas distintas y las dos son utiles.
 *
 * Llega del servidor propio, no de AEMET directamente: la clave de AEMET no puede viajar en el
 * bundle de una app de repositorio publico (ver utils/servidorPropio).
 */
export interface CurrentObservation {
  /** Grados Celsius. */
  temperature?: number;
  humidity?: number;
  /** km/h (el servidor ya los convierte; AEMET los da en m/s). */
  windSpeed?: number;
  windGusts?: number;
  windDirection?: number;
  /** mm en la ultima hora. */
  precipitation?: number;
  /** hPa. */
  pressure?: number;
  /**
   * Momento del final del periodo observado, en ISO. NO es "ahora": AEMET publica el parte horario
   * con del orden de 85 minutos de retraso, asi que la hora hay que enseñarla SIEMPRE.
   */
  observedAt: string;
  /** Quien lo midio. Hoy solo AEMET; el tipo deja sitio a otra red sin tocar a quien lo consume. */
  source: 'aemet';
  station: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    /** Metros sobre el nivel del mar. Explica una diferencia de temperatura con tu calle. */
    altitude?: number;
    /** Distancia desde el punto consultado. Se enseña para que el dato se juzgue solo. */
    distanceKm: number;
  };
}

export interface Forecast {
  current?: CurrentConditions;
  days: DayForecast[];
  /**
   * Altitud del terreno en el punto consultado, segun Open-Meteo. Sirve para descartar estaciones
   * a otra cota al pedir la observacion: 300 m de desnivel ya son unos 2 grados de diferencia.
   */
  elevation?: number;
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
  /** Grados desde el norte, en sentido horario. Se convierte a rumbo en palabras al mostrarlo. */
  windDirection?: number;
}
