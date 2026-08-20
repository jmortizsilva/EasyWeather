import { distanciaMetros, esElMismoSitio } from '../distancia';

const MADRID = { lat: 40.4168, lon: -3.7038 };
const SEVILLA = { lat: 37.3891, lon: -5.9845 };

describe('distanciaMetros', () => {
  it('el mismo punto son 0 metros', () => {
    expect(distanciaMetros(MADRID, MADRID)).toBe(0);
  });

  it('Madrid-Sevilla ronda los 390 km', () => {
    const km = distanciaMetros(MADRID, SEVILLA) / 1000;
    expect(km).toBeGreaterThan(385);
    expect(km).toBeLessThan(395);
  });

  it('es simetrica', () => {
    expect(distanciaMetros(MADRID, SEVILLA)).toBeCloseTo(distanciaMetros(SEVILLA, MADRID), 6);
  });

  it('un grado de latitud son unos 111 km, se mida donde se mida', () => {
    const enMadrid = distanciaMetros(MADRID, { lat: MADRID.lat + 1, lon: MADRID.lon });
    const enEcuador = distanciaMetros({ lat: 0, lon: 0 }, { lat: 1, lon: 0 });
    expect(enMadrid / 1000).toBeCloseTo(111.19, 1);
    expect(enEcuador / 1000).toBeCloseTo(111.19, 1);
  });

  // Un grado de longitud encoge con la latitud; sin el coseno saldrian los mismos 111 km.
  it('un grado de longitud encoge al subir de latitud', () => {
    const enEcuador = distanciaMetros({ lat: 0, lon: 0 }, { lat: 0, lon: 1 });
    const enMadrid = distanciaMetros(MADRID, { lat: MADRID.lat, lon: MADRID.lon + 1 });
    expect(enMadrid).toBeLessThan(enEcuador * 0.8);
  });
});

describe('esElMismoSitio', () => {
  it('a menos de 1,5 km es el mismo sitio', () => {
    // ~1,1 km al norte
    expect(esElMismoSitio(MADRID, { lat: MADRID.lat + 0.01, lon: MADRID.lon })).toBe(true);
  });

  it('a mas de 1,5 km ya no', () => {
    // ~3,3 km al norte
    expect(esElMismoSitio(MADRID, { lat: MADRID.lat + 0.03, lon: MADRID.lon })).toBe(false);
  });

  it('sin alguno de los dos puntos, no se puede afirmar que sea el mismo sitio', () => {
    expect(esElMismoSitio(MADRID, undefined)).toBe(false);
    expect(esElMismoSitio(undefined, MADRID)).toBe(false);
  });
});
