import * as Notifications from 'expo-notifications';
import { cabeceras, endpoint } from './servidorPropio';

// Servidor de avisos propio (Node/Fastify, multi-app). Vigila la temperatura y envia los push.
// Los datos de conexion (URL, id de app y clave) viven en servidorPropio.ts, porque tambien los
// usan las observaciones medidas.

// Identificador del proyecto en EAS (necesario para obtener el token de push de Expo).
const PROJECT_ID = 'bdc45482-63ad-4db7-b1cf-12e9a55b0479';

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
  /**
   * Avisos OFICIALES de AEMET. `null` = apagados. Va aparte del `umbral` a proposito: el umbral es
   * una regla del usuario y esto es informacion oficial, y el servidor los trata por separado para
   * que nunca se mezclen en la misma notificacion.
   */
  avisosOficiales: { nivelMinimo: string; fenomenosSilenciados: string[] } | null;
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

// Identificador de push de este iPhone. Requiere permiso concedido y un dispositivo real.
export async function getPushToken(): Promise<string | undefined> {
  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID });
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
