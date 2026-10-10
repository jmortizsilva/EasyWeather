import { esLetraGrande } from '../letraGrande';

// Las escalas son las que da iOS para cada tamaño, medidas con el servicio `entorno` del puente el
// 2026-10-10. Lo que fija la prueba: ningún tamaño normal cambia la disposición, y todos los de
// accesibilidad sí.
describe('cuándo la letra es grande', () => {
  it.each([
    ['large, el de serie', 1],
    ['extra-extra-extra-large, el mayor de los normales', 1.353],
  ])('%s no lo es', (_nombre, escala) => {
    expect(esLetraGrande(escala)).toBe(false);
  });

  it.each([
    ['accessibility-medium', 1.786],
    ['accessibility-extra-large', 2.643],
    ['accessibility-extra-extra-extra-large', 3.571],
  ])('%s sí lo es', (_nombre, escala) => {
    expect(esLetraGrande(escala)).toBe(true);
  });
});
