import { Place } from '../types';

// Limpieza de los resultados del buscador. Logica pura, sin React Native: se prueba con Jest.

function clave(place: Place): string {
  // La clave es EXACTAMENTE lo que el usuario oye o lee de cada fila. Si dos resultados suenan
  // igual, para quien busca son el mismo aunque Open-Meteo los distinga por coordenadas.
  return `${place.name.trim().toLowerCase()}|${(place.admin1 ?? '').trim().toLowerCase()}`;
}

/**
 * Quita los resultados que se presentan igual que otro anterior. Open-Meteo devuelve varias
 * entradas indistinguibles para una misma ciudad (buscando "Londres" salían dos filas "Londres,
 * Inglaterra"): son divisiones administrativas distintas, pero con el mismo nombre y la misma
 * región no hay forma de elegir entre ellas, y la lista solo se hace más larga.
 *
 * Se conserva el PRIMERO de cada grupo: la API los devuelve por relevancia, así que es el que más
 * probablemente busca el usuario.
 */
export function sinDuplicados(resultados: Place[]): Place[] {
  const vistos = new Set<string>();
  return resultados.filter((place) => {
    const k = clave(place);
    if (vistos.has(k)) {
      return false;
    }
    vistos.add(k);
    return true;
  });
}
