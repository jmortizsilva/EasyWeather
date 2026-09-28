import { distanciaMetros } from './distancia';
import { horaMedicion } from './observacionTexto';
import { numeroEs } from './text';

// Textos de la pantalla para ELEGIR estacion de AEMET. Puro: se decide aqui y se prueba con Jest.
//
// De que va: el servidor elige por cercania, y no siempre acierta. La estacion mas cerca puede
// estar en otro valle o en otra vertiente, y quien vive alli lo sabe mejor que la formula. Aqui se
// redacta lo que hace falta para que esa eleccion sea informada: cuanto, a que altura, de cuando, y
// por que la app no la habria cogido sola.

/** Por que la eleccion automatica descartaria una estacion. `null` = si la cogeria. */
export type MotivoDescarte = 'lejos' | 'desnivel' | 'vieja';

/** Una estacion entre las que se puede elegir, tal y como la manda el servidor. */
export interface EstacionCandidata {
  id: string;
  nombre: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  distanceKm: number;
  /** Altitud de la estacion menos la del punto. Ausente si no se sabe alguna de las dos. */
  desnivelM?: number;
  observedAt: string;
  temperature?: number;
  motivoDescarte: MotivoDescarte | null;
}

/** Lo que se guarda en el telefono de la eleccion del usuario. */
export interface EstacionElegida {
  id: string;
  /** Se guarda para poder decir "tu estacion X no publica" antes de que conteste el servidor. */
  nombre: string;
  /**
   * Donde estabas al elegirla. Solo sirve para "Mi ubicacion", que es el unico lugar que se mueve
   * bajo el mismo identificador; en uno guardado nunca cambia. Puede faltar: las elecciones hechas
   * antes de que esto existiera siguen valiendo.
   */
  lat?: number;
  lon?: number;
}

// A partir de aqui se considera que ya no estas donde elegiste la estacion. Son los mismos 25 km
// que el servidor admite como maximo para que una estacion represente un punto: mas alla de eso, ni
// la app la habria cogido sola ni tiene sentido llamarla "la mia".
export const LEJOS_DE_DONDE_ELEGISTE_KM = 25;

/**
 * Si la eleccion del usuario se aplica estando en este punto.
 *
 * Existe para poder elegir estacion tambien en "Mi ubicacion", que TE SIGUE. Sin esto, quien fijara
 * la estacion de su pueblo y se fuera a 350 km veria en pantalla el nombre de su sitio con la
 * medicion de la estacion de su pueblo, que es exactamente el fallo que reporto una probadora en
 * septiembre viniendo de Valencia.
 *
 * La eleccion NO se borra al alejarse, solo se queda dormida: mientras estas lejos manda la
 * automatica, y al volver tu estacion vuelve sola. Borrarla castigaria por haber viajado.
 */
export function eleccionAplicable(
  elegida: EstacionElegida | undefined,
  punto: { lat: number; lon: number },
): boolean {
  if (!elegida) {
    return false;
  }
  // Sin punto guardado se aplica siempre: o es una eleccion vieja, o es de un lugar fijo, que no se
  // mueve. En los dos casos, dudar seria quitarle al usuario algo que si eligio.
  if (elegida.lat === undefined || elegida.lon === undefined) {
    return true;
  }
  const metros = distanciaMetros({ lat: elegida.lat, lon: elegida.lon }, punto);
  return metros <= LEJOS_DE_DONDE_ELEGISTE_KM * 1000;
}

/** Por que el servidor no puede servir la estacion elegida. */
export type MotivoSinDato = 'desconocida' | 'sin-dato' | 'vieja';

// Un desnivel de cuatro metros no le dice nada a nadie y ensucia una linea que se lee en voz alta.
// A partir de aqui si importa: el aire se enfria unos 6,5 grados por cada 1.000 m.
const DESNIVEL_QUE_IMPORTA_M = 10;

const MOTIVO_VISIBLE: Record<MotivoDescarte, string> = {
  lejos: 'más lejos de lo que la app coge sola',
  desnivel: 'a otra altitud que tu sitio',
  vieja: 'su último dato es viejo',
};

function textoDesnivel(desnivelM: number | undefined): string | undefined {
  if (desnivelM === undefined || Math.abs(desnivelM) < DESNIVEL_QUE_IMPORTA_M) {
    return undefined;
  }
  const metros = Math.abs(Math.round(desnivelM));
  return `${numeroEs(metros)} m más ${desnivelM > 0 ? 'alta' : 'baja'} que tu sitio`;
}

export interface FilaEstacion {
  titulo: string;
  /** La segunda linea, la que se ve. */
  detalle: string;
  /** Lo que lee VoiceOver de la fila entera, en una sola tirada. */
  spoken: string;
}

/**
 * Una fila de la lista de estaciones.
 *
 * Las que la politica automatica descartaria se enseñan IGUAL, diciendo por que: es el sentido de
 * poder elegir —alguien puede preferir la de 30 km que esta en su mismo valle—, pero la eleccion
 * tiene que ser informada y no una lista de nombres a secas.
 */
