import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Paleta } from '../../theme/colores';
import { useColores } from '../../theme/ThemeContext';
import { OpcionAjustable } from '../../utils/avisoLluvia';

/**
 * Lo que se ve de un selector ajustable: su nombre y las opciones en fila, con la elegida rellena.
 * Nada de esto es accesible por separado: el selector entero ya es un elemento, y si cada opción lo
 * fuera, VoiceOver las recorrería sueltas además del ajustable.
 */
export function OpcionesVisibles<T>({
  etiqueta,
  opciones,
  indice,
  onCambiar,
}: {
  etiqueta: string;
  opciones: OpcionAjustable<T>[];
  indice: number;
  onCambiar: (valor: T) => void;
}) {
  const colores = useColores();
  const estilos = useMemo(() => crearEstilos(colores), [colores]);
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>{etiqueta}</Text>
      <View style={estilos.opciones}>
        {opciones.map((opcion, i) => (
          <Pressable
            key={String(opcion.valor)}
            accessible={false}
            onPress={() => onCambiar(opcion.valor)}
            style={[estilos.opcion, i === indice && estilos.opcionElegida]}>
            <Text style={[estilos.texto, i === indice && estilos.textoElegido]}>
              {opcion.visible}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const crearEstilos = (c: Paleta) =>
  StyleSheet.create({
    contenedor: {
      paddingVertical: 12,
      gap: 8,
    },
    titulo: {
      color: c.textoFila,
      fontSize: 17,
    },
    // En varias líneas si no caben: con texto grande, «Cualquier lluvia» no entra al lado de las otras.
    opciones: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    opcion: {
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.borde,
      backgroundColor: c.campo,
    },
    opcionElegida: {
      backgroundColor: c.primario,
      borderColor: c.textoPrimario,
    },
    texto: {
      color: c.textoCampo,
      fontSize: 17,
    },
    textoElegido: {
      color: c.textoPrimario,
      fontWeight: '600',
    },
  });
