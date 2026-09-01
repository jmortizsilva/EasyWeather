import * as Location from 'expo-location';
import {
  empezarSeguimiento,
  hayModuloDeUbicacion,
  pararSeguimiento,
} from '../../modules/ubicacion-significativa';
import { nombreUbicacion } from './geocode';
import { destinoDeUbicacion, getPushToken } from './push';

// Ubicacion para los avisos.
//
// EL SEGUIMIENTO EN SEGUNDO PLANO LO HACE UN MODULO NATIVO PROPIO, con el servicio de CAMBIOS
// SIGNIFICATIVOS de iOS. Aqui esta el porque, que costo caro:
//
// - Apple rechazo la build 17 (2.5.4) por declarar `UIBackgroundModes = ["location"]` sin hacer
//   seguimiento continuo. Y tenian razon: la app solo queria enterarse de que has cambiado de sitio.
// - Las geovallas de expo-location no valen sin esa declaracion: su consumidor enciende
//   `allowsBackgroundLocationUpdates`, que sin ella lanza y **mata la app al arrancar**. Comprobado
//   el 2026-09-01 en un informe de fallo real (`Abort trap: 6`).
// - El servicio de cambios significativos no necesita el modo (lo confirma un ingeniero de Apple en
//   el hilo 818370 de sus foros), no enciende el GPS, y **no hay que re-armarlo**: una geovalla se
//   vuelve a dibujar cada vez, y si ese paso falla una sola vez el seguimiento muere en silencio.
//
// Si una build no llevara el modulo compilado, la app sigue funcionando: la ubicacion se actualiza
// al abrir la app y al volver a primer plano, como para quien no concede el permiso "Siempre".

// Nombre de la tarea de geovallas que registraron las versiones anteriores. Solo se conserva para
// poder DESREGISTRARLA: mientras siga registrada en un telefono, cualquier build futura sin el modo
// de fondo se cerraria sola al arrancar, porque iOS restaura las tareas antes de ejecutar nada
// nuestro. Ver `limpiarGeovallaAntigua`.
const TAREA_GEOVALLA = 'tiempo-geovalla-ubicacion';

// Nombre del sitio (barrio y ciudad) por geocodificacion inversa nativa, el mismo criterio que la
// pestana Hoy (helper nombreUbicacion). Si no hay nada util, devuelve undefined: mejor que el
// servidor deje el generico "tu ubicacion" a titular con un "Mi ubicacion" que no dice nada. Nunca
// lanza: geocodificar es secundario y no debe tumbar el reporte de ubicacion.
async function nombreDeUbicacion(lat: number, lon: number): Promise<string | undefined> {
  try {
    const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    return nombreUbicacion(geo[0]);
  } catch {
    return undefined;
  }
}

/** Un sitio ya resuelto: coordenadas y, si iOS supo darlo, su nombre. */
export interface UbicacionReportada {
  lat: number;
  lon: number;
  nombre?: string;
}

/**
 * Lee el GPS AHORA, con su nombre. Le basta el permiso "mientras usas la app", asi que funciona
 * con la app abierta aunque no se haya concedido "Siempre".
 *
 * Nunca lanza: sin permiso, sin senal o con el GPS caido devuelve `undefined`, que para quien la
 * llama significa "no se donde estas", no un error que haya que enseñar.
 */
export async function leerUbicacionActual(): Promise<UbicacionReportada | undefined> {
  try {
    const enUso = await Location.getForegroundPermissionsAsync();
    if (enUso.status !== 'granted') {
      return undefined;
    }
    const posicion = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = posicion.coords;
    return { lat: latitude, lon: longitude, nombre: await nombreDeUbicacion(latitude, longitude) };
  } catch {
    return undefined;
  }
}

/**
 * Desregistra la geovalla que dejaron las versiones anteriores.
 *
 * Esto NO es limpieza cosmetica, es lo que evita un cierre al arrancar. La tarea queda guardada en
 * el telefono y sobrevive a actualizar la app, y iOS la restaura durante el arranque, antes de que
 * corra una sola linea nuestra. Con el modo de fondo ya retirado, esa restauracion es la que mata
 * la app. Por eso hay que borrarla desde una version que TODAVIA arranque —una actualizacion por
 * aire sobre las builds que aun declaran el modo—, y no desde la build que lo quita.
 *
 * Nunca lanza: si no habia nada que borrar, mejor.
 */
async function limpiarGeovallaAntigua(): Promise<void> {
  try {
    if (await Location.hasStartedGeofencingAsync(TAREA_GEOVALLA)) {
      await Location.stopGeofencingAsync(TAREA_GEOVALLA);
    }
  } catch {
    // Sin expo-task-manager, sin tarea o con la libreria en otra version: no hay nada que hacer.
  }
}

// Pide el permiso de ubicacion "Siempre" (fondo). iOS exige conceder antes "mientras usas la app".
// Se mantiene aunque ahora mismo no haya seguimiento en segundo plano: es el permiso que necesita
// el modulo nativo que viene, y pedirlo cuando toca (al activar un aviso) es mejor que pedirlo de
// golpe el dia que aparezca.
export async function pedirPermisoUbicacionSiempre(): Promise<boolean> {
  const enUso = await Location.getForegroundPermissionsAsync();
  if (enUso.status !== 'granted') {
    const pedido = await Location.requestForegroundPermissionsAsync();
    if (pedido.status !== 'granted') {
      return false;
    }
  }
  const fondo = await Location.requestBackgroundPermissionsAsync();
  return fondo.status === 'granted';
}

/**
 * Arranca el seguimiento mientras haya algun aviso activo.
 *
 * Se le pasa el destino cada vez, no solo la primera: el token de push se renueva al reinstalar o
 * restaurar el telefono, y el modulo tiene que reportar con el vigente cuando despierte sin
 * JavaScript. Sin permiso "Siempre" no se enciende nada, porque iOS no despertaria a la app.
 */
export async function iniciarSeguimientoUbicacion(): Promise<void> {
  await limpiarGeovallaAntigua();
  if (!hayModuloDeUbicacion) {
    return;
  }
  const fondo = await Location.getBackgroundPermissionsAsync();
  if (fondo.status !== 'granted') {
    await pararSeguimiento();
    return;
  }
  const token = await getPushToken();
  if (!token) {
    return; // Sin token no hay a quien avisar; se reintenta en la proxima sincronizacion.
  }
  const { url, appKey } = destinoDeUbicacion();
  await empezarSeguimiento(url, appKey, token);
}

/** Detiene el seguimiento (cuando el usuario desactiva todos los avisos). */
export async function detenerSeguimientoUbicacion(): Promise<void> {
  await limpiarGeovallaAntigua();
  await pararSeguimiento();
}
