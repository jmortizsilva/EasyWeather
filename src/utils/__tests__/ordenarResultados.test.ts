import { Place } from '../../types';
import { distanciaKm, ordenarPorCercania, Referencia } from '../ordenarResultados';

const p = (id: string, name: string, lat: number, lon: number, extra: Partial<Place> = {}): Place =>
  ({ id, name, lat, lon, ...extra }) as Place;

// Coordenadas aproximadas, las justas para que las distancias relativas sean las de verdad.
const MADRID: Referencia = { lat: 40.42, lon: -3.7, countryCode: 'ES', country: 'Espana' };

const meridaBadajoz = p('1', 'Merida', 38.92, -6.34, { countryCode: 'ES', country: 'Espana' });
const meridaYucatan = p('2', 'Merida', 20.97, -89.62, { countryCode: 'MX', country: 'Mexico' });
const meridaVenezuela = p('3', 'Merida', 8.6, -71.15, { countryCode: 'VE', country: 'Venezuela' });
const barcelona = p('4', 'Barcelona', 41.39, 2.17, { countryCode: 'ES', country: 'Espana' });

describe('distanciaKm', () => {
  it('mide una distancia conocida con poco error', () => {
    // Madrid - Barcelona son unos 505 km en linea recta.
    expect(distanciaKm(MADRID, barcelona)).toBeGreaterThan(480);
    expect(distanciaKm(MADRID, barcelona)).toBeLessThan(530);
  });

  it('el mismo punto esta a cero', () => {
    expect(distanciaKm(MADRID, { lat: 40.42, lon: -3.7 })).toBeCloseTo(0);
  });

  it('no se rompe al cruzar el meridiano 180', () => {
    // Dos puntos vecinos con longitudes +179 y -179: restando coordenadas darian media vuelta al
    // mundo. Estan a poco mas de 200 km.
    const cerca = distanciaKm({ lat: 0, lon: 179 }, { lat: 0, lon: -179 });
    expect(cerca).toBeLessThan(250);
  });
});

describe('ordenarPorCercania', () => {
  it('pone tu pais primero: la Merida de Extremadura por delante de Mexico y Venezuela', () => {
    // El caso que se veia en pantalla. Open-Meteo devuelve estas tres en este orden, por relevancia
    // mundial, y la de al lado quedaba tercera.
    const r = ordenarPorCercania([meridaYucatan, meridaVenezuela, meridaBadajoz], MADRID);
    expect(r.map((x) => x.id)).toEqual(['1', '2', '3']);
  });

  it('dentro de tu pais manda la distancia', () => {
    const r = ordenarPorCercania([barcelona, meridaBadajoz], MADRID);
    expect(r.map((x) => x.id)).toEqual(['1', '4']); // Merida (330 km) antes que Barcelona (505 km)
  });

  it('los de fuera conservan el orden de la API', () => {
    const r = ordenarPorCercania([meridaYucatan, meridaVenezuela], MADRID);
    expect(r.map((x) => x.id)).toEqual(['2', '3']);
  });

  it('sin ubicacion se respeta el orden original', () => {
    const entrada = [meridaYucatan, meridaVenezuela, meridaBadajoz];
    expect(ordenarPorCercania(entrada, undefined).map((x) => x.id)).toEqual(['2', '3', '1']);
  });

  it('no modifica la lista que recibe', () => {
    const entrada = [meridaYucatan, meridaBadajoz];
    ordenarPorCercania(entrada, MADRID);
    expect(entrada.map((x) => x.id)).toEqual(['2', '1']);
  });

  it('sin codigo ISO se compara el nombre del pais, que es el respaldo', () => {
    const sinCodigo: Referencia = { lat: 40.42, lon: -3.7, country: 'Espana' };
    const lugar = p('9', 'Merida', 38.92, -6.34, { country: 'Espana' });
    const r = ordenarPorCercania([meridaYucatan, lugar], sinCodigo);
    expect(r.map((x) => x.id)).toEqual(['9', '2']);
  });

  it('si no hay forma de saber el pais, no se inventa una agrupacion', () => {
    const sinPais: Referencia = { lat: 40.42, lon: -3.7 };
    const entrada = [meridaYucatan, meridaBadajoz];
    expect(ordenarPorCercania(entrada, sinPais).map((x) => x.id)).toEqual(['2', '1']);
  });

  it('con una lista vacia devuelve vacia', () => {
    expect(ordenarPorCercania([], MADRID)).toEqual([]);
  });
});
