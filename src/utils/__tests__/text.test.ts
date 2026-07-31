import { normalizeText, toNumber } from '../text';

describe('normalizeText', () => {
  it('quita tildes, pasa a minusculas y recorta', () => {
    expect(normalizeText('  Málaga ')).toBe('malaga');
    expect(normalizeText('AVILÉS')).toBe('aviles');
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
