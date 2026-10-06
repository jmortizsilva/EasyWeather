// Comprueba de un tiron que el puente de desarrollo funciona de verdad contra el movil.
//
//   node herramientas/comprobar-puente.mjs
//
// Hace falta: el servidor levantado, `npm start` corriendo y la app abierta en el iPhone, en primer
// plano. Esto solo habla con el servidor por HTTP; quien navega y abre cosas es la app.
//
// Por que existe: el puente tiene muchas piezas (conexion, servicios, navegacion inyectada,
// acciones registradas por cada pantalla) y cada una falla de una forma distinta. Repasarlas a mano
// con curl son quince ordenes y es facil saltarse justo la que estaba rota. Esto las recorre en
// orden, dice que se esperaba y que llego, y separa lo que esta MAL de lo que esta PENDIENTE.
//
// Lo que esto NO puede comprobar: que lo que se abrio se vea bien. Eso son las capturas, y las
// capturas necesitan una build con react-native-view-shot (ver docs/PENDIENTE.md). Mientras no la
// haya, el script avisa de los pasos en los que hay que mirar el movil.

const PUERTO = 8790;
const BASE = `http://127.0.0.1:${PUERTO}`;

// Pausa entre pasos visibles, para que quien tiene el movil vea lo que pasa en vez de un parpadeo.
const MS_PARA_MIRAR = 2500;

const PESTANAS = ['hoy', 'lugares', 'avisos'];

// Lo que cada pantalla con capas tiene que haber registrado. Si falta una, la tanda de capturas no
// podria llegar a ese estado, y es justo el fallo que no da ningun error por si solo.
const ACCIONES_ESPERADAS = [
  'abrirBusqueda',
  'cerrarBusqueda',
  'abrirTemperatura',
  'abrirResumenes',
  'abrirOficiales',
  'cerrarSeccion',
];

let mal = 0;
let pendiente = 0;

function bien(texto) {
  console.log(`  ok        ${texto}`);
}
function fallo(texto) {
  mal += 1;
  console.log(`  MAL       ${texto}`);
}
function aplazado(texto) {
  pendiente += 1;
  console.log(`  pendiente ${texto}`);
}
function mira(texto) {
  console.log(`  >> mira el movil: ${texto}`);
}

const esperar = (ms) => new Promise((listo) => setTimeout(listo, ms));

async function estado() {
  const respuesta = await fetch(`${BASE}/estado`);
  return respuesta.json();
}

/** Pide un servicio. Devuelve el sobre tal cual: {ok, datos} o {ok, error}. */
async function pedir(servicio, parametros) {
  const respuesta = await fetch(`${BASE}/pedir`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ servicio, parametros }),
  });
  return respuesta.json();
}

