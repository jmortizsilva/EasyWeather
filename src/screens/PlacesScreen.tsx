import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TabParamList } from '../navigation/types';
import { CURRENT_LOCATION_ID, usePlaces } from '../state/PlacesContext';

export default function PlacesScreen() {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const { places, currentLocationPlace, activeId, setActiveId, removePlace } = usePlaces();

  const selectAndGoHome = (id: string) => {
    setActiveId(id);
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.content} accessibilityLabel="Pantalla Mis lugares">
      <Text style={styles.title} accessibilityRole="header">
        Mis lugares
      </Text>

      <View style={styles.card}>
        <Pressable
          style={[styles.row, activeId === CURRENT_LOCATION_ID && styles.rowSelected]}
          onPress={() => selectAndGoHome(CURRENT_LOCATION_ID)}
          accessibilityRole="button"
          accessibilityLabel="Ver previsión de mi ubicación"
          accessibilityState={{ selected: activeId === CURRENT_LOCATION_ID }}
        >
          <Text style={styles.rowTitle}>📍 {currentLocationPlace?.name ?? 'Mi ubicación'}</Text>
          {currentLocationPlace?.admin1 ? <Text style={styles.rowMeta}>{currentLocationPlace.admin1}</Text> : null}
        </Pressable>
      </View>

      {places.length === 0 && (
        <Text style={styles.note}>Aún no has añadido ningún lugar. Ve a la pestaña Añadir para buscar uno.</Text>
      )}

      {places.length > 0 && (
        <View style={styles.card}>
          {places.map((place, index) => (
            <View
              key={place.id}
              style={[styles.favoriteRow, index < places.length - 1 && styles.rowDivider]}
            >
              <Pressable
                style={[styles.favoriteSelect, activeId === place.id && styles.rowSelected]}
                onPress={() => selectAndGoHome(place.id)}
                accessibilityRole="button"
                accessibilityLabel={`Ver previsión de ${place.name}`}
                accessibilityHint="En el rotor de acciones tienes la opción de quitar este lugar"
                accessibilityState={{ selected: activeId === place.id }}
                accessibilityActions={[{ name: 'quitar', label: 'Quitar de mis lugares' }]}
                onAccessibilityAction={(event) => {
                  if (event.nativeEvent.actionName === 'quitar') {
                    void removePlace(place.id);
                  }
                }}
              >
                <Text style={styles.rowTitle}>{place.name}</Text>
                <Text style={styles.rowMeta}>{place.admin1 ?? ''}</Text>
              </Pressable>
              {/* Botón visible para quien NO usa VoiceOver; se oculta del árbol de
                  accesibilidad porque para VoiceOver la acción va por el rotor. */}
              <Pressable
                style={styles.removeButton}
                onPress={() => void removePlace(place.id)}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <Text style={styles.removeText}>Quitar</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 40,
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
