// Lo que la app deja escrito para el widget. El widget es Swift y no decide nada: recibe cada dato
// ya escrito, para la pantalla y para VoiceOver, y solo elige cuáles pinta. Así los textos salen
// de las mismas funciones que la pantalla del lugar y se prueban aquí, sin dispositivo.
//
// El formato es un contrato con targets/widget/Datos.swift: si cambia, cambian los dos y sube
// VERSION_DATOS_WIDGET.

import { AvisosLugar, CURRENT_LOCATION_ID, CurrentObservation, Forecast, Place } from '../types';
import { describeUvIndex, describeWindDirection } from '../utils/meteo';
import { numeroEs } from '../utils/text';
import { describeWeatherCode } from '../utils/weatherCodes';

export const VERSION_DATOS_WIDGET = 3;

/** Los datos que se pueden elegir, en el orden en que se pintan. */
export const CLAVES_DATO = [
  'temperatura',
  'cielo',
  'maxMin',
  'sensacion',
  'lluvia',
  'viento',
  'humedad',
  'uv',
  'estacion',
  'sol',
] as const;

export type ClaveDato = (typeof CLAVES_DATO)[number];

export interface TextoDato {
  /** Corto, para la pantalla: «18º», «Lluvia 40%». */
  visible: string;
  /** Para VoiceOver, una frase con las unidades en palabras: «Probabilidad de lluvia 40 por ciento». */
  hablado: string;
}

export interface LugarWidget {
  id: string;
  nombre: string;
  /** Con esto el widget le pide al servidor el lugar al día, sin abrir la app. */
  lat: number;
  lon: number;
  /** La estación de AEMET elegida a mano, si la hay y vale donde está el lugar. */
  estacion?: string;
  /**
   * Cuándo se obtuvo la previsión, en milisegundos. El widget la enseña siempre. Falta si la app
   * todavía no ha cargado este lugar: aun así va en la lista, para poder elegirlo en el widget.
   */
  actualizadoEn?: number;
  /** Solo naranja o rojo: el amarillo no cabe en un widget sin quitar sitio a todo lo demás. */
  aviso?: TextoDato & {
    nivel: 'naranja' | 'rojo';
    /** «Aviso naranja», para el tamaño pequeño, donde el fenómeno no cabe. */
    corto: string;
  };
  datos: Partial<Record<ClaveDato, TextoDato>>;
}

export interface DatosWidget {
  version: number;
  lugares: LugarWidget[];
  /** Dónde pedir los lugares al día (la ruta /widget del servidor propio) y con qué clave. */
  servidor?: { url: string; clave: string };
}

export interface FuenteLugar {
  place: Place;
  /** Sin previsión todavía, el lugar va solo con su nombre. */
  forecast?: Forecast;
  updatedAt?: number;
  observacion?: CurrentObservation;
  avisos?: AvisosLugar;
  estacion?: string;
}

/**
 * «8:31» de «2026-10-21T08:31», la hora local del sitio tal como la da Open-Meteo. No usa
 * formatTime (dayDetails), que formatea según la configuración regional del sistema: en el iPhone
 * sale «8:31» y en Node «08:31», y este texto lo escriben las dos, la app y el servidor.
 */
function horaDeIso(iso: string | undefined): string | undefined {
  const partes = iso?.match(/T(\d{2}):(\d{2})/);
  return partes ? `${Number(partes[1])}:${partes[2]}` : undefined;
}

const grados = (valor: number) => ({
  visible: `${Math.round(valor)}º`,
  hablado: `${Math.round(valor)} grados`,
});

