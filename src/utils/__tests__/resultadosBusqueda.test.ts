import { Place } from '../../types';
import { describirResultados } from '../resultadosBusqueda';

const p = (id: string, name: string, extra: Partial<Place> = {}): Place => ({
  id,
  name,
  lat: 0,
  lon: 0,
  ...extra,
});

describe('describirResultados', () => {
  it('con un solo resultado basta la region', () => {
    const r = describirResultados([p('1', 'Vigo', { admin1: 'Galicia', admin2: 'Pontevedra' })]);
    expect(r).toHaveLength(1);
    expect(r[0].detalle).toBe('Galicia');
  });

  it('si dos se llaman igual en la misma region, los distingue con el siguiente dato', () => {
    // El caso que se veia en pantalla: dos filas identicas para una ciudad grande.
    const r = describirResultados([
      p('1', 'Londres', { admin1: 'Inglaterra', admin2: 'Gran Londres', country: 'Reino Unido' }),
      p('2', 'Londres', { admin1: 'Inglaterra', admin2: 'City of London', country: 'Reino Unido' }),
    ]);
    expect(r).toHaveLength(2);
    expect(r[0].detalle).toBe('Inglaterra · Gran Londres · Reino Unido');
    expect(r[1].detalle).toBe('Inglaterra · City of London · Reino Unido');
  });

  it('el pais se dice siempre, aunque no haga falta para distinguir', () => {
    // Es lo que permite descartar un resultado sin saberse la geografia de medio mundo.
    const r = describirResultados([p('1', 'Merida', { admin1: 'Extremadura', country: 'Espana' })]);
    expect(r[0].detalle).toBe('Extremadura · Espana');
  });

  it('el pais no sustituye a la region: se anade detras', () => {
    const r = describirResultados([
      p('1', 'Merida', { admin1: 'Extremadura', country: 'Espana' }),
      p('2', 'Merida', { admin1: 'Estado de Yucatan', country: 'Mexico' }),
    ]);
    expect(r.map((x) => x.detalle)).toEqual(['Extremadura · Espana', 'Estado de Yucatan · Mexico']);
  });

  it('no repite el pais si un nivel administrativo ya lo decia', () => {
    const r = describirResultados([p('1', 'Ciudad', { admin1: 'Singapur', country: 'Singapur' })]);
    expect(r[0].detalle).toBe('Singapur');
  });

  it('no alarga los que ya se distinguen por la region', () => {
    const r = describirResultados([
      p('1', 'Santiago', { admin1: 'Galicia', admin2: 'A Coruna' }),
      p('2', 'Santiago', { admin1: 'Region Metropolitana', admin2: 'Santiago' }),
    ]);
    expect(r.map((x) => x.detalle)).toEqual(['Galicia', 'Region Metropolitana']);
  });

  it('llega hasta el pais si hace falta para separarlos', () => {
    const r = describirResultados([
      p('1', 'Cordoba', { admin1: 'Andalucia', country: 'Espana' }),
      p('2', 'Cordoba', { admin1: 'Andalucia', country: 'Argentina' }),
    ]);
    expect(r[0].detalle).toBe('Andalucia · Espana');
    expect(r[1].detalle).toBe('Andalucia · Argentina');
  });

  it('no repite un dato que ya se dijo ni el propio nombre del lugar', () => {
    // Open-Meteo repite el nombre en los niveles administrativos de las capitales de provincia.
    const r = describirResultados([
      p('1', 'Murcia', { admin1: 'Murcia', admin2: 'Murcia', country: 'Espana' }),
    ]);
    expect(r[0].detalle).toBe('Espana');
  });

  it('deja una sola fila si siguen siendo indistinguibles con todos los datos', () => {
    const r = describirResultados([
      p('1', 'Nowhere', { admin1: 'Nada' }),
      p('2', 'Nowhere', { admin1: 'Nada' }),
    ]);
    expect(r).toHaveLength(1);
    expect(r[0].place.id).toBe('1'); // se conserva el primero: la API los da por relevancia
  });

  it('aguanta un lugar sin ningun dato de region', () => {
    const r = describirResultados([p('1', 'Isla')]);
    expect(r[0].detalle).toBe('');
  });

  it('con una lista vacia devuelve vacia', () => {
    expect(describirResultados([])).toEqual([]);
  });

  it('mantiene el orden que trae la API', () => {
    const r = describirResultados([
      p('1', 'Uno', { admin1: 'A' }),
      p('2', 'Dos', { admin1: 'B' }),
      p('3', 'Tres', { admin1: 'C' }),
    ]);
    expect(r.map((x) => x.place.id)).toEqual(['1', '2', '3']);
  });
});
