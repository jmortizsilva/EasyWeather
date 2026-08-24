import { CURRENT_LOCATION_ID, Place } from '../types';
import { TempGuardada, textoLugar } from './tempActual';

// Textos del control de páginas de "Hoy". Vive aparte del componente y sin un solo import de React
// Native a propósito: así se prueba con Jest sin dispositivo ni mocks (regla del proyecto: lo que
// "decide" va separado de la fontanería que toca módulos nativos).

export const CONTROL_PAGINAS_HINT =
  'Desliza arriba o abajo para cambiar de lugar, o usa tres dedos a izquierda y derecha';

export const ETIQUETA_CONTROL = 'Selector de ubicación';

export interface ValoresControl {
  /** Etiqueta estable del control; en braille es un prefijo permanente delante de cada valor. */
  label: string;
  /** Valor actual (ciudad, grados y posición), lo que cambia al pasar de página. */
  value: string;
  /** Valor tras el próximo gesto, para que la vista nativa refresque la braille de forma síncrona. */
  valueOnIncrement: string;
  valueOnDecrement: string;
}

/**
 * Los valores vecinos se calculan por adelantado (igual que en las filas de día) para que la línea
 * braille se refresque dentro del gesto; ver modules/adjustable-button.
 *
 * El sentido de los gestos es el de la app Tiempo de iOS, que es contra la que se compara quien usa
 * esto: flick ARRIBA lleva al lugar siguiente (2, 3, 4...). Ojo, es el contrario al de las filas de
 * "Próximos días", y no es un descuido: allí el ajustable recorre los datos de un día, como se lee
 * una lista hacia abajo, mientras que aquí se pasa de página. iOS también los distingue.
 */
export function valoresControl(
  lugares: Place[],
  indice: number,
  currentByPlace: Record<string, TempGuardada>,
  ahora: number,
): ValoresControl {
  // Se añade la posición ("2 de 3") porque un control de páginas sin ella deja sin saber cuántos
  // lugares hay ni dónde estás; es lo que anuncia el equivalente nativo de iOS.
  const conPosicion = (i: number) => {
    const j = Math.min(Math.max(i, 0), lugares.length - 1);
    const p = lugares[j];
    const hablado = textoLugar(p.name, currentByPlace[p.id], ahora).hablado;
    // La ubicación actual se dice como tal, y no solo por su nombre geocodificado: "Salou" a secas
    // no distingue el sitio donde estás de un lugar guardado que se llame igual, y esa página es la
    // única que cambia sola cuando te mueves.
    const conNombre = p.id === CURRENT_LOCATION_ID ? `Mi ubicación, ${hablado}` : hablado;
    return `${conNombre}. ${j + 1} de ${lugares.length}`;
  };
  return {
    label: ETIQUETA_CONTROL,
    value: conPosicion(indice),
    valueOnIncrement: conPosicion(indice + 1), // flick arriba = siguiente
    valueOnDecrement: conPosicion(indice - 1), // flick abajo = anterior
  };
}
