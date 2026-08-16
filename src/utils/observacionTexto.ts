import { CurrentObservation } from '../types';

// Texto de la observacion MEDIDA. Puro: se decide aqui y se prueba con Jest, sin dispositivo.
//
// De que va todo esto: una medicion tiene que poder contestar sola a "cuanto", "quien lo midio",
// "donde" y "cuando". Si falta cualquiera de las cuatro, deja de ser una medicion y pasa a ser un
// numero suelto, que es justo lo que la app no quiere enseñar.

/** Numero con coma decimal, que es como se escribe en español. */
function numeroEs(valor: number): string {
  return String(Math.round(valor * 10) / 10).replace('.', ',');
}

/**
 * AEMET fecha en ISO pero con el desfase pegado y sin dos puntos ("2026-08-16T11:00:00+0000").
 * Esa forma es ISO 8601 valido pero NO es la que el estandar de JavaScript obliga a interpretar, y
 * hay motores (Hermes, el de React Native) mas estrictos que Node. Se normaliza antes de parsear
 * para no depender de la benevolencia del motor.
 */
export function parsearMomento(iso: string): Date | undefined {
  if (!iso) {
    return undefined;
  }
  const normalizado = iso.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  const fecha = new Date(normalizado);
  return Number.isNaN(fecha.getTime()) ? undefined : fecha;
}

/** La hora de la medicion, en la hora local del telefono (viene en UTC). */
export function horaMedicion(iso: string): string | undefined {
  const fecha = parsearMomento(iso);
  if (!fecha) {
    return undefined;
  }
  return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export interface ObservacionTexto {
  /** Primera linea: el dato y cuando se midio. */
  principal: string;
  /** Segunda linea: quien lo midio y a que distancia. */
  estacion: string;
  /**
   * Lo que lee VoiceOver, en una sola tirada. Dice "grados" y "kilometros" con todas sus letras:
   * el simbolo º se lee como ordinal ("veintiocho coma cinco grado masculino") y "km" no siempre
   * se expande. Lleva la procedencia dentro para que no haya que deducirla de la pantalla.
   */
  spoken: string;
}

/**
 * Texto de una observacion, o `undefined` si no hay nada que contar. Sin temperatura no se enseña:
 * es el dato del que va la linea, y una ficha de estacion sin medida no le dice nada a nadie.
 */
export function describirObservacion(
  observacion: CurrentObservation | undefined,
): ObservacionTexto | undefined {
  if (observacion?.temperature === undefined) {
    return undefined;
  }

  const grados = numeroEs(observacion.temperature);
  const hora = horaMedicion(observacion.observedAt);
  const { name, distanceKm } = observacion.station;
  const distancia = numeroEs(distanceKm);

  // Sin hora legible se omite en vez de inventarla: mejor una medicion sin fechar (raro) que una
  // fechada mal. El resto del texto sigue valiendo.
  const principal = hora ? `Medido: ${grados}º a las ${hora}` : `Medido: ${grados}º`;
  const estacion = `Estación ${name}, a ${distancia} km · AEMET`;

  const cuando = hora ? ` Medida a las ${hora}.` : '';
  const spoken =
    `Temperatura medida: ${grados} grados. Observación de AEMET. ` +
    `Estación ${name}, a ${distancia} kilómetros.${cuando}`;

  return { principal, estacion, spoken };
}
