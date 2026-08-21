import { computeMoonInfo, describeMoonPhase, diasHastaLunaLlena } from '../moon';

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

describe('diasHastaLunaLlena', () => {
  // Anclaje con el mundo real, no con lo que devuelva suncalc: la luna llena de agosto de 2026 cae
  // el 28 a las 04:18 UTC (timeanddate.com). Con desfase de Madrid (+2h) el mediodia del 28 es el
  // que cae mas cerca de ese instante, asi que desde el 21 deben faltar 7 dias.
  const MADRID = 7200;

  it('acierta una luna llena real: 28 de agosto de 2026', () => {
    expect(diasHastaLunaLlena('2026-08-21', MADRID)).toBe(7);
    expect(diasHastaLunaLlena('2026-08-28', MADRID)).toBe(0);
  });

  it('los dias que YA se llaman "luna llena" cuentan como cero, no como "manana"', () => {
    // La franja de fase que describeMoonPhase llama "Luna llena" abarca algo mas de un dia, asi que
    // el 27 la pantalla ya pone "Luna llena". Devolver 1 haria que la linea dijese "Luna llena...
    // luna llena manana", que se contradice. Se prefiere callar la coletilla a contradecirse.
    expect(
      describeMoonPhase(computeMoonInfo('2026-08-27', 40.4, -3.7, MADRID).moonPhase).name,
    ).toBe('Luna llena');
    expect(diasHastaLunaLlena('2026-08-27', MADRID)).toBe(0);
  });

  it('el dia que señala es de luna llena de verdad: iluminada casi al 100%', () => {
    const dias = diasHastaLunaLlena('2026-08-21', MADRID);
    const fecha = new Date(Date.parse('2026-08-21T12:00:00Z') + (dias ?? 0) * 86_400_000);
    const info = computeMoonInfo(fecha.toISOString().slice(0, 10), 40.4, -3.7, MADRID);
    expect(info.moonIllumination).toBeGreaterThan(0.98);
  });

  it('la cuenta baja de uno en uno segun avanzan los dias', () => {
    const cuenta = ['21', '22', '23', '24', '25', '26'].map((d) =>
      diasHastaLunaLlena(`2026-08-${d}`, MADRID),
    );
    expect(cuenta).toEqual([7, 6, 5, 4, 3, 2]);
  });

  it('justo despues de una llena empieza a contar la SIGUIENTE, no vuelve a cero', () => {
    // El 30 de agosto ya se ha pasado la del 28; la siguiente es la de septiembre.
    const dias = diasHastaLunaLlena('2026-08-30', MADRID);
    expect(dias).toBeGreaterThan(20);
    expect(dias).toBeLessThan(30);
  });

  it('fecha invalida devuelve undefined en vez de un numero inventado', () => {
    expect(diasHastaLunaLlena('no-es-fecha', MADRID)).toBeUndefined();
  });
});

describe('describeMoonPhase', () => {
  it('mapea fases conocidas y desconocidas', () => {
    expect(describeMoonPhase(0).name).toBe('Luna nueva');
    expect(describeMoonPhase(0.5).name).toBe('Luna llena');
    expect(describeMoonPhase(undefined).name).toBe('Fase desconocida');
  });
});
