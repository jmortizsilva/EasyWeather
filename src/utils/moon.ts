import * as SunCalc from 'suncalc';

export interface MoonDayInfo {
  moonrise?: string;
  moonset?: string;
  moonPhase?: number;
  moonIllumination?: number;
  moonAlwaysUp?: boolean;
  moonAlwaysDown?: boolean;
}

// Open-Meteo no ofrece datos de la luna, así que los calculamos en local con suncalc (sin red ni
// clave). `utcOffsetSeconds` es el desfase horario DEL LUGAR (el que devuelve Open-Meteo): con él
// las horas salen en la hora local del sitio y son idénticas en el teléfono y en el servidor
// (que corre en UTC), sin depender de la zona horaria del entorno. Se devuelven como ISO SIN
// sufijo de zona (igual que el amanecer/anochecer de Open-Meteo) para que se formateen igual.
export function computeMoonInfo(
  dateISO: string,
  lat: number,
  lon: number,
  utcOffsetSeconds = 0,
): MoonDayInfo {
  const offsetMs = utcOffsetSeconds * 1000;
  // Mediodía en la hora local del lugar, como instante real (UTC).
  const noonUtcMs = Date.parse(`${dateISO}T12:00:00Z`) - offsetMs;
  if (Number.isNaN(noonUtcMs)) {
    return {};
  }
  const noon = new Date(noonUtcMs);
  // inUTC=true: suncalc usa el día natural (UTC) del instante que le pasamos, que es el mediodía
  // local; así el día de referencia es el del lugar, no el del entorno donde corre el código. El
  // 4º parámetro existe en el runtime de suncalc pero su tipado no lo declara, de ahí el cast.
  const getMoonTimes = SunCalc.getMoonTimes as (
    date: Date,
    lat: number,
    lng: number,
    inUTC?: boolean,
  ) => { rise?: Date; set?: Date; alwaysUp?: boolean; alwaysDown?: boolean };
  const times = getMoonTimes(noon, lat, lon, true);
  const illumination = SunCalc.getMoonIllumination(noon);

  const aHoraLocal = (d: Date | null | undefined): string | undefined =>
    d ? new Date(d.getTime() + offsetMs).toISOString().slice(0, 16) : undefined;

  return {
    moonrise: aHoraLocal(times.rise),
    moonset: aHoraLocal(times.set),
    moonPhase: illumination.phase,
    moonIllumination: illumination.fraction,
    moonAlwaysUp: times.alwaysUp,
    moonAlwaysDown: times.alwaysDown,
  };
}

// Nombres en español de las ocho fases lunares, con su emoji correspondiente.
export function describeMoonPhase(phase: number | undefined): { name: string; emoji: string } {
  if (phase === undefined || !Number.isFinite(phase)) {
    return { name: 'Fase desconocida', emoji: '🌙' };
  }

  const p = ((phase % 1) + 1) % 1;
  if (p < 0.03 || p > 0.97) return { name: 'Luna nueva', emoji: '🌑' };
  if (p < 0.22) return { name: 'Luna creciente', emoji: '🌒' };
  if (p < 0.28) return { name: 'Cuarto creciente', emoji: '🌓' };
  if (p < 0.47) return { name: 'Luna gibosa creciente', emoji: '🌔' };
  if (p < 0.53) return { name: 'Luna llena', emoji: '🌕' };
  if (p < 0.72) return { name: 'Luna gibosa menguante', emoji: '🌖' };
  if (p < 0.78) return { name: 'Cuarto menguante', emoji: '🌗' };
  return { name: 'Luna menguante', emoji: '🌘' };
}
