import { lugarDeEnlace } from '../enlaceWidget';

describe('lugarDeEnlace', () => {
  it('saca el id del lugar', () => {
    expect(lugarDeEnlace('com.jmortizsilva.tiempo://lugar/current')).toBe('current');
    expect(lugarDeEnlace('com.jmortizsilva.tiempo.dev://lugar/madrid-28079')).toBe('madrid-28079');
  });

  it('deshace lo que el widget codificó', () => {
    expect(lugarDeEnlace('com.jmortizsilva.tiempo://lugar/40.4%2C-3.7')).toBe('40.4,-3.7');
  });

  it('cualquier otro enlace no es del widget', () => {
    expect(lugarDeEnlace(undefined)).toBeUndefined();
    expect(lugarDeEnlace(null)).toBeUndefined();
    expect(
      lugarDeEnlace('exp+tiempo://expo-development-client/?url=http%3A%2F%2Flocalhost'),
    ).toBeUndefined();
    expect(lugarDeEnlace('com.jmortizsilva.tiempo://lugar/')).toBeUndefined();
    expect(lugarDeEnlace('com.jmortizsilva.tiempo://lugar/%E0%A4%A')).toBeUndefined();
  });
});
