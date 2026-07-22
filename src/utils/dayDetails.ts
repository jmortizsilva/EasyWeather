import { DayForecast } from '../types';
import { describeUvIndex, describeWindDirection } from './meteo';
import { describeMoonPhase } from './moon';

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
  const formatted = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export interface DayDetailLine {
  title: string;
  /** Texto visual (usa el símbolo º). */
  value: string;
  /** Texto para VoiceOver: dice "grados" en vez de º, que se leería como ordinal. */
  spoken: string;
}

export function buildDayDetails(day: DayForecast): DayDetailLine[] {
  const lines: DayDetailLine[] = [];

  if (day.tMin !== undefined || day.tMax !== undefined) {
    lines.push({
      title: 'Temperatura',
      value: `mínima ${day.tMin ?? '-'}º, máxima ${day.tMax ?? '-'}º`,
      spoken: `mínima ${day.tMin ?? 'sin dato'} grados, máxima ${day.tMax ?? 'sin dato'} grados`,
    });
  }

  if (day.apparentMin !== undefined || day.apparentMax !== undefined) {
    lines.push({
      title: 'Sensación térmica',
      value: `mínima ${day.apparentMin ?? '-'}º, máxima ${day.apparentMax ?? '-'}º`,
      spoken: `mínima ${day.apparentMin ?? 'sin dato'} grados, máxima ${day.apparentMax ?? 'sin dato'} grados`,
    });
  }

  if (day.humidity !== undefined) {
    const value = `${day.humidity}%`;
    lines.push({ title: 'Humedad media', value, spoken: value });
  }

  if (day.windMax !== undefined) {
    const direction = describeWindDirection(day.windDirection);
    const gusts = day.windGusts !== undefined ? `, rachas de ${day.windGusts} km/h` : '';
    const value = `hasta ${day.windMax} km/h${direction ? ` del ${direction}` : ''}${gusts}`;
    lines.push({ title: 'Viento', value, spoken: value });
  }

  if (day.uvMax !== undefined) {
    const qualifier = describeUvIndex(day.uvMax);
    const value = `${day.uvMax}${qualifier ? ` (${qualifier})` : ''}`;
    lines.push({ title: 'Índice UV máximo', value, spoken: value });
  }

  if (day.precipitationSum !== undefined) {
    const probability = day.rainProbability !== undefined ? `, probabilidad ${day.rainProbability}%` : '';
    const value = `${day.precipitationSum} mm${probability}`;
    lines.push({ title: 'Precipitación', value, spoken: value });
  }

  const sunrise = formatTime(day.sunrise);
  const sunset = formatTime(day.sunset);
  if (sunrise && sunset) {
    const value = `amanece a las ${sunrise}, anochece a las ${sunset}`;
    lines.push({ title: 'Sol', value, spoken: value });
  }

  if (day.moonPhase !== undefined || day.moonIllumination !== undefined) {
    const { name, emoji } = describeMoonPhase(day.moonPhase);
    const illum = day.moonIllumination !== undefined ? Math.round(day.moonIllumination * 100) : undefined;
    const illumValue = illum !== undefined ? `, ${illum}% iluminada` : '';
    const illumSpoken = illum !== undefined ? `, ${illum} por ciento iluminada` : '';
    lines.push({
      title: 'Luna',
      value: `${emoji} ${name}${illumValue}`,
      spoken: `${name}${illumSpoken}`,
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

  const day = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  const time = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${day.charAt(0).toUpperCase() + day.slice(1)} a las ${time}`;
}
