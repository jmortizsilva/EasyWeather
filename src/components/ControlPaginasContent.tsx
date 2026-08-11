import { StyleSheet, View } from 'react-native';
import { Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';

// Los textos que lee VoiceOver viven en utils/paginasLugar (lógica pura, con test); aquí solo
// queda lo que se ve.

/**
 * Los puntos, como el control de páginas de la app Tiempo de iOS. Va marcado accessible={false}
 * porque el contenedor (la vista nativa ajustable) ya es el único elemento para VoiceOver.
 */
export function ControlPaginasContent({ total, indice }: { total: number; indice: number }) {
  const colores = useColores();
  const styles = crearEstilos(colores);
  return (
    <View style={styles.fila} accessible={false} importantForAccessibility="no-hide-descendants">
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.punto, i === indice ? styles.puntoActivo : undefined]} />
      ))}
    </View>
  );
}

const crearEstilos = (c: Paleta) =>
  StyleSheet.create({
    // Alto de 44 aunque los puntos midan 8: es el area tactil minima de iOS, y ademas da al
    // elemento de VoiceOver un tamano comodo de enfocar.
    fila: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      minHeight: 44,
    },
    punto: {
      width: 8,
      height: 8,
      borderRadius: 4,
      // El punto inactivo va del color tenue del texto, no de un gris fijo: en la paleta clara un
      // gris claro sobre fondo casi blanco no se veria.
      backgroundColor: c.textoTenue,
      opacity: 0.4,
    },
    puntoActivo: {
      backgroundColor: c.acento,
      opacity: 1,
    },
  });