async function main() {
  console.log('\n1. Hay alguien al otro lado');
  let quien;
  try {
    quien = await estado();
  } catch {
    fallo(`no contesta ${BASE}. Falta arrancar el servidor:`);
    console.log('            node ../../comun/herramientas/puente/servidor/servidor.mjs');
    return;
  }
  if (!quien.movilConectado) {
    fallo('el servidor esta, pero no hay movil conectado.');
    console.log('            Arranca `npm start`, abre la app y dejala en primer plano.');
    console.log('            iOS pide permiso de red local la primera vez: hay que aceptarlo.');
    return;
  }
  bien(
    `conectado: ${quien.identidad?.app} ${quien.identidad?.version} (${quien.identidad?.plataforma})`,
  );
  console.log(`            lo que llegue cae en ${quien.carpetaRecibido}`);

  console.log('\n2. Navegar por las tres pestanas');
  for (const pestana of PESTANAS) {
    const r = await pedir('navegar', { ruta: pestana });
    if (r.ok && r.datos?.pestana === pestana) {
      bien(`navegar a "${pestana}"`);
    } else {
      fallo(`navegar a "${pestana}": ${r.error ?? JSON.stringify(r.datos)}`);
    }
    mira(`deberia estar delante la pestana "${pestana}"`);
    await esperar(MS_PARA_MIRAR);
  }

  // Con "/hoy" tambien, porque tanda.mjs escribe rutas y asi vale sin tocarlo.
  const conBarra = await pedir('navegar', { ruta: '/hoy' });
  if (conBarra.ok) {
    bien('navegar acepta tambien "/hoy", como escribe tanda.mjs');
  } else {
    fallo(`navegar con barra delante: ${conBarra.error}`);
  }

  console.log('\n3. Las acciones que registran las pantallas');
  const acciones = await pedir('acciones');
  if (!acciones.ok) {
    fallo(`el servicio acciones: ${acciones.error}`);
  } else {
    const hay = acciones.datos ?? [];
    console.log(`            llegan ${hay.length}: ${hay.join(', ') || 'ninguna'}`);
    for (const esperada of ACCIONES_ESPERADAS) {
      if (hay.includes(esperada)) {
        bien(esperada);
      } else {
        fallo(`falta la accion "${esperada}"`);
      }
    }
    // El README de comun dice que `acciones` devuelve solo las de la pantalla de delante. Aqui las
    // pestanas son nativas y puede que las tres pantallas esten montadas a la vez, con lo que
    // llegarian todas. No es un fallo: es una diferencia que hay que MEDIR antes de corregir nada
    // en comun.
    console.log(
      hay.length > 2
        ? '            (llegan de varias pantallas a la vez: las pestanas nativas no desmontan)'
        : '            (llegan solo las de la pantalla de delante)',
    );
  }

  console.log('\n4. Abrir y cerrar lo que no es una pestana');
  for (const [accion, queSeVe] of [
    ['abrirBusqueda', 'la hoja de busqueda, encima de Mis lugares'],
    ['cerrarBusqueda', 'Mis lugares otra vez, sin la hoja'],
    ['abrirTemperatura', 'la hoja del aviso de temperatura'],
    ['cerrarSeccion', 'Avisos otra vez, sin la hoja'],
  ]) {
    const r = await pedir('accion', { nombre: accion });
    if (r.ok) {
      bien(`accion ${accion}`);
    } else {
      fallo(`accion ${accion}: ${r.error}`);
    }
    mira(queSeVe);
    await esperar(MS_PARA_MIRAR);
  }

  console.log('\n5. Lo que tiene que contestar diciendolo, no callandose');
  const vuelta = await pedir('volver');
  if (vuelta.ok && vuelta.datos?.vuelto === false && vuelta.datos?.aviso) {
    bien('volver explica que esta app no tiene pila');
  } else {
    fallo(`volver: ${JSON.stringify(vuelta)}`);
  }

  const inventada = await pedir('navegar', { ruta: 'ajustes' });
  if (!inventada.ok && inventada.error?.includes('hoy')) {
    bien('una pestana que no existe contesta con las que hay');
  } else {
    fallo(`navegar a una pestana inventada: ${JSON.stringify(inventada)}`);
  }

  const noExiste = await pedir('loQueSea');
  if (!noExiste.ok && noExiste.error?.includes('navegar')) {
    bien('un servicio que no existe contesta con la lista');
  } else {
    fallo(`servicio inventado: ${JSON.stringify(noExiste)}`);
  }

  console.log('\n6. Lo que todavia no puede funcionar');
  const rastro = await pedir('rastro');
  if (rastro.ok && Array.isArray(rastro.datos) && rastro.datos.length === 0) {
    aplazado('el rastro llega vacio, y es lo esperado: nadie llama a anotarSuceso todavia');
  } else if (rastro.ok) {
    bien(`el rastro trae ${rastro.datos.length} sucesos`);
  } else {
    fallo(`el servicio rastro: ${rastro.error}`);
  }

  const captura = await fetch(`${BASE}/captura?nombre=comprobacion`).then((r) => r.json());
  if (captura.ruta) {
    bien(`captura guardada en ${captura.ruta}`);
  } else {
    aplazado(`captura: ${captura.error}`);
    console.log('            Esperado hasta que una build lleve react-native-view-shot.');
  }

  console.log(`\nResumen: ${mal} mal, ${pendiente} pendiente de build.`);
  if (mal > 0) {
    console.log('Algo esta roto de verdad. Los "MAL" de arriba dicen que.');
  }
}

await main();
