import { Place } from '../types';
import { distanciaMetros, MISMO_SITIO_METROS } from './distancia';

// Guardar en "Mis lugares" el sitio donde estas. Puro: se decide aqui y se prueba con Jest.
//
// Para que existe. "Mi ubicacion" te SIGUE, asi que el sitio donde estuviste se pierde en cuanto te
// vas. Y ademas es la unica via para los sitios que ninguna fuente sabe nombrar: Els Reguers
// (Tortosa) no esta en la lista del INE porque no es un municipio, y en Open-Meteo figura como
// "Regues", un nombre que nadie va a escribir. Estando alli, el telefono ya sabe donde estas y como
// se llama, asi que de ahi sale el lugar.

/**
 * Prefijo del identificador de un lugar guardado asi. Los otros dos que existen son `ine:` (lista
 * de municipios) y el numero de Open-Meteo, asi que ninguno puede chocar con este.
 */
export const PREFIJO_PUNTO = 'punto:';

/**
 * Nombre generico que pone `PlacesContext` cuando Apple no sabe geocodificar el punto. No es un
 * nombre: es la ausencia de uno, y por eso aqui vale como "todavia no se puede guardar".
 */
const SIN_NOMBRE = 'Mi ubicación';

// Cuatro decimales son unos 11 metros, de sobra para identificar un sitio y sin arrastrar la deriva
// del GPS al identificador.
const decimales = (n: number) => n.toFixed(4);

/**
 * El lugar FIJO que se guardaria estando donde estas, o `undefined` si todavia no se puede.
 *
 * Devuelve `undefined` sin nombre util a proposito: guardar un lugar llamado "Mi ubicacion" dejaria
 * en la lista una fila indistinguible de la de arriba, que es justo la que se mueve. Y el nombre es
 * lo que se quiere conservar, no las coordenadas.
 */
export function lugarDesdeUbicacion(actual: Place | undefined): Place | undefined {
  if (!actual || !Number.isFinite(actual.lat) || !Number.isFinite(actual.lon)) {
    return undefined;
  }
  const nombre = actual.name?.trim();
  if (!nombre || nombre === SIN_NOMBRE) {
    return undefined;
  }
  return {
    ...actual,
    id: `${PREFIJO_PUNTO}${decimales(actual.lat)},${decimales(actual.lon)}`,
    name: nombre,
  };
}

/**
 * El lugar ya guardado que es ESTE mismo sitio, si lo hay.
 *
 * Se exige el mismo nombre *y* la cercania, no solo una de las dos cosas. Solo por cercania se
 * perderian dos barrios distintos a un kilometro, que tienen nombres distintos porque son sitios
 * distintos; solo por nombre se confundiria un "Centro" con otro "Centro" a 300 km. Es la misma
 * regla que ya usa la mezcla de municipios, y por el mismo motivo.
 */
export function yaGuardado(places: Place[], punto: Place | undefined): Place | undefined {
  if (!punto) {
    return undefined;
  }
  return places.find(
    (p) =>
      p.name.trim().toLocaleLowerCase('es') === punto.name.trim().toLocaleLowerCase('es') &&
      distanciaMetros(p, punto) < MISMO_SITIO_METROS,
  );
}
