import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabParamList } from '../navigation/types';
import { searchPlaces } from '../services/openMeteo';
import { usePlaces } from '../state/PlacesContext';
import { Place } from '../types';

const SEARCH_DEBOUNCE_MS = 400;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const { places, addPlace, removePlace, viewPlace } = usePlaces();
  const [citySearch, setCitySearch] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const trimmed = citySearch.trim();
    if (trimmed.length < 2) {
      // Limpiar resultados al vaciar el buscador; sincroniza estado con la entrada, no cascada.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      accessibilityLabel="Pantalla Buscar lugar"
      keyboardShouldPersistTaps="handled">
      <Text style={styles.title} accessibilityRole="header">
        Buscar
      </Text>

      {/* Campo y "Cancelar" en la misma fila para que el orden de VoiceOver sea campo -> cancelar.
          Cancelar borra el texto y cierra el teclado (por si ya no se quiere buscar). */}
      <View style={styles.searchRow}>
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
        <Pressable
          style={styles.cancelButton}
          onPress={() => {
            setCitySearch('');
            Keyboard.dismiss();
          }}
          accessibilityRole="button"
          accessibilityLabel="Cancelar búsqueda"
          accessibilityHint="Borra el texto y cierra el teclado">
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
      {searchLoading && <ActivityIndicator color="#9ed3ff" accessibilityLabel="Buscando lugares" />}

      {searchResults.length > 0 && (
        <View style={styles.card}>
          {searchResults.map((place, index) => {
            const saved = places.some((p) => p.id === place.id);
            const where = place.admin1 ? `, ${place.admin1}` : '';
            return (
              <View
                key={place.id}
                style={[styles.resultRow, index < searchResults.length - 1 && styles.rowDivider]}>
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
                  }}>
                  <Text style={styles.rowTitle}>{place.name}</Text>
                  <Text style={styles.rowMeta}>{place.admin1 ?? ''}</Text>
                </Pressable>
                {/* Botón visible para quien NO usa VoiceOver; se oculta del árbol de
                    accesibilidad porque ahí la acción va por el rotor. */}
                <Pressable
                  style={[styles.saveButton, saved && styles.savedButton]}
                  onPress={() => (saved ? void removePlace(place.id) : void addPlace(place))}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants">
                  <Text style={styles.saveText}>{saved ? 'Quitar' : 'Guardar'}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}

      {!searchLoading && citySearch.trim().length >= 2 && searchResults.length === 0 && (
        <Text style={styles.note}>Sin resultados para «{citySearch.trim()}».</Text>
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    fontSize: 17,
    color: '#ffffff',
    backgroundColor: '#132740',
  },
  cancelButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  cancelText: {
    color: '#7cbcff',
    fontSize: 17,
    fontWeight: '600',
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
