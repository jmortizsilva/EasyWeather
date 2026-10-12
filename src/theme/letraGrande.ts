import { useWindowDimensions } from 'react-native';

// Cuándo la letra es tan grande que lo que va en fila tiene que pasar a ir en columna.
//
// Medido el 2026-10-10 (docs/REVISION-ACCESIBILIDAD-2026-10-10.md): con todos los tamaños
// normales de iOS, hasta el mayor (×1,353), las filas de la app caben. Desde el primer tamaño de
// accesibilidad (×1,786) empiezan a romperse: el valor de una fila acaba en una columna de una
// letra, y lo que no cabe se sale por la derecha. Es también donde Apple cambia de disposición en
// sus propias apps (en Ajustes, el valor pasa debajo del nombre).
//
// El umbral va entre los dos y no justo en ×1,786 para no depender de cómo redondee iOS la escala.

export const ESCALA_LETRA_GRANDE = 1.5;

export function esLetraGrande(escalaDeLetra: number): boolean {
  return escalaDeLetra >= ESCALA_LETRA_GRANDE;
}

export function useLetraGrande(): boolean {
  return esLetraGrande(useWindowDimensions().fontScale);
}

// Cuánto pueden crecer los títulos grandes de pantalla (los de 34 puntos). Con ×2, al máximo, un
// título parte palabras en dos («Carabanch / el», «Busca / r»); con ×1,75 caben enteras, medido el
// 2026-10-10. Y ×1,75 deja el título en unos 60 puntos, a la par del texto normal al máximo (unos
// 61): más bajo, el título quedaría más pequeño que lo que encabeza. Solo los títulos: el resto
// del texto escala sin tope, también las filas que parten palabra («Desactivado / s»).
//
// También lo lleva el título de la ficha de un lugar sin guardar (28 puntos, unos 49 al máximo):
// sin tope partía en «Ma / dri / d» (beta 22, 2026-10-12).
//
// Es lo que hace Apple con sus títulos grandes. El precio está asumido: a quien pide el tamaño
// máximo, el título le queda por debajo de lo que pidió.
export const TOPE_TITULO = 1.75;
