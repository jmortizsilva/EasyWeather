/**
 * Levanta el puente de desarrollo mientras la app está viva.
 *
 * Se llama una vez desde la disposición raíz. En una build publicada las dos
 * funciones de dentro no hacen nada, así que no hace falta envolver la llamada
 * en un `if` que el linter de hooks tampoco aceptaría.
 */

import { useEffect } from 'react';

import { arrancarPuente, pararPuente } from './puente';
import { registrarServiciosDeDesarrollo } from './servicios';

export function usePuenteDeDesarrollo(): void {
  useEffect(() => {
    if (!__DEV__) return;

    registrarServiciosDeDesarrollo();
    arrancarPuente();
    return pararPuente;
  }, []);
}
