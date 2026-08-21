import { HourlyForecast } from '../../types';
import { filaHora } from '../horaTexto';

const HORA: HourlyForecast = {
  time: '2026-08-21T14:00',
  temperature: 30,
  weatherCode: 0,
  rainProbability: 10,
  windSpeed: 12,
  windDirection: 315,
};

describe('filaHora', () => {
  it('dice el rumbo en palabras, no en grados', () => {
    const fila = filaHora(HORA);
    expect(fila.direccion).toBe('del noroeste');
    expect(fila.spoken).toContain('viento 12 kilómetros por hora del noroeste');
    expect(fila.spoken).not.toContain('315');
  });

  it('lo hablado dice grados y kilómetros por hora con todas sus letras', () => {
    const fila = filaHora(HORA);
    expect(fila.spoken).toBe(
      '14:00: 30 grados, Cielo despejado, probabilidad de lluvia 10 por ciento, ' +
        'viento 12 kilómetros por hora del noroeste',
    );
    // Lo visible sí usa el símbolo y las abreviaturas.
    expect(fila.temperatura).toBe('30º');
    expect(fila.viento).toBe('Viento 12 km/h');
  });

  it('sin velocidad no se da el rumbo: un rumbo sin viento no informa de nada', () => {
    const fila = filaHora({ ...HORA, windSpeed: undefined });
    expect(fila.direccion).toBe('');
    expect(fila.spoken).toContain('viento sin dato');
    expect(fila.spoken).not.toContain('noroeste');
  });

  it('sin rumbo se queda con la velocidad, sin inventarse una dirección', () => {
    const fila = filaHora({ ...HORA, windDirection: undefined });
    expect(fila.direccion).toBe('');
    expect(fila.spoken).toContain('viento 12 kilómetros por hora');
  });

  it('los ocho rumbos salen del grado, redondeando al más cercano', () => {
    const rumbo = (grados: number) => filaHora({ ...HORA, windDirection: grados }).direccion;
    expect(rumbo(0)).toBe('del norte');
    expect(rumbo(45)).toBe('del noreste');
    expect(rumbo(90)).toBe('del este');
    expect(rumbo(180)).toBe('del sur');
    expect(rumbo(270)).toBe('del oeste');
    // 350 está más cerca del norte que del noroeste, y 359 no debe salirse de la tabla.
    expect(rumbo(350)).toBe('del norte');
    expect(rumbo(359)).toBe('del norte');
  });

  it('un hueco de la previsión no rompe la fila ni lo hablado', () => {
    const fila = filaHora({ time: '2026-08-21T03:00' });
    expect(fila.temperatura).toBe('-º');
    expect(fila.lluvia).toBe('Lluvia -%');
    expect(fila.spoken).toContain('sin dato grados');
    expect(fila.spoken).toContain('Sin datos de cielo');
  });
});
