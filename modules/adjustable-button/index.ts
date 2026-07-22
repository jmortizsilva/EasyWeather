import { requireNativeView } from 'expo';
import { ViewProps } from 'react-native';

export interface AdjustableButtonProps extends ViewProps {
  /** Texto que lee VoiceOver al enfocar la fila. */
  label?: string;
  /** Valor actual, que cambia con cada flick vertical. */
  value?: string;
  hint?: string;
  onAccessibilityIncrement?: () => void;
  onAccessibilityDecrement?: () => void;
  onAccessibilityActivate?: () => void;
}

// Vista nativa de iOS que combina los rasgos "ajustable" y "botón" (ver el Swift del módulo).
const AdjustableButton = requireNativeView<AdjustableButtonProps>('AdjustableButton');

export default AdjustableButton;
