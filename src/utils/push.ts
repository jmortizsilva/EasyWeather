import * as Notifications from 'expo-notifications';

// Servidor de avisos (Cloudflare Worker). Vigila la temperatura y envía el push del aviso.
const SERVER_URL = 'https://easyweather-alerts.easyweather-app.workers.dev';
// Identificador del proyecto en EAS (necesario para obtener el token de push de Expo).
const PROJECT_ID = 'bdc45482-63ad-4db7-b1cf-12e9a55b0479';

export interface ThresholdRegistration {
  lat: number;
  lon: number;
  placeName: string;
  maxThreshold: number;
  minThreshold: number;
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

// Suscribe este teléfono al aviso de temperatura del servidor (o actualiza su ubicación/umbrales).
export async function registerThresholdDevice(params: ThresholdRegistration): Promise<boolean> {
  const token = await getPushToken();
  if (!token) {
    return false;
  }
  try {
    const response = await fetch(`${SERVER_URL}/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, ...params }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Pide al servidor una notificación de prueba inmediata, para comprobar toda la cadena de push.
export async function sendTestNotification(): Promise<boolean> {
  const token = await getPushToken();
  if (!token) {
    return false;
  }
  try {
    const response = await fetch(`${SERVER_URL}/test`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Avisa al servidor de la ubicacion actual (y la zona horaria del telefono) para que los avisos
// y el resumen se calculen desde donde esta el usuario. La llama la tarea de geovallas al moverse.
export async function reportarUbicacion(lat: number, lon: number): Promise<boolean> {
  const token = await getPushToken();
  if (!token) {
    return false;
  }
  const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    const response = await fetch(`${SERVER_URL}/ubicacion`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, lat, lon, zonaHoraria }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Da de baja este teléfono del aviso de temperatura.
export async function unregisterThresholdDevice(): Promise<void> {
  const token = await getPushToken();
  if (!token) {
    return;
  }
  try {
    await fetch(`${SERVER_URL}/unregister`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch {
    // Si el servidor no responde, no se rompe la app; se reintenta la próxima vez.
  }
}
