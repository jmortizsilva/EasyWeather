import { describirEdad, TEMP_FRESCA_MS, textoLugar, textoTempActual } from '../tempActual';

const AHORA = 1_700_000_000_000;

describe('textoTempActual', () => {
  it('sin dato devuelve undefined', () => {
    expect(textoTempActual(undefined, AHORA)).toBeUndefined();
    expect(textoTempActual({ temperature: undefined, fetchedAt: AHORA }, AHORA)).toBeUndefined();
  });

  it('dato fresco: solo la temperatura, redondeada', () => {
    const t = textoTempActual({ temperature: 15.4, fetchedAt: AHORA }, AHORA);
    expect(t).toEqual({ visible: '15º', hablado: '15 grados' });
  });

  it('dato viejo: añade la antigüedad, desarrollada al hablar', () => {
    const t = textoTempActual({ temperature: 15, fetchedAt: AHORA - 40 * 60 * 1000 }, AHORA);
    expect(t?.hablado).toBe('15 grados, hace 40 minutos');
    expect(t?.visible).toBe('15º · hace 40 min');
  });

  it('en el límite de frescura todavía no anuncia edad', () => {
    const t = textoTempActual({ temperature: 8, fetchedAt: AHORA - TEMP_FRESCA_MS }, AHORA);
    expect(t?.hablado).toBe('8 grados');
  });

  it('sin fetchedAt se trata como fresco (no inventa antigüedad)', () => {
    const t = textoTempActual({ temperature: 8 }, AHORA);
    expect(t?.hablado).toBe('8 grados');
  });
});

describe('describirEdad', () => {
  it('minutos', () => {
    expect(describirEdad(60_000)).toBe('1 minuto');
    expect(describirEdad(40 * 60_000)).toBe('40 minutos');
  });

  it('pasa a horas a partir de hora y media', () => {
    expect(describirEdad(120 * 60_000)).toBe('2 horas');
    expect(describirEdad(60 * 60_000)).toBe('1 hora');
  });
});

describe('textoLugar', () => {
  it('con temperatura une nombre y grados', () => {
    const r = textoLugar('Madrid', { temperature: 15, fetchedAt: AHORA }, AHORA);
    expect(r.hablado).toBe('Madrid, 15 grados');
    expect(r.visible).toBe('Madrid  15º');
  });

  it('sin temperatura solo el nombre', () => {
    const r = textoLugar('Madrid', undefined, AHORA);
    expect(r).toEqual({ visible: 'Madrid', hablado: 'Madrid' });
  });
});
