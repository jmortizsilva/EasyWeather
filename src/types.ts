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
  /** Días desde este día hasta la próxima luna llena; 0 si este día ya es de luna llena. */
  moonDaysToFull?: number;
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

/**
 * Aviso OFICIAL de fenomenos adversos de AEMET. No tiene nada que ver con los avisos de
 * temperatura que configura el usuario en la pestaña Avisos: aquello es una regla suya y esto es
 * informacion oficial de riesgo. Nunca se presentan mezclados ni con el mismo nombre.
 *
 * **El texto viene ya redactado del servidor propio, y es deliberado.** Un aviso solo puede venir
 * de alli (la clave de AEMET no puede viajar en el bundle), asi que duplicar aqui la redaccion no
 * compraria nada y habria que mantener dos copias. A cambio, corregir como suena un aviso es
 * redesplegar el servidor: ni build ni actualizacion por aire. Los campos estructurados viajan
 * igual, para poder ordenar y colorear sin releer texto.
 */
export type NivelAviso = 'amarillo' | 'naranja' | 'rojo';

export interface TextoAviso {
  /** "Aviso naranja por lluvias". */
  titulo: string;
  /** "Hoy de las 18:00 a las 23:59". */
  periodo: string;
  /** Nombre de la zona de aviso de AEMET. */
  zona: string;
  /** El umbral, LITERAL de AEMET ("Precipitación acumulada en una hora: 20 mm."). */
  umbral: string;
  /** "Probabilidad 40%-70%". Vacio si AEMET no la da. */
  probabilidad: string;
  /** El consejo de AEMET, literal. Es texto de proteccion civil: no se reescribe. */
  consejo: string;
  /** Lo mismo con las unidades en palabras, para VoiceOver. */
  spoken: string;
}

export interface AvisoOficial {
  /** Identificador CAP, unico por emision. Sirve de clave de lista. */
  id: string;
  level: NivelAviso;
  /** Codigo de fenomeno de AEMET: PR, TO, AT, BT, NE, NI, VI, CO... */
  phenomenonCode: string;
  phenomenon: string;
  /** Comienzo del periodo, ISO con el desfase local del sitio. */
  onset: string;
  expires: string;
  description?: string;
  instruction?: string;
  probability?: string;
  zone: { code: string; name: string; coastal: boolean };
  sent: string;
  source: 'aemet';
  texto: TextoAviso;
}

/** La linea del anuncio de la pantalla principal, decidida tambien en el servidor. */
export interface ResumenAvisos {
  titulo: string;
  detalle: string;
  spoken: string;
  nivel: NivelAviso;
}

/** Lo que devuelve el servidor para un punto. Sin avisos, la lista va vacia y el resumen nulo. */
export interface AvisosLugar {
  avisos: AvisoOficial[];
  resumen: ResumenAvisos | null;
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

// Tipo 3: avisos OFICIALES de AEMET. Se parece a los anteriores en la pantalla, pero no es lo
// mismo y no puede presentarse como si lo fuera: los otros dos son reglas que escribe el usuario;
// este solo decide si quiere enterarse de lo que AEMET ya ha decidido, y a partir de que nivel.
export interface AvisosOficialesAlert {
  enabled: boolean;
  /** No se notifica nada por debajo de este nivel. El amarillo es muy frecuente. */
  nivelMinimo: NivelAviso;
}

export interface NotificationSettings {
  summaries: SummaryAlert[];
  threshold: ThresholdAlert;
  avisosOficiales: AvisosOficialesAlert;
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
