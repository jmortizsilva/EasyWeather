import { normalizeText, numeroEs, toNumber } from '../text';

describe('normalizeText', () => {
  it('quita tildes, pasa a minusculas y recorta', () => {
    expect(normalizeText('  Málaga ')).toBe('malaga');
    expect(normalizeText('AVILÉS')).toBe('aviles');
  });
});

describe('numeroEs', () => {
  it('escribe el decimal con coma, que es como se escribe en español', () => {
    expect(numeroEs(28.9)).toBe('28,9');
    expect(numeroEs(-1.5)).toBe('-1,5');
  });

  it('redondea a un decimal y no deja un ",0" colgando', () => {
    expect(numeroEs(28.94)).toBe('28,9');
    expect(numeroEs(28.96)).toBe('29');
    expect(numeroEs(30)).toBe('30');
  });
});

describe('toNumber', () => {
  it('acepta numeros finitos tal cual', () => {
    expect(toNumber(30)).toBe(30);
    expect(toNumber(-2)).toBe(-2);
  });

  it('convierte cadenas con coma decimal', () => {
    expect(toNumber('3,5')).toBe(3.5);
    expect(toNumber(' -2 ')).toBe(-2);
  });

  it('devuelve undefined con valores no numericos', () => {
    expect(toNumber('hola')).toBeUndefined();
    expect(toNumber(NaN)).toBeUndefined();
    expect(toNumber(null)).toBeUndefined();
  });
});
