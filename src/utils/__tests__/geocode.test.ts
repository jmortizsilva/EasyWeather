import { nombreUbicacion } from '../geocode';

describe('nombreUbicacion', () => {
  it('barrio y ciudad -> "barrio, ciudad"', () => {
    expect(nombreUbicacion({ district: 'Ciudad Lineal', city: 'Madrid' })).toBe(
      'Ciudad Lineal, Madrid',
    );
  });

  it('sin barrio -> ciudad', () => {
    expect(nombreUbicacion({ district: null, city: 'Madrid' })).toBe('Madrid');
  });

  it('barrio igual que ciudad -> ciudad (sin repetir)', () => {
    expect(nombreUbicacion({ district: 'Madrid', city: 'Madrid' })).toBe('Madrid');
  });

  it('solo barrio -> barrio', () => {
    expect(nombreUbicacion({ district: 'Ciudad Lineal' })).toBe('Ciudad Lineal');
  });

  it('sin ciudad ni barrio -> comarca', () => {
    expect(nombreUbicacion({ subregion: 'Sierra Norte' })).toBe('Sierra Norte');
  });

  it('cadenas vacias o nada -> undefined', () => {
    expect(nombreUbicacion({ city: '  ', district: '' })).toBeUndefined();
    expect(nombreUbicacion(undefined)).toBeUndefined();
  });
});
