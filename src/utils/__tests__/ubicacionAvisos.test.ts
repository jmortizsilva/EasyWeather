import { ubicacionParaEnviar } from '../ubicacionAvisos';

const MADRID = { lat: 40.4168, lon: -3.7038, nombre: 'Madrid' };
// A unos 3,3 km: para la app ya es otro sitio.
const OTRO_SITIO = { lat: 40.4468, lon: -3.7038 };
// A unos 1,1 km: sigue siendo el mismo sitio.
const AL_LADO = { lat: 40.4268, lon: -3.7038 };

describe('ubicacionParaEnviar', () => {
  it('manda la lectura fresca, no la cacheada', () => {
    const fresca = { lat: 37.3891, lon: -5.9845, nombre: 'Sevilla' };
    expect(ubicacionParaEnviar(fresca, MADRID)).toEqual(fresca);
  });

  it('sin lectura fresca se manda la cacheada, que es lo unico que hay', () => {
    expect(ubicacionParaEnviar(undefined, MADRID)).toEqual(MADRID);
  });

  it('sin lectura fresca y sin cacheada no se manda ubicacion', () => {
    expect(ubicacionParaEnviar(undefined, undefined)).toBeNull();
  });

  // El fallo que nombraba la ciudad equivocada en el aviso de temperatura.
  it('si la lectura fresca no trae nombre y esta lejos, NO se le pega el nombre viejo', () => {
    expect(ubicacionParaEnviar(OTRO_SITIO, MADRID)).toEqual({
      lat: OTRO_SITIO.lat,
      lon: OTRO_SITIO.lon,
      nombre: undefined,
    });
  });

  it('si la lectura fresca no trae nombre pero es el mismo sitio, se reaprovecha el nombre', () => {
    expect(ubicacionParaEnviar(AL_LADO, MADRID)).toEqual({
      lat: AL_LADO.lat,
      lon: AL_LADO.lon,
      nombre: 'Madrid',
    });
  });

  it('sin nombre fresco y sin cacheada, se manda solo la posicion', () => {
    expect(ubicacionParaEnviar(OTRO_SITIO, undefined)).toEqual({
      lat: OTRO_SITIO.lat,
      lon: OTRO_SITIO.lon,
      nombre: undefined,
    });
  });

  it('el nombre fresco manda siempre, aunque haya uno cacheado del mismo sitio', () => {
    const fresca = { lat: AL_LADO.lat, lon: AL_LADO.lon, nombre: 'Chamartin, Madrid' };
    expect(ubicacionParaEnviar(fresca, MADRID)?.nombre).toBe('Chamartin, Madrid');
  });
});
