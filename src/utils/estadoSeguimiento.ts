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
  if (!estado.hayModulo || !estado.activo) {
    return 'Los avisos usarán la ubicación de la última vez que abras la app.';
  }
  return 'Siguiendo tu ubicación: los avisos hablarán del sitio donde estés, aunque no abras la app.';
}
