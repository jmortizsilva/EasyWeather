import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Servidor de avisos propio (Node/Fastify, multi-app). Vigila la temperatura y envia los push.
// El servidor sirve varias apps: cada ruta cuelga de /apps/<app>/ y exige la clave de la app en la
// cabecera X-App-Key. La clave llega por variable de entorno EXPO_PUBLIC_APP_KEY: se incrusta en el
// bundle al publicar (eas update/build) pero NO se sube al repositorio, que es publico.
const SERVER_URL = 'https://api.jmortiz.es';
const APP_ID = 'easyweather';
const APP_KEY = process.env.EXPO_PUBLIC_APP_KEY ?? '';
// Identificador del proyecto en EAS (necesario para obtener el token de push de Expo).
const PROJECT_ID = 'bdc45482-63ad-4db7-b1cf-12e9a55b0479';

function endpoint(ruta: string): string {
  return `${SERVER_URL}/apps/${APP_ID}/${ruta}`;
}

// Lo que necesita el modulo nativo de seguimiento para reportar por su cuenta, con la app cerrada
// y sin JavaScript. Se le pasa desde aqui para que no haya dos sitios con la URL y la clave.
export function destinoDeUbicacion(): { url: string; appKey: string } {
  return { url: endpoint('ubicacion'), appKey: APP_KEY };
}

function cabeceras(): Record<string, string> {
  return { 'content-type': 'application/json', 'x-app-key': APP_KEY };
}

// Un resumen tal y como lo entiende el servidor. `seguirUbicacion` = usar la ubicacion actual del
// dispositivo (para los resumenes de "mi ubicacion"); si es false, se usa la lat/lon fija enviada.
export interface ResumenServidor {
  id: string;
  hora: number;
  minuto: number;
  campos: string[];
  seguirUbicacion: boolean;
  lat: number;
  lon: number;
  nombre: string;
}

// Estado completo de avisos que el cliente manda al servidor. El servidor reemplaza lo que tenga
// guardado para este token: es idempotente (mandar el estado entero evita descuadres).
export interface SincronizacionAvisos {
  zonaHoraria: string;
  // `nombre` es opcional: cuando iOS no sabe geocodificar el punto se manda sin el, y el servidor
  // titula con el generico "tu ubicacion". Vale mas eso que arrastrar el nombre de otra ciudad.
  ubicacion: { lat: number; lon: number; nombre?: string } | null;
  umbral: { maxThreshold: number; minThreshold: number } | null;
  resumenes: ResumenServidor[];
}

// Sube al servidor el estado completo de avisos (umbral + resumenes) con la ubicacion y zona
// horaria actuales.
export async function sincronizarAvisos(datos: SincronizacionAvisos): Promise<boolean> {
  const token = await getPushToken();
  if (!token) {
    return false;
  }
  try {
    const response = await fetch(endpoint('sincronizar'), {
      method: 'POST',
      headers: cabeceras(),
      body: JSON.stringify({ token, ...datos }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

const CLAVE_TOKEN = 'tiempo.push.token.v1';
// Copia en memoria, para no ir al disco en cada llamada dentro de la misma ejecucion.
let tokenEnMemoria: string | undefined;

/**
 * Identificador de push de este iPhone. Requiere permiso concedido y un dispositivo real.
 *
 * Se guarda en disco porque pedirselo a Expo es una llamada de RED, y esto lo llama la tarea de
 * geovallas cuando iOS despierta a la app con una ventana de tiempo corta y, muchas veces, con mala
 * cobertura. Una llamada de red que no hace falta ahi puede costar el reporte entero.
 *
 * El token solo cambia al reinstalar o restaurar el telefono, y para eso esta `refrescarPushToken`,
 * que corre con la app abierta.
 */
export async function getPushToken(): Promise<string | undefined> {
  if (tokenEnMemoria) {
    return tokenEnMemoria;
  }
  const guardado = await AsyncStorage.getItem(CLAVE_TOKEN);
  if (guardado) {
    tokenEnMemoria = guardado;
    return guardado;
  }
  return pedirTokenAExpo();
}

/**
 * Vuelve a preguntarle el token a Expo y actualiza la copia guardada. Se llama con la app en primer
 * plano, donde una llamada de red no cuesta nada: es lo que detecta que el token ha cambiado tras
 * reinstalar o restaurar el telefono. Devuelve el token vigente, o el guardado si Expo no contesta.
 */
export async function refrescarPushToken(): Promise<string | undefined> {
  return (await pedirTokenAExpo()) ?? getPushToken();
}

async function pedirTokenAExpo(): Promise<string | undefined> {
  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID });
    tokenEnMemoria = data;
    await AsyncStorage.setItem(CLAVE_TOKEN, data);
    return data;
  } catch {
    return undefined;
  }
}

// Pide al servidor una notificación de prueba inmediata, para comprobar toda la cadena de push.
export async function sendTestNotification(): Promise<boolean> {
  const token = await getPushToken();
  if (!token) {
    return false;
  }
  try {
    const response = await fetch(endpoint('test'), {
      method: 'POST',
      headers: cabeceras(),
      body: JSON.stringify({ token }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Avisa al servidor de la ubicacion actual (y la zona horaria del telefono) para que los avisos
// y el resumen se calculen desde donde esta el usuario. La llama la tarea de geovallas al moverse.
// `nombre` es el sitio ya geocodificado en el movil; sirve para titular el resumen con la ciudad.
// Si no se resolvio se omite, y entonces el servidor BORRA el que tuviera, porque un nombre solo
// vale para las coordenadas en que se resolvio: arrastrarlo era lo que hacia que el aviso de
// temperatura nombrase la ciudad de la que el usuario ya se habia ido. Sin nombre, el aviso cae en
// el generico "en tu ubicacion".
export async function reportarUbicacion(
  lat: number,
  lon: number,
  nombre?: string,
): Promise<boolean> {
  const token = await getPushToken();
  if (!token) {
    return false;
  }
  const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    const response = await fetch(endpoint('ubicacion'), {
      method: 'POST',
      headers: cabeceras(),
      body: JSON.stringify({ token, lat, lon, nombre, zonaHoraria }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
