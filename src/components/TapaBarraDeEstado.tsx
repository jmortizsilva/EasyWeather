import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColores } from '../theme/ThemeContext';

/**
 * Franja fija del color del fondo detrás de la hora y la batería. Las pantallas que se desplazan
 * enteras ponen la zona segura como margen del contenido, y al bajar ese margen se va con lo demás:
 * el texto pasaba por debajo de la hora (captura de un probador de la beta 22, 2026-10-20).
 *
 * Va DESPUÉS del ScrollView, para quedar encima. Sin contenido, VoiceOver no la ve. Las hojas
 * (pageSheet) no la necesitan: empiezan por debajo de la barra de estado.
 */
export default function TapaBarraDeEstado() {
  const { top } = useSafeAreaInsets();
  const colores = useColores();
  return (
    <View
      pointerEvents="none"
      style={[styles.franja, { height: top, backgroundColor: colores.fondo }]}
    />
  );
}

const styles = StyleSheet.create({
  franja: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
