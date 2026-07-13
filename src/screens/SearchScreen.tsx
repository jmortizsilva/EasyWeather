import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TabParamList } from '../navigation/types';
import { searchPlaces } from '../services/openMeteo';
import { usePlaces } from '../state/PlacesContext';
import { Place } from '../types';

const SEARCH_DEBOUNCE_MS = 400;

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const { places, addPlace, removePlace, viewPlace } = usePlaces();
  const [citySearch, setCitySearch] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const trimmed = citySearch.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const timer = setTimeout(() => {
      void searchPlaces(trimmed)
        .then((results) => setSearchResults(results))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false));
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [citySearch]);

  const handleView = (place: Place) => {
    viewPlace(place);
    navigation.navigate('Home');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      accessibilityLabel="Pantalla Buscar lugar"
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title} accessibilityRole="header">
        Buscar
      </Text>

      <TextInput
        value={citySearch}
        onChangeText={setCitySearch}
        placeholder="Busca una ciudad o pueblo"
        placeholderTextColor="#c2d0e6"
        style={styles.input}
        accessibilityLabel="Buscar lugar"
        accessibilityHint="Escribe el nombre de una ciudad o pueblo para ver su previsión"
        autoFocus
      />
      {searchLoading && <ActivityIndicator color="#9ed3ff" accessibilityLabel="Buscando lugares" />}

      {searchResults.length > 0 && (
        <View style={styles.card}>
          {searchResults.map((place, index) => {
            const saved = places.some((p) => p.id === place.id);
            const where = place.admin1 ? `, ${place.admin1}` : '';
            return (
              <View key={place.id} style={[styles.resultRow, index < searchResults.length - 1 && styles.rowDivider]}>
                <Pressable
                  style={styles.resultSelect}
                  onPress={() => handleView(place)}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver previsión de ${place.name}${where}${saved ? ', guardado en mis lugares' : ''}`}
                  accessibilityHint={
                    saved
                      ? 'En el rotor de acciones puedes eliminarlo de mis lugares'
                      : 'En el rotor de acciones puedes guardarlo en mis lugares'
                  }
                  accessibilityActions={[
                    saved
                      ? { name: 'eliminar', label: 'Eliminar de mis lugares' }
                      : { name: 'guardar', label: 'Guardar en mis lugares' },
                  ]}
                  onAccessibilityAction={(event) => {
                    const action = event.nativeEvent.actionName;
                    if (action === 'guardar') {
                      void addPlace(place);
                    } else if (action === 'eliminar') {
                      void removePlace(place.id);
                    }
                  }}
                >
                  <Text style={styles.rowTitle}>{place.name}</Text>
                  <Text style={styles.rowMeta}>{place.admin1 ?? ''}</Text>
                </Pressable>
                {/* Botón visible para quien NO usa VoiceOver; se oculta del árbol de
                    accesibilidad porque ahí la acción va por el rotor. */}
                <Pressable
                  style={[styles.saveButton, saved && styles.savedButton]}
                  onPress={() => (saved ? void removePlace(place.id) : void addPlace(place))}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  <Text style={styles.saveText}>{saved ? 'Quitar' : 'Guardar'}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      {!searchLoading && citySearch.trim().length >= 2 && searchResults.length === 0 && (
        <Text style={styles.note}>Sin resultados para "{citySearch.trim()}".</Text>
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
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    fontSize: 17,
    color: '#ffffff',
    backgroundColor: '#132740',
  },
  card: {
    backgroundColor: '#132740',
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a4367',
  },
  resultSelect: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
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
  saveButton: {
    backgroundColor: '#1b5ea9',
    paddingHorizontal: 16,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedButton: {
    backgroundColor: '#7a2a38',
  },
  saveText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  note: {
    color: '#b8c6dc',
    fontSize: 15,
  },
});
