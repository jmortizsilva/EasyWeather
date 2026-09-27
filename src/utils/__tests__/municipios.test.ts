import { Place } from '../../types';
import {
  aPlace,
  buscarMunicipios,
  mezclarMunicipios,
  Municipio,
  normalizar,
  todosLosMunicipios,
} from '../municipios';

// Los municipios de España que la app lleva dentro. Se prueban contra el fichero de datos de verdad,
// no contra un doble: la mitad de lo que puede salir mal esta en los datos (nombres del INE al
// reves, acentos, coordenadas) y un doble no lo cazaria.

const p = (id: string, name: string, lat: number, lon: number, extra: Partial<Place> = {}): Place =>
  ({ id, name, lat, lon, countryCode: 'ES', country: 'España', ...extra }) as Place;

/** Como se llaman las fichas que salen de la mezcla (las de Open-Meteo y las nuestras). */
const nombres = (lugares: { name: string }[]) => lugares.map((l) => l.name);

/** Como se llaman los municipios propios, que por dentro usan los nombres de la casa. */
const rotulos = (municipios: Municipio[]) => municipios.map((m) => m.nombre);

describe('normalizar', () => {
  it('quita tildes y mayusculas, que es como se escribe desde un teclado cualquiera', () => {
    expect(normalizar('Badia del Vallès')).toBe('badia del valles');
    expect(normalizar('BADIA DEL VALLÈS')).toBe('badia del valles');
    expect(normalizar('Alcàsser')).toBe('alcasser');
    expect(normalizar('A Coruña')).toBe('a coruna');
  });

  it('trata el apostrofo como separacion de palabras y el punto volado como parte de una', () => {
    // Si el apostrofo se borrara quedaria "lalfas del pi", y nadie encuentra asi su pueblo.
    expect(normalizar("l'Alfàs del Pi")).toBe('l alfas del pi');
    expect(normalizar("Castell d'Aro")).toBe('castell d aro');
    // La ela geminada es una sola palabra: se busca escribiendo "compostella".
    expect(normalizar('Santiago de Compostel·la')).toBe('santiago de compostella');
  });

  it('deja un solo espacio entre palabras', () => {
    expect(normalizar('  Vitoria - Gasteiz  ')).toBe('vitoria gasteiz');
  });
});

