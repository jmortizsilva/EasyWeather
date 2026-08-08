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

async function recentrarGeovalla(lat: number, lon: number): Promise<void> {
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
}

// La tarea se define a nivel de modulo para que quede registrada al cargar la app (requisito de
// TaskManager). Solo actua al SALIR de la zona.
TaskManager.defineTask<{ eventType: Location.LocationGeofencingEventType }>(
  TAREA_GEOVALLA,
  async ({ data, error }) => {
    if (error || !data || data.eventType !== Location.LocationGeofencingEventType.Exit) {
      return;
    }
    try {
      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = posicion.coords;
      const nombre = await nombreDeUbicacion(latitude, longitude);
      await reportarUbicacion(latitude, longitude, nombre);
      await recentrarGeovalla(latitude, longitude);
    } catch {
      // Sin ubicacion o sin red: se reintenta en el proximo cambio de zona.
    }
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
export async function iniciarSeguimientoUbicacion(): Promise<void> {
  const fondo = await Location.getBackgroundPermissionsAsync();
  if (fondo.status !== 'granted') {
    return;
  }
  const posicion = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const { latitude, longitude } = posicion.coords;
  const nombre = await nombreDeUbicacion(latitude, longitude);
  await reportarUbicacion(latitude, longitude, nombre);
  await recentrarGeovalla(latitude, longitude);
}

// Detiene el seguimiento (cuando el usuario desactiva todos los avisos).
export async function detenerSeguimientoUbicacion(): Promise<void> {
  if (await Location.hasStartedGeofencingAsync(TAREA_GEOVALLA)) {
    await Location.stopGeofencingAsync(TAREA_GEOVALLA);
  }
}
