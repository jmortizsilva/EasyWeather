/**
 * Rastro de lo que se anuncia y de a dónde se mueve el foco del lector.
 *
 * Un fallo de accesibilidad no se diagnostica preguntando «¿qué oíste?»: se
 * diagnostica leyendo qué se anunció y a dónde saltó el foco justo después de
 * la acción que falló. Este módulo guarda esos sucesos para pedirlos por el
 * puente (servicio `rastro`) sin que nadie tenga que transcribir nada.
 *
 * Para que se llene hay que llamar a `anotarSuceso` desde las funciones que
 * anuncian (`anunciar`, `anunciarImportante`) y desde la que mueve el foco
 * (`devolverFoco`). Ver README.md, «Instalarlo en una app», paso 5.
 *
 * Solo vive en memoria y solo en desarrollo: fuera de `__DEV__` no anota nada.
 */

export type Suceso = {
  /** Milisegundos desde el primer suceso anotado, para leer la secuencia. */
  ms: number;
  tipo: 'anuncio' | 'anuncioImportante' | 'foco';
  detalle: string;
};

/** Bastan unos pocos: esto es para ver «qué pasó justo ahora», no un historial. */
const TOPE = 50;

let sucesos: Suceso[] = [];
let arranque = 0;

export function anotarSuceso(tipo: Suceso['tipo'], detalle: string): void {
  if (!__DEV__) return;

  const ahora = Date.now();
  if (arranque === 0) arranque = ahora;

  sucesos.push({ ms: ahora - arranque, tipo, detalle });
  if (sucesos.length > TOPE) sucesos = sucesos.slice(-TOPE);
}

export function leerRastro(): Suceso[] {
  return [...sucesos];
}

export function limpiarRastro(): void {
  sucesos = [];
  arranque = 0;
}
