import AsyncStorage from '@react-native-async-storage/async-storage';
import { AvisosLugar, FenomenoAviso } from '../types';
import { cabeceras, endpoint } from '../utils/servidorPropio';

// Avisos OFICIALES de AEMET, pedidos al servidor propio. Como la observacion, no se habla con
// AEMET desde aqui: su clave no puede ir en el bundle (repo publico) y una sola descarga en el
// servidor (3,5 MB con los avisos de toda España) sirve a todos los dispositivos.
//
// El texto viene ya redactado del servidor. Ver la nota de `AvisoOficial` en types.ts.

// Igual que el de la observacion: esto acompaña a la prevision, no la sustituye. Si el servidor
// tarda, se prefiere enseñar el tiempo sin la seccion de avisos antes que dejar la pantalla
// esperando.
const TIEMPO_ESPERA_MS = 10_000;

/**
 * Avisos oficiales para un punto, o `undefined` si **no se ha podido preguntar** (sin red, servidor
 * caido, clave mal puesta). Nunca lanza.
 *
 * La diferencia entre `undefined` y `{avisos: []}` no es una sutileza, es lo importante de esta
 * funcion. La lista vacia significa que AEMET no tiene ningun aviso para ese sitio; `undefined`
 * significa que no lo sabemos. Si se confundieran, un servidor caido borraria de la pantalla un
 * aviso naranja, que es tanto como decirle a alguien que ya puede salir.
 */
export async function getAvisos(lat: number, lon: number): Promise<AvisosLugar | undefined> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_ESPERA_MS);
  try {
    const parametros = new URLSearchParams({ lat: String(lat), lon: String(lon) });
    const respuesta = await fetch(`${endpoint('avisos')}?${parametros}`, {
      headers: cabeceras(),
      signal: control.signal,
    });
    if (!respuesta.ok) {
      return undefined;
    }
    const datos = (await respuesta.json()) as Partial<AvisosLugar> | null;
    // Un 200 sin lista es una respuesta rara, no una caida: se toma como "no hay avisos".
    return {
      avisos: Array.isArray(datos?.avisos) ? datos.avisos : [],
      resumen: datos?.resumen ?? null,
    };
  } catch {
    return undefined;
  } finally {
    clearTimeout(temporizador);
  }
}

// --- Catalogo de fenomenos ---------------------------------------------------------------------

const CACHE_FENOMENOS = 'tiempo.fenomenos.v1';

/**
 * Los fenomenos que se pueden silenciar, tal y como los sirve el servidor (lista base mas lo que
 * AEMET haya usado de verdad). No se escribe aqui a mano por dos motivos: un lote real trajo
 * "Rissagas", que no habria estado en ninguna lista inventada, y un codigo inventado seria un
 * interruptor que no apaga nada.
 *
 * Se guarda en el telefono porque cambia una vez cada muchos meses y la pantalla de ajustes tiene
 * que funcionar sin red. Devuelve `undefined` solo cuando no hay ni respuesta ni copia guardada:
 * entonces la pantalla lo dice con palabras, que es mejor que una lista vacia sin explicacion.
 */
export async function getFenomenos(): Promise<FenomenoAviso[] | undefined> {
  const guardados = await leerCatalogoGuardado();
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), TIEMPO_ESPERA_MS);
  try {
    const respuesta = await fetch(endpoint('fenomenos'), {
      headers: cabeceras(),
      signal: control.signal,
    });
    if (!respuesta.ok) {
      return guardados;
    }
    const datos = (await respuesta.json()) as { fenomenos?: unknown } | null;
    const fenomenos = Array.isArray(datos?.fenomenos)
      ? datos.fenomenos.filter(
          (f): f is FenomenoAviso =>
            !!f && typeof f.codigo === 'string' && typeof f.nombre === 'string',
        )
      : [];
    // Una lista vacia del servidor no se guarda encima de una buena: seria empeorar la pantalla
    // por una respuesta rara.
    if (fenomenos.length === 0) {
      return guardados;
    }
    await AsyncStorage.setItem(CACHE_FENOMENOS, JSON.stringify(fenomenos));
    return fenomenos;
  } catch {
    return guardados;
  } finally {
    clearTimeout(temporizador);
  }
}

async function leerCatalogoGuardado(): Promise<FenomenoAviso[] | undefined> {
  try {
    const guardado = await AsyncStorage.getItem(CACHE_FENOMENOS);
    if (!guardado) {
      return undefined;
    }
    const lista = JSON.parse(guardado);
    return Array.isArray(lista) && lista.length > 0 ? lista : undefined;
  } catch {
    return undefined;
  }
}
