import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TabParamList } from '../navigation/types';
import { searchPlaces } from '../services/openMeteo';
import { usePlaces } from '../state/PlacesContext';
import { Place } from '../types';

const SEARCH_DEBOUNCE_MS = 400;

export default function AddPlaceScreen() {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const { addPlace } = usePlaces();
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

  const handleAdd = async (place: Place) => {
    await addPlace(place);
    setCitySearch('');
    setSearchResults([]);
    navigation.navigate('Home');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      accessibilityLabel="Pantalla Añadir lugar"
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title} accessibilityRole="header">
        Añadir lugar
      </Text>

      <TextInput
        value={citySearch}
        onChangeText={setCitySearch}
        placeholder="Busca una ciudad o pueblo"
        placeholderTextColor="#c2d0e6"
        style={styles.input}
        accessibilityLabel="Buscar lugar"
        accessibilityHint="Escribe el nombre de una ciudad o pueblo para añadirlo a tus lugares"
        autoFocus
      />
      {searchLoading && <ActivityIndicator color="#9ed3ff" accessibilityLabel="Buscando lugares" />}

      {searchResults.length > 0 && (
        <View style={styles.card}>
          {searchResults.map((place, index) => (
            <Pressable
              key={place.id}
              style={[styles.rowButton, index < searchResults.length - 1 && styles.rowDivider]}
              onPress={() => void handleAdd(place)}
              accessibilityRole="button"
              accessibilityLabel={`Añadir ${place.name}${place.admin1 ? `, ${place.admin1}` : ''}`}
            >
              <Text style={styles.rowTitle}>{place.name}</Text>
              <Text style={styles.rowMeta}>{place.admin1 ?? ''}</Text>
            </Pressable>
          ))}
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
  rowButton: {
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a4367',
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
  note: {
    color: '#b8c6dc',
    fontSize: 15,
  },
});
