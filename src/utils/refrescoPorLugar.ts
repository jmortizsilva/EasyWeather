// Decide si toca volver a preguntar por un lugar y si lo que ya hay en pantalla sigue valiendo
// mientras llega la respuesta.
//
// Existe por un fallo real. El throttle de la observacion medida y el de los avisos oficiales
// guardaban solo la HORA de la ultima consulta, con el id del lugar como clave. Para un lugar
// guardado eso basta, porque sus coordenadas no cambian nunca. Pero el id de la ubicacion actual es
// siempre el mismo y sus coordenadas se mueven contigo: al volver de un viaje, la consulta del sitio
// nuevo caia dentro de la ventana de la del sitio viejo y sencillamente no se hacia.
//
// Lo que se veia (2026-09-09, volviendo de Valencia a Madrid): la pantalla decia "Carabanchel" y
// debajo, como temperatura MEDIDA, la del aeropuerto de Valencia. Con los avisos de AEMET habria
// sido peor: un aviso naranja de la provincia que acabas de dejar.

/** Cuando y PARA QUE PUNTO se pregunto la ultima vez. */
export interface ConsultaHecha {
  /** Epoch ms. Un 0 significa "reintentable ya", que es como se marca un fallo de red. */
  cuando: number;
  lat: number;
  lon: number;
}

export interface Punto {
  lat: number;
  lon: number;
}

/**
 * - `esperar`: mismo punto y todavia dentro de la ventana; lo que hay en pantalla vale.
 * - `consultar`: mismo punto pero la ventana se agoto, o es la primera vez.
 * - `olvidar-y-consultar`: el punto ha cambiado. Ademas de preguntar hay que RETIRAR lo que se
 *   estuviera enseñando, que es del sitio anterior y no vale ni un segundo mas.
 */
export type VeredictoRefresco = 'esperar' | 'consultar' | 'olvidar-y-consultar';

export function veredictoRefresco(
  ultima: ConsultaHecha | undefined,
  punto: Punto,
  ahora: number,
  ventanaMs: number,
): VeredictoRefresco {
  if (!ultima) {
    return 'consultar';
  }
  // Se comparan las coordenadas exactas, sin margen, y no es descuido: las de un lugar guardado no
  // cambian jamas, y las de la ubicacion actual solo se reescriben cuando te has movido de verdad
  // (mas de 1,5 km, ver PlacesContext) o cuando pulsas "actualizar ubicacion" a mano. Asi que aqui
  // no llega deriva del GPS que pudiera saltarse el throttle sola.
  if (ultima.lat !== punto.lat || ultima.lon !== punto.lon) {
    return 'olvidar-y-consultar';
  }
  return ahora - ultima.cuando < ventanaMs ? 'esperar' : 'consultar';
}
