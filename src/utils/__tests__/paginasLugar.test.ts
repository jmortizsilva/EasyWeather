import { Place } from '../../types';
import { valoresControl } from '../paginasLugar';
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
  it('la etiqueta es corta y estable (en braille es un prefijo permanente)', () => {
    expect(valoresControl(LUGARES, 0, TEMPS, 0).label).toBe('Lugar');
    expect(valoresControl(LUGARES, 2, TEMPS, 0).label).toBe('Lugar');
  });

  it('el valor lleva lugar, grados y la posicion en el carrusel', () => {
    const { value } = valoresControl(LUGARES, 1, TEMPS, 0);
    expect(value).toContain('Sevilla');
    expect(value).toContain('35');
    expect(value).toContain('2 de 3');
  });

  it('los valores vecinos se adelantan para refrescar la braille en el gesto', () => {
    const v = valoresControl(LUGARES, 1, TEMPS, 0);
    expect(v.valueOnIncrement).toContain('Madrid'); // flick arriba = anterior
    expect(v.valueOnDecrement).toContain('Vigo'); // flick abajo = siguiente
  });

  it('en los extremos el vecino se queda en el mismo lugar, no se sale de la lista', () => {
    const primero = valoresControl(LUGARES, 0, TEMPS, 0);
    expect(primero.valueOnIncrement).toContain('Madrid');
    expect(primero.valueOnIncrement).toContain('1 de 3');

    const ultimo = valoresControl(LUGARES, 2, TEMPS, 0);
    expect(ultimo.valueOnDecrement).toContain('Vigo');
    expect(ultimo.valueOnDecrement).toContain('3 de 3');
  });

  it('un indice fuera de rango no rompe: se recorta a la lista', () => {
    expect(valoresControl(LUGARES, 99, TEMPS, 0).value).toContain('3 de 3');
    expect(valoresControl(LUGARES, -5, TEMPS, 0).value).toContain('1 de 3');
  });

  it('sin temperatura guardada dice solo el lugar y su posicion', () => {
    const { value } = valoresControl(LUGARES, 0, {}, 0);
    expect(value).toBe('Madrid. 1 de 3');
  });
});
