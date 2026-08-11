import { CLARO, OSCURO, PALETAS } from '../colores';
import { temaDelSistema } from '../temaSistema';

describe('temaDelSistema', () => {
  it('sigue al sistema', () => {
    expect(temaDelSistema('light')).toBe('claro');
    expect(temaDelSistema('dark')).toBe('oscuro');
  });

  it('cae en oscuro si el sistema aun no ha respondido', () => {
    // useColorScheme puede devolver null en el primer render y tambien 'unspecified' (lo tipa asi
    // ColorSchemeName de RN); el aspecto historico de la app es el oscuro.
    expect(temaDelSistema(null)).toBe('oscuro');
    expect(temaDelSistema(undefined)).toBe('oscuro');
    expect(temaDelSistema('unspecified')).toBe('oscuro');
  });
});

describe('paletas', () => {
  it('las dos paletas definen exactamente los mismos tokens', () => {
    // Evita el fallo silencioso de anadir un token a una paleta y olvidarlo en la otra: en esa
    // pantalla saldria "undefined" como color, que iOS pinta en negro.
    expect(Object.keys(CLARO).sort()).toEqual(Object.keys(OSCURO).sort());
  });

  it('ningun token queda vacio', () => {
    for (const [nombre, paleta] of Object.entries(PALETAS)) {
      for (const [token, valor] of Object.entries(paleta)) {
        expect(`${nombre}.${token}=${valor}`).toMatch(/=#[0-9a-f]{6}$/);
      }
    }
  });
});
