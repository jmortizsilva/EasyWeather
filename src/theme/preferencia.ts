import { NombreTema } from './colores';

// Logica pura de la preferencia de tema: se prueba con Jest sin dispositivo ni mocks (regla del
// proyecto: lo que "decide" va separado de la fontaneria que toca modulos nativos).

/** Lo que elige el usuario. "automatico" delega en el ajuste del iPhone. */
export type PreferenciaTema = 'automatico' | 'claro' | 'oscuro';

export const PREFERENCIA_POR_DEFECTO: PreferenciaTema = 'automatico';

const VALIDAS: PreferenciaTema[] = ['automatico', 'claro', 'oscuro'];

/** Etiquetas de los ajustes; tambien son lo que lee VoiceOver. */
export const ETIQUETA_PREFERENCIA: Record<PreferenciaTema, string> = {
  automatico: 'Automático',
  claro: 'Claro',
  oscuro: 'Oscuro',
};

/** Lo que devuelve useColorScheme de RN: ademas de light/dark puede venir vacio o 'unspecified'. */
export type EsquemaSistema = 'light' | 'dark' | 'unspecified' | null | undefined;

/**
 * Tema efectivo. Con "automatico" manda el esquema del sistema; si el sistema no lo ha reportado
 * (null en el primer render, o 'unspecified'), se cae en oscuro, el aspecto historico de la app.
 */
export function resolverTema(
  preferencia: PreferenciaTema,
  esquemaSistema: EsquemaSistema,
): NombreTema {
  if (preferencia === 'claro' || preferencia === 'oscuro') {
    return preferencia;
  }
  return esquemaSistema === 'light' ? 'claro' : 'oscuro';
}

/** Valida lo leido de disco: cualquier cosa rara vuelve al valor por defecto. */
export function leerPreferencia(guardado: string | null | undefined): PreferenciaTema {
  return VALIDAS.includes(guardado as PreferenciaTema)
    ? (guardado as PreferenciaTema)
    : PREFERENCIA_POR_DEFECTO;
}
