// Paletas de la app. Un solo sitio donde vive el color: las pantallas piden tokens por su
// SIGNIFICADO (fondo, tarjeta, textoTenue...), nunca un hex suelto. Asi el modo claro se resuelve
// cambiando de paleta, sin tocar ni una pantalla.

export type NombreTema = 'claro' | 'oscuro';

export interface Paleta {
  /** Fondo de pantalla. */
  fondo: string;
  /** Fondo de tarjeta o agrupacion sobre el fondo. */
  tarjeta: string;
  /** Fila seleccionada dentro de una tarjeta. */
  tarjetaSeleccionada: string;
  /** Separadores y bordes finos dentro de tarjetas. */
  borde: string;
  /** Borde de los contenedores de navegacion (barra de pestanas). */
  bordeNavegacion: string;

  /** Texto principal: titulos de pantalla y valores destacados. */
  texto: string;
  /** Maximo contraste: temperatura grande y texto sobre relleno de color. */
  textoFuerte: string;
  /** Titulo de fila dentro de una tarjeta. */
  textoFila: string;
  /** Cabecera de seccion. */
  textoSeccion: string;
  /** Etiquetas y notas secundarias. */
  textoTenue: string;
  /** Datos de apoyo de una fila (metadatos). */
  textoMeta: string;

  /** Color de marca: enlaces, bordes de realce, pestana activa. */
  acento: string;
  /** Variante para indicadores de carga. */
  acentoSuave: string;
  /** Pestana no seleccionada. */
  tabInactivo: string;

  /** Relleno de boton principal. */
  primario: string;
  /** Texto sobre el relleno principal. */
  textoPrimario: string;

  /** Fondo de campo de texto y de pastillas de datos. */
  campo: string;
  /** Texto dentro de un campo o pastilla. */
  textoCampo: string;
  /** Marcador de arrastre del modal. */
  agarre: string;

  /** Accion destructiva (quitar). */
  peligro: string;
  textoPeligro: string;

  /** Aviso de exito / confirmacion. */
  exitoFondo: string;
  exitoBorde: string;
  exitoTexto: string;
}

// Paleta oscura: la que la app ha tenido siempre, conservada tal cual para no cambiar de aspecto
// a quien ya la usa asi.
export const OSCURO: Paleta = {
  fondo: '#0d1a2b',
  tarjeta: '#132740',
  tarjetaSeleccionada: '#1a3a5f',
  borde: '#2a4367',
  bordeNavegacion: '#244061',

  texto: '#f4f8ff',
  textoFuerte: '#ffffff',
  textoFila: '#f0f5ff',
  textoSeccion: '#eaf3ff',
  textoTenue: '#b8c6dc',
  textoMeta: '#c2d0e6',

  acento: '#7cbcff',
  acentoSuave: '#9ed3ff',
  tabInactivo: '#a9bcd6',

  primario: '#1b5ea9',
  textoPrimario: '#ffffff',

  campo: '#0e2238',
  textoCampo: '#dbe8ff',
  agarre: '#3a5578',

  peligro: '#7a2a38',
  textoPeligro: '#ffe8ed',

  exitoFondo: '#1c4a2e',
  exitoBorde: '#5fd08a',
  exitoTexto: '#eafff1',
};

// Paleta clara. Los tonos se eligieron comprobando el contraste con su fondo (minimo 4,5:1 para
// texto normal, segun WCAG AA): el texto tenue sobre el fondo da 6,3:1 y el acento sobre blanco
// 6,7:1. Importa mas de lo normal porque en este proyecto lo visual no se detecta al usarlo.
export const CLARO: Paleta = {
  fondo: '#f2f5fa',
  tarjeta: '#ffffff',
  tarjetaSeleccionada: '#dbe8f8',
  borde: '#d3dce8',
  bordeNavegacion: '#c9d4e2',

  texto: '#0f1c2e',
  textoFuerte: '#06101d',
  textoFila: '#10203a',
  textoSeccion: '#10203a',
  textoTenue: '#4b5b70',
  textoMeta: '#465768',

  acento: '#0a5cab',
  acentoSuave: '#0a5cab',
  tabInactivo: '#5b6b80',

  primario: '#0a5cab',
  textoPrimario: '#ffffff',

  campo: '#ffffff',
  textoCampo: '#0f1c2e',
  agarre: '#b9c5d6',

  peligro: '#a4232b',
  textoPeligro: '#ffffff',

  exitoFondo: '#e3f5e9',
  exitoBorde: '#1e7a44',
  exitoTexto: '#0d3d22',
};

export const PALETAS: Record<NombreTema, Paleta> = {
  claro: CLARO,
  oscuro: OSCURO,
};
