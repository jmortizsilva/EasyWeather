import { esElMismoSitio } from './distancia';

// Que ubicacion se le manda al servidor de avisos. Pura, para poder probarla: es la decision que
// hacia que el aviso de temperatura hablase de la ciudad equivocada.

export interface UbicacionConNombre {
  lat: number;
  lon: number;
  nombre?: string;
}

/**
 * Elige la ubicacion que se sube con el estado de avisos.
 *
 * Manda la lectura RECIEN hecha del GPS. La cacheada (la que enseña la pantalla Hoy) no sirve: se
 * queda congelada mientras miras un lugar guardado, y al subirla se pisaba en el servidor la
 * ubicacion buena que habia dejado la geovalla.
 *
 * El nombre cacheado solo se reaprovecha si la lectura fresca cae en el MISMO sitio. Pegar un
 * nombre de otra ciudad a unas coordenadas nuevas es peor que no dar nombre: el servidor cae
 * entonces en "en tu ubicacion", que es impreciso pero cierto.
 *
 * Sin lectura fresca NO se manda ubicacion, y esto es lo importante: el servidor conserva entonces
 * la que tenga, que viene de la geovalla o de una sincronizacion anterior. Antes se mandaba la
 * cacheada, y cuando iOS despertaba a la app en segundo plano por la propia geovalla, la app
 * arrancaba con la ubicacion vieja restaurada del disco y —si el GPS no contestaba a tiempo— subia
 * esa, pisando la buena que la geovalla acababa de dejar. Una foto vieja nunca es mejor que lo que
 * el servidor ya sabe.
 */
export function ubicacionParaEnviar(
  fresca: UbicacionConNombre | undefined,
  cacheada: UbicacionConNombre | undefined,
): UbicacionConNombre | null {
  if (!fresca) {
    return null;
  }
  if (fresca.nombre) {
    return fresca;
  }
  const nombre = esElMismoSitio(fresca, cacheada) ? cacheada?.nombre : undefined;
  return { lat: fresca.lat, lon: fresca.lon, nombre };
}