/** Los textos de un lugar. Lo que no tenga dato no sale: el widget no pinta guiones. */
export function lugarWidget(fuente: FuenteLugar): LugarWidget {
  const { place, forecast, observacion, avisos } = fuente;
  const actual = forecast?.current;
  const hoy = forecast?.days[0];
  const datos: LugarWidget['datos'] = {};

  if (actual?.temperature !== undefined) {
    datos.temperatura = grados(actual.temperature);
  }
  if (actual?.weatherCode !== undefined) {
    const { label } = describeWeatherCode(actual.weatherCode);
    datos.cielo = { visible: label, hablado: label };
  }
  if (hoy?.tMin !== undefined && hoy.tMax !== undefined) {
    // Mínima primero, como en la pantalla del lugar.
    datos.maxMin = {
      visible: `Mín. ${Math.round(hoy.tMin)}º · Máx. ${Math.round(hoy.tMax)}º`,
      hablado: `Mínima ${Math.round(hoy.tMin)} grados, máxima ${Math.round(hoy.tMax)} grados`,
    };
  }
  if (actual?.apparent !== undefined) {
    const t = grados(actual.apparent);
    datos.sensacion = {
      visible: `Sensación ${t.visible}`,
      hablado: `Sensación térmica ${t.hablado}`,
    };
  }
  if (hoy?.rainProbability !== undefined) {
    const p = numeroEs(hoy.rainProbability);
    datos.lluvia = { visible: `Lluvia ${p}%`, hablado: `Probabilidad de lluvia ${p} por ciento` };
  }
  if (hoy?.windMax !== undefined) {
    const direccion = describeWindDirection(hoy.windDirection);
    const desde = direccion ? ` del ${direccion}` : '';
    const v = numeroEs(hoy.windMax);
    datos.viento = {
      visible: `Viento ${v} km/h${desde}`,
      hablado: `Viento hasta ${v} kilómetros por hora${desde}`,
    };
  }
  if (hoy?.humidity !== undefined) {
    const h = numeroEs(hoy.humidity);
    datos.humedad = { visible: `Humedad ${h}%`, hablado: `Humedad media ${h} por ciento` };
  }
  if (hoy?.uvMax !== undefined) {
    const nivel = describeUvIndex(hoy.uvMax);
    const uv = `${numeroEs(hoy.uvMax)}${nivel ? `, ${nivel}` : ''}`;
    datos.uv = { visible: `UV ${uv}`, hablado: `Índice UV máximo ${uv}` };
  }
  if (observacion?.temperature !== undefined) {
    const t = numeroEs(observacion.temperature);
    const estacion = observacion.station.name;
    datos.estacion = {
      visible: `Medido ${t}º · ${estacion}`,
      hablado: `Temperatura medida ${t} grados, estación ${estacion}`,
    };
  }
  const amanece = horaDeIso(hoy?.sunrise);
  const anochece = horaDeIso(hoy?.sunset);
  if (amanece && anochece) {
    datos.sol = {
      visible: `Sol ${amanece} – ${anochece}`,
      hablado: `Amanece a las ${amanece}, anochece a las ${anochece}`,
    };
  }

  const resumen = avisos?.resumen;
  const aviso =
    resumen && resumen.nivel !== 'amarillo'
      ? {
          nivel: resumen.nivel,
          corto: `Aviso ${resumen.nivel}`,
          visible: resumen.titulo,
          hablado: resumen.titulo,
        }
      : undefined;

  return {
    id: place.id,
    nombre: place.name,
    lat: place.lat,
    lon: place.lon,
    ...(fuente.estacion ? { estacion: fuente.estacion } : {}),
    ...(forecast && fuente.updatedAt ? { actualizadoEn: fuente.updatedAt } : {}),
    ...(aviso ? { aviso } : {}),
    datos,
  };
}

/** Todos los lugares, la ubicación actual primero y luego en el orden de Mis lugares. */
export function datosWidget(
  fuentes: FuenteLugar[],
  servidor?: DatosWidget['servidor'],
): DatosWidget {
  const orden = (f: FuenteLugar) => (f.place.id === CURRENT_LOCATION_ID ? 0 : 1);
  return {
    version: VERSION_DATOS_WIDGET,
    lugares: [...fuentes].sort((a, b) => orden(a) - orden(b)).map(lugarWidget),
    ...(servidor ? { servidor } : {}),
  };
}
