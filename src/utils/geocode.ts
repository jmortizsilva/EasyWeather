// Nombre legible de "mi ubicacion" a partir de la geocodificacion inversa de Apple (expo-location).
// Puro: se decide aqui y se prueba con Jest, sin dispositivo.
//
// El campo `district` es el barrio/subLocality de iOS (p. ej. "Ciudad Lineal"); Open-Meteo no
// interviene en el nombre, solo en el tiempo de las coordenadas. Se muestra "barrio, ciudad" cuando
// iOS conoce el barrio y no coincide con la ciudad; si no, la ciudad; y como ultimo recurso la
// comarca. Devuelve undefined si no hay nada util, para que cada llamador ponga su propio respaldo.

export interface DireccionGeocodificada {
  city?: string | null;
  district?: string | null;
  subregion?: string | null;
}

export function nombreUbicacion(dir: DireccionGeocodificada | undefined): string | undefined {
  const barrio = dir?.district?.trim() || undefined;
  const ciudad = dir?.city?.trim() || undefined;
  const comarca = dir?.subregion?.trim() || undefined;
  if (barrio && ciudad && barrio !== ciudad) {
    return `${barrio}, ${ciudad}`;
  }
  return ciudad ?? barrio ?? comarca;
}
