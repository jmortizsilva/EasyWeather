import { Place } from '../types';

// En que orden se presentan los resultados del buscador. Logica pura, sin React Native: se prueba
// con Jest.
//
// Open-Meteo los devuelve por relevancia global, que para quien busca desde su casa es el orden
// equivocado: buscando "Merida" desde Espana salian antes la de Mexico y la de Venezuela que la de
// Extremadura, que quedaba tercera.

/** Lo que hace falta saber de donde esta el usuario. Todo opcional: puede no haber ubicacion. */
export interface Referencia {
  lat: number;
  lon: number;
  countryCode?: string;
  country?: string;
}

const RADIO_TIERRA_KM = 6371;

const aRadianes = (grados: number) => (grados * Math.PI) / 180;

/**
 * Distancia en kilometros por la formula de haversine. Se usa esta y no una resta de coordenadas
 * porque la resta se rompe al cruzar el meridiano 180 (dos puntos vecinos pasan a estar a 360
 * grados) y porque un grado de longitud no mide lo mismo en Madrid que en Oslo.
 */
export function distanciaKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const dLat = aRadianes(b.lat - a.lat);
  const dLon = aRadianes(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(a.lat)) * Math.cos(aRadianes(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * RADIO_TIERRA_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

const normalizar = (valor: string | undefined) => valor?.trim().toLowerCase() || undefined;

/**
 * Si un resultado es del mismo pais que el usuario. Manda el codigo ISO; el nombre solo se mira
 * cuando falta el codigo, porque los dos proveedores lo traducen por su cuenta y no tiene por que
 * coincidir letra a letra.
 */
function mismoPais(place: Place, desde: Referencia): boolean {
  const codigoUsuario = normalizar(desde.countryCode);
  const codigoLugar = normalizar(place.countryCode);
  if (codigoUsuario && codigoLugar) {
    return codigoUsuario === codigoLugar;
  }
  const paisUsuario = normalizar(desde.country);
  const paisLugar = normalizar(place.country);
  return Boolean(paisUsuario && paisLugar && paisUsuario === paisLugar);
}

/**
 * Primero los del pais donde estas, del mas cercano al mas lejano; despues el resto, en el orden
 * que trae Open-Meteo.
 *
 * Se agrupa por pais en vez de ordenar todo por distancia porque la distancia a secas deja que una
 * aldea de al lado adelante a una ciudad conocida del extranjero. Dentro del pais propio ese riesgo
 * es asumible: si hay dos sitios con el mismo nombre en tu pais, el de al lado es casi siempre el
 * que buscas.
 *
 * Sin ubicacion (permiso denegado, GPS aun sin resolver) se devuelve el orden original: es mejor
 * eso que inventarse una referencia.
 */
export function ordenarPorCercania(resultados: Place[], desde: Referencia | undefined): Place[] {
  if (!desde) {
    return resultados;
  }

  const propios: Place[] = [];
  const resto: Place[] = [];
  for (const place of resultados) {
    (mismoPais(place, desde) ? propios : resto).push(place);
  }

  // sort ordena en el sitio, y la lista de entrada es de quien la llame: se ordena una copia.
  const cercaPrimero = [...propios].sort((a, b) => distanciaKm(desde, a) - distanciaKm(desde, b));
  return [...cercaPrimero, ...resto];
}
