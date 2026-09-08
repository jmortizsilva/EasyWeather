// Que se le dice al usuario sobre el seguimiento de su ubicacion. Logica pura, sin React Native:
// se prueba con Jest.
//
// Existe porque llevabamos dos dias deduciendo por que un aviso hablaba del sitio equivocado, y la
// app tenia el dato y no lo enseñaba. Las tres causas posibles se leen igual desde fuera —el aviso
// llega con la ciudad de ayer— y son muy distintas: falta el permiso "Siempre", la build no lleva
// el modulo, o el seguimiento simplemente no arranco. Decirlo evita la investigacion entera.

export interface EstadoSeguimiento {
  /** Si esta build lleva compilado el modulo nativo de seguimiento. */
  hayModulo: boolean;
  /** Si iOS tiene concedido el permiso de ubicacion "Siempre". */
  permisoSiempre: boolean;
  /** Si el seguimiento esta encendido de verdad, segun el propio modulo. */
  activo: boolean;
  /** Si hay algun aviso activo. Sin ninguno no hay nada que ubicar. */
  algunAvisoActivo: boolean;
}

/**
 * El texto que va bajo los avisos, o `undefined` si no toca decir nada.
 *
 * Se calla cuando no hay ningun aviso activo: ahi la ubicacion no se usa para nada, y una linea
 * hablando de ella solo seria una fila mas que recorrer con VoiceOver.
 */
export function textoSeguimiento(estado: EstadoSeguimiento): string | undefined {
  if (!estado.algunAvisoActivo) {
    return undefined;
  }
  if (!estado.permisoSiempre) {
    return 'Sin el permiso de ubicación «Siempre», los avisos usarán la última ubicación conocida. Puedes concederlo en Ajustes de iOS, en EasyWeather.';
  }
  // Estos dos se decian igual, y costo una tarde: con el mismo texto no habia forma de saber si a
  // un telefono le faltaba la version nueva o si el seguimiento no habia llegado a arrancar. Son
  // problemas distintos y se arreglan de forma distinta, asi que se dicen distinto.
  if (!estado.hayModulo) {
    return 'Esta versión de la app no puede seguir tu ubicación: los avisos usarán la del último momento en que la abras. Hace falta instalar la versión más reciente.';
  }
  if (!estado.activo) {
    return 'El seguimiento de tu ubicación no ha arrancado. Cierra la app del todo y vuelve a abrirla; si sigue igual, desactiva y vuelve a activar un aviso.';
  }
  return 'Siguiendo tu ubicación: los avisos hablarán del sitio donde estés, aunque no abras la app.';
}
