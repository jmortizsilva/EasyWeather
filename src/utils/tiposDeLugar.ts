// Que resultados del buscador son un LUGAR que merezca la pena ofrecer. Logica pura, sin React
// Native: se prueba con Jest.
//
// El problema que resuelve: buscando "Bilbao" salian siete resultados, y entre ellos el barrio de
// Bilbao de Madrid y otro de Costa Rica. Quien busca una ciudad en una app del tiempo no espera
// barrios: espera poblaciones y, como mucho, paises.
//
// Open-Meteo devuelve en cada resultado un `feature_code` de GeoNames, que es justo la clasificacion
// que hace falta. Comprobado contra la API el 2026-09-01:
//
//   Bilbao (Pais Vasco)      PPLA2   capital de una division de segundo orden
//   Bilbao (Filipinas)       PPL     poblacion
//   Bronchales (Teruel)      PPLA3   capital de una division de tercer orden, un pueblo de 400
//   Bilbao (Madrid)          PPLX    SECCION de una poblacion  -> un barrio
//   Aeropuerto de Bilbao     AIRP    aeropuerto
//   Espana                   PCLI    pais independiente

/**
 * Prefijo de las poblaciones en GeoNames: ciudades, pueblos, aldeas y las capitales de cada nivel
 * administrativo (PPL, PPLA, PPLA2, PPLA3, PPLC...). Todas valen.
 */
const POBLACION = 'PPL';

/**
 * Seccion de una poblacion: el barrio. Es el unico `PPL*` que se descarta, y es el motivo de que
 * este fichero exista.
 */
const BARRIO = 'PPLX';

/** Prefijo de las entidades politicas: paises y territorios dependientes (PCLI, PCL, PCLD...). */
const PAIS = 'PCL';

/**
 * True si este resultado se puede ofrecer en el buscador.
 *
 * Sin codigo devuelve TRUE, a proposito: si Open-Meteo dejara de mandarlo, es preferible enseñar de
 * mas —como hasta ahora— que dejar el buscador vacio y sin explicacion.
 */
export function esLugarBuscable(codigo: string | undefined): boolean {
  const limpio = codigo?.trim().toUpperCase();
  if (!limpio) {
    return true;
  }
  if (limpio === BARRIO) {
    return false;
  }
  return limpio.startsWith(POBLACION) || limpio.startsWith(PAIS);
}
