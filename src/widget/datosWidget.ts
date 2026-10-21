// Lo que la app deja escrito para el widget. El widget es Swift y no decide nada: recibe cada dato
// ya escrito, para la pantalla y para VoiceOver, y solo elige cuáles pinta. Así los textos salen
// de las mismas funciones que la pantalla del lugar y se prueban aquí, sin dispositivo.
//
// El formato es un contrato con targets/widget/Datos.swift: si cambia, cambian los dos y sube
// VERSION_DATOS_WIDGET.

import { AvisosLugar, CURRENT_LOCATION_ID, CurrentObservation, Forecast, Place } from '../types';
import { formatTime } from '../utils/dayDetails';
import { describeUvIndex, describeWindDirection } from '../utils/meteo';
import { numeroEs } from '../utils/text';
import { describeWeatherCode } from '../utils/weatherCodes';

export const VERSION_DATOS_WIDGET = 1;

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
  /** Cuándo se obtuvo la previsión, en milisegundos. El widget la enseña siempre. */
  actualizadoEn: number;
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
}

export interface FuenteLugar {
  place: Place;
  forecast: Forecast;
  updatedAt: number;
  observacion?: CurrentObservation;
  avisos?: AvisosLugar;
}

const grados = (valor: number) => ({
  visible: `${Math.round(valor)}º`,
  hablado: `${Math.round(valor)} grados`,
});

/** Los textos de un lugar. Lo que no tenga dato no sale: el widget no pinta guiones. */
export function lugarWidget(fuente: FuenteLugar): LugarWidget {
  const { place, forecast, observacion, avisos } = fuente;
  const actual = forecast.current;
  const hoy = forecast.days[0];
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
  const amanece = formatTime(hoy?.sunrise);
  const anochece = formatTime(hoy?.sunset);
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
    actualizadoEn: fuente.updatedAt,
    ...(aviso ? { aviso } : {}),
    datos,
  };
}

/** Todos los lugares con previsión, la ubicación actual primero. */
export function datosWidget(fuentes: FuenteLugar[]): DatosWidget {
  const orden = (f: FuenteLugar) => (f.place.id === CURRENT_LOCATION_ID ? 0 : 1);
  return {
    version: VERSION_DATOS_WIDGET,
    lugares: [...fuentes].sort((a, b) => orden(a) - orden(b)).map(lugarWidget),
  };
}
