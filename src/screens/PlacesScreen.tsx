import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabParamList } from '../navigation/types';
import { CURRENT_LOCATION_ID, usePlaces } from '../state/PlacesContext';
import { TempGuardada, textoTempActual } from '../utils/tempActual';

export default function PlacesScreen() {
  const insets = useSafeAreaInsets();
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
          Aún no has añadido ningún lugar. Ve a la pestaña Buscar para encontrar uno.
        </Text>
      )}

      {places.length > 0 && (
        <View style={styles.card}>
          {places.map((place, index) => {
            const { hablado, tempVisible } = etiquetaLugar(place.name, currentByPlace[place.id]);
            const meta = [place.admin1, tempVisible].filter(Boolean).join(' · ');
            return (
              <View
                key={place.id}
                style={[styles.favoriteRow, index < places.length - 1 && styles.rowDivider]}>
                <Pressable
                  style={[styles.favoriteSelect, activeId === place.id && styles.rowSelected]}
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
                {/* Botón visible para quien NO usa VoiceOver; se oculta del árbol de
                  accesibilidad porque para VoiceOver la acción va por el rotor. */}
                <Pressable
                  style={styles.removeButton}
                  onPress={() => void removePlace(place.id)}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants">
                  <Text style={styles.removeText}>Quitar</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0d1a2b',
  },
  content: {
    // paddingTop se calcula con la zona segura de iOS (useSafeAreaInsets), no fijo.
    paddingHorizontal: 16,
    paddingBottom: 96,
    gap: 16,
  },
  title: {
    color: '#f4f8ff',
    fontSize: 34,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#132740',
    borderRadius: 16,
    overflow: 'hidden',
  },
  note: {
    color: '#b8c6dc',
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
    borderBottomColor: '#2a4367',
  },
  rowSelected: {
    backgroundColor: '#1a3a5f',
  },
  rowTitle: {
    color: '#f0f5ff',
    fontSize: 17,
    fontWeight: '600',
  },
  rowMeta: {
    color: '#c2d0e6',
    fontSize: 15,
    marginTop: 2,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  favoriteSelect: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  removeButton: {
    backgroundColor: '#7a2a38',
    paddingHorizontal: 16,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#ffe8ed',
    fontSize: 17,
    fontWeight: '600',
  },
});
