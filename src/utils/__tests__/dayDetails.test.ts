import { valoresFilaDia } from '../dayDetails';

// Opciones del ajustable: la previsión completa (opción 0) y detrás los detalles del día.
const PREV = 'mínima 1 grados, máxima 9 grados, despejado, probabilidad de lluvia 0 por ciento';
const TEMP = 'Temperatura: mínima 1 grados';
const HUM = 'Humedad media: 25%';
const VIENTO = 'Viento: hasta 10 km/h';
const opciones = [PREV, TEMP, HUM, VIENTO];

describe('valoresFilaDia', () => {
  it('aterrizaje (índice 0, previsión): arriba se queda, abajo entra en los detalles', () => {
    expect(valoresFilaDia(opciones, 0)).toEqual({
      value: PREV,
      valueOnIncrement: PREV, // flick arriba = previous, clampado a 0
      valueOnDecrement: TEMP, // flick abajo = next
    });
  });

  it('primer detalle: arriba vuelve a la previsión, abajo sigue avanzando', () => {
    expect(valoresFilaDia(opciones, 1)).toEqual({
      value: TEMP,
      valueOnIncrement: PREV,
      valueOnDecrement: HUM,
    });
  });

  it('detalle intermedio: expone ambos vecinos', () => {
    expect(valoresFilaDia(opciones, 2)).toEqual({
      value: HUM,
      valueOnIncrement: TEMP,
      valueOnDecrement: VIENTO,
    });
  });

  it('última opción: abajo se queda (no hay siguiente)', () => {
    expect(valoresFilaDia(opciones, 3)).toEqual({
      value: VIENTO,
      valueOnIncrement: HUM,
      valueOnDecrement: VIENTO,
    });
  });

  it('lista vacía: todo vacío, sin reventar por índices fuera de rango', () => {
    expect(valoresFilaDia([], 0)).toEqual({
      value: '',
      valueOnIncrement: '',
      valueOnDecrement: '',
    });
  });
});
