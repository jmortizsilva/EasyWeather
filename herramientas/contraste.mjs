// Contraste WCAG de las paletas de la app, CALCULADO.
//
//   node herramientas/contraste.mjs
//
// La lista de revision de comun pide el contraste "calculado y no mirado", y mirarlo no vale:
// un amarillo que parece legible se queda en 2,2:1 con texto blanco. Esto recorre los pares que
// de verdad se dan en pantalla y dice cuales no llegan.
//
// Minimos de WCAG AA: 4,5:1 para texto normal, 3:1 para texto grande y para lo que no es texto
// (bordes que delimitan un control, estados, iconos que informan).
//
// OJO con los que fallan y no son fallo: una tarjeta sobre el fondo o un separador entre filas
// son decoracion mientras la informacion llegue por otro lado (el espaciado, el texto). Lo que
// SI es fallo es que el estado de un control dependa de un color flojo; de ahi salio
// MarcaElegida.

import { readFileSync } from 'node:fs';

const fuente = readFileSync(process.argv[2] ?? 'src/theme/colores.ts', 'utf8');

function paleta(nombre) {
  const i = fuente.indexOf('export const ' + nombre + ': Paleta = {');
  if (i === -1) throw new Error('no encuentro la paleta ' + nombre);
  const bloque = fuente.slice(i, fuente.indexOf('\n};', i) + 3);

  // Los colores de primer nivel van SOLO hasta donde empieza `aviso:`. Sin este corte, los
  // colores anidados de los avisos pisan a `texto`, `fondo` y `borde`, y salen numeros de
  // otro par que parecen buenos. Paso en la primera version de este script.
  const planos = bloque.slice(0, bloque.indexOf('aviso: {'));
  const p = {};
  for (const m of planos.matchAll(/(\w+):\s*'(#[0-9a-fA-F]{6})'/g)) p[m[1]] = m[2];

  const avisos = {};
  const zona = bloque.slice(bloque.indexOf('aviso: {'));
  for (const nivel of ['amarillo', 'naranja', 'rojo']) {
    const m = zona.match(new RegExp(nivel + ':\\s*\\{([^}]*)\\}'));
    if (!m) continue;
    const o = {};
    for (const c of m[1].matchAll(/(\w+):\s*'(#[0-9a-fA-F]{6})'/g)) o[c[1]] = c[2];
    avisos[nivel] = o;
  }
  return { p, avisos };
}

const luminancia = (hex) => {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

const ratio = (a, b) => {
  const [alta, baja] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (alta + 0.05) / (baja + 0.05);
};

function revisar(nombre) {
  const { p, avisos } = paleta(nombre);

  const pares = [
    ['TEXTO (min 4,5:1)', null, null, 0],
    ['texto / fondo', p.texto, p.fondo, 4.5],
    ['texto / tarjeta', p.texto, p.tarjeta, 4.5],
    ['textoFuerte / tarjeta', p.textoFuerte, p.tarjeta, 4.5],
    ['textoFila / tarjeta', p.textoFila, p.tarjeta, 4.5],
    ['textoSeccion / fondo', p.textoSeccion, p.fondo, 4.5],
    ['textoTenue / fondo', p.textoTenue, p.fondo, 4.5],
    ['textoTenue / tarjeta', p.textoTenue, p.tarjeta, 4.5],
    ['textoMeta / tarjeta', p.textoMeta, p.tarjeta, 4.5],
    ['acento / fondo', p.acento, p.fondo, 4.5],
    ['acento / tarjeta', p.acento, p.tarjeta, 4.5],
    ['tabInactivo / fondo', p.tabInactivo, p.fondo, 4.5],
    ['textoPrimario / primario', p.textoPrimario, p.primario, 4.5],
    ['textoCampo / campo', p.textoCampo, p.campo, 4.5],
    ['textoPeligro / peligro', p.textoPeligro, p.peligro, 4.5],
    ['exitoTexto / exitoFondo', p.exitoTexto, p.exitoFondo, 4.5],
    ['texto / tarjetaSelec.', p.texto, p.tarjetaSeleccionada, 4.5],
    ['textoTenue / tarjetaSelec.', p.textoTenue, p.tarjetaSeleccionada, 4.5],
    ['NO TEXTO (min 3:1)', null, null, 0],
    ['borde / tarjeta', p.borde, p.tarjeta, 3],
    ['borde / fondo', p.borde, p.fondo, 3],
    ['bordeNavegacion / fondo', p.bordeNavegacion, p.fondo, 3],
    ['agarre / tarjeta', p.agarre, p.tarjeta, 3],
    ['exitoBorde / exitoFondo', p.exitoBorde, p.exitoFondo, 3],
    ['marca elegida / tarjetaSel.', p.acento, p.tarjetaSeleccionada, 3],
    ['tarjeta / fondo', p.tarjeta, p.fondo, 3],
    ['tarjetaSelec. / tarjeta', p.tarjetaSeleccionada, p.tarjeta, 3],
  ];

  for (const nivel of ['amarillo', 'naranja', 'rojo']) {
    const a = avisos[nivel];
    if (!a) {
      console.log('(no se pudo leer el aviso ' + nivel + ')');
      continue;
    }
    pares.push(['aviso ' + nivel + ': texto/fondo', a.texto, a.fondo, 4.5]);
    pares.push(['aviso ' + nivel + ': borde/fondo', a.borde, a.fondo, 3]);
  }

  console.log('\n===== ' + nombre + ' =====');
  const fallos = [];
  for (const [etiqueta, a, b, minimo] of pares) {
    if (!a) {
      console.log('\n-- ' + etiqueta);
      continue;
    }
    const r = ratio(a, b);
    const ok = r >= minimo;
    if (!ok) fallos.push(etiqueta + ' ' + r.toFixed(2) + ':1');
    console.log(
      (ok ? ' ok  ' : 'FALLA') +
        '  ' +
        etiqueta.padEnd(27) +
        r.toFixed(2).padStart(6) +
        ':1   ' +
        a +
        ' sobre ' +
        b,
    );
  }
  console.log('\n-> ' + fallos.length + ' por debajo del minimo: ' + (fallos.join(' | ') || '-'));
}

revisar('CLARO');
revisar('OSCURO');
