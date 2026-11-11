import { View } from 'react-native';
import { valoresAjustable } from '../../utils/avisoLluvia';
import { OpcionesVisibles } from './OpcionesVisibles';
import type { SelectorAjustableProps } from './SelectorAjustable.ios';

/**
 * Variante para lo que no es iOS (y para las pruebas). Solo puede declarar el rol de ajustable desde
 * JavaScript; la braille síncrona es cosa de la vista nativa. En iOS se usa SelectorAjustable.ios.tsx.
 * Increment y decrement se atienden sin declararlos en accessibilityActions, para que no salgan en
 * el rotor.
 */
export default function SelectorAjustable<T>({
  etiqueta,
  opciones,
  valor,
  onCambiar,
}: SelectorAjustableProps<T>) {
  const v = valoresAjustable(opciones, valor);
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={etiqueta}
      accessibilityValue={{ text: v.value }}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') onCambiar(v.siguiente);
        if (event.nativeEvent.actionName === 'decrement') onCambiar(v.anterior);
      }}>
      <OpcionesVisibles
        etiqueta={etiqueta}
        opciones={opciones}
        indice={v.indice}
        onCambiar={onCambiar}
      />
    </View>
  );
}
