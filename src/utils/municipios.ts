import { MUNICIPIOS, PROVINCIAS } from '../data/municipios';
import { Place } from '../types';
import { distanciaKm } from './ordenarResultados';

// Los municipios de España, buscados en el propio telefono. Logica pura, sin React Native: se
// prueba con Jest.
//
// Por que no basta con Open-Meteo, que es quien busca todo lo demas: su geocodificador tiene
// agujeros en España. Comprobado el 2026-09-26 sobre una muestra aleatoria de 250 municipios, 12 no
// salian escribiendo NINGUNO de sus nombres (un 4,8%; del orden de 400 municipios). Uno de ellos es
// Badia del Vallès, 13.000 habitantes, que es el caso que destapo esto: la API devuelve la lista
// vacia, asi que no habia nada que arreglar en la app hasta que hubo otra fuente.
//
// Y de los que si salen, muchos llegan con el nombre de antes: Open-Meteo enseña "Begas" por Begues,
// "San Quirico de Tarrasa" por Sant Quirze del Vallès y "Carbia" por Villa de Cruces. Aqui manda
// SIEMPRE el nombre oficial del INE, y la ficha de Open-Meteo del mismo pueblo se descarta.
//
// El fichero de datos lo genera `herramientas/generar-municipios.mjs`, que explica de donde sale
// cada campo. La lista viaja dentro de la app a proposito: estos pueblos no tienen otra via, asi
// que tenian que poder encontrarse sin red y sin que dependa de ningun servidor nuestro.

/** Un municipio ya interpretado, con lo que hace falta para buscarlo y para enseñarlo. */
export interface Municipio {
  /** Codigo del INE. Sus dos primeros digitos son la provincia. */
  ine: string;
  /** El nombre oficial, tal cual lo escribe el INE. Es el unico que se enseña. */
  nombre: string;
  lat: number;
  lon: number;
  habitantes: number;
  /**
   * Todo lo que se puede escribir para dar con este municipio, ya normalizado: el nombre oficial,
   * cada mitad de los nombres dobles ("Donostia/San Sebastián") y los nombres alternativos. NO se
   * enseñan: solo sirven para encontrarlo y para reconocer la ficha de Open-Meteo del mismo sitio.
   */
  objetivos: string[];
}

/**
 * Acentos y demas, uno a uno, en vez de `String.prototype.normalize('NFD')`.
 *
 * Es a proposito: quien ejecuta esto de verdad es Hermes, y lo que soporte de Unicode no se ha
 * podido comprobar aqui —un test de Jest corre en Node, que si lo soporta, asi que una prueba verde
 * no diria nada del telefono—. Con una tabla explicita se comporta igual en los dos sitios.
 */
// prettier-ignore
const TILDES: Record<string, string> = {
  á: 'a', à: 'a', ä: 'a', â: 'a',
  é: 'e', è: 'e', ë: 'e', ê: 'e',
  í: 'i', ì: 'i', ï: 'i', î: 'i',
  ó: 'o', ò: 'o', ö: 'o', ô: 'o',
  ú: 'u', ù: 'u', ü: 'u', û: 'u',
  ñ: 'n', ç: 'c', ý: 'y',
};

