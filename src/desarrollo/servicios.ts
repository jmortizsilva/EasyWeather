/**
 * Lo que el puente sabe hacer en esta app.
 *
 * Vive aparte de `puente.ts` a propósito: la fontanería no tiene por qué
 * conocer las funcionalidades, y añadir un servicio nuevo no debería obligar a
 * tocar la conexión.
 *
 * Los de aquí son los comunes a cualquier app. Los propios de cada proyecto
 * (volcar el estado de la sesión, leer lo guardado en disco, vaciar un
 * historial…) se añaden debajo, siguiendo las reglas de README.md, «Añadir un
 * servicio».
 */

import Constants from 'expo-constants';
import { Appearance, DevSettings, Dimensions, NativeModules, PixelRatio } from 'react-native';
import { captureScreen } from 'react-native-view-shot';

import { ejecutarAccion, listarAcciones } from './automatizacion';
import { navegarPorPuente } from './navegacion';
import { registrarServicio } from './puente';
import { leerRastro, limpiarRastro } from './rastro';

export function registrarServiciosDeDesarrollo(): void {
  /*
   * Una foto de la pantalla que tenga el móvil ahora mismo.
   *
   * `comun/` carga la librería DENTRO de la función, para que una build anterior
   * a haberla instalado no reviente al arrancar solo por tener el import. Aquí
   * no se puede: medido el 2026-10-06, el `import()` dinámico devuelve el módulo
   * sin resolver en este Metro («undefined is not a function»), y lo mismo le
   * pasa a `react-native`. Como el módulo ya está en el binario desde la build
   * de desarrollo `7f254415`, el import normal es seguro.
   */
  registrarServicio('pantalla', async () => {
    return {
      formato: 'png',
      base64: await captureScreen({ format: 'png', result: 'base64' }),
    };
  });

  /*
   * Cambiar de pantalla desde el ordenador: `{"ruta":"hoy"}`.
   *
   * Es lo que permite recorrer la app entera capturando sin que nadie toque el
   * móvil (ver tanda.mjs). Aquí NO es Expo Router como en `comun/`: esta app
   * navega por pestañas nativas y el estado vive en `PestanasContext`, así que
   * la ruta es la clave de la pestaña (`hoy`, `lugares`, `avisos`) y la
   * navegación se inyecta desde la raíz. El porqué, en `navegacion.ts`.
   *
   * Lo de dentro de una pestaña —la búsqueda, las secciones de avisos— no se
   * navega: se abre con estado local, y por tanto con el servicio `accion`.
   */
  registrarServicio('navegar', (parametros) =>
    navegarPorPuente((parametros as { ruta?: string } | undefined)?.ruta),
  );

  /*
   * No hay `volver` que valga: esta app no tiene pila de navegación. Lo que en
   * otra app sería volver, aquí es cerrar lo que la pantalla tenga abierto, y
   * eso es una acción suya. Se contesta diciéndolo, en vez de callarse y dejar
   * pensando que la orden se ejecutó.
   */
  registrarServicio('volver', () => ({
    vuelto: false,
    aviso:
      'Esta app no tiene pila: son tres pestañas. Para cerrar lo que haya abierto, ' +
      `usa el servicio "accion" con una de estas: ${listarAcciones().join(', ') || 'ninguna'}`,
  }));

  // Qué se anunció y a dónde se movió el foco, para explicar un fallo de
  // accesibilidad sin que nadie tenga que describir lo que oyó.
  registrarServicio('rastro', () => leerRastro());
  registrarServicio('limpiarRastro', () => {
    limpiarRastro();
    return { limpio: true };
  });

  // Reproducir una secuencia (abrir un diálogo, cancelarlo, abrir otro…) sin
  // tocar el móvil: llama a la misma función que llamaría el botón. Ver
  // automatizacion.ts para qué prueba esto y qué no.
  registrarServicio('acciones', () => listarAcciones());
  registrarServicio('accion', (parametros) => {
    const nombre = (parametros as { nombre?: string } | undefined)?.nombre;
    if (!nombre) throw new Error('Falta "nombre" en los parámetros');
    return ejecutarAccion(nombre);
  });

  // ---- Los servicios propios de la app van a partir de aquí.

  /*
   * Qué está pasando en el aparato ahora mismo. Nació para diagnosticar: una captura decía que las
   * pantallas se rompían con la letra grande y hacía falta saber por cuánto multiplica iOS de
   * verdad, en vez de deducirlo mirando píxeles.
   */
  registrarServicio('entorno', () => {
    const ventana = Dimensions.get('window');
    return {
      escalaDeLetra: PixelRatio.getFontScale(),
      densidad: PixelRatio.get(),
      ventana: { ancho: ventana.width, alto: ventana.height },
      tema: Appearance.getColorScheme(),
      // Qué binario es este. Sirve para no confundir la app de la Store con la de pruebas, y para
      // saber si un módulo nativo está DENTRO de la build o solo en el package.json.
      app: Constants.expoConfig?.name,
      identificador: Constants.expoConfig?.ios?.bundleIdentifier,
      hostUri: Constants.expoConfig?.hostUri,
      tieneViewShot: Boolean(NativeModules.RNViewShot),
      nativosParecidos: Object.keys(NativeModules).filter((k) => /shot|view/i.test(k)),
    };
  });

  /*
   * Recarga el bundle, como la «r» de Metro.
   *
   * Hace falta para distinguir un fallo de dibujo de uno de medida: si una pantalla se ve mal tras
   * cambiar un ajuste del sistema con la app abierta, pero bien tras recargar, lo que falla es que
   * no se vuelve a medir, no la disposición.
   */
  registrarServicio('recargar', () => {
    // Un respiro para que salga la respuesta antes de que el puente se caiga con la recarga.
    setTimeout(() => DevSettings.reload(), 300);
    return { recargando: true };
  });
}
