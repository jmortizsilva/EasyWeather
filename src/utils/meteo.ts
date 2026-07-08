const WIND_DIRECTIONS = [
  'norte',
  'noreste',
  'este',
  'sureste',
  'sur',
  'suroeste',
  'oeste',
  'noroeste',
];

export function describeWindDirection(degrees: number | undefined): string | undefined {
  if (degrees === undefined || !Number.isFinite(degrees)) {
    return undefined;
  }

  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  return WIND_DIRECTIONS[index];
}

// Escala de la OMS para el índice UV.
export function describeUvIndex(uv: number | undefined): string | undefined {
  if (uv === undefined || !Number.isFinite(uv)) {
    return undefined;
  }

  if (uv < 3) return 'bajo';
  if (uv < 6) return 'moderado';
  if (uv < 8) return 'alto';
  if (uv < 11) return 'muy alto';
  return 'extremo';
}
