import AdjustableButton from '../../../modules/adjustable-button';
import { OpcionAjustable, valoresAjustable } from '../../utils/avisoLluvia';
import { OpcionesVisibles } from './OpcionesVisibles';

export interface SelectorAjustableProps<T> {
  etiqueta: string;
  opciones: OpcionAjustable<T>[];
  valor: T;
  onCambiar: (valor: T) => void;
}

/**
 * Una elección entre pocas opciones como UN solo elemento ajustable: VoiceOver dice «Distancia,
 * 35 kilómetros, ajustable» y se cambia deslizando arriba o abajo. Con la vista nativa, como las
 * filas de los días: sin acciones en el rotor y con la braille al día dentro del gesto (ver
 * modules/adjustable-button). Quien no usa VoiceOver toca la opción que quiere.
 */
export default function SelectorAjustable<T>({
  etiqueta,
  opciones,
  valor,
  onCambiar,
}: SelectorAjustableProps<T>) {
  const v = valoresAjustable(opciones, valor);
  return (
    <AdjustableButton
      label={etiqueta}
      value={v.value}
      valueOnIncrement={v.valueOnIncrement}
      valueOnDecrement={v.valueOnDecrement}
      esBoton={false}
      onAccessibilityIncrement={() => onCambiar(v.siguiente)}
      onAccessibilityDecrement={() => onCambiar(v.anterior)}>
      <OpcionesVisibles
        etiqueta={etiqueta}
        opciones={opciones}
        indice={v.indice}
        onCambiar={onCambiar}
      />
    </AdjustableButton>
  );
}
