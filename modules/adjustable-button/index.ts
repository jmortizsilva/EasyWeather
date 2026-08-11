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
  /**
   * Si además de ajustable debe anunciarse como botón. Por defecto sí (las filas de día se abren).
   * El control de páginas lo pone a false: no hay nada que activar y anunciarlo confunde.
   */
  esBoton?: boolean;
  /**
   * Cambiar este número obliga a VoiceOver a re-escanear la pantalla. Necesario cuando el
   * contenido de alrededor cambia sin que haya un scroll nativo de por medio: VoiceOver cachea
   * los elementos y seguiría recorriendo los anteriores (ver el Swift del módulo).
   */
  refrescoAccesibilidad?: number;
  onAccessibilityIncrement?: () => void;
  onAccessibilityDecrement?: () => void;
  onAccessibilityActivate?: () => void;
  /** Gesto de tres dedos: izquierda avanza, derecha retrocede. */
  onAccessibilityScrollNext?: () => void;
  onAccessibilityScrollPrevious?: () => void;
}

// Vista nativa de iOS que combina los rasgos "ajustable" y "botón" (ver el Swift del módulo).
const AdjustableButton = requireNativeView<AdjustableButtonProps>('AdjustableButton');

export default AdjustableButton;
