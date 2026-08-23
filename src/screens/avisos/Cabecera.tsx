import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useColores } from '../../theme/ThemeContext';
import { crearEstilos } from './estilos';

// Cabecera de una subpantalla de Avisos: el título y la salida. El botón de cerrar va SIEMPRE, y no
// solo el gesto de escape de VoiceOver ni el deslizamiento de la hoja: son dos formas de salir que
// no todo el mundo conoce, y quedarse encerrado en una hoja es de las peores cosas que pueden pasar.
export default function Cabecera({ titulo, onCerrar }: { titulo: string; onCerrar: () => void }) {
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  return (
    <View style={styles.cabecera}>
      <Text style={styles.title} accessibilityRole="header">
        {titulo}
      </Text>
      <Pressable
        onPress={onCerrar}
        accessibilityRole="button"
        accessibilityLabel="Listo, volver a Avisos"
        style={styles.tecladoBoton}>
        <Text style={styles.tecladoBotonTexto}>Listo</Text>
      </Pressable>
    </View>
  );
}
