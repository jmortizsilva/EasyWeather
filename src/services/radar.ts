import { RadarLugar } from '../types';
import { cabeceras, endpoint } from '../utils/servidorPropio';

// El radar de AEMET alrededor de un lugar, pedido al servidor propio, que es quien guarda los
// barridos: AEMET solo da la última imagen y su clave no puede ir en la app. Los textos llegan ya
// escritos. Acompaña a la previsión, como la medición: si tarda, se enseña el tiempo sin la línea.

const TIEMPO_ESPERA_MS = 10_000;

/**
 * La línea del radar de un punto. Tres respuestas, que significan cosas distintas:
 * - un `RadarLugar`: hay que enseñarlo;
 * - `null`: ningún radar cubre el sitio (fuera de España), y no se enseña nada;
 * - `undefined`: no se ha podido preguntar. Nunca lanza.
 */
export async function getRadar(lat: number, lon: number): Promise<RadarLugar | null | undefined> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_ESPERA_MS);
  try {
    const parametros = new URLSearchParams({ lat: String(lat), lon: String(lon) });
    const respuesta = await fetch(`${endpoint('radar')}?${parametros}`, {
      headers: cabeceras(),
      signal: control.signal,
    });
    if (!respuesta.ok) {
      return undefined;
    }
    const datos = (await respuesta.json()) as { radar?: Partial<RadarLugar> | null } | null;
    const radar = datos?.radar;
    if (radar === null) {
      return null;
    }
    if (typeof radar?.visible !== 'string' || typeof radar.hablado !== 'string') {
      return undefined; // Una respuesta sin textos no se puede enseñar: como si no hubiera llegado.
    }
    return { visible: radar.visible, hablado: radar.hablado, sinImagen: radar.sinImagen === true };
  } catch {
    return undefined;
  } finally {
    clearTimeout(temporizador);
  }
}