/**
 * Deja un nombre en la forma con la que se comparan: sin tildes, en minusculas y con un solo
 * espacio entre palabras. Asi "BADIA DEL VALLES" encuentra "Badia del Vallès", que es como lo va a
 * escribir cualquiera que no tenga a mano el acento.
 *
 * El apostrofo y el punto volado NO se tratan igual, y la diferencia se nota al buscar:
 *
 *   - el apostrofo separa palabras ("l'Alfàs del Pi", "Castell d'Aro"), asi que se convierte en
 *     espacio. Borrandolo quedaba "lalfas del pi", y entonces quien escribia "alfas del pi" no
 *     encontraba su pueblo, que es justo lo que se venia a arreglar.
 *   - el punto volado esta DENTRO de una palabra: es la ela geminada catalana, y "Compostel·la" es
 *     una palabra sola. Ese se borra, para que se encuentre escribiendo "compostella".
 */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .replace(/[áàäâéèëêíìïîóòöôúùüûñçý]/g, (c) => TILDES[c])
    .replace(/·/g, '')
    .replace(/['’`]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Articulos con los que empieza el nombre de 611 municipios ("A Coruña", "El Ballestero", "Sa
 * Pobla", "l'Alfàs del Pi"). Se guarda tambien el nombre SIN el, porque nadie lo escribe y sin esto
 * quedaban fuera: al buscar "coruña", A Coruña perdia contra Coruña del Conde, un pueblo de cien
 * vecinos que si empieza por esa palabra.
 */
// prettier-ignore
const ARTICULOS = new Set([
  'el', 'la', 'los', 'las', 'lo', 'l', 'els', 'les', 'es', 'sa', 'ses', 'a', 'o', 'as', 'os',
]);

/** El nombre normalizado y, si empieza por un articulo, tambien lo que queda al quitarlo. */
function conYSinArticulo(normalizado: string): string[] {
  const espacio = normalizado.indexOf(' ');
  if (espacio < 0 || !ARTICULOS.has(normalizado.slice(0, espacio))) {
    return [normalizado];
  }
  return [normalizado, normalizado.slice(espacio + 1)];
}

// El fichero se interpreta la primera vez que se busca, no al arrancar: son 8.000 lineas y la
// pantalla de inicio no las necesita.
let interpretados: Municipio[] | undefined;

export function todosLosMunicipios(): Municipio[] {
  if (interpretados) {
    return interpretados;
  }
  interpretados = [];
  for (const linea of MUNICIPIOS.split('\n')) {
    if (!linea) {
      continue;
    }
    const [ine, nombre, lat, lon, habitantes, ...alternativos] = linea.split('|');
    interpretados.push({
      ine,
      nombre,
      lat: Number(lat),
      lon: Number(lon),
      habitantes: Number(habitantes),
      objetivos: [
        ...new Set(
          [nombre, ...nombre.split('/'), ...alternativos]
            .map(normalizar)
            .filter((n) => n.length > 0)
            .flatMap(conYSinArticulo),
        ),
      ],
    });
  }
  return interpretados;
}

/** Es justo lo escrito. */
const PUNTO_EXACTO = 0;
/** Empieza por lo escrito: "badia" -> Badia del Vallès. */
const PUNTO_EMPIEZA_POR = 1;
/** Lo escrito es una palabra de en medio: "compostela" -> Santiago de Compostela. */
const PUNTO_POR_DENTRO = 2;

/**
 * Como de bien encaja lo escrito con este municipio, de mejor (0) a peor; `undefined` si no encaja.
 *
 * Se admite encajar por una palabra de en medio porque medio pais se llama "algo de algo" y nadie
 * escribe el principio entero. Ojo: el caso del articulo inicial NO se resuelve aqui, sino al
 * interpretar el fichero (ver `conYSinArticulo`), porque tiene que competir de igual a igual con los
 * que empiezan por lo escrito y este encaje vale menos.
 */
function encaje(municipio: Municipio, consulta: string): number | undefined {
  let mejor: number | undefined;
  for (const objetivo of municipio.objetivos) {
    const punto =
      objetivo === consulta
        ? PUNTO_EXACTO
        : objetivo.startsWith(consulta)
          ? PUNTO_EMPIEZA_POR
          : objetivo.includes(` ${consulta}`)
            ? PUNTO_POR_DENTRO
            : undefined;
    if (punto !== undefined && (mejor === undefined || punto < mejor)) {
      mejor = punto;
    }
  }
  return mejor;
}

/** Cuantos municipios propios se ofrecen como maximo. Es el mismo tope que pide Open-Meteo. */
const TOPE = 10;

/**
 * Los municipios españoles que encajan con lo escrito, los que mas encajan primero y, a igual
 * encaje, los mas poblados. Con menos de dos letras no se busca, igual que en el resto del buscador.
 *
 * Los que encajan por una palabra de EN MEDIO ("Compostela" -> Santiago de Compostela) solo se
 * ofrecen **si no hay ninguno que empiece** por lo escrito, y el motivo se vio en pantalla: al
 * buscar "Mérida" salian antes San Pedro de Mérida, Oliva de Mérida y Valverde de Mérida que Mérida,
 * porque despues se ordena todo por cercania y los tres estan a la misma distancia. Como respaldo
 * siguen valiendo —quien escribe "Compostela" o "Tordueles" encuentra su pueblo—, pero no compiten
 * con lo que el usuario ha escrito de verdad.
 */
export function buscarMunicipios(consulta: string, tope = TOPE): Municipio[] {
  const limpia = normalizar(consulta);
  if (limpia.length < 2) {
    return [];
  }
  const todos: { municipio: Municipio; punto: number }[] = [];
  for (const municipio of todosLosMunicipios()) {
    const punto = encaje(municipio, limpia);
    if (punto !== undefined) {
      todos.push({ municipio, punto });
    }
  }
  const porElPrincipio = todos.filter((e) => e.punto <= PUNTO_EMPIEZA_POR);
  const encajan = porElPrincipio.length > 0 ? porElPrincipio : todos;
  return encajan
    .sort(
      (a, b) =>
        a.punto - b.punto ||
        b.municipio.habitantes - a.municipio.habitantes ||
        a.municipio.nombre.localeCompare(b.municipio.nombre),
    )
    .slice(0, tope)
    .map((e) => e.municipio);
}

/** La ficha que ve el resto de la app, con la misma forma que la de Open-Meteo. */
export function aPlace(municipio: Municipio): Place {
  const [provincia, comunidad] = PROVINCIAS[municipio.ine.slice(0, 2)] ?? [];
  return {
    // El prefijo evita que choque con los identificadores de Open-Meteo, que son numeros de
    // GeoNames. Un lugar guardado se recuerda por el suyo, asi que tienen que ser distintos.
    id: `ine:${municipio.ine}`,
    name: municipio.nombre,
    admin1: comunidad,
    admin2: provincia,
    country: 'España',
    countryCode: 'ES',
    lat: municipio.lat,
    lon: municipio.lon,
  };
}

// Cuando se considera que una ficha de Open-Meteo es el mismo pueblo que uno nuestro, y por tanto se
// descarta la suya. Se exige que el nombre encaje Y que este al lado: solo con la distancia se
// perderian sitios de verdad (Badia del Vallès y Barberà del Vallès son dos pueblos distintos a
// 1,2 km), y solo con el nombre se juntarian dos homonimos de dos provincias.
const KM_MISMO_NOMBRE = 15;
const KM_NOMBRE_A_MEDIAS = 8;

function esElMismoPueblo(municipio: Municipio, place: Place): boolean {
  const nombre = normalizar(place.name);
  if (!nombre) {
    return false;
  }
  const km = distanciaKm(municipio, place);
  if (municipio.objetivos.includes(nombre)) {
    return km <= KM_MISMO_NOMBRE;
  }
  // Open-Meteo acorta unos cuantos ("Sant Cugat" por Sant Cugat del Vallès, "Osera" por Osera de
  // Ebro). Se acepta que uno sea el principio del otro, pero pegados: a 8 km ya suele ser otra cosa.
  const aMedias = municipio.objetivos.some(
    (o) => o.startsWith(`${nombre} `) || nombre.startsWith(`${o} `),
  );
  return aMedias && km <= KM_NOMBRE_A_MEDIAS;
}

/**
 * Junta los municipios españoles con lo que haya contestado Open-Meteo, y deja fuera las fichas
 * suyas que sean el mismo pueblo que uno nuestro.
 *
 * Los propios van delante, pero el orden final no se decide aqui: `ordenarPorCercania` lo rehace
 * por distancia cuando se sabe donde esta el usuario.
 *
 * `deLaRed` vacia es un caso que importa: si Open-Meteo no contesta —sin red, o caido— los pueblos
 * de España siguen saliendo.
 */
export function mezclarMunicipios(consulta: string, deLaRed: Place[]): Place[] {
  const propios = buscarMunicipios(consulta);
  if (propios.length === 0) {
    return deLaRed;
  }
  const resto = deLaRed.filter((place) => !propios.some((m) => esElMismoPueblo(m, place)));
  return [...propios.map(aPlace), ...resto];
}
