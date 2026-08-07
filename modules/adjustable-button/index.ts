import { requireNativeView } from 'expo';
import { ViewProps } from 'react-native';

export interface AdjustableButtonProps extends ViewProps {
  /** Texto que lee VoiceOver al enfocar la fila. */
  label?: string;
  /** Valor actual, que cambia con cada flick vertical. */
  value?: string;
  /**
   * Valor que tendrá la fila tras el próximo flick arriba (incremento) o abajo (decremento).
   * Se envía por adelantado para poder fijar accessibilityValue de forma síncrona en el gesto,
   * lo que permite que la línea braille se refresque (ver el Swift del módulo).
   */
  valueOnIncrement?: string;
  valueOnDecrement?: string;
  hint?: string;
  onAccessibilityIncrement?: () => void;
  onAccessibilityDecrement?: () => void;
  onAccessibilityActivate?: () => void;
}

// Vista nativa de iOS que combina los rasgos "ajustable" y "botón" (ver el Swift del módulo).
const AdjustableButton = requireNativeView<AdjustableButtonProps>('AdjustableButton');

export default AdjustableButton;
