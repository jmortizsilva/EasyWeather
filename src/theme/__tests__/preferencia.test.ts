import { CLARO, OSCURO, PALETAS } from '../colores';
import { leerPreferencia, PREFERENCIA_POR_DEFECTO, resolverTema } from '../preferencia';

describe('resolverTema', () => {
  it('una preferencia explicita manda sobre el sistema', () => {
    expect(resolverTema('claro', 'dark')).toBe('claro');
    expect(resolverTema('oscuro', 'light')).toBe('oscuro');
  });

  it('en automatico sigue al sistema', () => {
    expect(resolverTema('automatico', 'light')).toBe('claro');
    expect(resolverTema('automatico', 'dark')).toBe('oscuro');
  });

  it('en automatico cae en oscuro si el sistema aun no ha respondido', () => {
    // useColorScheme puede devolver null en el primer render y tambien 'unspecified' (lo tipa asi
    // ColorSchemeName de RN); el aspecto historico de la app es el oscuro.
    expect(resolverTema('automatico', null)).toBe('oscuro');
    expect(resolverTema('automatico', undefined)).toBe('oscuro');
    expect(resolverTema('automatico', 'unspecified')).toBe('oscuro');
  });
});

describe('leerPreferencia', () => {
  it('acepta los tres valores validos', () => {
    expect(leerPreferencia('automatico')).toBe('automatico');
    expect(leerPreferencia('claro')).toBe('claro');
    expect(leerPreferencia('oscuro')).toBe('oscuro');
  });

  it('vuelve al valor por defecto con nada guardado o un valor corrupto', () => {
    expect(leerPreferencia(null)).toBe(PREFERENCIA_POR_DEFECTO);
    expect(leerPreferencia(undefined)).toBe(PREFERENCIA_POR_DEFECTO);
    expect(leerPreferencia('azul')).toBe(PREFERENCIA_POR_DEFECTO);
    expect(leerPreferencia('')).toBe(PREFERENCIA_POR_DEFECTO);
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
