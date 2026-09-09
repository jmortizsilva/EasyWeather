import { CurrentObservation } from '../types';
import { cabeceras, endpoint } from '../utils/servidorPropio';

// Observacion MEDIDA por una estacion real, pedida al servidor propio. No se habla con AEMET desde
// aqui a proposito: su clave no puede ir en el bundle (repo publico), y ademas AEMET limita por
// minuto, asi que una sola descarga en el servidor sirve a todos los dispositivos.
//
// Open-Meteo sigue yendo directo desde el movil: la prevision NO depende de que el servidor este
// levantado. Solo la observacion, que es un extra.

const TIEMPO_ESPERA_MS = 10_000;

// Mas corto que el de Open-Meteo (20 s) porque esto es un adorno, no el contenido principal: si el
// servidor tarda, se prefiere enseñar la prevision sola antes que dejar la pantalla esperando.

interface RespuestaObservacion {
  observacion: CurrentObservation | null;
}

/**
 * Observacion representativa de un punto, o `undefined` si no la hay. `undefined` NO es un error:
 * es lo normal fuera de España, o cuando la estacion mas cercana esta lejos o a otra altitud.
 *
 * Nunca lanza. Un fallo de red, un servidor caido o una clave mal puesta acaban todos en
 * `undefined`, porque para la pantalla significan lo mismo: hoy no hay medicion que enseñar.
 *
 * @param elevacion Altitud del terreno (la da Open-Meteo). Sin ella, el servidor elige estacion
 *                  solo por distancia, sin poder descartar una que este a otra cota.
 */
export async function getObservacion(
  lat: number,
  lon: number,
  elevacion?: number,
): Promise<CurrentObservation | undefined> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_ESPERA_MS);
  try {
    const parametros = new URLSearchParams({ lat: String(lat), lon: String(lon) });
    if (elevacion !== undefined && Number.isFinite(elevacion)) {
      parametros.set('alt', String(Math.round(elevacion)));
    }
    const respuesta = await fetch(`${endpoint('observacion')}?${parametros}`, {
      headers: cabeceras(),
      signal: control.signal,
    });
    if (!respuesta.ok) {
      return undefined;
    }
    const datos = (await respuesta.json()) as RespuestaObservacion;
    // El servidor manda null cuando ninguna estacion representa el punto.
    return datos?.observacion ?? undefined;
  } catch {
    return undefined;
  } finally {
    clearTimeout(temporizador);
  }
}
