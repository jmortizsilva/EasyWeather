// Las pestañas de la app y el estado de navegacion que entiende TabsHost.
//
// Todo esto es logica pura y sin React, para poder probarla: la fontaneria (el componente nativo,
// el contexto) esta en PestanasContext.tsx.
//
// POR QUE NO USAMOS react-navigation AQUI. La barra de pestañas de `react-native-bottom-tabs`
// rompia VoiceOver en iOS 27: dejaba dichas como "seleccionadas" todas las pestañas ya visitadas.
// Comprobado el 2026-09-15 en el iPhone, quitando y devolviendo cosas por aire: el fallo aparece y
// desaparece con los ICONOS. Esa libreria reasigna `item.image` y `item.selectedImage` a los
// UITabBarItem en cada pasada de layout (y por duplicado, una sincrona y otra aplazada), lo que
// obliga a UIKit a reconstruir el boton de la pestaña por detras de los objetos `UITab` y del
// delegado `shouldSelectTab` que iOS 27 estreno. Ahi se queda pegado el rasgo de seleccionado.
//
// react-native-screens conduce la MISMA barra nativa de Apple, pero pasando la configuracion como
// props al codigo nativo en vez de reescribir los items desde fuera, y usa la API clasica del
// UITabBarController. Ademas ya venia instalado y compilado, asi que el cambio entra por aire.

/** Identifica cada pestaña. Es el `screenKey` que viaja a nativo, asi que no puede cambiar. */
export type ClavePestana = 'hoy' | 'lugares' | 'avisos';

export interface Pestana {
  clave: ClavePestana;
  /** Lo que se ve debajo del icono y lo que lee VoiceOver. */
  titulo: string;
  sfSymbol: string;
}

// Buscar no esta aqui a proposito: no es una pestaña, sino una hoja modal que abre "Mis lugares".
// Una pestaña menos que recorrer con el lector de pantalla.
export const PESTANAS: readonly Pestana[] = [
  { clave: 'hoy', titulo: 'Hoy', sfSymbol: 'sun.max.fill' },
  { clave: 'lugares', titulo: 'Mis lugares', sfSymbol: 'list.bullet' },
  { clave: 'avisos', titulo: 'Avisos', sfSymbol: 'bell.fill' },
];

/**
 * Estado de navegacion de las pestañas.
 *
 * `confirmado` es lo que react-native-screens llama *provenance*: un numero que nativo incrementa
 * cada vez que acepta un cambio de pestaña. Sirve para ordenar: si mientras viaja una peticion
 * nuestra el usuario toca otra pestaña, nativo puede saber cual de los dos estados es mas nuevo.
 * Hay que devolverle SIEMPRE el ultimo que nos confirmo, no uno inventado.
 */
export interface EstadoPestanas {
  clave: ClavePestana;
  confirmado: number;
}

export const ESTADO_INICIAL: EstadoPestanas = { clave: 'hoy', confirmado: 0 };

/** Lo que nativo nos cuenta cuando la pestaña seleccionada cambia (por un toque o por nosotros). */
export interface SeleccionNativa {
  selectedScreenKey: string;
  provenance: number;
}

function esClave(valor: string): valor is ClavePestana {
  return PESTANAS.some((p) => p.clave === valor);
}

/**
 * Aplica lo que nativo confirma.
 *
 * Se descarta lo que llegue ATRASADO (un `provenance` menor que el ultimo confirmado): los eventos
 * cruzan de un hilo a otro y pueden desordenarse, y aplicar uno viejo devolveria al usuario a la
 * pestaña de la que acaba de salir. Con una clave que no conocemos se anota el numero pero no se
 * mueve la pestaña: preferimos quedarnos donde estabamos a saltar a ningun sitio.
 */
export function alConfirmarNativo(actual: EstadoPestanas, evento: SeleccionNativa): EstadoPestanas {
  if (evento.provenance < actual.confirmado) {
    return actual;
  }
  if (!esClave(evento.selectedScreenKey)) {
    return { ...actual, confirmado: evento.provenance };
  }
  return { clave: evento.selectedScreenKey, confirmado: evento.provenance };
}

/**
 * Cambia de pestaña desde JavaScript (lo hace "Mis lugares" al elegir un lugar).
 *
 * `confirmado` NO se toca: sigue siendo el ultimo estado que nativo reconocio, y es sobre ese sobre
 * el que se pide el cambio. Inventar un numero mayor es justo lo que rompe el desempate.
 */
export function alPedirDesdeJs(actual: EstadoPestanas, clave: ClavePestana): EstadoPestanas {
  return actual.clave === clave ? actual : { ...actual, clave };
}
