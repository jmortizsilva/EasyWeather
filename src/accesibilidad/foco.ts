/**
 * Mover el foco de VoiceOver a un elemento concreto.
 *
 * Al cerrar una hoja o al desaparecer una fila, iOS manda el foco al principio de la pantalla y se
 * pierde el sitio. Esto lo devuelve donde toca, y de paso lo anota para el puente: sin la etiqueta,
 * el rastro diría «foco» y nada más.
 *
 * **Se usa `sendAccessibilityEvent` y NO `setAccessibilityFocus`.** La segunda está obsoleta y por
 * dentro delega en la vía pre-Fabric; con la arquitectura nueva —la de este proyecto— no encuentra
 * la vista y no hace nada, sin dar ningún error. Parece que funciona y el foco nunca se mueve.
 *
 * Hay DOS funciones porque hay dos situaciones distintas, y confundirlas rompe una de las dos:
 *
 *   - `devolverFoco` espera un momento, para cuando la pantalla todavía se está recomponiendo
 *     (cerrar un modal). Es una promesa a propósito: mover el foco corta cualquier anuncio en
 *     curso, así que primero se espera a que el foco esté puesto y solo después se anuncia.
 *   - `moverFoco` no espera nada, para cuando ya se sabe que la vista existe porque lo dice su
 *     propio `onLayout`. Un temporizador aquí se calibra sin querer con el móvil en el que se
 *     prueba, y en uno más lento salta antes de que la vista exista, sin dar error.
 */

import { AccessibilityInfo, type HostInstance } from 'react-native';

import { anotarSuceso } from '../desarrollo/rastro';

/** Margen para que el foco no se pida antes de que la pantalla se haya recompuesto. */
const MS_ESPERA_CIERRE = 300;

/** Para después de cerrar algo: espera a que la pantalla se recomponga. */
export function devolverFoco(
  elemento: HostInstance | null | undefined,
  etiqueta = '?',
): Promise<void> {
  anotarSuceso('foco', etiqueta);
  return new Promise((resolver) => {
    setTimeout(() => {
      if (elemento) {
        AccessibilityInfo.sendAccessibilityEvent(elemento, 'focus');
      }
      resolver();
    }, MS_ESPERA_CIERRE);
  });
}

/** Para cuando la vista ya existe (desde su `onLayout`): sin esperas que calibrar. */
export function moverFoco(elemento: HostInstance | null | undefined, etiqueta = '?'): void {
  anotarSuceso('foco', etiqueta);
  if (elemento) {
    AccessibilityInfo.sendAccessibilityEvent(elemento, 'focus');
  }
}
