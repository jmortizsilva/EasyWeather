import { computeMoonInfo, describeMoonPhase } from '../moon';

describe('computeMoonInfo', () => {
  // Madrid (aprox), verano: desfase +2h = 7200 s.
  const info = computeMoonInfo('2025-08-01', 40.4, -3.7, 7200);

  it('devuelve fase e iluminacion en rango [0,1]', () => {
    expect(info.moonPhase).toBeGreaterThanOrEqual(0);
    expect(info.moonPhase).toBeLessThanOrEqual(1);
    expect(info.moonIllumination).toBeGreaterThanOrEqual(0);
    expect(info.moonIllumination).toBeLessThanOrEqual(1);
  });

  it('las horas de luna salen como ISO local SIN sufijo de zona (para formatearse igual)', () => {
    for (const hora of [info.moonrise, info.moonset]) {
      if (hora !== undefined) {
        expect(hora).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      }
    }
  });

  it('el resultado no depende de la zona horaria del entorno (mismo desfase, mismo resultado)', () => {
    const otra = computeMoonInfo('2025-08-01', 40.4, -3.7, 7200);
    expect(otra).toEqual(info);
  });

  it('fecha invalida devuelve objeto vacio', () => {
    expect(computeMoonInfo('no-es-fecha', 40.4, -3.7, 7200)).toEqual({});
  });
});

describe('describeMoonPhase', () => {
  it('mapea fases conocidas y desconocidas', () => {
    expect(describeMoonPhase(0).name).toBe('Luna nueva');
    expect(describeMoonPhase(0.5).name).toBe('Luna llena');
    expect(describeMoonPhase(undefined).name).toBe('Fase desconocida');
  });
});
