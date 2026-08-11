import { View } from 'react-native';
import { CONTROL_PAGINAS_HINT, valoresControl } from '../utils/paginasLugar';
import { ControlPaginasContent } from './ControlPaginasContent';
import type { ControlPaginasProps } from './ControlPaginas.ios';

/**
 * Variante para lo que no es iOS (y para el preview web). Solo puede declarar el rol de ajustable
 * desde JavaScript; el gesto de tres dedos y la braille síncrona son cosa de la vista nativa, así
 * que aquí no están. En iOS se usa ControlPaginas.ios.tsx.
 */
export default function ControlPaginas({
  lugares,
  indice,
  currentByPlace,
  ahora,
  onCambiar,
}: ControlPaginasProps) {
  const actual = Math.min(Math.max(indice, 0), lugares.length - 1);
  const { label, value } = valoresControl(lugares, actual, currentByPlace, ahora);

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: value }}
      accessibilityHint={CONTROL_PAGINAS_HINT}
      onAccessibilityAction={(event) => {
        const accion = event.nativeEvent.actionName;
        if (accion === 'increment') {
          onCambiar(Math.max(actual - 1, 0));
        }
        if (accion === 'decrement') {
          onCambiar(Math.min(actual + 1, lugares.length - 1));
        }
      }}>
      <ControlPaginasContent total={lugares.length} indice={actual} />
    </View>
  );
}
