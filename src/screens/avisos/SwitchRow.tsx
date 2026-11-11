import { useMemo } from 'react';
import { Pressable, Switch, Text } from 'react-native';
import { useColores } from '../../theme/ThemeContext';
import { crearEstilos } from './estilos';

// Fila-conmutador accesible: toda la fila es UN solo elemento con rol "conmutador", para que
// VoiceOver lea "Temperatura, conmutador, activado" en un único flick (en vez de leer el texto y
// el interruptor por separado). El interruptor visual queda como adorno, sin foco ni toque.
export default function SwitchRow({
  label,
  value,
  onValueChange,
  divider,
  hint,
  etiquetaHablada,
}: {
  label: string;
  /** Si VoiceOver debe decirlo distinto de como se ve: «5 kilómetros» donde pone «5 km». */
  etiquetaHablada?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  divider?: boolean;
  hint?: string;
}) {
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  return (
    <Pressable
      style={[styles.switchRow, divider && styles.rowDivider]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={etiquetaHablada ?? label}
      accessibilityHint={hint}
      onPress={() => onValueChange(!value)}>
      <Text style={styles.rowTitle}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        style={styles.switchControl}
        importantForAccessibility="no-hide-descendants"
      />
    </Pressable>
  );
}
