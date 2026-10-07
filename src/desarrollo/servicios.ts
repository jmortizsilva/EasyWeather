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
import {
  AccessibilityInfo,
  Appearance,
  DevSettings,
  Dimensions,
  NativeModules,
  PixelRatio,
} from 'react-native';

import { ejecutarAccion, listarAcciones } from './automatizacion';
import { navegarPorPuente } from './navegacion';
import { registrarServicio } from './puente';
import { leerMedidas } from './medidas';
import { leerRastro, limpiarRastro } from './rastro';

export function registrarServiciosDeDesarrollo(): void {
  /*
   * Una foto de la pantalla que tenga el móvil ahora mismo.
   *
   * La librería se carga DENTRO de la función, y con `require`, no con `import`.
   * Los tres detalles importan y cada uno viene de un susto distinto:
   *
   *   - Dentro y no arriba, como manda `comun/`: resuelve su módulo nativo con
   *     `TurboModuleRegistry.getEnforcing`, que **lanza** si no está. Con el
   *     import arriba, una build sin el módulo —la 19, la beta— no abriría.
   *     Cargarlo aquí convierte eso en un `{ok:false}` del puente.
   *   - `require` y no `import()`: medido el 2026-10-06, el `import()` dinámico
   *     devuelve el módulo sin resolver en este Metro. `require` sí funciona y
   *     también es perezoso.
   *   - Y por eso el paquete tiene que estar instalado igualmente: sin él no hay
   *     tipos y `tsc` no pasa.
   */
  registrarServicio('pantalla', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const vs = require('react-native-view-shot') as typeof import('react-native-view-shot');
    return {
      formato: 'png',
      base64: await vs.captureScreen({ format: 'png', result: 'base64' }),
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
  // Alturas reales de los trozos instrumentados con anotarMedida. Ver medidas.ts.
  registrarServicio('medidas', () => leerMedidas());

  registrarServicio('entorno', async () => {
    const ventana = Dimensions.get('window');

    /*
     * Los interruptores de accesibilidad, PREGUNTADOS y no recordados.
     *
     * El 2026-10-06 se dio por buena una tanda entera creyendo que «aumentar contraste» estaba
     * apagado, y llevaba encendido todo el rato: la referencia «normal» no era la de por defecto.
     * Una condición que no se puede comprobar no es una condición, es una suposición.
     *
     * «Aumentar contraste» se llama aquí isDarkerSystemColorsEnabled: comprobado en
     * RCTAccessibilityManager.mm, que lee UIAccessibilityDarkerSystemColorsEnabled().
     */
    const [lector, negrita, contraste, transparencia, movimiento, grises, invertido] =
      await Promise.all([
        AccessibilityInfo.isScreenReaderEnabled(),
        AccessibilityInfo.isBoldTextEnabled(),
        AccessibilityInfo.isDarkerSystemColorsEnabled(),
        AccessibilityInfo.isReduceTransparencyEnabled(),
        AccessibilityInfo.isReduceMotionEnabled(),
        AccessibilityInfo.isGrayscaleEnabled(),
        AccessibilityInfo.isInvertColorsEnabled(),
      ]);
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
      ajustes: {
        lectorDePantalla: lector,
        textoEnNegrita: negrita,
        aumentarContraste: contraste,
        reducirTransparencia: transparencia,
        reducirMovimiento: movimiento,
        escalaDeGrises: grises,
        coloresInvertidos: invertido,
      },
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
