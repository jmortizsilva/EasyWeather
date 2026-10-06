// Alturas reales de trozos de pantalla, para diagnosticar por el puente en vez de a ojo.
//
// Una captura dice QUE algo no cabe, pero no CUANTO ocupa cada cosa. Esto lo dice: se cuelga un
// onLayout de lo que se quiera medir y el servicio `medidas` lo devuelve. Solo en desarrollo.

const medidas = new Map<string, { alto: number; ancho: number; y: number }>();

export function anotarMedida(nombre: string, layout: { height: number; width: number; y: number }) {
  if (!__DEV__) return;
  medidas.set(nombre, { alto: layout.height, ancho: layout.width, y: layout.y });
}

export function leerMedidas(): Record<string, { alto: number; ancho: number; y: number }> {
  return Object.fromEntries(medidas);
}
