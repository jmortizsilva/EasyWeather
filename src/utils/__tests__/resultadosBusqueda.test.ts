import { Place } from '../../types';
import { sinDuplicados } from '../resultadosBusqueda';

const p = (id: string, name: string, admin1?: string, lat = 0, lon = 0): Place => ({
  id,
  name,
  admin1,
  lat,
  lon,
});

describe('sinDuplicados', () => {
  it('quita los resultados que se presentan igual (el caso real de "Londres")', () => {
    // Open-Meteo devolvia dos entradas distintas que en pantalla se leian identicas.
    const resultados = [
      p('1', 'Londres', 'Inglaterra', 51.5, -0.12),
      p('2', 'Londres', 'Inglaterra', 51.51, -0.09),
      p('3', 'Londres', 'Ontario', 42.98, -81.24),
    ];
    const limpio = sinDuplicados(resultados);
    expect(limpio.map((x) => x.id)).toEqual(['1', '3']);
  });

  it('conserva el primero de cada grupo (la API los da por relevancia)', () => {
    const limpio = sinDuplicados([p('a', 'Madrid', 'Madrid'), p('b', 'Madrid', 'Madrid')]);
    expect(limpio).toHaveLength(1);
    expect(limpio[0].id).toBe('a');
  });

  it('no confunde lugares con el mismo nombre en regiones distintas', () => {
    const limpio = sinDuplicados([
      p('a', 'Santiago', 'Galicia'),
      p('b', 'Santiago', 'Region Metropolitana'),
    ]);
    expect(limpio).toHaveLength(2);
  });

  it('ignora mayusculas y espacios sobrantes al comparar', () => {
    const limpio = sinDuplicados([p('a', 'Vigo', 'Galicia'), p('b', ' vigo ', ' GALICIA ')]);
    expect(limpio).toHaveLength(1);
  });

  it('trata igual la region ausente y la vacia', () => {
    const limpio = sinDuplicados([p('a', 'Nowhere'), p('b', 'Nowhere', '')]);
    expect(limpio).toHaveLength(1);
  });

  it('con una lista vacia devuelve vacia', () => {
    expect(sinDuplicados([])).toEqual([]);
  });
});
