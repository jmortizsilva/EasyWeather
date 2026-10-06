/**
 * Como navega el puente en ESTA app, que no usa Expo Router.
 *
 * El servicio `navegar` que trae `comun/` llama a `router.navigate` con una ruta. Aqui no hay
 * router: hay tres pestanas nativas y su estado vive en `PestanasContext` (ver navegacion/
 * pestanas.ts para el porque de esa libreria y no otra). O sea que un servicio suelto no puede
 * navegar por su cuenta: necesita el `irA` del contexto, que es estado de React.
 *
 * La solucion es que la pantalla raiz deje `irA` registrado aqui mientras esta montada, y que el
 * servicio use lo registrado. Si no hay nada registrado, el servicio lo dice en vez de fallar en
 * silencio: querria decir que el puente arranco antes que la navegacion, y eso es un fallo de
 * instalacion que conviene ver a la primera.
 *
 * Lo que esto NO alcanza: todo lo que no es una pestana. La busqueda vive dentro de "Mis lugares"
 * y las tres secciones de avisos dentro de "Avisos", y se abren con estado local, no navegando.
 * A eso se llega con las acciones registradas (`automatizacion.ts`), que es lo que lleva
 * docs/pantallas.txt.
 */

import { useEffect } from 'react';

import { ClavePestana, PESTANAS } from '../navegacion/pestanas';

type IrA = (clave: ClavePestana) => void;

const CLAVES: readonly string[] = PESTANAS.map((p) => p.clave);

let irA: IrA | null = null;

/**
 * Deja la navegacion a mano del puente mientras la raiz esta montada.
 *
 * Sin lista de dependencias, igual que `useAccionesDeDesarrollo`: `irA` cambia de identidad en
 * cada cambio de pestana y lo que interesa es que lo registrado sea siempre el ultimo.
 */
export function useNavegacionDelPuente(nueva: IrA): void {
  useEffect(() => {
    if (!__DEV__) return;
    irA = nueva;
    return () => {
      irA = null;
    };
  });
}

/** Cambia de pestana. Acepta "hoy" y "/hoy", para que `tanda.mjs` valga sin tocarlo. */
export function navegarPorPuente(destino: string | undefined): { pestana: string } {
  if (!destino) {
    throw new Error(`Falta "ruta". Las pestanas son: ${CLAVES.join(', ')}`);
  }
  const clave = CLAVES.find((c) => c === destino.replace(/^\//, ''));
  if (!clave) {
    throw new Error(
      `No existe la pestana "${destino}". Hay: ${CLAVES.join(', ')}. ` +
        'Lo de dentro de una pestana (la busqueda, las secciones de avisos) se abre con el ' +
        'servicio "accion", no con este.',
    );
  }
  if (!irA) {
    throw new Error(
      'La navegacion no esta registrada: falta useNavegacionDelPuente en la raiz de la app.',
    );
  }
  irA(clave as ClavePestana);
  return { pestana: clave };
}
