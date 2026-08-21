export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Número con coma decimal, que es como se escribe en español, redondeado a un decimal. Open-Meteo y
 * AEMET dan las temperaturas con decimales, y sin esto salían con punto ("28.9º"), que en una app en
 * español está mal escrito y además VoiceOver lo lee como si fuera otra cosa.
 */
export function numeroEs(valor: number): string {
  return String(Math.round(valor * 10) / 10).replace('.', ',');
}

export function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.replace(',', '.').trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}
