import { Place } from '../../types';
import { claveDeLugares, paginaQueTocaMostrar, valoresControl } from '../paginasLugar';
import { TempGuardada } from '../tempActual';

const lugar = (id: string, name: string): Place => ({ id, name, lat: 0, lon: 0 });

const LUGARES = [lugar('current', 'Madrid'), lugar('a', 'Sevilla'), lugar('b', 'Vigo')];

// Temperaturas recién obtenidas: con ahora = 0 se tratan como frescas y no se dice la antigüedad.
const TEMPS: Record<string, TempGuardada> = {
  current: { temperature: 30, fetchedAt: 0 },
  a: { temperature: 35, fetchedAt: 0 },
  b: { temperature: 18, fetchedAt: 0 },
};

describe('valoresControl', () => {
  it('la etiqueta es estable: no depende del lugar en el que estes', () => {
    expect(valoresControl(LUGARES, 0, TEMPS, 0).label).toBe('Selector de ubicación');
    expect(valoresControl(LUGARES, 2, TEMPS, 0).label).toBe('Selector de ubicación');
  });

  // Es la unica pagina que cambia sola al moverte; su nombre geocodificado no la distingue de un
  // lugar guardado que se llame igual.
  it('la ubicacion actual se anuncia como "Mi ubicación", los lugares guardados no', () => {
    expect(valoresControl(LUGARES, 0, TEMPS, 0).value).toContain('Mi ubicación, Madrid');
    expect(valoresControl(LUGARES, 1, TEMPS, 0).value).not.toContain('Mi ubicación');
  });

  it('el valor lleva lugar, grados y la posicion en el carrusel', () => {
    const { value } = valoresControl(LUGARES, 1, TEMPS, 0);
    expect(value).toContain('Sevilla');
    expect(value).toContain('35');
    expect(value).toContain('2 de 3');
  });

  // El sentido es el de la app Tiempo de iOS: arriba avanza. Antes era al revés, y por eso este
  // test se reescribió: afirmaba el comportamiento equivocado como si fuera el bueno.
  it('flick arriba lleva al lugar siguiente y flick abajo al anterior', () => {
    const v = valoresControl(LUGARES, 1, TEMPS, 0);
    expect(v.valueOnIncrement).toContain('Vigo'); // flick arriba = siguiente
    expect(v.valueOnDecrement).toContain('Madrid'); // flick abajo = anterior
  });

  it('en los extremos el vecino se queda en el mismo lugar, no se sale de la lista', () => {
    const primero = valoresControl(LUGARES, 0, TEMPS, 0);
    expect(primero.valueOnDecrement).toContain('Madrid');
    expect(primero.valueOnDecrement).toContain('1 de 3');

    const ultimo = valoresControl(LUGARES, 2, TEMPS, 0);
    expect(ultimo.valueOnIncrement).toContain('Vigo');
    expect(ultimo.valueOnIncrement).toContain('3 de 3');
  });

  it('un indice fuera de rango no rompe: se recorta a la lista', () => {
    expect(valoresControl(LUGARES, 99, TEMPS, 0).value).toContain('3 de 3');
    expect(valoresControl(LUGARES, -5, TEMPS, 0).value).toContain('1 de 3');
  });

  it('sin temperatura guardada dice solo el lugar y su posicion', () => {
    const { value } = valoresControl(LUGARES, 0, {}, 0);
    expect(value).toBe('Mi ubicación, Madrid. 1 de 3');
  });
});

describe('paginaQueTocaMostrar', () => {
  // El fallo que lo trajo: se guarda el sitio donde estás desde "Mis lugares", el lugar nuevo entra
  // EL PRIMERO de los guardados y todos los índices se corren, pero el lugar activo no cambia.

  const base = {
    activeIdPrevio: 'madrid',
    activeId: 'madrid',
    clavePrevia: 'current|madrid|vigo',
    clave: 'current|madrid|vigo',
    indicePagina: 1,
    indiceActivo: 1,
  };

  it('sin cambios no toca nada', () => {
    expect(paginaQueTocaMostrar(base)).toBeUndefined();
  });

  it('al añadir un lugar por delante, la página sigue al lugar que estabas viendo', () => {
    // "punto:40,0" entra el primero de los guardados: Madrid pasa del índice 1 al 2.
    expect(
      paginaQueTocaMostrar({
        ...base,
        clave: 'current|punto:40,0|madrid|vigo',
        indiceActivo: 2,
      }),
    ).toBe(2);
  });

  it('al quitar un lugar por delante del activo, también', () => {
    expect(
      paginaQueTocaMostrar({
        ...base,
        indicePagina: 2,
        clavePrevia: 'current|vigo|madrid',
        clave: 'current|madrid',
        indiceActivo: 1,
      }),
    ).toBe(1);
  });

  it('al cambiar de lugar activo desde fuera, la página va con él', () => {
    expect(paginaQueTocaMostrar({ ...base, activeId: 'vigo', indiceActivo: 2 })).toBe(2);
  });

  it('si la lista cambia pero el activo se queda donde estaba, no se mueve nada', () => {
    // Se quitó uno de DETRÁS: los índices anteriores no se corren.
    expect(
      paginaQueTocaMostrar({ ...base, clave: 'current|madrid', indiceActivo: 1 }),
    ).toBeUndefined();
  });

  it('si el lugar activo ya no está en la lista, se deja la página donde está', () => {
    // Quien lo quitó decide a dónde ir; saltar a ciegas sería peor.
    expect(
      paginaQueTocaMostrar({ ...base, clave: 'current|vigo', indiceActivo: -1 }),
    ).toBeUndefined();
  });
});

describe('claveDeLugares', () => {
  it('cambia al añadir, al quitar y al reordenar', () => {
    const a = claveDeLugares([{ id: 'current' }, { id: 'madrid' }]);
    expect(claveDeLugares([{ id: 'current' }, { id: 'x' }, { id: 'madrid' }])).not.toBe(a);
    expect(claveDeLugares([{ id: 'current' }])).not.toBe(a);
    // Reordenar deja la misma longitud y sin embargo los índices ya no señalan lo mismo.
    expect(claveDeLugares([{ id: 'madrid' }, { id: 'current' }])).not.toBe(a);
  });
});
