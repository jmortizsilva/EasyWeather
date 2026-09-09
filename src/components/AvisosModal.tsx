import { useMemo } from 'react';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';
import { AvisoOficial } from '../types';

// El detalle de los avisos OFICIALES de AEMET de un lugar. Se abre desde el anuncio de arriba.
//
// Todo el texto viene ya redactado del servidor (ver `AvisoOficial` en types.ts): aquí no se
// compone ni una frase. El umbral y el consejo se enseñan LITERALES —son texto oficial de
// protección civil— y lo que oye VoiceOver es lo mismo con las unidades en palabras.

interface Props {
  visible: boolean;
  avisos: AvisoOficial[];
  lugar: string;
  onClose: () => void;
}

export default function AvisosModal({ visible, avisos, lugar, onClose }: Props) {
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* Mismo gesto de escape de VoiceOver (dos dedos, la "Z") que la ficha del día. */}
      <View style={styles.backdrop} onAccessibilityEscape={onClose}>
        <View style={styles.sheet} accessibilityViewIsModal onAccessibilityEscape={onClose}>
          <View style={styles.grabber} importantForAccessibility="no" />
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title} accessibilityRole="header">
                Avisos oficiales
              </Text>
              <Text style={styles.subtitle}>{lugar}</Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar los avisos oficiales">
              <Text style={styles.closeText}>Cerrar</Text>
            </Pressable>
          </View>

          <ScrollView>
            {avisos.map((aviso) => {
              const color = colores.aviso[aviso.level];
              return (
                <View
                  key={aviso.id}
                  style={[
                    styles.tarjeta,
                    { backgroundColor: color.fondo, borderColor: color.borde },
                  ]}
                  accessible
                  accessibilityLabel={aviso.texto.spoken}>
                  <Text style={[styles.avisoTitulo, { color: color.texto }]}>
                    {aviso.texto.titulo}
                  </Text>
                  <Text style={[styles.avisoLinea, { color: color.texto }]}>
                    {aviso.texto.periodo}
                  </Text>
                  <Text style={[styles.avisoLinea, { color: color.texto }]}>
                    Zona: {aviso.texto.zona}
                  </Text>
                  {/* Literal de AEMET: es el umbral que ha disparado el aviso, y reescribirlo sería
                      inventarse un dato oficial. */}
                  {aviso.texto.umbral !== '' && (
                    <Text style={[styles.avisoLinea, { color: color.texto }]}>
                      {aviso.texto.umbral}
                    </Text>
                  )}
                  {aviso.texto.probabilidad !== '' && (
                    <Text style={[styles.avisoLinea, { color: color.texto }]}>
                      {aviso.texto.probabilidad}
                    </Text>
                  )}
                  {aviso.texto.consejo !== '' && (
                    <Text style={[styles.avisoConsejo, { color: color.texto }]}>
                      {aviso.texto.consejo}
                    </Text>
                  )}
                </View>
              );
            })}

            {avisos.length === 0 && (
              <Text style={styles.note}>No hay avisos oficiales para este lugar.</Text>
            )}

            {/* AEMET autoriza el uso citándola como autora. Aquí la atribución es obligada además
                por lo que es la pantalla: todo lo que hay dentro lo ha emitido AEMET. */}
            <Pressable
              style={styles.atribucion}
              onPress={() => {
                void Linking.openURL('https://www.aemet.es/es/eltiempo/prediccion/avisos');
              }}
              accessibilityRole="link"
              accessibilityLabel="Avisos de AEMET, Agencia Estatal de Meteorología"
              accessibilityHint="Abre la página de avisos de AEMET en el navegador">
              <Text style={styles.atribucionTexto}>Avisos de AEMET</Text>
            </Pressable>

            {/* Lo que esta pantalla NO es. Va escrito porque los dos tipos de aviso llegan por la
                misma vía (una notificación) y sin esto podrían confundirse. */}
            <Text style={styles.aclaracion}>
              Estos avisos los emite AEMET para toda una zona. No son los avisos de temperatura que
              tú configuras en la pestaña Avisos, que son reglas tuyas para tu sitio.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const crearEstilos = (c: Paleta) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: c.tarjeta,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 16,
      paddingBottom: 24,
      maxHeight: '85%',
    },
    grabber: {
      alignSelf: 'center',
      width: 36,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.agarre,
      marginTop: 8,
      marginBottom: 4,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 8,
    },
    headerText: {
      flex: 1,
      gap: 2,
    },
    title: {
      color: c.texto,
      fontSize: 22,
      fontWeight: '700',
    },
    subtitle: {
      color: c.textoTenue,
      fontSize: 15,
    },
    closeButton: {
      borderRadius: 12,
      backgroundColor: c.primario,
      paddingHorizontal: 16,
      minHeight: 44,
      justifyContent: 'center',
    },
    closeText: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    tarjeta: {
      borderWidth: 2,
      borderRadius: 14,
      padding: 14,
      marginTop: 12,
      gap: 4,
    },
    avisoTitulo: {
      fontSize: 18,
      fontWeight: '700',
    },
    avisoLinea: {
      fontSize: 15,
    },
    avisoConsejo: {
      fontSize: 14,
      marginTop: 4,
      opacity: 0.9,
    },
    note: {
      color: c.textoTenue,
      fontSize: 15,
      marginTop: 16,
    },
    atribucion: {
      marginTop: 20,
      minHeight: 44,
      justifyContent: 'center',
    },
    atribucionTexto: {
      color: c.acento,
      fontSize: 14,
      textDecorationLine: 'underline',
    },
    aclaracion: {
      color: c.textoTenue,
      fontSize: 13,
      marginTop: 8,
      lineHeight: 18,
    },
  });
