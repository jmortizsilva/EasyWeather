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

  /**
   * Colores de los avisos OFICIALES de AEMET, uno por nivel. Son los de la escala Meteoalerta, no
   * una eleccion estetica: quien ya conoce los avisos espera ese amarillo, ese naranja y ese rojo.
   *
   * El color NUNCA es lo unico que dice el nivel: el titulo lo escribe con letras ("Aviso naranja
   * por lluvias"), porque si no, alguien que no distinga esos tonos —o que use VoiceOver— no
   * sabria de que se le esta avisando.
   */
  aviso: Record<NivelDeAviso, ColoresAviso>;
}

export type NivelDeAviso = 'amarillo' | 'naranja' | 'rojo';

export interface ColoresAviso {
  fondo: string;
  borde: string;
  texto: string;
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

  // Contraste del texto sobre su fondo, medido: 10,1:1 el amarillo, 9,7:1 el naranja y 10,8:1 el
  // rojo. Los bordes van sobre 5:1, muy por encima del 3:1 que pide WCAG para lo que no es texto.
  aviso: {
    amarillo: { fondo: '#4a3c10', borde: '#e6c34d', texto: '#fff7e0' },
    naranja: { fondo: '#5a3512', borde: '#ff9f45', texto: '#fff1e2' },
    rojo: { fondo: '#5c1f22', borde: '#ff7a7a', texto: '#ffe9e9' },
  },
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

  // Medido igual que en la paleta oscura: 10,0:1 el amarillo, 11,0:1 el naranja y 11,2:1 el rojo.
  aviso: {
    amarillo: { fondo: '#fdf3d0', borde: '#8a6d00', texto: '#4a3a00' },
    naranja: { fondo: '#ffe8d4', borde: '#8f4a00', texto: '#4d2800' },
    rojo: { fondo: '#fde3e3', borde: '#a4232b', texto: '#5c1114' },
  },
};

export const PALETAS: Record<NombreTema, Paleta> = {
  claro: CLARO,
  oscuro: OSCURO,
};
