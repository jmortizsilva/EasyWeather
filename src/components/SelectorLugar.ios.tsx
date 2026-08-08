import AdjustableButton from '../../modules/adjustable-button';
import { Place } from '../types';
import { TempGuardada, textoLugar } from '../utils/tempActual';
import { SELECTOR_HINT, SelectorLugarContent, valoresSelector } from './SelectorLugarContent';

interface Props {
  /** Lugares que recorre el ajustable (ubicación actual primero, luego guardados). */
  seleccionables: Place[];
  /** Índice resaltado en el ajustable. */
  indiceSeleccionado: number;
  currentByPlace: Record<string, TempGuardada>;
  /** Momento actual (epoch ms) para la antigüedad; lo inyecta la pantalla. */
  ahora: number;
  /** Flick: solo cambia el índice resaltado, sin recargar Hoy. */
  onCambiar: (indice: number) => void;
  /** Doble toque: selecciona ese lugar (recarga Hoy con sus datos). */
  onSeleccionar: (place: Place) => void;
}

// Variante de iOS: la vista nativa combina "ajustable" y "botón". Con flick vertical se recorre la
// lista de lugares (sin recargar la pantalla, solo cambia lo que anuncia); con doble toque se
// selecciona el lugar mostrado y Hoy se actualiza. Es el mismo componente que las filas de día.
export default function SelectorLugar({
  seleccionables,
  indiceSeleccionado,
  currentByPlace,
  ahora,
  onCambiar,
  onSeleccionar,
}: Props) {
  const indice = Math.min(Math.max(indiceSeleccionado, 0), seleccionables.length - 1);
  const lugar = seleccionables[indice];
  const { label, value, valueOnIncrement, valueOnDecrement } = valoresSelector(
    seleccionables,
    indice,
    currentByPlace,
    ahora,
  );
  const visible = textoLugar(lugar.name, currentByPlace[lugar.id], ahora).visible;

  const anterior = () => onCambiar(Math.max(indice - 1, 0));
  const siguiente = () => onCambiar(Math.min(indice + 1, seleccionables.length - 1));
  const seleccionar = () => onSeleccionar(lugar);

  return (
    <AdjustableButton
      label={label}
      value={value}
      // El valor tras el próximo flick, para que la vista nativa refresque la braille síncrona.
      valueOnIncrement={valueOnIncrement}
      valueOnDecrement={valueOnDecrement}
      hint={SELECTOR_HINT}
      onAccessibilityActivate={seleccionar}
      onAccessibilityIncrement={anterior}
      onAccessibilityDecrement={siguiente}>
      <SelectorLugarContent
        texto={visible}
        onAnterior={anterior}
        onSiguiente={siguiente}
        onSeleccionar={seleccionar}
        puedeAnterior={indice > 0}
        puedeSiguiente={indice < seleccionables.length - 1}
      />
    </AdjustableButton>
  );
}