describe('el fichero de datos', () => {
  it('trae los 8.132 municipios del INE a 1 de enero de 2026', () => {
    // Si este numero baja, el fichero se ha truncado. Si sube o baja porque el INE publico lista
    // nueva, se cambia aqui a mano tras volver a generar: es la unica forma de notarlo.
    expect(todosLosMunicipios()).toHaveLength(8132);
  });

  it('ningun municipio se queda sin nombre, sin coordenadas ni sin provincia', () => {
    for (const m of todosLosMunicipios()) {
      expect(m.nombre.length).toBeGreaterThan(0);
      expect(Number.isFinite(m.lat)).toBe(true);
      expect(Number.isFinite(m.lon)).toBe(true);
      // España cabe entera en este rectangulo, Canarias incluidas.
      expect(m.lat).toBeGreaterThan(27);
      expect(m.lat).toBeLessThan(44);
      expect(m.lon).toBeGreaterThan(-19);
      expect(m.lon).toBeLessThan(5);
      expect(aPlace(m).admin2).toBeTruthy();
    }
  });

  it('endereza los nombres que el INE escribe al reves para ordenarlos', () => {
    // El INE los lista como "Roda, La" y "Alfàs del Pi, l'", que no es como se llaman. Las
    // mayusculas se dejan como las escribe el INE, que no es coherente consigo mismo: pone
    // "Alfàs del Pi, l'" en minuscula y "Hospitalet de Llobregat, L'" en mayuscula.
    expect(rotulos(buscarMunicipios('la roda'))).toContain('La Roda');
    expect(rotulos(buscarMunicipios('alfas del pi'))).toContain("l'Alfàs del Pi");
    expect(rotulos(buscarMunicipios('hospitalet de llobregat'))).toContain(
      "L'Hospitalet de Llobregat",
    );
    for (const m of todosLosMunicipios()) {
      expect(m.nombre).not.toMatch(/, (el|la|los|las|l'|els|les|es|sa|ses|a|o|as|os)$/i);
    }
  });

  it('no destroza los tres nombres que llevan coma de verdad', () => {
    // Estos tienen coma porque son municipios fusionados, no por el articulo del INE.
    expect(rotulos(buscarMunicipios('castell d aro'))).toContain(
      "Castell d'Aro, Platja d'Aro i s'Agaró",
    );
    expect(rotulos(buscarMunicipios('saus'))).toContain('Saus, Camallera i Llampaies');
  });
});

describe('buscarMunicipios', () => {
  it('encuentra Badia del Vallès, que es el pueblo que Open-Meteo no tiene', () => {
    // El caso que motivo todo esto: la API de Open-Meteo devuelve la lista VACIA para este nombre,
    // escrito como sea, asi que sin esta lista no habia forma de sacarlo en el buscador.
    for (const escrito of ['Badia del Vallès', 'badia del valles', 'BADIA DEL VALLES', 'badia']) {
      expect(rotulos(buscarMunicipios(escrito))).toContain('Badia del Vallès');
    }
  });

  it('encuentra los demas municipios que a Open-Meteo le faltan', () => {
    // De la muestra de 250 del 2026-09-26: estos doce no salian con ninguno de sus nombres.
    const ausentes = [
      'Pozuelo de Calatrava',
      'Zigoitia',
      'Trucios-Turtzioz',
      'Castellví de la Marca',
      'Villagonzalo Pedernales',
      'Lahiguera',
      'El Milano',
      'Ramirás',
      'Arroba de los Montes',
      'Junta de Traslaloma',
      'Merindad de Cuesta-Urria',
      'Quintanilla del Agua y Tordueles',
    ];
    for (const nombre of ausentes) {
      expect(rotulos(buscarMunicipios(normalizar(nombre)))).toContain(nombre);
    }
  });

  it('vale escribir una palabra de en medio del nombre', () => {
    // Medio pais se llama "algo de algo" y nadie escribe el principio entero.
    expect(rotulos(buscarMunicipios('compostela'))).toContain('Santiago de Compostela');
    expect(rotulos(buscarMunicipios('tordueles'))).toContain('Quintanilla del Agua y Tordueles');
  });

  it('encuentra los que empiezan por articulo sin tener que escribir el articulo', () => {
    // 611 municipios empiezan por articulo y nadie lo escribe. El caso que lo dejo claro: buscando
    // "coruña", A Coruña (245.000 habitantes) perdia contra Coruña del Conde, de cien vecinos, que
    // era el unico que empezaba literalmente por esa palabra.
    expect(buscarMunicipios('coruna')[0].nombre).toBe('A Coruña');
    expect(rotulos(buscarMunicipios('ballestero'))).toContain('El Ballestero');
    expect(rotulos(buscarMunicipios('roda'))).toContain('La Roda');
  });

  it('encuentra los nombres dobles por cualquiera de sus dos mitades', () => {
    expect(rotulos(buscarMunicipios('donostia'))).toContain('Donostia/San Sebastián');
    expect(rotulos(buscarMunicipios('san sebastian'))).toContain('Donostia/San Sebastián');
  });

  it('encuentra un pueblo por su nombre de antes, pero lo llama por el oficial', () => {
    // Quien lleva toda la vida diciendo "Begas" tiene que dar con el pueblo; lo que lee es "Begues".
    const porElViejo = buscarMunicipios('begas');
    expect(rotulos(porElViejo)).toContain('Begues');
    expect(rotulos(porElViejo)).not.toContain('Begas');
    expect(rotulos(buscarMunicipios('renteria'))).toContain('Errenteria');
  });

  it('lo que encaja por una palabra de en medio no compite con lo que empieza por lo escrito', () => {
    // Se vio en pantalla: buscando "Mérida" salian antes San Pedro de Mérida, Oliva de Mérida y
    // Valverde de Mérida que Mérida, porque luego se ordena por cercania y estan a la misma
    // distancia. Ahora los de en medio solo salen si no hay ninguno que empiece por lo escrito.
    const merida = rotulos(buscarMunicipios('merida'));
    expect(merida).toContain('Mérida');
    expect(merida).not.toContain('San Pedro de Mérida');
    // Pero como respaldo siguen valiendo, que para eso estan: nada empieza por "compostela".
    expect(rotulos(buscarMunicipios('compostela'))).toContain('Santiago de Compostela');
  });

  it('no saca un pueblo por una etiqueta desambiguada de Wikidata', () => {
    // Zarra tenia el alias "Zarra (Valencia)", y aparecia al buscar "Valencia". Se poda al generar.
    expect(rotulos(buscarMunicipios('valencia'))).not.toContain('Zarra');
  });

  it('pone delante lo mas poblado cuando varios encajan igual', () => {
    // "Madrid" encaja con Madrid y con un puñado de pueblos que empiezan igual.
    expect(buscarMunicipios('madrid')[0].nombre).toBe('Madrid');
    expect(buscarMunicipios('valencia')[0].nombre).toBe('València');
  });

  it('no busca con menos de dos letras, igual que el resto del buscador', () => {
    expect(buscarMunicipios('a')).toEqual([]);
    expect(buscarMunicipios(' ')).toEqual([]);
    expect(buscarMunicipios('')).toEqual([]);
  });

  it('no devuelve mas de diez, que es el tope que se le pide a Open-Meteo', () => {
    expect(buscarMunicipios('san').length).toBeLessThanOrEqual(10);
  });
});

describe('aPlace', () => {
  it('describe el municipio con la provincia y la comunidad del INE', () => {
    const badia = buscarMunicipios('badia del valles').find((m) => m.ine === '08904');
    expect(badia).toBeDefined();
    expect(aPlace(badia!)).toEqual({
      id: 'ine:08904',
      name: 'Badia del Vallès',
      admin1: 'Cataluña',
      admin2: 'Barcelona',
      country: 'España',
      countryCode: 'ES',
      lat: 41.508,
      lon: 2.114,
    });
  });

  it('usa un identificador que no puede chocar con los de Open-Meteo', () => {
    // Los de Open-Meteo son numeros de GeoNames. Un lugar guardado se recuerda por el suyo.
    for (const m of buscarMunicipios('barcelona')) {
      expect(aPlace(m).id).toMatch(/^ine:\d{5}$/);
    }
  });
});

describe('mezclarMunicipios', () => {
  // Coordenadas de verdad, que son las que deciden si dos fichas son el mismo pueblo.
  const barberaDeOpenMeteo = p('3109804', 'Barberà del Vallès', 41.5159, 2.12457);
  const begasDeOpenMeteo = p('3128760', 'Begas', 41.3333, 1.9333);
  const santCugatDeOpenMeteo = p('3110044', 'Sant Cugat', 41.4725, 2.0863);
  const valenciaDeVenezuela = p('3625549', 'Valencia', 10.1667, -68.0, {
    countryCode: 'VE',
    country: 'Venezuela',
  });

  it('saca Badia del Vallès y NO se come Barberà, que es otro pueblo a 1,2 km', () => {
    // El error que habria sido facil cometer: juntar dos fichas solo por estar cerca. Badia se
    // separo de Barberà en 1994 y son dos municipios distintos.
    const mezcla = mezclarMunicipios('badia del valles', [barberaDeOpenMeteo]);
    expect(nombres(mezcla)).toContain('Badia del Vallès');
    expect(nombres(mezcla)).toContain('Barberà del Vallès');
  });

  it('descarta la ficha de Open-Meteo cuando es el mismo pueblo con el nombre viejo', () => {
    const mezcla = mezclarMunicipios('begues', [begasDeOpenMeteo]);
    expect(nombres(mezcla)).toEqual(['Begues']);
  });

  it('descarta tambien la ficha de Open-Meteo cuando trae el nombre a medias', () => {
    // Open-Meteo llama "Sant Cugat" a Sant Cugat del Vallès.
    const mezcla = mezclarMunicipios('sant cugat del valles', [santCugatDeOpenMeteo]);
    expect(nombres(mezcla)).toEqual(['Sant Cugat del Vallès']);
  });

  it('no junta dos sitios que se llaman igual pero estan lejos', () => {
    const mezcla = mezclarMunicipios('valencia', [valenciaDeVenezuela]);
    expect(nombres(mezcla)).toContain('València');
    expect(nombres(mezcla)).toContain('Valencia');
  });

  it('sigue dando los pueblos de España aunque Open-Meteo no conteste', () => {
    // Es la razon de que la lista viaje dentro de la app: sin red, o con Open-Meteo caido, estos
    // pueblos no tendrian ninguna otra via.
    expect(nombres(mezclarMunicipios('badia del valles', []))).toContain('Badia del Vallès');
  });

  it('deja pasar tal cual lo que no es de España', () => {
    const londres = p('2643743', 'London', 51.5085, -0.1257, {
      countryCode: 'GB',
      country: 'Reino Unido',
    });
    expect(mezclarMunicipios('london', [londres])).toEqual([londres]);
  });
});
