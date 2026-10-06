/**
 * El lado del móvil del puente de desarrollo.
 *
 * La app se conecta al ordenador —nunca al revés— para que no haga falta
 * abrirle un puerto al móvil ni saber su dirección, que cambia sola.
 *
 * **Nada de esto llega a una build publicada**: sin `__DEV__` la conexión ni se
 * intenta, y sin `hostUri` no hay a dónde ir. Ver `direccion.ts`.
 *
 * Aquí solo hay fontanería: quién se conecta, cuándo se reintenta y cómo se
 * empaqueta el mensaje. Lo que el puente *sabe hacer* se registra desde fuera
 * con `registrarServicio`, para que añadir uno nuevo no obligue a tocar esto.
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { direccionDelPuente } from './direccion';

/** Lo que puede pedir el ordenador. Devuelve lo que sea; viaja como JSON. */
export type Servicio = (parametros?: unknown) => Promise<unknown> | unknown;

const SERVICIOS = new Map<string, Servicio>();

export function registrarServicio(nombre: string, servicio: Servicio): void {
  SERVICIOS.set(nombre, servicio);
}

/** Reintento fijo y corto: el ordenador está en la mesa, no al otro lado del mundo. */
const MS_REINTENTO = 3000;

let conexion: WebSocket | null = null;
let reintento: ReturnType<typeof setTimeout> | null = null;
let parado = false;

function enviar(objeto: unknown): boolean {
  if (conexion?.readyState !== 1) return false;
  conexion.send(JSON.stringify(objeto));
  return true;
}

/**
 * Manda un informe al ordenador sin que nadie tenga que copiar y pegar.
 *
 * Devuelve si salió o no, para que quien llama pueda seguir ofreciendo el
 * portapapeles cuando el puente no esté levantado. Nunca lanza: un fallo del
 * puente no puede tumbar la pantalla que lo usa.
 */
export function enviarInforme(
  nombre: string,
  formato: 'texto' | 'json',
  contenido: unknown,
): boolean {
  if (!__DEV__) return false;
  return enviar({ tipo: 'informe', nombre, formato, contenido });
}

async function atender(mensaje: { id: number; servicio: string; parametros?: unknown }) {
  const servicio = SERVICIOS.get(mensaje.servicio);

  if (!servicio) {
    enviar({
      tipo: 'respuesta',
      id: mensaje.id,
      ok: false,
      error: `No existe el servicio "${mensaje.servicio}". Hay: ${[...SERVICIOS.keys()].join(', ')}`,
    });
    return;
  }

  try {
    const datos = await servicio(mensaje.parametros);
    enviar({ tipo: 'respuesta', id: mensaje.id, ok: true, datos });
  } catch (error) {
    enviar({
      tipo: 'respuesta',
      id: mensaje.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function conectar(direccion: string) {
  if (parado) return;

  const socket = new WebSocket(direccion);
  conexion = socket;

  const reintentar = () => {
    if (conexion === socket) conexion = null;
    if (parado || reintento) return;
    reintento = setTimeout(() => {
      reintento = null;
      conectar(direccion);
    }, MS_REINTENTO);
  };

  socket.onopen = () => {
    enviar({
      tipo: 'hola',
      app: Constants.expoConfig?.name ?? 'app',
      version: Constants.expoConfig?.version ?? 'desconocida',
      plataforma: Platform.OS,
    });
  };

  socket.onmessage = (evento) => {
    try {
      const mensaje = JSON.parse(String(evento.data));
      if (mensaje.tipo === 'peticion') void atender(mensaje);
    } catch {
      // Un mensaje ilegible del ordenador no es asunto de la app.
    }
  };

  // Sin `onerror` propio, un fallo de conexión sale por consola como error no
  // capturado cada tres segundos, y ensucia el registro de Metro hasta hacerlo
  // inservible. El puente apagado es lo normal, no una avería.
  socket.onerror = () => {};
  socket.onclose = reintentar;
}

/** Arranca el puente. Sin build de desarrollo no hace absolutamente nada. */
export function arrancarPuente(): void {
  if (!__DEV__) return;

  const direccion = direccionDelPuente(Constants.expoConfig?.hostUri);
  if (!direccion) return;

  parado = false;
  conectar(direccion);
}

export function pararPuente(): void {
  parado = true;
  if (reintento) clearTimeout(reintento);
  reintento = null;
  conexion?.close();
  conexion = null;
}
