import * as SunCalc from 'suncalc';

export interface MoonDayInfo {
  moonrise?: string;
  moonset?: string;
  moonPhase?: number;
  moonIllumination?: number;
  moonAlwaysUp?: boolean;
  moonAlwaysDown?: boolean;
}

// Open-Meteo no ofrece datos de la luna, así que los calculamos en local con suncalc
// (sin red ni clave). Tomamos como referencia el mediodía local del día: la app ya
// asume que la zona horaria del dispositivo coincide con la del lugar (igual que hace
// con el amanecer y el anochecer de Open-Meteo), y la luna sigue el mismo criterio.
export function computeMoonInfo(dateISO: string, lat: number, lon: number): MoonDayInfo {
  const noon = new Date(`${dateISO}T12:00:00`);
  if (Number.isNaN(noon.getTime())) {
    return {};
  }

  const times = SunCalc.getMoonTimes(noon, lat, lon);
  const illumination = SunCalc.getMoonIllumination(noon);

  return {
    moonrise: times.rise ? times.rise.toISOString() : undefined,
    moonset: times.set ? times.set.toISOString() : undefined,
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
