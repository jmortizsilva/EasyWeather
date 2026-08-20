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
 * Sin lectura fresca (sin permiso, o el GPS falla) se manda la cacheada, que es lo unico que hay.
 */
export function ubicacionParaEnviar(
  fresca: UbicacionConNombre | undefined,
  cacheada: UbicacionConNombre | undefined,
): UbicacionConNombre | null {
  if (!fresca) {
    return cacheada ?? null;
  }
  if (fresca.nombre) {
    return fresca;
  }
  const nombre = esElMismoSitio(fresca, cacheada) ? cacheada?.nombre : undefined;
  return { lat: fresca.lat, lon: fresca.lon, nombre };
}
