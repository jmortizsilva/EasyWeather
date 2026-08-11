import { Place } from '../types';

// Como se presentan los resultados del buscador. Logica pura, sin React Native: se prueba con Jest.

export interface ResultadoBusqueda {
  place: Place;
  /**
   * Texto que acompana al nombre y que hace este resultado DISTINGUIBLE del resto de resultados
   * que se llaman igual. Normalmente es solo la region; se alarga con niveles mas finos solo
   * cuando hace falta.
   */
  detalle: string;
}

const SEPARADOR = ' · ';

function limpio(valor: string | undefined): string | undefined {
  const v = valor?.trim();
  return v ? v : undefined;
}

/**
 * Datos que pueden describir un lugar, de mas general a mas concreto. Se descartan los repetidos
 * (Open-Meteo repite el nombre en algun nivel: p. ej. una ciudad que da nombre a su provincia) y
 * los que coinciden con el propio nombre, que no aportarian nada al leerlos.
 */
function partesDescriptivas(place: Place): string[] {
  const candidatos = [place.admin1, place.admin2, place.admin3, place.country];
  const partes: string[] = [];
  for (const candidato of candidatos) {
    const valor = limpio(candidato);
    if (!valor) {
      continue;
    }
    const yaEsta = partes.some((p) => p.toLowerCase() === valor.toLowerCase());
    if (yaEsta || valor.toLowerCase() === place.name.trim().toLowerCase()) {
      continue;
    }
    partes.push(valor);
  }
  return partes;
}

function etiqueta(partes: string[], niveles: number): string {
  return partes.slice(0, niveles).join(SEPARADOR);
}

/**
 * Describe cada resultado con lo justo para poder elegir.
 *
 * Cuando se busca una ciudad grande, Open-Meteo devuelve varias entradas con el MISMO nombre y la
 * misma region: son sitios distintos de verdad (coordenadas distintas, normalmente el municipio y
 * alguna division administrativa que lo contiene), pero tal cual se leian identicas y no habia
 * forma de elegir. En vez de esconderlas, se les anade el siguiente dato que las diferencia
 * (provincia, comarca, pais...), y solo ese: alargar todas las filas por si acaso las haria
 * pesadas de escuchar.
 *
 * Si tras agotar los datos dos entradas siguen siendo indistinguibles, entonces si se deja una
 * sola: dos filas identicas no ayudan a nadie a decidir.
 */
export function describirResultados(resultados: Place[]): ResultadoBusqueda[] {
  // Se agrupa por nombre: solo compiten entre si los que suenan igual.
  const grupos = new Map<string, Place[]>();
  for (const place of resultados) {
    const clave = place.name.trim().toLowerCase();
    grupos.set(clave, [...(grupos.get(clave) ?? []), place]);
  }

  const detallePorId = new Map<string, string>();
  for (const grupo of grupos.values()) {
    const partesPorPlace = new Map(grupo.map((p) => [p.id, partesDescriptivas(p)]));
    const maxPartes = Math.max(0, ...[...partesPorPlace.values()].map((p) => p.length));

    // Se sube de nivel mientras haya dos que se lean igual y quede algo con lo que separarlos.
    let niveles = 1;
    while (niveles < maxPartes) {
      const etiquetas = grupo.map((p) => etiqueta(partesPorPlace.get(p.id) ?? [], niveles));
      if (new Set(etiquetas).size === etiquetas.length) {
        break;
      }
      niveles += 1;
    }

    for (const place of grupo) {
      detallePorId.set(place.id, etiqueta(partesPorPlace.get(place.id) ?? [], niveles));
    }
  }

  const vistos = new Set<string>();
  const salida: ResultadoBusqueda[] = [];
  for (const place of resultados) {
    const detalle = detallePorId.get(place.id) ?? '';
    const clave = `${place.name.trim().toLowerCase()}|${detalle.toLowerCase()}`;
    if (vistos.has(clave)) {
      continue; // indistinguible incluso con todos los datos: no aporta una segunda fila igual
    }
    vistos.add(clave);
    salida.push({ place, detalle });
  }
  return salida;
}
