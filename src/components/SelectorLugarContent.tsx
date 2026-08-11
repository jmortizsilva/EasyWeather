import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColores } from '../theme/ThemeContext';
import { Place } from '../types';
import { TempGuardada, textoLugar } from '../utils/tempActual';

export const SELECTOR_HINT = 'Toca dos veces para ver este lugar en Hoy';

export interface SelectorValores {
  /** Etiqueta CORTA y estable ("Lugar"); en braille es un prefijo permanente. */
  label: string;
  /** Valor actual (ciudad + grados), lo que cambia con cada flick. */
  value: string;
  /** Valor tras el próximo flick, para que la vista nativa refresque la braille de forma síncrona. */
  valueOnIncrement: string;
  valueOnDecrement: string;
}

// Textos hablados del ajustable. Los valores vecinos se calculan por adelantado (igual que en las
// filas de día) para la línea braille; ver modules/adjustable-button.
export function valoresSelector(
  seleccionables: Place[],
  indice: number,
  currentByPlace: Record<string, TempGuardada>,
  ahora: number,
): SelectorValores {
  const hablado = (i: number) => {
    const j = Math.min(Math.max(i, 0), seleccionables.length - 1);
    const p = seleccionables[j];
    return textoLugar(p.name, currentByPlace[p.id], ahora).hablado;
  };
  return {
    label: 'Lugar',
    value: hablado(indice),
    valueOnIncrement: hablado(indice - 1), // flick arriba = anterior
    valueOnDecrement: hablado(indice + 1), // flick abajo = siguiente
  };
}

interface ContentProps {
  /** Texto visible (ciudad + grados) del lugar resaltado. */
  texto: string;
  onAnterior: () => void;
  onSiguiente: () => void;
  onSeleccionar: () => void;
  puedeAnterior: boolean;
  puedeSiguiente: boolean;
}

// Parte visible, común a las dos variantes (nativa de iOS y RN). Todo va marcado accessible={false}
// porque el contenedor (nativo o Pressable ajustable) ya es el único elemento para VoiceOver; estos
// botones −/+ y el toque central son para quien ve la pantalla.
export function SelectorLugarContent({
  texto,
  onAnterior,
  onSiguiente,
  onSeleccionar,
  puedeAnterior,
  puedeSiguiente,
}: ContentProps) {
  const colores = useColores();
  return (
    <View
      style={[styles.contenedor, { backgroundColor: colores.tarjeta, borderColor: colores.borde }]}>
      <Text style={[styles.etiqueta, { color: colores.textoTenue }]}>Lugar</Text>
      <View style={styles.fila}>
        <Pressable
          onPress={onAnterior}
          disabled={!puedeAnterior}
          accessible={false}
          style={({ pressed }) => [
            styles.boton,
            { backgroundColor: colores.primario },
            { opacity: !puedeAnterior ? 0.3 : pressed ? 0.75 : 1 },
          ]}>
          <Text style={[styles.signo, { color: colores.textoPrimario }]}>−</Text>
        </Pressable>
        <Pressable onPress={onSeleccionar} accessible={false} style={styles.centro}>
          <Text style={[styles.valor, { color: colores.texto }]} numberOfLines={1}>
            {texto}
          </Text>
        </Pressable>
        <Pressable
          onPress={onSiguiente}
          disabled={!puedeSiguiente}
          accessible={false}
          style={({ pressed }) => [
            styles.boton,
            { backgroundColor: colores.primario },
            { opacity: !puedeSiguiente ? 0.3 : pressed ? 0.75 : 1 },
          ]}>
          <Text style={[styles.signo, { color: colores.textoPrimario }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Solo medidas: el color lo aplica el componente con los tokens del tema.
const styles = StyleSheet.create({
  contenedor: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  etiqueta: {
    fontSize: 15,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  centro: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  valor: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  boton: {
    minWidth: 56,
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signo: {
    fontSize: 26,
    fontWeight: '700',
  },
});
