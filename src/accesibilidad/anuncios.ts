/**
 * Anuncios de voz, en un solo sitio.
 *
 * Viene de `comun/codigo/accesibilidad/anuncios.ts`, con una diferencia: aquí cada anuncio deja
 * rastro para el puente de desarrollo. Sin eso, el servicio `rastro` devuelve siempre una lista
 * vacía y no hay forma de explicar un fallo de accesibilidad sin que alguien transcriba lo que oyó.
 *
 * Regla del proyecto: solo se anuncian cambios de estado importantes (guardado, error, permiso que
 * falta). Lo que se lee al enfocar no se anuncia, o la app se vuelve inutilizable con VoiceOver.
 *
 * El turno importa más de lo que parece. Un anuncio en cola lo corta cualquier cosa, incluido un
 * cambio de foco. Por eso hay dos funciones y no una.
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { anotarSuceso } from '../desarrollo/rastro';

/**
 * Informativo. Espera su turno y no pisa nada de lo que se esté leyendo.
 * Para avisos que se pueden perder sin consecuencias.
 */
export function anunciar(mensaje: string): void {
  anotarSuceso('anuncio', mensaje);
  AccessibilityInfo.announceForAccessibilityWithOptions(mensaje, { queue: true });
}

/**
 * Resultado de una acción o error. Se emite ya, saltando la cola, así que no lo pisa ni un cambio
 * de foco.
 *
 * Aun así conviene mover el foco ANTES de llamar aquí: si el foco se mueve mientras habla, el
 * orden de lo que se oye deja de tener sentido.
 */
export function anunciarImportante(mensaje: string): void {
  anotarSuceso('anuncioImportante', mensaje);
  AccessibilityInfo.announceForAccessibilityWithOptions(mensaje, { queue: false });
}

/** Si hay un lector de pantalla encendido ahora mismo. */
export function useLectorPantallaActivo(): boolean {
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    let vigente = true;
    void AccessibilityInfo.isScreenReaderEnabled().then((valor) => {
      if (vigente) {
        setActivo(valor);
      }
    });
    const suscripcion = AccessibilityInfo.addEventListener('screenReaderChanged', setActivo);
    return () => {
      vigente = false;
      suscripcion.remove();
    };
  }, []);

  return activo;
}
