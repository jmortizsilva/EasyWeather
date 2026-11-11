// Textos y opciones del aviso de lluvia. Lógica pura: la pantalla (screens/avisos/AvisoLluvia.tsx)
// solo los pinta. Los aprobó Jose el 2026-11-11 (docs/PROPUESTA-AVISO-LLUVIA.md).

import { AvisoLluviaAlert, IntensidadLluvia, RadioLluviaKm } from '../types';

export interface OpcionAjustable<T> {
  valor: T;
  /** Lo que se ve en pantalla. */
  visible: string;
  /** Lo que dice VoiceOver: sin abreviaturas. */
  hablado: string;
}

export const OPCIONES_RADIO: OpcionAjustable<RadioLluviaKm>[] = [10, 20, 35, 50].map((km) => ({
  valor: km as RadioLluviaKm,
  visible: `${km} km`,
  hablado: `${km} kilómetros`,
}));

export const OPCIONES_INTENSIDAD: OpcionAjustable<IntensidadLluvia>[] = [
  { valor: 'cualquiera', visible: 'Cualquier lluvia', hablado: 'Cualquier lluvia' },
  { valor: 'moderada', visible: 'Desde moderada', hablado: 'Desde moderada' },
  { valor: 'fuerte', visible: 'Solo fuerte', hablado: 'Solo fuerte' },
];

/**
 * Lo que dice un ajustable ahora y tras el próximo deslizamiento. Arriba sube (más distancia, más
 * intensidad), como cualquier ajustable de iOS. En los extremos se queda donde está.
 */
export function valoresAjustable<T>(opciones: OpcionAjustable<T>[], actual: T) {
  const i = Math.max(
    opciones.findIndex((o) => o.valor === actual),
    0,
  );
  const en = (j: number) => opciones[Math.min(Math.max(j, 0), opciones.length - 1)];
  return {
    indice: i,
    value: en(i).hablado,
    valueOnIncrement: en(i + 1).hablado,
    valueOnDecrement: en(i - 1).hablado,
    siguiente: en(i + 1).valor,
    anterior: en(i - 1).valor,
  };
}

/** El estado que se lee en la fila de la lista de Avisos, sin entrar. */
export function estadoAvisoLluvia(aviso: AvisoLluviaAlert): string {
  if (!aviso.enabled) return 'Desactivado';
  const intensidad = {
    cualquiera: 'cualquier lluvia',
    moderada: 'desde moderada',
    fuerte: 'solo fuerte',
  };
  return `Activado · ${aviso.radioKm} km, ${intensidad[aviso.intensidad]}`;
}

/** «23:00» a partir de minutos del día. */
export function horaDeMinutos(minutos: number): string {
  const h = Math.floor(minutos / 60) % 24;
  const m = minutos % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Lo que se manda al servidor; `null` si está desactivado. */
export function avisoLluviaParaServidor(aviso: AvisoLluviaAlert | undefined) {
  if (!aviso?.enabled) return null;
  return {
    radioKm: aviso.radioKm,
    intensidad: aviso.intensidad,
    segundoAviso: aviso.segundoAviso,
    noche: aviso.noche.activada ? { desde: aviso.noche.desde, hasta: aviso.noche.hasta } : null,
  };
}
