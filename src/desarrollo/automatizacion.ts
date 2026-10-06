/**
 * Acciones que una pantalla ofrece para probarse sola desde el puente, sin
 * que nadie tenga que tocar el móvil.
 *
 * No simula el toque físico ni pasa por el lector de pantalla: llama a la misma
 * función que ya llama el botón (`() => setDialogo('crear')`, por ejemplo).
 * Sirve para encontrar fallos estructurales —un diálogo que se queda a medio
 * cerrar, una pantalla que no vuelve al estado esperado— reproduciendo la
 * secuencia exacta y sacando una captura entre paso y paso. No prueba qué lee
 * VoiceOver ni si el foco llega de verdad: eso lo sigue haciendo una persona,
 * al final, una vez, y no en cada iteración.
 *
 * Cada pantalla registra sus acciones al montarse y las quita al desmontarse,
 * así solo existen las de la pantalla que está delante ahora mismo.
 */

import { useEffect } from 'react';

type Accion = () => void | Promise<void>;

const acciones = new Map<string, Accion>();

export function registrarAccion(nombre: string, accion: Accion): void {
  if (!__DEV__) return;
  acciones.set(nombre, accion);
}

export function quitarAccion(nombre: string): void {
  acciones.delete(nombre);
}

export function listarAcciones(): string[] {
  return [...acciones.keys()];
}

export async function ejecutarAccion(nombre: string): Promise<{ ejecutada: string }> {
  const accion = acciones.get(nombre);
  if (!accion) {
    throw new Error(
      `No existe la acción "${nombre}". Hay: ${listarAcciones().join(', ') || 'ninguna'}`,
    );
  }
  await accion();
  return { ejecutada: nombre };
}

/**
 * Registra las acciones de una pantalla mientras está montada.
 *
 * Se pasan en un objeto para que una pantalla las declare de una vez:
 *
 *     useAccionesDeDesarrollo({
 *       abrirCrear: () => setDialogo('crear'),
 *       cancelar: () => setDialogo(null),
 *     });
 *
 * Las funciones se vuelven a registrar en cada pintado, que es lo que hace que
 * no se queden con un estado viejo. En una build publicada no hace nada.
 */
export function useAccionesDeDesarrollo(nuevas: Record<string, Accion>): void {
  useEffect(() => {
    if (!__DEV__) return;
    for (const [nombre, accion] of Object.entries(nuevas)) registrarAccion(nombre, accion);
    return () => {
      for (const nombre of Object.keys(nuevas)) quitarAccion(nombre);
    };
  });
}
