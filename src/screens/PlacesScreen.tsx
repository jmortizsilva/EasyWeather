import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabParamList } from '../navigation/types';
import { CURRENT_LOCATION_ID, usePlaces } from '../state/PlacesContext';
import { Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';
import { TempGuardada, textoTempActual } from '../utils/tempActual';
import SearchScreen from './SearchScreen';

export default function PlacesScreen() {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const {
    places,
    currentLocationPlace,
    activeId,
    currentByPlace,
    setActiveId,
    removePlace,
    refreshCurrentTemps,
  } = usePlaces();

  // Momento actual para la antigüedad de las temperaturas. Se fija al recibir el foco (no Date.now
  // en render, que sería impuro); con 0 hasta entonces se tratan como frescas.
  const [ahora, setAhora] = useState(0);
  const [buscando, setBuscando] = useState(false);

  // Al abrir "Mis lugares" se refresca la temperatura de todos los lugares (una sola llamada).
  useFocusEffect(
    useCallback(() => {
      setAhora(Date.now());
      void refreshCurrentTemps();
    }, [refreshCurrentTemps]),
  );

  // Nombre + temperatura (con su antigüedad si no es fresca) para lo que lee VoiceOver y lo visible.
  const etiquetaLugar = (name: string, entry: TempGuardada | undefined) => {
    const temp = textoTempActual(entry, ahora);
    return {
      hablado: temp ? `${name}, ${temp.hablado}` : name,
      tempVisible: temp?.visible,
    };
  };

  const selectAndGoHome = (id: string) => {
    setActiveId(id);
    navigation.navigate('Home');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      accessibilityLabel="Pantalla Mis lugares">
      <Text style={styles.title} accessibilityRole="header">
        Mis lugares
      </Text>

      <View style={styles.card}>
        {(() => {
          const nombre = currentLocationPlace?.name ?? 'Mi ubicación';
          const { hablado, tempVisible } = etiquetaLugar(
            nombre,
            currentByPlace[CURRENT_LOCATION_ID],
          );
          const meta = [currentLocationPlace?.admin1, tempVisible].filter(Boolean).join(' · ');
          return (
            <Pressable
              style={[styles.row, activeId === CURRENT_LOCATION_ID && styles.rowSelected]}
              onPress={() => selectAndGoHome(CURRENT_LOCATION_ID)}
              accessibilityRole="button"
              accessibilityLabel={hablado}
              accessibilityState={{ selected: activeId === CURRENT_LOCATION_ID }}>
              <Text style={styles.rowTitle}>📍 {nombre}</Text>
              {meta ? <Text style={styles.rowMeta}>{meta}</Text> : null}
            </Pressable>
          );
        })()}
      </View>

      {places.length === 0 && (
        <Text style={styles.note}>
          Aún no has añadido ningún lugar. Usa el botón Añadir lugar para buscar uno.
        </Text>
      )}

      {places.length > 0 && (
        <View style={styles.card}>
          {places.map((place, index) => {
            const { hablado, tempVisible } = etiquetaLugar(place.name, currentByPlace[place.id]);
            const meta = [place.admin1, tempVisible].filter(Boolean).join(' · ');
            return (
              <Swipeable
                key={place.id}
                renderRightActions={() => (
                  // Se revela al deslizar; queda FUERA del árbol de accesibilidad a propósito,
                  // porque para VoiceOver la misma acción ya está en el rotor (más rápida que
                  // tener que deslizar).
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => void removePlace(place.id)}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants">
                    <Text style={styles.removeText}>Quitar</Text>
                  </Pressable>
                )}
                // Se permite deslizar en los dos sentidos: se pidió "flick a la derecha o a la
                // izquierda", y la acción revelada es la misma.
                renderLeftActions={() => (
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => void removePlace(place.id)}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants">
                    <Text style={styles.removeText}>Quitar</Text>
                  </Pressable>
                )}>
                <Pressable
                  style={[
                    styles.favoriteSelect,
                    index < places.length - 1 && styles.rowDivider,
                    activeId === place.id && styles.rowSelected,
                  ]}
                  onPress={() => selectAndGoHome(place.id)}
                  accessibilityRole="button"
                  accessibilityLabel={hablado}
                  accessibilityHint="En el rotor de acciones tienes la opción de quitar este lugar"
                  accessibilityState={{ selected: activeId === place.id }}
                  accessibilityActions={[{ name: 'quitar', label: 'Quitar de mis lugares' }]}
                  onAccessibilityAction={(event) => {
                    if (event.nativeEvent.actionName === 'quitar') {
                      void removePlace(place.id);
                    }
                  }}>
                  <Text style={styles.rowTitle}>{place.name}</Text>
                  {meta ? <Text style={styles.rowMeta}>{meta}</Text> : null}
                </Pressable>
              </Swipeable>
            );
          })}
        </View>
      )}

      <Pressable
        style={styles.buttonPrimary}
        onPress={() => setBuscando(true)}
        accessibilityRole="button"
        accessibilityLabel="Añadir lugar"
        accessibilityHint="Abre la búsqueda para encontrar una ciudad o pueblo">
        <Text style={styles.buttonText}>Añadir lugar</Text>
      </Pressable>

      {/* La búsqueda ya no es una pestaña: su contenido es "añadir un lugar", así que vive aquí
          como hoja. accessibilityViewIsModal deja fuera del recorrido de VoiceOver lo que queda
          detrás, y onAccessibilityEscape permite cerrarla con el gesto de la Z. */}
      <Modal
        visible={buscando}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setBuscando(false)}>
        <View
          style={styles.hoja}
          accessibilityViewIsModal
          onAccessibilityEscape={() => setBuscando(false)}>
          <SearchScreen onClose={() => setBuscando(false)} />
        </View>
      </Modal>
    </ScrollView>
  );
}

const crearEstilos = (c: Paleta) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.fondo,
    },
    content: {
      // paddingTop se calcula con la zona segura de iOS (useSafeAreaInsets), no fijo.
      paddingHorizontal: 16,
      paddingBottom: 96,
      gap: 16,
    },
    title: {
      color: c.texto,
      fontSize: 34,
      fontWeight: '700',
    },
    card: {
      backgroundColor: c.tarjeta,
      borderRadius: 16,
      overflow: 'hidden',
    },
    note: {
      color: c.textoTenue,
      fontSize: 15,
    },
    row: {
      minHeight: 44,
      paddingVertical: 12,
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.borde,
    },
    rowSelected: {
      backgroundColor: c.tarjetaSeleccionada,
    },
    rowTitle: {
      color: c.textoFila,
      fontSize: 17,
      fontWeight: '600',
    },
    rowMeta: {
      color: c.textoMeta,
      fontSize: 15,
      marginTop: 2,
    },
    // El fondo explícito importa: la fila se desliza por encima del botón "Quitar", y sin fondo
    // propio se transparentaría y se leerían los dos textos superpuestos.
    favoriteSelect: {
      minHeight: 44,
      paddingVertical: 12,
      paddingHorizontal: 16,
      justifyContent: 'center',
      backgroundColor: c.tarjeta,
    },
    removeButton: {
      backgroundColor: c.peligro,
      paddingHorizontal: 24,
      minWidth: 88,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeText: {
      color: c.textoPeligro,
      fontSize: 17,
      fontWeight: '600',
    },
    buttonPrimary: {
      borderRadius: 12,
      backgroundColor: c.primario,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    buttonText: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    // Fondo propio de la hoja de búsqueda: una hoja modal de iOS no hereda el de la pantalla.
    hoja: {
      flex: 1,
      backgroundColor: c.fondo,
    },
  });
