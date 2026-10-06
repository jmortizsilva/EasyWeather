/**
 * Manda un informe al ordenador en cuanto está listo, si el puente está puesto.
 *
 * Existe para no tener que copiar y pegar: sin esto, cada informe se lee al
 * portapapeles, se pasa al ordenador a mano y se guarda con un nombre
 * inventado. Con una build de desarrollo y el puente levantado, llega solo.
 *
 * El portapapeles y el compartir se quedan donde estaban: son los que funcionan
 * en la app publicada, que es la que usa la gente.
 */

import { useEffect } from 'react';

import { enviarInforme } from './puente';

/**
 * Lo último mandado de cada informe, para no repetirlo.
 *
 * Vive fuera del hook a propósito: un `useRef` se pierde al desmontar, y esto
 * tiene que sobrevivir justamente a eso. Volver a entrar en la pantalla, o una
 * recarga en caliente mientras se edita el código con la app abierta, montan el
 * componente otra vez y disparaban el efecto con el mismo contenido. Se llenaba
 * la carpeta de copias del mismo informe.
 */
const ULTIMO_ENVIADO = new Map<string, string>();

/**
 * `alEnviar` es para avisar a quien tiene el móvil de que el informe ya salió,
 * normalmente con un anuncio de voz sacado del diccionario de la app. Con un
 * contenido vacío no se manda nada: así una pantalla puede pasar `''` hasta
 * que el informe esté completo.
 */
export function useInformePorPuente(
  nombre: string,
  formato: 'texto' | 'json',
  contenido: unknown,
  alEnviar?: () => void,
): void {
  useEffect(() => {
    if (!__DEV__ || !contenido) return;

    const huella = typeof contenido === 'string' ? contenido : JSON.stringify(contenido);
    if (ULTIMO_ENVIADO.get(nombre) === huella) return;

    if (enviarInforme(nombre, formato, contenido)) {
      ULTIMO_ENVIADO.set(nombre, huella);
      alEnviar?.();
    }
  }, [nombre, formato, contenido, alEnviar]);
}
