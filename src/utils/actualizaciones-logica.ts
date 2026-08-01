// Logica pura de las actualizaciones, SIN imports nativos, para poder probarla con Jest
// sin dispositivo (CLAUDE.md 6). La fontaneria (expo-updates, AsyncStorage, Alert) vive en
// actualizaciones.ts, que reutiliza esto.

// Marcador para "corriendo el bundle incrustado" (Updates.updateId es null ahi).
export const INCRUSTADO = 'incrustado';

// Decide si hay que avisar de novedades comparando el id del update en marcha con el
// ultimo que vio el usuario. La primera vez solo se memoriza (no se avisa de la version
// que estrena el aviso). Se avisa cuando el id cambia a uno real (no el bundle incrustado).
export function decidirAvisoNovedades(
  idGuardado: string | null,
  idActual: string,
): { avisar: boolean; idParaGuardar: string } {
  if (idGuardado === null) {
    return { avisar: false, idParaGuardar: idActual };
  }
  if (idActual !== idGuardado && idActual !== INCRUSTADO) {
    return { avisar: true, idParaGuardar: idActual };
  }
  return { avisar: false, idParaGuardar: idGuardado };
}
