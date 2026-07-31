import { describeWeatherCode } from '../weatherCodes';

describe('describeWeatherCode', () => {
  it('devuelve la descripcion del codigo WMO conocido', () => {
    expect(describeWeatherCode(0).label).toBe('Cielo despejado');
    expect(describeWeatherCode(95).label).toBe('Tormenta');
  });

  it('cae en "sin datos" con codigo desconocido o ausente', () => {
    expect(describeWeatherCode(undefined).label).toBe('Sin datos de cielo');
    expect(describeWeatherCode(1234).label).toBe('Sin datos de cielo');
  });
});
