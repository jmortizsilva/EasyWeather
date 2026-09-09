import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useColores } from '../../theme/ThemeContext';
import { crearEstilos } from './estilos';

// Cabecera de una subpantalla de Avisos: el boton de volver ARRIBA A LA IZQUIERDA y primero en el
// orden de lectura, y debajo el titulo grande. Es la disposicion de las pantallas de Apple, y la
// que pide la guia comun de accesibilidad (§9): el que sale de la pantalla es el primer control
// que encuentras, no el ultimo.
//
// Antes era un "Listo" a la derecha. "Listo" promete que algo se ha confirmado, y estas pantallas
// tienen su propio boton de guardar: quien lo pulsaba podia creer que estaba guardando.
//
// El boton va SIEMPRE, ademas del gesto de escape de VoiceOver y del deslizamiento de la hoja: son
// dos salidas que no todo el mundo conoce, y quedarse encerrado es de lo peor que puede pasar. El
// gesto (rascar con dos dedos) lo atiende el `onAccessibilityEscape` de la vista raiz de cada
// pantalla, que hace exactamente esto mismo.
export default function Cabecera({
  titulo,
  destino,
  onVolver,
}: {
  titulo: string;
  /** A donde lleva el boton, para poder decirlo: "Atrás… Vuelve a Avisos". */
  destino: string;
  onVolver: () => void;
}) {
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  return (
    <View style={styles.cabecera}>
      <Pressable
        onPress={onVolver}
        accessibilityRole="button"
        accessibilityLabel="Atrás"
        accessibilityHint={`Vuelve a ${destino}`}
        // El area tactil se estira hacia fuera: el texto es corto y sin esto el blanco de arriba a
        // la izquierda, que es donde todo el mundo apunta, no seria pulsable.
        hitSlop={12}
        style={styles.botonVolver}>
        {/* El chevron es el de iOS. No se lee: la etiqueta ya dice "Atrás". */}
        <Text style={styles.botonVolverTexto}>‹ Atrás</Text>
      </Pressable>
      <Text style={styles.title} accessibilityRole="header">
        {titulo}
      </Text>
    </View>
  );
}
