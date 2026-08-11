import { NombreTema } from './colores';

// Logica pura del tema: se prueba con Jest sin dispositivo ni mocks (regla del proyecto: lo que
// "decide" va separado de la fontaneria que toca modulos nativos).
//
// La app NO tiene ajuste propio de aspecto a proposito: manda siempre lo que el usuario tenga
// configurado en el iPhone. Un ajuste duplicado dentro de la app solo da dos sitios donde mirar
// cuando algo no se ve como se espera.

/** Lo que devuelve useColorScheme de RN: ademas de light/dark puede venir vacio o 'unspecified'. */
export type EsquemaSistema = 'light' | 'dark' | 'unspecified' | null | undefined;

/**
 * Tema efectivo a partir del esquema del sistema. Si iOS no lo ha reportado todavia (null en el
 * primer render, o 'unspecified'), se cae en oscuro, que es el aspecto historico de la app.
 */
export function temaDelSistema(esquemaSistema: EsquemaSistema): NombreTema {
  return esquemaSistema === 'light' ? 'claro' : 'oscuro';
}
