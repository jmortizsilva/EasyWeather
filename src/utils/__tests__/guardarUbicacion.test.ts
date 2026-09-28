import { CURRENT_LOCATION_ID, Place } from '../../types';
import { lugarDesdeUbicacion, PREFIJO_PUNTO, yaGuardado } from '../guardarUbicacion';

// El caso que lo destapó: Els Reguers (Tortosa). No está en la lista del INE porque no es un
// municipio, y en Open-Meteo figura como "Regués", así que la única vía para tenerlo guardado es
// estar allí. Ver docs/PENDIENTE.md.
const elsReguers: Place = {
  id: CURRENT_LOCATION_ID,
  name: 'Els Reguers, Tortosa',
  admin1: 'Cataluña',
  country: 'España',
  countryCode: 'ES',
  lat: 40.8387,
  lon: 0.4489,
};

describe('lugarDesdeUbicacion', () => {
  it('convierte la ubicación actual en un lugar fijo, conservando el nombre de Apple', () => {
    const lugar = lugarDesdeUbicacion(elsReguers);
    expect(lugar?.name).toBe('Els Reguers, Tortosa');
    expect(lugar?.lat).toBe(40.8387);
    expect(lugar?.admin1).toBe('Cataluña');
    expect(lugar?.countryCode).toBe('ES');
  });

  it('le da un id propio, que ya no es el que se mueve', () => {
    const lugar = lugarDesdeUbicacion(elsReguers);
    expect(lugar?.id).toBe(`${PREFIJO_PUNTO}40.8387,0.4489`);
    expect(lugar?.id).not.toBe(CURRENT_LOCATION_ID);
  });

  it('el id no cambia por la deriva del GPS de unos metros', () => {
    // Unos 3 m al norte: el identificador tiene que ser el mismo sitio.
    const unosMetros = { ...elsReguers, lat: 40.83873 };
    expect(lugarDesdeUbicacion(unosMetros)?.id).toBe(lugarDesdeUbicacion(elsReguers)?.id);
  });

  it('sin nombre de verdad no se guarda nada', () => {
    // "Mi ubicación" es lo que pone la app cuando Apple no sabe decir dónde estás: guardarlo
    // dejaría en la lista una fila igual que la de arriba, y encima quieta.
    expect(lugarDesdeUbicacion({ ...elsReguers, name: 'Mi ubicación' })).toBeUndefined();
    expect(lugarDesdeUbicacion({ ...elsReguers, name: '   ' })).toBeUndefined();
    expect(lugarDesdeUbicacion(undefined)).toBeUndefined();
  });

  it('sin coordenadas válidas tampoco', () => {
    expect(lugarDesdeUbicacion({ ...elsReguers, lat: NaN })).toBeUndefined();
  });
});

describe('yaGuardado', () => {
  const guardado = lugarDesdeUbicacion(elsReguers) as Place;

  it('reconoce el sitio que ya está en la lista', () => {
    expect(yaGuardado([guardado], guardado)?.id).toBe(guardado.id);
  });

  it('lo reconoce aunque te hayas movido unos metros desde que lo guardaste', () => {
    // 300 m más allá, mismo pueblo y mismo nombre: no se guarda dos veces.
    const masAlla = lugarDesdeUbicacion({ ...elsReguers, lat: 40.8414 }) as Place;
    expect(yaGuardado([guardado], masAlla)?.id).toBe(guardado.id);
  });

  it('no confunde dos sitios que se llaman igual pero están lejos', () => {
    const otroCentro = lugarDesdeUbicacion({
      ...elsReguers,
      name: 'Els Reguers, Tortosa',
      lat: 43.3,
      lon: -2.9,
    }) as Place;
    expect(yaGuardado([guardado], otroCentro)).toBeUndefined();
  });

  it('no estorba a dos barrios vecinos con nombres distintos', () => {
    const elBarrioDeAlLado = lugarDesdeUbicacion({
      ...elsReguers,
      name: 'Jesús, Tortosa',
      lat: 40.8402,
    }) as Place;
    expect(yaGuardado([guardado], elBarrioDeAlLado)).toBeUndefined();
  });

  it('con la lista vacía o sin punto, no hay nada guardado', () => {
    expect(yaGuardado([], guardado)).toBeUndefined();
    expect(yaGuardado([guardado], undefined)).toBeUndefined();
  });
});
