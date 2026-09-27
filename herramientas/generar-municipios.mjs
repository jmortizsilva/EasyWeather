// Genera `src/data/municipios.ts`: los municipios de España con su nombre oficial y sus
// coordenadas, que es lo que la busqueda mira ANTES de preguntar a Open-Meteo.
//
//   node herramientas/generar-municipios.mjs
//
// Por que existe esto: el geocodificador de Open-Meteo tiene agujeros en España. Medido el
// 2026-09-26 sobre una muestra aleatoria de 250 municipios, 12 no salian con NINGUNO de sus nombres
// (un 4,8%, del orden de 400 municipios). Entre ellos Badia del Vallès, 13.000 habitantes, que es el
// caso que destapo todo esto. Y de los que si salen, muchos llegan con el exonimo viejo: "Begas" por
// Begues, "San Quirico de Tarrasa" por Sant Quirze del Vallès, "Carbia" por Villa de Cruces.
//
// El reparto de fuentes no es casual: cada una da lo que es suyo.
//
//   - El INE dice QUE municipios hay y COMO SE LLAMAN. Es la autoridad legal sobre las dos cosas y
//     su lista viene fechada. Wikidata tiene un campo de nombre oficial (P1448), pero esta a medias
//     y se equivoca: para Santiago de Compostela dice solo "Santiago".
//   - Wikidata da las COORDENADAS, que el INE no publica en esta lista. Es CC0 (dominio publico), y
//     sus coordenadas se cotejaron contra las de Open-Meteo para las capitales de las 52
//     provincias: mediana 0,52 km de diferencia, maxima 2,29 km. Sirven de sobra para el tiempo.
//   - Wikidata da tambien los NOMBRES ALTERNATIVOS (etiquetas en es/ca/eu/gl/an/ast), que no se
//     enseñan nunca: sirven para reconocer el sitio cuando alguien lo escribe como se decia antes, y
//     para emparejar nuestra ficha con la de Open-Meteo y no acabar con dos filas del mismo pueblo.
//
// Los nombres de provincia y comunidad tambien son del INE, no de Open-Meteo, que los tiene
// descuidados: escribe "Província de Lérida" (mitad catalan, mitad castellano), "Provincia de
// Gerona" y "Bizkaia" al lado de "Provincia de Guipúzcoa". Copiarlos habria sido importar la misma
// enfermedad que esto viene a curar.
//
// Se vuelve a ejecutar cuando el INE publique lista nueva (cambia un puñado de municipios por
// decada) y se commitea el `.ts` que sale: la app no descarga nada de esto.

import { writeFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

const AGENTE = 'EasyWeather/1.0 (https://github.com/jmortizsilva; jmortizsilva@gmail.com)';
const SALIDA = new URL('../src/data/municipios.ts', import.meta.url);

// El año de la lista del INE va dentro de su URL, asi que hay que decirlo a mano.
const ANIO_INE = 26;
const URL_INE = `https://www.ine.es/daco/daco42/codmun/diccionario${ANIO_INE}.xlsx`;
const URL_CODIGOS = 'https://www.ine.es/daco/daco42/codmun/cod_ccaa_provincia.htm';
const WDQS = 'https://query.wikidata.org/sparql';

async function bajar(url) {
  const r = await fetch(url, { headers: { 'User-Agent': AGENTE } });
  if (!r.ok) throw new Error(`${url} respondio ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

// --- Lector minimo de xlsx --------------------------------------------------------------------
// Un xlsx es un zip con XML dentro. Se lee por el directorio central, y no buscando las cabeceras
// locales, porque esas pueden traer los tamaños a cero cuando el zip se escribio al vuelo. Se hace a
// mano para no meter una dependencia en el proyecto por una herramienta que se ejecuta una vez cada
// varios años.

function ficherosDelZip(buf) {
  let fin = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 65558; i -= 1) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      fin = i;
      break;
    }
  }
  if (fin < 0) throw new Error('no parece un zip: falta el fin del directorio central');

  const ficheros = new Map();
  let p = buf.readUInt32LE(fin + 16);
  const cuantos = buf.readUInt16LE(fin + 10);
  for (let n = 0; n < cuantos; n += 1) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('directorio central corrupto');
    const largoNombre = buf.readUInt16LE(p + 28);
    ficheros.set(buf.toString('utf8', p + 46, p + 46 + largoNombre), {
      metodo: buf.readUInt16LE(p + 10),
      comprimido: buf.readUInt32LE(p + 20),
      desplazamiento: buf.readUInt32LE(p + 42),
    });
    p += 46 + largoNombre + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
  }
  return ficheros;
}

function leerDelZip(buf, ficheros, nombre) {
  const f = ficheros.get(nombre);
  if (!f) throw new Error(`el xlsx no trae ${nombre}`);
  const l = f.desplazamiento;
  if (buf.readUInt32LE(l) !== 0x04034b50) throw new Error('cabecera local corrupta');
  const inicio = l + 30 + buf.readUInt16LE(l + 26) + buf.readUInt16LE(l + 28);
  const datos = buf.subarray(inicio, inicio + f.comprimido);
  return (f.metodo === 8 ? inflateRawSync(datos) : datos).toString('utf8');
}

const desescapar = (t) =>
  t
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&Aacute;/g, 'Á')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í')
    .replace(/&Oacute;/g, 'Ó')
    .replace(/&Uacute;/g, 'Ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&Ntilde;/g, 'Ñ')
    .replace(/&uuml;/g, 'ü')
    .replace(/&agrave;/g, 'à')
    .replace(/&egrave;/g, 'è')
    .replace(/&ograve;/g, 'ò')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&amp;/g, '&');

const textoDe = (xml) =>
  desescapar([...xml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(''));

/** Las filas de la primera hoja, como diccionarios de columna (A, B, C...) a texto. */
function filasDelXlsx(buf) {
  const ficheros = ficherosDelZip(buf);
  const compartidas = [
    ...leerDelZip(buf, ficheros, 'xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g),
  ].map((m) => textoDe(m[1]));
  const hoja = leerDelZip(buf, ficheros, 'xl/worksheets/sheet1.xml');
  const filas = [];
  for (const [, cuerpo] of hoja.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const celdas = {};
    const celda = /<c r="([A-Z]+)\d+"([^>]*)>([\s\S]*?)<\/c>/g;
    for (const [, ref, atributos, contenido] of cuerpo.matchAll(celda)) {
      const valor = /<v>([\s\S]*?)<\/v>/.exec(contenido)?.[1];
      if (/t="s"/.test(atributos) && valor !== undefined) celdas[ref] = compartidas[Number(valor)];
      else if (/t="(inlineStr|str)"/.test(atributos)) celdas[ref] = textoDe(contenido);
      else if (valor !== undefined) celdas[ref] = desescapar(valor);
    }
    if (Object.keys(celdas).length) filas.push(celdas);
  }
  return filas;
}

// --- El INE escribe los nombres al reves para poder ordenarlos -------------------------------
// En sus listas pone "Roda, La", "Alfàs del Pi, l'" y "Coruña, A", que es comodo para ordenar
// alfabeticamente y no es como se llama el sitio. Hay que darles la vuelta antes de enseñarlos.

/**
 * Los articulos que el INE manda al final, en las cuatro lenguas que aparecen. Es una lista CERRADA
 * a proposito: hay tres municipios cuyo nombre lleva una coma de verdad y no un articulo
 * ("Castell d'Aro, Platja d'Aro i s'Agaró", "Cruïlles, Monells i Sant Sadurní de l'Heura",
 * "Saus, Camallera i Llampaies"), y darles la vuelta los dejaria irreconocibles.
 */
// prettier-ignore
const ARTICULOS = new Set(['el', 'la', 'los', 'las', 'lo', "l'", 'els', 'les', 'es', 'sa', 'ses', 'a', 'o', 'as', 'os']);

/** "Roda, La" -> "La Roda"; "Alfàs del Pi, l'" -> "l'Alfàs del Pi". Respeta mayusculas y apostrofo. */
function delanteElArticulo(parte) {
  const corte = parte.lastIndexOf(', ');
  if (corte < 0) return parte;
  const articulo = parte.slice(corte + 2);
  if (!ARTICULOS.has(articulo.toLowerCase())) return parte;
  const resto = parte.slice(0, corte);
  return articulo.endsWith("'") ? `${articulo}${resto}` : `${articulo} ${resto}`;
}

/** Cada mitad de un nombre doble lleva su propio articulo: "Camp de Mirra, el/Campo de Mirra". */
const nombreDerecho = (nombre) => nombre.split('/').map(delanteElArticulo).join('/');

/**
 * Lo mismo para provincias y comunidades, donde detras de la coma no hay solo articulos sino
 * generos enteros ("Madrid, Comunidad de", "Navarra, Comunidad Foral de"). Ninguna lleva coma
 * propia, asi que aqui el intercambio es siempre.
 */
function delanteElGenerico(nombre) {
  const corte = nombre.lastIndexOf(', ');
  return corte < 0 ? nombre : `${nombre.slice(corte + 2)} ${nombre.slice(0, corte)}`;
}

// --- Las tres fuentes ------------------------------------------------------------------------

async function municipiosDelIne() {
  const filas = filasDelXlsx(await bajar(URL_INE));
  const municipios = [];
  for (const f of filas) {
    // A=CODAUTO B=CPRO C=CMUN D=digito de control E=NOMBRE. En las filas de titulo no son numeros.
    if (!/^\d+$/.test(f.B ?? '') || !/^\d+$/.test(f.C ?? '') || !f.E) continue;
    const cpro = String(f.B).padStart(2, '0');
    municipios.push({
      ine: cpro + String(f.C).padStart(3, '0'),
      cpro,
      codauto: String(f.A).padStart(2, '0'),
      nombre: nombreDerecho(f.E.trim()),
    });
  }
  return { municipios, titulo: (filas[0]?.A ?? '').trim() };
}

async function provinciasDelIne() {
  // La pagina del INE va en ISO-8859-15, no en UTF-8: leida como UTF-8 los acentos que no vengan
  // como entidad HTML llegan roros. Es el mismo detalle que muerde con los ficheros de AEMET.
  const html = new TextDecoder('iso-8859-15').decode(await bajar(URL_CODIGOS));
  const provincias = {};
  const comunidades = {};
  for (const fila of html.match(/<tr[\s\S]*?<\/tr>/g) ?? []) {
    const celdas = [...fila.matchAll(/<t[dh][\s\S]*?<\/t[dh]>/g)].map((c) =>
      desescapar(c[0].replace(/<[^>]+>/g, '')).trim(),
    );
    if (celdas.length < 4) continue;
    const [codauto, comunidad, cpro, provincia] = celdas;
    if (!/^\d{2}$/.test(cpro) || !/^\d{2}$/.test(codauto)) continue;
    provincias[cpro] = { provincia: delanteElGenerico(provincia), codauto };
    comunidades[codauto] = delanteElGenerico(comunidad);
  }
  return { provincias, comunidades };
}

const esperar = (ms) => new Promise((seguir) => setTimeout(seguir, ms));

async function deWikidata(consulta, intentos = 4) {
  for (let n = 1; ; n += 1) {
    const r = await fetch(`${WDQS}?format=json&query=${encodeURIComponent(consulta)}`, {
      headers: { 'User-Agent': AGENTE },
    });
    if (r.ok) return (await r.json()).results.bindings;
    if (n >= intentos) throw new Error(`Wikidata respondio ${r.status} tras ${n} intentos`);
    // El 504 de Wikidata depende de lo cargado que este su servidor, no de la consulta: la misma
    // que falla ahora funciona al rato. Se reintenta con una espera creciente.
    console.log(`  Wikidata respondio ${r.status}, reintentando (${n}/${intentos - 1})...`);
    await esperar(5000 * n);
  }
}

/**
 * Las consultas van por TROZOS, agrupadas por el primer digito del codigo INE (que va del 01 al
 * 52). Pedir los 8.132 de golpe se pasa del limite de tiempo de Wikidata y devuelve 504: no es que
 * la consulta este mal, es que no cabe. Y el filtro por longitud del codigo deja fuera lo que no es
 * un municipio, porque P772 se usa tambien para entidades menores, con mas digitos.
 */
const TROZOS = ['0', '1', '2', '3', '4', '5'];

const consultaCoordenadas = (trozo) => `
SELECT ?ine ?coord ?pob WHERE {
  ?m wdt:P772 ?ine . FILTER(STRLEN(?ine) = 5 && STRSTARTS(?ine, "${trozo}"))
  ?m wdt:P625 ?coord .
  OPTIONAL { ?m wdt:P1082 ?pob }
}`;

const consultaNombres = (trozo) => `
SELECT ?ine ?es ?ca ?eu ?gl ?an ?ast WHERE {
  ?m wdt:P772 ?ine . FILTER(STRLEN(?ine) = 5 && STRSTARTS(?ine, "${trozo}"))
  OPTIONAL { ?m rdfs:label ?es  FILTER(lang(?es)="es") }
  OPTIONAL { ?m rdfs:label ?ca  FILTER(lang(?ca)="ca") }
  OPTIONAL { ?m rdfs:label ?eu  FILTER(lang(?eu)="eu") }
  OPTIONAL { ?m rdfs:label ?gl  FILTER(lang(?gl)="gl") }
  OPTIONAL { ?m rdfs:label ?an  FILTER(lang(?an)="an") }
  OPTIONAL { ?m rdfs:label ?ast FILTER(lang(?ast)="ast") }
}`;

/** Une los resultados de todos los trozos de una consulta. */
async function porTrozos(construir) {
  const filas = [];
  for (const trozo of TROZOS) {
    filas.push(...(await deWikidata(construir(trozo))));
    await esperar(500);
  }
  return filas;
}

// --- Normalizacion, la misma que en la app ---------------------------------------------------
// Tiene que coincidir con `sinTildes` y `normalizar` de src/utils/municipios.ts: aqui se usa para
// decidir que nombre alternativo NO hace falta guardar porque ya se encontraria con el oficial.

// prettier-ignore
const TILDES = {
  á: 'a', à: 'a', ä: 'a', â: 'a', é: 'e', è: 'e', ë: 'e', ê: 'e', í: 'i', ì: 'i', ï: 'i', î: 'i',
  ó: 'o', ò: 'o', ö: 'o', ô: 'o', ú: 'u', ù: 'u', ü: 'u', û: 'u', ñ: 'n', ç: 'c', ý: 'y',
};

const normalizar = (t) =>
  t
    .toLowerCase()
    .replace(/[áàäâéèëêíìïîóòöôúùüûñçý]/g, (c) => TILDES[c])
    .replace(/·/g, '')
    .replace(/['’`]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Lo que se puede escribir para encontrar un municipio por su nombre oficial. */
const objetivos = (nombre) =>
  [normalizar(nombre), ...nombre.split('/').map((p) => normalizar(p))].filter(Boolean);

// --- Montar el fichero -----------------------------------------------------------------------

console.log('Bajando la lista del INE...');
const { municipios, titulo } = await municipiosDelIne();
console.log(`  ${municipios.length} municipios. Cabecera: ${titulo}`);

console.log('Bajando los codigos de provincia y comunidad del INE...');
const { provincias, comunidades } = await provinciasDelIne();
const cuantasProvincias = Object.keys(provincias).length;
console.log(`  ${cuantasProvincias} provincias, ${Object.keys(comunidades).length} comunidades`);
if (cuantasProvincias !== 52) throw new Error('la tabla de provincias del INE no trae 52 filas');

console.log('Consultando coordenadas a Wikidata...');
const coordenadas = new Map();
for (const f of await porTrozos(consultaCoordenadas)) {
  const ine = f.ine.value.trim();
  const [lon, lat] = f.coord.value.replace('Point(', '').replace(')', '').split(' ').map(Number);
  // Redondeado porque en Wikidata hay censos escritos con el punto de los miles tomado por decimal
  // (Torrox venia con "22.523" habitantes). Solo sirve para ordenar empates, asi que no se intenta
  // adivinar el valor bueno: se deja un entero y se sigue.
  const pob = f.pob ? Math.max(0, Math.round(Number(f.pob.value))) : 0;
  const previo = coordenadas.get(ine);
  // Un municipio puede traer varios censos: se queda el mayor, que casi siempre es el mas reciente.
  if (!previo) coordenadas.set(ine, { lat, lon, pob });
  else if (pob > previo.pob) previo.pob = pob;
}
console.log(`  ${coordenadas.size} codigos con coordenadas`);

console.log('Consultando nombres alternativos a Wikidata...');
const alternativos = new Map();
for (const f of await porTrozos(consultaNombres)) {
  const ine = f.ine.value.trim();
  const nombres = ['es', 'ca', 'eu', 'gl', 'an', 'ast'].map((l) => f[l]?.value).filter(Boolean);
  alternativos.set(ine, [...new Set([...(alternativos.get(ine) ?? []), ...nombres])]);
}
console.log(`  ${alternativos.size} codigos con etiquetas`);

const lineas = [];
const sinCoordenadas = [];
for (const m of municipios) {
  const c = coordenadas.get(m.ine);
  if (!c) {
    sinCoordenadas.push(m);
    continue;
  }
  const propios = objetivos(m.nombre);
  // Solo se guarda el nombre alternativo que aporte algo: si ya se encontraria escribiendo el
  // oficial (porque es su prefijo o una de sus mitades), guardarlo seria peso a cambio de nada.
  const alias = (alternativos.get(m.ine) ?? [])
    .map((a) => a.trim())
    .filter((a) => {
      const n = normalizar(a);
      if (n.length < 2) return false;
      // Ya se encontraria escribiendo el nombre oficial: es igual, o el oficial empieza por el.
      if (propios.some((p) => p === n || p.startsWith(`${n} `))) return false;
      // Y al reves, es una etiqueta desambiguada de Wikidata, no un nombre: "Zarra, Valencia" hacia
      // que Zarra apareciese al buscar "Valencia". El nombre a secas ya encuentra el pueblo.
      if (propios.some((p) => n.startsWith(`${p} `))) return false;
      return true;
    });
  const campos = [
    m.ine,
    m.nombre,
    c.lat.toFixed(4),
    c.lon.toFixed(4),
    String(c.pob),
    ...new Set(alias),
  ];
  // El formato es texto separado por barras dentro de una plantilla de JavaScript: cualquiera de
  // estos caracteres en un nombre lo romperia sin avisar, asi que se para aqui y no en la app.
  if (campos.some((v) => /[|\n`$\\]/.test(v))) {
    throw new Error(`nombre con un caracter que rompe el formato: ${m.nombre}`);
  }
  lineas.push(campos.join('|'));
}
if (sinCoordenadas.length) {
  console.log(`  ¡ATENCION! ${sinCoordenadas.length} municipios sin coordenadas, se quedan fuera:`);
  for (const m of sinCoordenadas) console.log(`    ${m.ine} ${m.nombre}`);
}

const provinciasTs = Object.entries(provincias)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([cpro, { provincia, codauto }]) => `  '${cpro}': ['${provincia}', '${comunidades[codauto]}'],`,
  )
  .join('\n');

const fichero = `// GENERADO por herramientas/generar-municipios.mjs. No editar a mano.
//
// ${titulo}
// Nombres oficiales y codigos: INE (${URL_INE}).
// Coordenadas y nombres alternativos: Wikidata, CC0.
// Generado el ${new Date().toISOString().slice(0, 10)} con ${lineas.length} municipios.

/** Provincia y comunidad de cada codigo de provincia, que son los dos primeros digitos del INE. */
export const PROVINCIAS: Record<string, [provincia: string, comunidad: string]> = {
${provinciasTs}
};

/**
 * Un municipio por linea, con los campos separados por barra:
 *
 *   codigo INE | nombre oficial | latitud | longitud | habitantes | nombres alternativos...
 *
 * Es un texto y no una estructura, a proposito: pesa menos en el paquete, en los diff de git se lee
 * una linea por municipio, y no cuesta nada arrancar la app porque no se interpreta hasta la primera
 * busqueda. Los nombres alternativos NO se enseñan nunca (ver src/utils/municipios.ts).
 */
export const MUNICIPIOS = \`
${lineas.join('\n')}
\`;
`;

writeFileSync(SALIDA, fichero, 'utf8');
console.log(
  `\nEscrito src/data/municipios.ts con ${lineas.length} municipios (${(fichero.length / 1024).toFixed(0)} KB).`,
);
