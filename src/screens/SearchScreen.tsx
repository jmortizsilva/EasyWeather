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
import { searchPlaces } from '../services/openMeteo';
import { usePlaces } from '../state/PlacesContext';
import { Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';
import { Place } from '../types';
import { vibrarConfirmacion } from '../utils/haptica';
import { ordenarPorCercania } from '../utils/ordenarResultados';
import { describirResultados } from '../utils/resultadosBusqueda';

const SEARCH_DEBOUNCE_MS = 400;

interface Props {
  /** Cierra la búsqueda. Se pasa cuando se abre como hoja desde "Mis lugares". */
  onClose: () => void;
  /** Muestra la previsión de un lugar sin guardarlo, en una vista de la que SÍ se puede salir. */
  onVerPrevision: (place: Place) => void;
}

export default function SearchScreen({ onClose, onVerPrevision }: Props) {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { places, addPlace, removePlace, currentLocationPlace } = usePlaces();
  const [citySearch, setCitySearch] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  // "Borrar" solo tiene sentido si hay texto que borrar.
  const puedeBorrar = citySearch.length > 0;

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

  // Open-Meteo ordena por relevancia mundial, que para quien busca desde su casa es el orden
  // equivocado: "Mérida" desde España devolvía antes la de México y la de Venezuela que la de
  // Extremadura. Se reordena aquí y no en el servicio para que la capa de red siga siendo tonta.
  const resultadosOrdenados = useMemo(
    () => ordenarPorCercania(searchResults, currentLocationPlace),
    [searchResults, currentLocationPlace],
  );

  // Consultar un lugar buscado NO lo convierte en el lugar de "Hoy": se abre una vista propia con
  // botón de volver. Antes acababas viendo en Hoy un lugar sin guardar y sin forma de salir.
  const handleView = (place: Place) => {
    Keyboard.dismiss();
    onVerPrevision(place);
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
      // "always" evita que un toque en la lista cierre el teclado en vez de activar la fila. Con
      // VoiceOver no interviene: allí quien tiene que resolverlo es onAccessibilityTap en cada
      // fila (ver más abajo), porque el doble toque no pasa por el sistema de toques de React
      // Native. Para quien usa la pantalla a la vista, arrastrar la lista sí cierra el teclado,
      // que es lo habitual en iOS.
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag">
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

      {/* Campo y sus botones en la misma fila, para que el orden de VoiceOver sea
          campo -> Listo -> Borrar: lo primero que se encuentra tras escribir es cerrar el teclado,
          que es lo que hay que hacer antes de recorrer los resultados. */}
      <View style={styles.searchRow}>
        <TextInput
          value={citySearch}
          onChangeText={setCitySearch}
          placeholder="Busca una ciudad o pueblo"
          placeholderTextColor={colores.textoTenue}
          style={styles.input}
          accessibilityLabel="Buscar lugar"
          accessibilityHint="Escribe el nombre de una ciudad o pueblo. Los resultados salen debajo según escribes; con Listo o con la tecla Buscar del teclado lo cierras y se recorren más cómodos"
          // Tecla "Buscar" en el teclado (en vez de Intro); al pulsarla se cierra el teclado y
          // quedan a la vista los resultados que ya se cargan en vivo.
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus
        />
        {/* Cerrar el teclado tiene botón propio: con el teclado abierto tapa media pantalla y
            quedan menos resultados a la vista. La tecla "Buscar" hace lo mismo, pero no todo el
            mundo la conoce. Ya NO hace falta pulsarlo para que los resultados respondan al primer
            toque; eso lo resuelve onAccessibilityTap en cada fila. */}
        {focused && (
          <Pressable
            style={styles.cancelButton}
            onPress={() => Keyboard.dismiss()}
            accessibilityRole="button"
            accessibilityLabel="Listo"
            accessibilityHint="Cierra el teclado para poder recorrer los resultados">
            <Text style={styles.cancelText}>Listo</Text>
          </Pressable>
        )}
        {puedeBorrar && (
          <Pressable
            style={styles.cancelButton}
            onPress={() => {
              setCitySearch('');
              Keyboard.dismiss();
            }}
            accessibilityRole="button"
            accessibilityLabel="Borrar la búsqueda"
            accessibilityHint="Vacía el campo y cierra el teclado">
            <Text style={styles.cancelText}>Borrar</Text>
          </Pressable>
        )}
      </View>
      {searchLoading && (
        <ActivityIndicator color={colores.acentoSuave} accessibilityLabel="Buscando lugares" />
      )}

      {resultadosOrdenados.length > 0 && (
        <View style={styles.card}>
          {describirResultados(resultadosOrdenados).map(({ place, detalle }, index, lista) => {
            const saved = places.some((p) => p.id === place.id);
            // El detalle ya viene calculado para que ESTA fila no suene igual que otra de la lista.
            const where = detalle ? `, ${detalle}` : '';
            return (
              <View
                key={place.id}
                style={[styles.resultRow, index < lista.length - 1 && styles.rowDivider]}>
                <Pressable
                  style={styles.resultSelect}
                  onPress={() => handleView(place)}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver previsión de ${place.name}${where}${saved ? ', guardado en mis lugares' : ''}`}
                  // onAccessibilityTap, NO una acción 'activate': accessibilityActivate de
                  // RCTViewComponentView.mm solo mira esta prop, y si devuelve NO, VoiceOver
                  // sintetiza un toque normal, que es el que se come el cierre del teclado (había
                  // que pulsar dos veces con el teclado abierto). Declarar 'activate' en
                  // accessibilityActions NO vale: eso solo lo mete en el rotor.
                  onAccessibilityTap={() => handleView(place)}
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
                  <Text style={styles.rowMeta}>{detalle}</Text>
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
                  }
                  // Ver arriba: sin onAccessibilityTap, el primer doble toque se gasta en cerrar
                  // el teclado y hay que pulsar el botón dos veces para guardar.
                  onAccessibilityTap={() => {
                    if (saved) {
                      void removePlace(place.id);
                    } else {
                      void guardarYCerrar(place);
                    }
                  }}>
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
