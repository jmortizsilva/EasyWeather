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

// Los colores de los avisos van anidados (paleta.aviso.naranja.fondo), asi que las dos
// comprobaciones tienen que bajar un nivel. Se aplanan a "aviso.naranja.fondo" en vez de mirar solo
// la superficie: si no, un token nuevo dentro de `aviso` se colaria sin que nadie se enterase.
function aplanar(objeto: object, prefijo = ''): [string, unknown][] {
  return Object.entries(objeto).flatMap(([clave, valor]) => {
    const ruta = prefijo ? `${prefijo}.${clave}` : clave;
    return valor !== null && typeof valor === 'object'
      ? aplanar(valor as object, ruta)
      : [[ruta, valor] as [string, unknown]];
  });
}

describe('paletas', () => {
  it('las dos paletas definen exactamente los mismos tokens', () => {
    // Evita el fallo silencioso de anadir un token a una paleta y olvidarlo en la otra: en esa
    // pantalla saldria "undefined" como color, que iOS pinta en negro.
    expect(
      aplanar(CLARO)
        .map(([k]) => k)
        .sort(),
    ).toEqual(
      aplanar(OSCURO)
        .map(([k]) => k)
        .sort(),
    );
  });

  it('ningun token queda vacio', () => {
    for (const [nombre, paleta] of Object.entries(PALETAS)) {
      for (const [token, valor] of aplanar(paleta)) {
        expect(`${nombre}.${token}=${String(valor)}`).toMatch(/=#[0-9a-f]{6}$/);
      }
    }
  });

  // Los tres niveles tienen que existir en las dos paletas: si faltara uno, la pantalla de un aviso
  // rojo se quedaria sin color de fondo y con el texto encima del fondo de la tarjeta.
  it('cada paleta trae los tres niveles de aviso completos', () => {
    for (const paleta of Object.values(PALETAS)) {
      for (const nivel of ['amarillo', 'naranja', 'rojo'] as const) {
        expect(Object.keys(paleta.aviso[nivel]).sort()).toEqual(['borde', 'fondo', 'texto']);
      }
    }
  });
});
