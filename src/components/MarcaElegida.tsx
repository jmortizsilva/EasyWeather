import { Text } from 'react-native';
import { useColores } from '../theme/ThemeContext';

/**
 * La marca de la fila elegida, para que no sea el color lo único que lo dice.
 *
 * Existe porque el tinte no basta: el fondo de la fila seleccionada da 1,24:1 contra la tarjeta en
 * la paleta clara y 1,30:1 en la oscura (calculado el 2026-10-06 con herramientas/contraste.mjs),
 * muy por debajo del 3:1 que WCAG pide para el estado de un control.
 *
 * Y es la peor clase de fallo, el que no se queja: VoiceOver SÍ lo dice, porque las filas llevan
 * accessibilityState selected. O sea que a quien usa lector no le falta nada, y a quien ve poco le
 * falta todo. Por eso no se detectó usando la app.
 *
 * Va DENTRO del texto del título y no en una fila aparte a propósito: con la letra al máximo
 * (x3,571) una fila horizontal aprieta el texto hasta partir palabras —se vio en «Aviso de
 * temperatura», que quedó en «temperatur / a»—, y así la marca se pliega con el resto.
 *
 * No añade ninguna parada de VoiceOver: la fila entera ya es un solo elemento con su
 * accessibilityLabel, así que este texto no se lee por separado.
 */
export function MarcaElegida({ elegida }: { elegida: boolean }) {
  const colores = useColores();
  if (!elegida) {
    return null;
  }
  return <Text style={{ color: colores.acento }}>✓ </Text>;
}
