import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
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
import { Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';
import { Place } from '../types';
import { vibrarConfirmacion } from '../utils/haptica';

const SEARCH_DEBOUNCE_MS = 400;

interface Props {
  /** Cierra la búsqueda. Se pasa cuando se abre como hoja desde "Mis lugares". */
  onClose: () => void;
}

export default function SearchScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const { places, addPlace, removePlace, viewPlace } = usePlaces();
  const [citySearch, setCitySearch] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  // "Cancelar" solo tiene sentido si hay algo que cancelar: el campo con foco (teclado abierto) o
  // con texto escrito. Tras cancelar (sin foco y vacio) desaparece.
  const showCancel = focused || citySearch.length > 0;

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
    onClose();
    navigation.navigate('Home');
  };

  // Guardar es la razón de ser de esta pantalla: al hacerlo se cierra sola, que es lo que se
  // esperaba (antes había que cerrarla a mano). Se vibra porque VoiceOver no anuncia nada al
  // desaparecer la hoja, y sin confirmación no se sabe si se llegó a guardar.
  const guardarYCerrar = async (place: Place) => {
    await addPlace(place);
    vibrarConfirmacion();
    onClose();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      accessibilityLabel="Pantalla Buscar lugar"
      // "always", no "handled": con "handled" el primer toque sobre "Guardar" se gastaba en cerrar
      // el teclado y había que pulsar dos veces para que guardase de verdad.
      keyboardShouldPersistTaps="always">
      {/* Cabecera con "Cerrar": al ser una hoja modal, tiene que haber una salida visible además
          del gesto de escape de VoiceOver que lleva el contenedor. */}
      <View style={styles.headerRow}>
        <Text style={styles.title} accessibilityRole="header">
          Buscar
        </Text>
        <Pressable
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cerrar búsqueda">
          <Text style={styles.closeText}>Cerrar</Text>
        </Pressable>
      </View>

      {/* Campo y "Cancelar" en la misma fila para que el orden de VoiceOver sea campo -> cancelar.
          Cancelar borra el texto y cierra el teclado (por si ya no se quiere buscar). */}
      <View style={styles.searchRow}>
        <TextInput
          value={citySearch}
          onChangeText={setCitySearch}
          placeholder="Busca una ciudad o pueblo"
          placeholderTextColor={colores.textoTenue}
          style={styles.input}
          accessibilityLabel="Buscar lugar"
          accessibilityHint="Escribe el nombre de una ciudad o pueblo para ver su previsión"
          // Tecla "Buscar" en el teclado (en vez de Intro); al pulsarla se cierra el teclado y
          // quedan a la vista los resultados que ya se cargan en vivo.
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus
        />
        {showCancel && (
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
        )}
      </View>
      {searchLoading && (
        <ActivityIndicator color={colores.acentoSuave} accessibilityLabel="Buscando lugares" />
      )}

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
                  // La acción del rotor se mantiene para quien ya la conocía, pero ya no es la
                  // única vía: el botón de al lado hace lo mismo y sí se encuentra con un flick.
                  accessibilityActions={[
                    saved
                      ? { name: 'eliminar', label: 'Eliminar de mis lugares' }
                      : { name: 'guardar', label: 'Guardar en mis lugares' },
                  ]}
                  onAccessibilityAction={(event) => {
                    const action = event.nativeEvent.actionName;
                    if (action === 'guardar') {
                      void guardarYCerrar(place);
                    } else if (action === 'eliminar') {
                      void removePlace(place.id);
                    }
                  }}>
                  <Text style={styles.rowTitle}>{place.name}</Text>
                  <Text style={styles.rowMeta}>{place.admin1 ?? ''}</Text>
                </Pressable>
                {/* Botón de guardar. ANTES estaba oculto para VoiceOver, con la acción solo en el
                    rotor, y los usuarios no la encontraban: guardar un lugar es la razón de ser de
                    esta pantalla, así que tiene que ser un botón que salga al hacer flick. */}
                <Pressable
                  style={[styles.saveButton, saved && styles.savedButton]}
                  onPress={() => (saved ? void removePlace(place.id) : void guardarYCerrar(place))}
                  accessibilityRole="button"
                  accessibilityLabel={
                    saved
                      ? `Quitar ${place.name} de mis lugares`
                      : `Guardar ${place.name} en mis lugares`
                  }>
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
      flexShrink: 1,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
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
      color: c.textoCampo,
      backgroundColor: c.campo,
      // En la paleta clara el campo es blanco sobre fondo casi blanco: sin borde no se ve donde
      // empieza. En la oscura el borde queda discreto y no molesta.
      borderWidth: 1,
      borderColor: c.borde,
    },
    cancelButton: {
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    cancelText: {
      color: c.acento,
      fontSize: 17,
      fontWeight: '600',
    },
    card: {
      backgroundColor: c.tarjeta,
      borderRadius: 16,
      overflow: 'hidden',
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.borde,
    },
    resultSelect: {
      flex: 1,
      minHeight: 44,
      paddingVertical: 12,
      paddingHorizontal: 16,
      justifyContent: 'center',
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
    saveButton: {
      backgroundColor: c.primario,
      paddingHorizontal: 16,
      minWidth: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    savedButton: {
      backgroundColor: c.peligro,
    },
    saveText: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    note: {
      color: c.textoTenue,
      fontSize: 15,
    },
  });
