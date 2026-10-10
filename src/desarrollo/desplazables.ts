/**
 * Las zonas desplazables de la app, apuntadas por nombre para poder capturarlas
 * enteras desde el puente.
 *
 * La captura normal solo ve lo que cabe en la pantalla, y con la letra grande lo
 * que se rompe suele estar más abajo: el final de una lista, la fila que queda
 * bajo la barra de pestañas. Desde el ordenador no se puede deslizar el dedo, y
 * `scrollTo` de React Native no frena al final del contenido (en iOS pasa el
 * desplazamiento tal cual a UIScrollView), así que «bajar una pantalla» desde
 * aquí acabaría enseñando un hueco en blanco. Por eso se captura la zona entera
 * de una vez (`snapshotContentContainer` de react-native-view-shot).
 *
 *     const refDesplazable = useDesplazableDePuente('lugares');
 *     <ScrollView ref={refDesplazable} …>
 *
 * En una build publicada el hook devuelve `undefined` y no apunta nada.
 */

import { useCallback, useRef } from 'react';
import type { ScrollView } from 'react-native';

const desplazables = new Map<string, ScrollView>();

export function leerDesplazable(nombre: string): ScrollView | undefined {
  return desplazables.get(nombre);
}

export function listarDesplazables(): string[] {
  return [...desplazables.keys()];
}

/**
 * `activo` sirve para cuando hay varias zonas iguales montadas a la vez, como
 * las páginas de «Hoy»: solo se apunta la que está delante.
 *
 * Al soltar, solo se borra el nombre si sigue apuntando a ESTA vista. Si no,
 * al pasar de página la vieja podría soltar después de que la nueva se haya
 * apuntado, y borrarla.
 */
export function useDesplazableDePuente(
  nombre: string,
  activo = true,
): ((vista: ScrollView | null) => void) | undefined {
  const propia = useRef<ScrollView | null>(null);
  const ref = useCallback(
    (vista: ScrollView | null) => {
      if (vista && activo) {
        propia.current = vista;
        desplazables.set(nombre, vista);
        return;
      }
      if (propia.current && desplazables.get(nombre) === propia.current) {
        desplazables.delete(nombre);
      }
      propia.current = null;
    },
    [nombre, activo],
  );
  return __DEV__ ? ref : undefined;
}