export function filaEstacion(estacion: EstacionCandidata): FilaEstacion {
  const distancia = `a ${numeroEs(estacion.distanceKm)} km`;
  const desnivel = textoDesnivel(estacion.desnivelM);
  const hora = horaMedicion(estacion.observedAt);
  const motivo = estacion.motivoDescarte ? MOTIVO_VISIBLE[estacion.motivoDescarte] : undefined;

  const detalle = [distancia, desnivel, hora ? `dato de las ${hora}` : undefined, motivo]
    .filter(Boolean)
    .join(' · ');

  // Con todas sus letras: "km" no siempre se expande y el punto medio se lee como signo.
  const habladoDistancia = `a ${numeroEs(estacion.distanceKm)} kilómetros`;
  const habladoDesnivel = desnivel?.replace(' m ', ' metros ');
  const spoken = [
    `${estacion.nombre},`,
    habladoDistancia,
    habladoDesnivel,
    hora ? `último dato a las ${hora}` : undefined,
    motivo,
  ]
    .filter(Boolean)
    .join('. ');

  return { titulo: estacion.nombre, detalle, spoken: `${spoken}.` };
}

/** La primera fila de la lista: dejar que elija la app. */
export function filaAutomatica(automatica: EstacionCandidata | undefined): FilaEstacion {
  const detalle = automatica
    ? `Ahora sería ${automatica.nombre}, a ${numeroEs(automatica.distanceKm)} km`
    : 'Ahora mismo no hay ninguna que represente este sitio';
  return {
    titulo: 'Automática',
    detalle,
    spoken: `Automática. ${
      automatica
        ? `La app coge la más cercana que valga. Ahora sería ${automatica.nombre}, a ${numeroEs(automatica.distanceKm)} kilómetros.`
        : 'La app coge la más cercana que valga. Ahora mismo no hay ninguna que represente este sitio.'
    }`,
  };
}

export interface AvisoSinDato {
  visible: string;
  spoken: string;
}

/**
 * Lo que se enseña en la tarjeta cuando la estacion ELEGIDA no puede contestar.
 *
 * No se cae en la automatica: poner "Estacion X" encima de un numero de Y seria mentir sobre quien
 * midio, que es lo unico que esta app no se permite con una medicion. Asi que se dice que calla, se
 * dice desde cuando, y quien quiera cambia de estacion.
 */
export function avisoSinDato(
  motivo: MotivoSinDato,
  nombre: string,
  observedAt?: string,
): AvisoSinDato {
  if (motivo === 'desconocida') {
    const texto = `${nombre} ya no está en la red de AEMET`;
    return {
      visible: texto,
      spoken: `Tu estación elegida, ${nombre}, ya no está en la red de AEMET.`,
    };
  }
  if (motivo === 'sin-dato') {
    const texto = `${nombre} está emitiendo, pero sin temperatura`;
    return {
      visible: texto,
      spoken: `Tu estación elegida, ${nombre}, está emitiendo, pero sin temperatura.`,
    };
  }
  const hora = observedAt ? horaMedicion(observedAt) : undefined;
  const texto = hora
    ? `${nombre} no publica desde las ${hora}`
    : `${nombre} no publica ahora mismo`;
  return {
    visible: texto,
    spoken: hora
      ? `Tu estación elegida, ${nombre}, no publica desde las ${hora}.`
      : `Tu estación elegida, ${nombre}, no publica ahora mismo.`,
  };
}

/**
 * Si hay que ofrecer elegir estacion cuando NO hay medicion que enseñar.
 *
 * Es el caso en el que mas falta hace —no hay dato porque ninguna estacion pasa el filtro, y a lo
 * mejor el usuario quiere una mas lejana— y a la vez el que hay que ofrecer con mas cuidado: la
 * linea que lo ofrece es una parada nueva de VoiceOver, y sin filtro la tendria TODO el que esta
 * fuera de España, que es justo quien nunca va a tener estacion.
 *
 * De ahi el pais: AEMET solo mide en España, asi que fuera no se pinta nada y no se pregunta nada.
 * Sin codigo de pais tampoco se ofrece (lugares guardados antes de que existiera ese campo): ante
 * la duda, mejor no dar una parada de mas que darla donde no sirve.
 */
export function ofrecerEstacionSinMedicion(situacion: {
  /** Hay medicion en pantalla: entonces se entra por ella, no por aqui. */
  hayMedicion: boolean;
  /** Ya se esta contando que la estacion elegida calla: ese aviso ya es el boton. */
  hayAvisoDeEstacion: boolean;
  /** La pantalla permite elegir en este lugar (no es una consulta de paso). */
  sePuedeElegir: boolean;
  countryCode?: string;
}): boolean {
  if (situacion.hayMedicion || situacion.hayAvisoDeEstacion || !situacion.sePuedeElegir) {
    return false;
  }
  return situacion.countryCode === 'ES';
}
