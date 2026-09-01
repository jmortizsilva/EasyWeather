import * as Location from 'expo-location';
import { nombreUbicacion } from './geocode';

// Ubicacion para los avisos.
//
// AQUI YA NO HAY SEGUIMIENTO EN SEGUNDO PLANO, y es a proposito. Lo hubo, con geovallas de
// expo-location, y se ha quitado porque no se podia sostener: expo-location exige declarar el modo
// de fondo "location" en el Info.plist para vigilar zonas, y Apple rechaza esa declaracion (2.5.4)
// porque la app no hace seguimiento continuo. Sin el modo, el consumidor de geovallas de la
// libreria lanza al arrancar la app y iOS la mata: comprobado el 2026-09-01 en un informe de fallo
// real, `Abort trap: 6` dentro de `EXGeofencingTaskConsumer startMonitoringRegionsForTask:`,
// durante `didFinishLaunchingWithOptions`. La app no abria.
//
// Mientras tanto, la ubicacion se actualiza al abrir la app y al volver a primer plano, que es lo
// que hace `NotificationsContext`. El seguimiento vuelve con un modulo nativo propio (servicio de
// cambios significativos de iOS, que NO necesita ese modo), y por eso se conservan tanto el permiso
// "Siempre" como los nombres de estas funciones: el modulo entra por aqui.

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
 * Arranca el seguimiento de ubicacion mientras haya algun aviso activo.
 *
 * Hoy no arranca nada: solo se asegura de que no quede viva la geovalla de las versiones
 * anteriores. Aqui es donde entrara el modulo nativo.
 */
export async function iniciarSeguimientoUbicacion(): Promise<void> {
  await limpiarGeovallaAntigua();
}

/** Detiene el seguimiento (cuando el usuario desactiva todos los avisos). */
export async function detenerSeguimientoUbicacion(): Promise<void> {
  await limpiarGeovallaAntigua();
}
