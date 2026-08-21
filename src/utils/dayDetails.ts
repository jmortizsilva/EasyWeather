import { DayForecast } from '../types';
import { describeUvIndex, describeWindDirection } from './meteo';
import { describeMoonPhase } from './moon';
import { numeroEs } from './text';

export function formatTime(timeISO: string | undefined): string | undefined {
  if (!timeISO) {
    return undefined;
  }
  const date = new Date(timeISO);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export function formatFullDate(dateISO: string): string {
  const date = new Date(dateISO);
  if (Number.isNaN(date.getTime())) {
    return dateISO;
  }
  const formatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export interface DayDetailLine {
  title: string;
  /** Texto visual: con símbolos y abreviaturas (º, %, km/h). */
  value: string;
  /**
   * Texto para VoiceOver, con TODAS las unidades escritas con letras. No es un capricho: º se lee
   * como ordinal masculino, y las abreviaturas las expande según el contexto, así que dos filas de
   * la misma pantalla acababan sonando de forma distinta. La regla de esta app es que todo lo que
   * se oye diga la unidad igual, y que los decimales lleven coma (`numeroEs`).
   */
  spoken: string;
}

/**
 * Cuánto falta para la próxima luna llena, como coletilla de la línea de la luna. Vacío si ese día
 * YA es de luna llena: la propia fase acaba de decirlo y repetirlo sobra.
 */
function textoProximaLunaLlena(dias: number | undefined): string {
  if (dias === undefined || dias <= 0) {
    return '';
  }
  if (dias === 1) {
    return ', luna llena mañana';
  }
  return `, luna llena en ${dias} días`;
}

/** Número visible, con coma decimal; guion si no hay dato. */
function visible(valor: number | undefined): string {
  return valor !== undefined ? numeroEs(valor) : '-';
}

/** Número hablado, con coma decimal; "sin dato" si falta, que es lo que hay que oír. */
function hablado(valor: number | undefined): string {
  return valor !== undefined ? numeroEs(valor) : 'sin dato';
}

export function buildDayDetails(day: DayForecast): DayDetailLine[] {
  const lines: DayDetailLine[] = [];

  if (day.tMin !== undefined || day.tMax !== undefined) {
    lines.push({
      title: 'Temperatura',
      value: `mínima ${visible(day.tMin)}º, máxima ${visible(day.tMax)}º`,
      spoken: `mínima ${hablado(day.tMin)} grados, máxima ${hablado(day.tMax)} grados`,
    });
  }

  if (day.apparentMin !== undefined || day.apparentMax !== undefined) {
    lines.push({
      title: 'Sensación térmica',
      value: `mínima ${visible(day.apparentMin)}º, máxima ${visible(day.apparentMax)}º`,
      spoken: `mínima ${hablado(day.apparentMin)} grados, máxima ${hablado(day.apparentMax)} grados`,
    });
  }

  if (day.humidity !== undefined) {
    lines.push({
      title: 'Humedad media',
      value: `${numeroEs(day.humidity)}%`,
      spoken: `${numeroEs(day.humidity)} por ciento`,
    });
  }

  if (day.windMax !== undefined) {
    const direction = describeWindDirection(day.windDirection);
    const desde = direction ? ` del ${direction}` : '';
    const gustsValue =
      day.windGusts !== undefined ? `, rachas de ${numeroEs(day.windGusts)} km/h` : '';
    const gustsSpoken =
      day.windGusts !== undefined
        ? `, rachas de ${numeroEs(day.windGusts)} kilómetros por hora`
        : '';
    lines.push({
      title: 'Viento',
      value: `hasta ${numeroEs(day.windMax)} km/h${desde}${gustsValue}`,
      spoken: `hasta ${numeroEs(day.windMax)} kilómetros por hora${desde}${gustsSpoken}`,
    });
  }

  if (day.uvMax !== undefined) {
    const qualifier = describeUvIndex(day.uvMax);
    lines.push({
      title: 'Índice UV máximo',
      value: `${numeroEs(day.uvMax)}${qualifier ? ` (${qualifier})` : ''}`,
      // Con coma en vez de paréntesis: VoiceOver los lee de forma irregular y a veces se los salta.
      spoken: `${numeroEs(day.uvMax)}${qualifier ? `, ${qualifier}` : ''}`,
    });
  }

  if (day.precipitationSum !== undefined) {
    const probValue =
      day.rainProbability !== undefined ? `, probabilidad ${numeroEs(day.rainProbability)}%` : '';
    const probSpoken =
      day.rainProbability !== undefined
        ? `, probabilidad ${numeroEs(day.rainProbability)} por ciento`
        : '';
    lines.push({
      title: 'Precipitación',
      value: `${numeroEs(day.precipitationSum)} mm${probValue}`,
      spoken: `${numeroEs(day.precipitationSum)} milímetros${probSpoken}`,
    });
  }

  const sunrise = formatTime(day.sunrise);
  const sunset = formatTime(day.sunset);
  if (sunrise && sunset) {
    const value = `amanece a las ${sunrise}, anochece a las ${sunset}`;
    lines.push({ title: 'Sol', value, spoken: value });
  }

  if (day.moonPhase !== undefined || day.moonIllumination !== undefined) {
    const { name, emoji } = describeMoonPhase(day.moonPhase);
    const illum =
      day.moonIllumination !== undefined ? Math.round(day.moonIllumination * 100) : undefined;
    const illumValue = illum !== undefined ? `, ${illum}% iluminada` : '';
    const illumSpoken = illum !== undefined ? `, ${illum} por ciento iluminada` : '';
    const llena = textoProximaLunaLlena(day.moonDaysToFull);
    lines.push({
      title: 'Luna',
      value: `${emoji} ${name}${illumValue}${llena}`,
      spoken: `${name}${illumSpoken}${llena}`,
    });
  }

  const moonrise = formatTime(day.moonrise);
  const moonset = formatTime(day.moonset);
  if (moonrise || moonset || day.moonAlwaysUp || day.moonAlwaysDown) {
    let value: string;
    if (day.moonAlwaysUp) {
      value = 'sobre el horizonte todo el día';
    } else if (day.moonAlwaysDown) {
      value = 'bajo el horizonte todo el día';
    } else if (moonrise && moonset) {
      value = `sale a las ${moonrise}, se pone a las ${moonset}`;
    } else if (moonrise) {
      value = `sale a las ${moonrise}`;
    } else {
      value = `se pone a las ${moonset}`;
    }
    lines.push({ title: 'Salida y puesta de la luna', value, spoken: value });
  }

  return lines;
}

export interface ValoresAjustables {
  /** Valor verbalizado actual. */
  value: string;
  /** Valor que tendrá la fila tras el próximo flick arriba (previous) y abajo (next). */
  valueOnIncrement: string;
  valueOnDecrement: string;
}

// Opción en un índice; vacío si queda fuera de rango (defensivo).
function opcionEn(opciones: string[], index: number): string {
  return index >= 0 && index < opciones.length ? opciones[index] : '';
}

// Valor actual y los que resultarían del siguiente flick, calculados por adelantado. La vista
// nativa de iOS los necesita para fijar accessibilityValue de forma SÍNCRONA dentro del gesto;
// si el valor solo llegara por el rebote asíncrono a JS, la línea braille se quedaría con el
// valor viejo (ver modules/adjustable-button). El clampado replica al de next/previous en
// useDayRow. `opciones` es la lista completa del ajustable: previsión del día + sus detalles.
export function valoresFilaDia(opciones: string[], index: number): ValoresAjustables {
  const indiceSiguiente = Math.min(index + 1, opciones.length - 1);
  const indiceAnterior = Math.max(index - 1, 0);
  return {
    value: opcionEn(opciones, index),
    valueOnIncrement: opcionEn(opciones, indiceAnterior), // flick arriba = previous
    valueOnDecrement: opcionEn(opciones, indiceSiguiente), // flick abajo = next
  };
}

// Fecha y hora exactas de la última actualización. Se muestra siempre completa (con
// segundos) para que se pueda confirmar de un vistazo que los datos se han refrescado,
// en lugar de un impreciso "hace un momento".
export function formatUpdatedAt(timestamp: number | undefined): string | undefined {
  if (!timestamp || !Number.isFinite(timestamp)) {
    return undefined;
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const day = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
  const time = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${day.charAt(0).toUpperCase() + day.slice(1)} a las ${time}`;
}
