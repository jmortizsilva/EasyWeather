import * as SunCalc from 'suncalc';

export interface MoonDayInfo {
  moonrise?: string;
  moonset?: string;
  moonPhase?: number;
  moonIllumination?: number;
  moonAlwaysUp?: boolean;
  moonAlwaysDown?: boolean;
  /** Días desde ESTE día hasta la próxima luna llena; 0 si el día ya es de luna llena. */
  moonDaysToFull?: number;
}

// Franja de fase que se considera luna llena. La comparten describeMoonPhase (que pone el nombre) y
// la cuenta atrás, y tiene que ser la misma en las dos: si no, la línea podría decir "Luna llena" y
// a la vez "luna llena en 29 días".
//
// Consecuencia asumida: la franja abarca algo más de un día, así que la víspera del instante real
// ya se llama "Luna llena" y ahí la cuenta atrás se calla en vez de decir "mañana". Se prefiere
// perder la coletilla un día antes que contradecir al nombre que se está enseñando.
const LLENA_MIN = 0.47;
const LLENA_MAX = 0.53;

// El mes sinódico dura 29,53 días; con 31 se cubre entero con margen.
const DIAS_QUE_SE_MIRAN = 31;
const DIA_MS = 86_400_000;

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
    moonDaysToFull: diasHastaLunaLlena(dateISO, utcOffsetSeconds),
  };
}

/**
 * Días que faltan, DESDE ESE DÍA, para la próxima luna llena. 0 si ese día ya es de luna llena.
 *
 * No se calcula con una regla de tres sobre el mes sinódico: la órbita no es regular y el error se
 * come el día entero, que es justo la unidad que se enseña. Se recorre día a día, mirando la fase al
 * mediodía local, y se busca el salto que cruza la mitad del ciclo (0,5 = luna llena). Se devuelve
 * el mediodía que cae más cerca del cruce, porque el instante real está entre los dos.
 */
export function diasHastaLunaLlena(dateISO: string, utcOffsetSeconds = 0): number | undefined {
  const baseMs = Date.parse(`${dateISO}T12:00:00Z`) - utcOffsetSeconds * 1000;
  if (Number.isNaN(baseMs)) {
    return undefined;
  }

  const faseEn = (dia: number) =>
    SunCalc.getMoonIllumination(new Date(baseMs + dia * DIA_MS)).phase;

  let anterior = faseEn(0);
  if (anterior >= LLENA_MIN && anterior <= LLENA_MAX) {
    return 0;
  }

  for (let dia = 1; dia <= DIAS_QUE_SE_MIRAN; dia += 1) {
    const actual = faseEn(dia);
    // La fase crece de 0 a 1 y vuelve a empezar en la luna nueva; si baja, ha dado la vuelta y ese
    // salto no es el de la luna llena.
    const haDadoLaVuelta = actual < anterior;
    if (!haDadoLaVuelta && anterior < 0.5 && actual >= 0.5) {
      return Math.abs(anterior - 0.5) <= Math.abs(actual - 0.5) ? dia - 1 : dia;
    }
    anterior = actual;
  }
  return undefined;
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
  if (p < LLENA_MIN) return { name: 'Luna gibosa creciente', emoji: '🌔' };
  if (p <= LLENA_MAX) return { name: 'Luna llena', emoji: '🌕' };
  if (p < 0.72) return { name: 'Luna gibosa menguante', emoji: '🌖' };
  if (p < 0.78) return { name: 'Cuarto menguante', emoji: '🌗' };
  return { name: 'Luna menguante', emoji: '🌘' };
}
