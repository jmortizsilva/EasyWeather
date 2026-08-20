// Distancia entre dos puntos por la formula del haversine. Pura, sin dependencias: la usan la
// pantalla Hoy (para decidir si te has movido de zona y hay que recargar el tiempo) y el envio de
// avisos (para decidir si el nombre que teniamos guardado sigue valiendo para donde estas ahora).

const RADIO_TIERRA_M = 6371000;

const aRadianes = (grados: number): number => (grados * Math.PI) / 180;

export interface Punto {
  lat: number;
  lon: number;
}

export function distanciaMetros(a: Punto, b: Punto): number {
  const dLat = aRadianes(b.lat - a.lat);
  const dLon = aRadianes(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(a.lat)) * Math.cos(aRadianes(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * RADIO_TIERRA_M * Math.asin(Math.sqrt(h));
}

// A partir de aqui se considera que has cambiado de sitio: dentro de esa distancia la prevision es
// la misma y el nombre del lugar (barrio o ciudad) sigue siendo el correcto.
export const MISMO_SITIO_METROS = 1500;

/** True si los dos puntos son, a efectos de tiempo y de nombre, el mismo sitio. */
export function esElMismoSitio(a: Punto | undefined, b: Punto | undefined): boolean {
  if (!a || !b) {
    return false;
  }
  return distanciaMetros(a, b) < MISMO_SITIO_METROS;
}
