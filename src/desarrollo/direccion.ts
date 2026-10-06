/**
 * De dónde saca la app la dirección del ordenador de desarrollo.
 *
 * No se configura a mano: se deduce de `hostUri`, que es la máquina que está
 * sirviendo el código en ese momento. Así el puente sigue funcionando al
 * cambiar de red o de IP, que es lo que pasa en cuanto se reinicia el router.
 *
 * `hostUri` **solo existe durante el desarrollo con @expo/cli** (comprobado en
 * `expo-constants`, `Constants.types.ts`: "Only present during development").
 * En una build publicada no hay valor, y sin valor no hay puente: es la segunda
 * red de seguridad además de `__DEV__`.
 */

/** El puerto del puente. Metro se queda con el 8081; este va aparte. */
export const PUERTO_PUENTE = 8790;

/**
 * Devuelve `null` cuando no hay a quién conectarse, que es lo normal fuera del
 * desarrollo. Quien llama no tiene que distinguir por qué: sin dirección, nada.
 */
export function direccionDelPuente(hostUri: string | undefined | null): string | null {
  if (!hostUri) return null;

  // `hostUri` llega como "192.168.1.224:8081", a veces con esquema delante y
  // a veces con una ruta detrás. Se descarta todo menos la máquina.
  const sinEsquema = hostUri.replace(/^\w+:\/\//, '');
  const anfitrion = sinEsquema.split('/')[0].split('?')[0];

  // IPv6 entre corchetes: "[::1]:8081". El separador de puerto es el último
  // dos puntos, no el primero, así que partir por ':' a secas se la come.
  const cierre = anfitrion.lastIndexOf(']');
  const maquina = cierre !== -1 ? anfitrion.slice(0, cierre + 1) : anfitrion.split(':')[0];

  if (!maquina) return null;
  return `ws://${maquina}:${PUERTO_PUENTE}/app`;
}
