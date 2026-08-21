import { DayForecast } from '../../types';
import { buildDayDetails, valoresFilaDia } from '../dayDetails';

// Un dia con TODOS los valores con decimales, que es donde se veian los dos fallos: el punto
// decimal ("24.6") y las unidades leidas de forma distinta segun la fila.
const DIA: DayForecast = {
  date: '2026-08-21',
  tMin: 24.6,
  tMax: 31.4,
  apparentMin: 25.1,
  apparentMax: 33.8,
  humidity: 45.2,
  windMax: 24.5,
  windGusts: 40.2,
  windDirection: 315,
  uvMax: 7.35,
  precipitationSum: 0.24,
  rainProbability: 10,
};

const linea = (titulo: string) => buildDayDetails(DIA).find((l) => l.title === titulo);

describe('buildDayDetails', () => {
  it('ninguna fila escribe el decimal con punto: en español se escribe con coma', () => {
    for (const l of buildDayDetails(DIA)) {
      expect(l.value).not.toMatch(/\d\.\d/);
      expect(l.spoken).not.toMatch(/\d\.\d/);
    }
  });

  it('lo visible usa simbolos y lo hablado dice la unidad con todas sus letras', () => {
    expect(linea('Temperatura')?.value).toBe('mínima 24,6º, máxima 31,4º');
    expect(linea('Temperatura')?.spoken).toBe('mínima 24,6 grados, máxima 31,4 grados');

    expect(linea('Humedad media')?.value).toBe('45,2%');
    expect(linea('Humedad media')?.spoken).toBe('45,2 por ciento');

    expect(linea('Viento')?.value).toBe('hasta 24,5 km/h del noroeste, rachas de 40,2 km/h');
    expect(linea('Viento')?.spoken).toBe(
      'hasta 24,5 kilómetros por hora del noroeste, rachas de 40,2 kilómetros por hora',
    );

    expect(linea('Precipitación')?.value).toBe('0,2 mm, probabilidad 10%');
    expect(linea('Precipitación')?.spoken).toBe('0,2 milímetros, probabilidad 10 por ciento');
  });

  it('el indice UV cambia los parentesis por una coma al hablarlo', () => {
    expect(linea('Índice UV máximo')?.value).toBe('7,4 (alto)');
    expect(linea('Índice UV máximo')?.spoken).toBe('7,4, alto');
  });

  it('ninguna fila hablada deja abreviaturas sueltas que VoiceOver lea a su manera', () => {
    for (const l of buildDayDetails(DIA)) {
      expect(l.spoken).not.toContain('km/h');
      expect(l.spoken).not.toContain('º');
      expect(l.spoken).not.toContain('%');
    }
  });

  it('la luna dice cuanto falta para la llena, y se calla el dia que ya lo es', () => {
    const conCuenta = buildDayDetails({ ...DIA, moonPhase: 0.2, moonDaysToFull: 7 });
    expect(conCuenta.find((l) => l.title === 'Luna')?.spoken).toContain('luna llena en 7 días');

    const manana = buildDayDetails({ ...DIA, moonPhase: 0.2, moonDaysToFull: 1 });
    expect(manana.find((l) => l.title === 'Luna')?.spoken).toContain('luna llena mañana');

    const hoy = buildDayDetails({ ...DIA, moonPhase: 0.5, moonDaysToFull: 0 });
    expect(hoy.find((l) => l.title === 'Luna')?.spoken).not.toContain('luna llena en');
  });

  it('sin datos de luna no aparece la fila, en vez de salir vacia', () => {
    expect(buildDayDetails(DIA).find((l) => l.title === 'Luna')).toBeUndefined();
  });
});

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
