import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { nombreUbicacion } from './geocode';
import { reportarUbicacion } from './push';

// Seguimiento de ubicacion con la app cerrada mediante GEOVALLAS (bajo consumo, sobrevive a
// cerrar la app): se pone una valla alrededor de la zona actual y iOS despierta la app cuando el
// usuario sale de ella. Al salir, se avisa al servidor de la nueva ubicacion y se re-centra la
// valla. Asi el servidor tiene siempre la ubicacion al dia para el aviso de temperatura y el
// resumen, sin rastrear en continuo.

const TAREA_GEOVALLA = 'tiempo-geovalla-ubicacion';
// Radio de la zona: al alejarse mas de esto se considera que cambiaste de sitio. 3 km basta para
// el tiempo (nivel ciudad) y evita despertar a la app por moverse dentro del mismo pueblo.
const RADIO_METROS = 3000;

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

// Nunca lanza. expo-location se niega a vigilar zonas si el Info.plist no declara el modo de fondo
// "location", y ese modo lo quitamos a proposito: Apple rechazo la build 17 porque declararlo sin
// hacer seguimiento continuo incumple la directriz 2.5.4. Quien levanta esa negativa es
// plugins/geovallas-sin-modo-de-fondo.js, pero si algun dia dejara de aplicarse, sin este catch
// quedaria una promesa rechazada en medio de sincronizar los avisos. Quedarse sin geovalla degrada
// la ubicacion a la ultima reportada al abrir la app; tumbar la sincronizacion apagaria los avisos.
async function recentrarGeovalla(lat: number, lon: number): Promise<void> {
  try {
    // startGeofencingAsync REEMPLAZA las regiones vigiladas, asi que sirve para re-centrar.
    await Location.startGeofencingAsync(TAREA_GEOVALLA, [
      {
        latitude: lat,
        longitude: lon,
        radius: RADIO_METROS,
        notifyOnEnter: false,
        notifyOnExit: true,
      },
    ]);
  } catch {
    // Sin geovalla: los avisos usaran la ultima ubicacion que la app reporto al abrirse.
  }
}

// Antiguedad maxima de la lectura de respaldo. Si acabas de salir de una zona de 3 km, un punto de
// hace cinco minutos es ya el sitio nuevo. Uno mas viejo podria ser el sitio del que vienes, y
// re-centrar la zona ahi seria peor que no hacer nada: estarias fuera de ella al instante, iOS
// volveria a despertar a la app, y otra vez, en bucle.
const RESPALDO_MAX_MS = 5 * 60 * 1000;

/**
 * Donde estas, para la tarea de fondo. Primero el GPS; si no contesta —al despertar en frio pasa—,
 * la ultima posicion que iOS tenga guardada, que es instantanea y suele existir precisamente porque
 * acaba de calcularla para disparar la geovalla.
 *
 * `undefined` = no se sabe. Nunca lanza.
 */
async function posicionDeLaTarea(): Promise<{ lat: number; lon: number } | undefined> {
  try {
    const posicion = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { lat: posicion.coords.latitude, lon: posicion.coords.longitude };
  } catch {
    // Sigue por el respaldo.
  }
  try {
    const ultima = await Location.getLastKnownPositionAsync({ maxAge: RESPALDO_MAX_MS });
    return ultima ? { lat: ultima.coords.latitude, lon: ultima.coords.longitude } : undefined;
  } catch {
    return undefined;
  }
}

// La tarea se define a nivel de modulo para que quede registrada al cargar la app (requisito de
// TaskManager). Solo actua al SALIR de la zona.
//
// EL ORDEN IMPORTA, y es lo que fallaba: se re-centra la geovalla ANTES de avisar al servidor.
// iOS da una ventana corta al despertar a la app, y geocodificar y enviar dependen de la red. Si la
// ventana se agotaba antes de re-centrar, la zona se quedaba donde estaba; y como ya estabas fuera,
// iOS no volvia a lanzar ninguna salida NUNCA. El seguimiento moria en silencio hasta que abrieras
// la app. Perder un reporte solo cuesta esa actualizacion; perder el re-centrado los cuesta todos.
// Comprobado el 2026-09-01: el servidor seguia situando el telefono en el pueblo donde se durmio.
TaskManager.defineTask<{ eventType: Location.LocationGeofencingEventType }>(
  TAREA_GEOVALLA,
  async ({ data, error }) => {
    if (error || !data || data.eventType !== Location.LocationGeofencingEventType.Exit) {
      return;
    }
    const donde = await posicionDeLaTarea();
    if (!donde) {
      // Sin saber donde estas no hay zona que poner. Se recupera al abrir la app: al registrarse de
      // nuevo la tarea, iOS comprueba el estado de la zona y vuelve a lanzar la salida.
      return;
    }
    await recentrarGeovalla(donde.lat, donde.lon);
    await reportarUbicacion(donde.lat, donde.lon, await nombreDeUbicacion(donde.lat, donde.lon));
  },
);

// Pide el permiso de ubicacion "Siempre" (fondo). iOS exige conceder antes "mientras usas la app".
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

// Arranca el seguimiento: manda la ubicacion actual y pone la primera valla. No pide permiso (eso
// se hace aparte, con explicacion); si no esta concedido "Siempre", no hace nada.
//
// Se le puede pasar una lectura ya hecha para no volver a encender el GPS: quien sincroniza los
// avisos ya necesita saber donde estas para mandarlo al servidor, y leerlo dos veces seguidas gasta
// bateria para nada.
export async function iniciarSeguimientoUbicacion(ubicacion?: UbicacionReportada): Promise<void> {
  const fondo = await Location.getBackgroundPermissionsAsync();
  if (fondo.status !== 'granted') {
    return;
  }
  const donde = ubicacion ?? (await leerUbicacionActual());
  if (!donde) {
    return;
  }
  await reportarUbicacion(donde.lat, donde.lon, donde.nombre);
  await recentrarGeovalla(donde.lat, donde.lon);
}

// Detiene el seguimiento (cuando el usuario desactiva todos los avisos).
export async function detenerSeguimientoUbicacion(): Promise<void> {
  if (await Location.hasStartedGeofencingAsync(TAREA_GEOVALLA)) {
    await Location.stopGeofencingAsync(TAREA_GEOVALLA);
  }
}
