import { CurrentObservation } from '../types';
import { EstacionCandidata, MotivoSinDato } from '../utils/estaciones';
import { cabeceras, endpoint } from '../utils/servidorPropio';

// Observacion MEDIDA por una estacion real, pedida al servidor propio. No se habla con AEMET desde
// aqui a proposito: su clave no puede ir en el bundle (repo publico), y ademas AEMET limita por
// minuto, asi que una sola descarga en el servidor sirve a todos los dispositivos.
//
// Open-Meteo sigue yendo directo desde el movil: la prevision NO depende de que el servidor este
// levantado. Solo la observacion, que es un extra.

/** Lo que contesta /estaciones: entre quienes elegir, y cual saldria sin elegir nada. */
export interface ListaEstaciones {
  /** Identificador de la que cogeria la app sola, o `null` si ninguna representa el punto. */
  automatica: string | null;
  estaciones: EstacionCandidata[];
}

const TIEMPO_ESPERA_MS = 10_000;

// Mas corto que el de Open-Meteo (20 s) porque esto es un adorno, no el contenido principal: si el
// servidor tarda, se prefiere enseñar la prevision sola antes que dejar la pantalla esperando.

interface RespuestaObservacion {
  observacion: CurrentObservation | null;
  /** Solo cuando se pidio una estacion concreta y no puede contestar. */
  motivo?: MotivoSinDato;
  estacion?: { id: string; name?: string; observedAt?: string };
}

/**
 * Lo que se sabe de la observacion de un lugar. Los dos campos vacios significan "hoy no hay nada
 * que enseñar", que es lo normal fuera de España.
 */
export interface ResultadoObservacion {
  observacion?: CurrentObservation;
  /**
   * Por que la estacion ELEGIDA a mano no contesta. Cuando viene esto, la pantalla lo dice en vez
   * de enseñar una medicion: no se cae en la automatica, porque poner el nombre de una estacion
   * encima del dato de otra seria mentir sobre quien midio.
   */
  sinDato?: { motivo: MotivoSinDato; nombre?: string; observedAt?: string };
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
  estacion?: string,
): Promise<ResultadoObservacion> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_ESPERA_MS);
  try {
    const parametros = new URLSearchParams({ lat: String(lat), lon: String(lon) });
    if (elevacion !== undefined && Number.isFinite(elevacion)) {
      parametros.set('alt', String(Math.round(elevacion)));
    }
    // Con estacion, el servidor sirve ESA y solo esa, saltandose sus filtros de distancia y de
    // desnivel (el usuario los ha anulado a proposito) pero no el de frescura.
    if (estacion) {
      parametros.set('estacion', estacion);
    }
    const respuesta = await fetch(`${endpoint('observacion')}?${parametros}`, {
      headers: cabeceras(),
      signal: control.signal,
    });
    if (!respuesta.ok) {
      return {};
    }
    const datos = (await respuesta.json()) as RespuestaObservacion;
    if (datos?.observacion) {
      return { observacion: datos.observacion };
    }
    // El servidor manda null con motivo cuando la estacion elegida no puede contestar, y null a
    // secas cuando ninguna representa el punto (lo normal fuera de España).
    if (datos?.motivo) {
      return {
        sinDato: {
          motivo: datos.motivo,
          nombre: datos.estacion?.name,
          observedAt: datos.estacion?.observedAt,
        },
      };
    }
    return {};
  } catch {
    return {};
  } finally {
    clearTimeout(temporizador);
  }
}

/**
 * Las estaciones entre las que se puede elegir para un punto, o `undefined` si no se ha podido
 * preguntar. No cuesta ninguna peticion extra a AEMET: el servidor la saca del fichero que ya tiene
 * cacheado.
 */
export async function getEstaciones(
  lat: number,
  lon: number,
  elevacion?: number,
): Promise<ListaEstaciones | undefined> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_ESPERA_MS);
  try {
    const parametros = new URLSearchParams({ lat: String(lat), lon: String(lon) });
    if (elevacion !== undefined && Number.isFinite(elevacion)) {
      parametros.set('alt', String(Math.round(elevacion)));
    }
    const respuesta = await fetch(`${endpoint('estaciones')}?${parametros}`, {
      headers: cabeceras(),
      signal: control.signal,
    });
    if (!respuesta.ok) {
      return undefined;
    }
    return (await respuesta.json()) as ListaEstaciones;
  } catch {
    return undefined;
  } finally {
    clearTimeout(temporizador);
  }
}
