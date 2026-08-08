import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DayDetailModal from '../components/DayDetailModal';
import DayRow from '../components/DayRow';
import SelectorLugar from '../components/SelectorLugar';
import { CURRENT_LOCATION_ID, usePlaces } from '../state/PlacesContext';
import { DayForecast, Place } from '../types';
import { buildDayDetails, formatUpdatedAt } from '../utils/dayDetails';
import { describeWeatherCode } from '../utils/weatherCodes';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    places,
    currentLocationPlace,
    activeId,
    activePlace,
    forecast,
    forecastUpdatedAt,
    loadingForecast,
    loadingLocation,
    message,
    currentByPlace,
    detectCurrentLocation,
    refreshCurrentLocation,
    refreshCurrentTemps,
    reloadForecast,
    setActiveId,
  } = usePlaces();
  const [detail, setDetail] = useState<{ day: DayForecast; showSummary: boolean } | undefined>(
    undefined,
  );

  // Lugares que recorre el ajustable: la ubicación actual primero, luego los guardados.
  const seleccionables = [currentLocationPlace, ...places].filter((p): p is NonNullable<typeof p> =>
    Boolean(p),
  );
  const indiceActivo = seleccionables.findIndex((p) => p.id === activeId);
  // El ajustable solo tiene sentido con al menos dos destinos y cuando el lugar activo es uno de
  // ellos (si se está viendo un lugar buscado sin guardar, no aparece).
  const mostrarSelector = seleccionables.length >= 2 && indiceActivo >= 0;

  // Índice resaltado en el ajustable. Se separa de activeId: el flick solo mueve este índice (sin
  // recargar Hoy, para que VoiceOver no pierda el foco); la recarga ocurre al SELECCIONAR (botón).
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(indiceActivo);

  // Si el lugar activo cambia por fuera (GPS, Buscar, Mis lugares, o al seleccionar aquí), el
  // ajustable se pone al día. Ajuste de estado durante el render (patrón recomendado de React), en
  // vez de un efecto: no provoca renders en cascada.
  const [activeIdPrevio, setActiveIdPrevio] = useState(activeId);
  if (activeId !== activeIdPrevio) {
    setActiveIdPrevio(activeId);
    if (indiceActivo >= 0) {
      setIndiceSeleccionado(indiceActivo);
    }
  }

  // Momento actual para calcular la antigüedad de las temperaturas. Se fija al recibir el foco (no
  // Date.now en render, que sería impuro); mientras tanto 0 hace que se traten como frescas.
  const [ahora, setAhora] = useState(0);

  // Flick: solo resalta otro lugar en el ajustable, sin tocar la previsión.
  const cambiarSeleccion = (indice: number) => setIndiceSeleccionado(indice);
  // Doble toque (botón): aplica el lugar mostrado y recarga Hoy con sus datos.
  const seleccionarLugar = (place: Place) => {
    if (place.id !== activeId) {
      setActiveId(place.id);
    }
  };

  // Al entrar en la pestaña Hoy se comprueba si el usuario se ha movido de ciudad y se
  // refresca la previsión. Silencioso si ya hay datos. También se refrescan las temperaturas
  // que muestra el ajustable.
  useFocusEffect(
    useCallback(() => {
      setAhora(Date.now());
      void detectCurrentLocation();
      reloadForecast(true);
      void refreshCurrentTemps();
    }, [detectCurrentLocation, reloadForecast, refreshCurrentTemps]),
  );

  const isCurrentLocation = activeId === CURRENT_LOCATION_ID;
  const currentInfo = describeWeatherCode(forecast?.current?.weatherCode);
  const today = forecast?.days[0];
  const todayDetails = today ? buildDayDetails(today) : [];
  const upcomingDays = forecast?.days.slice(1) ?? [];
  const updatedAt = formatUpdatedAt(forecastUpdatedAt);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      accessibilityLabel="Pantalla Hoy">
      {activePlace ? (
        <Text style={styles.cityTitle} accessibilityRole="header">
          {activePlace.name}
        </Text>
      ) : (
        <Text style={styles.note}>
          Actualiza tu ubicación o busca un lugar en la pestaña Buscar.
        </Text>
      )}

      {/* Justo tras la cabecera, tal como se pidió: con flick arriba/abajo se recorre la lista de
          lugares y Hoy se actualiza al pararse. */}
      {mostrarSelector && (
        <SelectorLugar
          seleccionables={seleccionables}
          indiceSeleccionado={indiceSeleccionado}
          currentByPlace={currentByPlace}
          ahora={ahora}
          onCambiar={cambiarSeleccion}
          onSeleccionar={seleccionarLugar}
        />
      )}

      {today && (
        <View style={styles.currentCard}>
          <View
            accessible
            accessibilityLabel={`Ahora: ${forecast?.current?.temperature ?? '-'} grados, ${currentInfo.label}`}>
            <Text style={styles.currentTemp}>{forecast?.current?.temperature ?? '-'}º</Text>
            <Text style={styles.currentSky}>
              {currentInfo.emoji} {currentInfo.label}
            </Text>
          </View>

          {updatedAt && (
            <Text
              style={styles.updatedLine}
              accessibilityLabel={`Datos actualizados el ${updatedAt}`}>
              Actualizado: {updatedAt}
            </Text>
          )}

          <View style={styles.detailList}>
            {todayDetails.map((line) => (
              <View
                key={line.title}
                style={styles.detailRow}
                accessible
                accessibilityLabel={`${line.title}: ${line.spoken}`}>
                <Text style={styles.detailTitle}>{line.title}</Text>
                <Text style={styles.detailValue}>{line.value}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.buttonSecondary}
            onPress={() => setDetail({ day: today, showSummary: false })}
            accessibilityRole="button"
            accessibilityLabel="Ver hoy (hora a hora)">
            <Text style={styles.buttonSecondaryText}>Hoy (hora a hora)</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        style={styles.buttonPrimary}
        onPress={() => {
          if (isCurrentLocation) {
            void refreshCurrentLocation();
          } else {
            reloadForecast();
          }
        }}
        accessibilityRole="button"
        accessibilityLabel={isCurrentLocation ? 'Actualizar mi ubicación' : 'Actualizar previsión'}
        accessibilityHint={
          isCurrentLocation ? 'Usa el GPS del teléfono para detectar dónde estás' : undefined
        }>
        <Text style={styles.buttonText}>
          {isCurrentLocation ? 'Actualizar mi ubicación' : 'Actualizar previsión'}
        </Text>
      </Pressable>

      {(loadingForecast || loadingLocation) && (
        <ActivityIndicator
          color="#9ed3ff"
          accessibilityLabel="Cargando"
          accessibilityRole="progressbar"
        />
      )}

      {upcomingDays.length > 0 && (
        <>
          <Text style={styles.sectionHeader} accessibilityRole="header">
            Próximos días
          </Text>
          <View style={styles.daysCard}>
            {upcomingDays.map((day, index) => (
              <DayRow
                key={day.date}
                day={day}
                isLast={index === upcomingDays.length - 1}
                onOpen={() => setDetail({ day, showSummary: true })}
              />
            ))}
          </View>
        </>
      )}
      {!loadingForecast && !forecast && (
        <Text style={styles.note}>Todavía no hay datos disponibles.</Text>
      )}
      <Text style={styles.statusNote}>{message}</Text>

      <DayDetailModal
        visible={detail !== undefined}
        day={detail?.day}
        place={activePlace}
        showSummary={detail?.showSummary ?? true}
        onClose={() => setDetail(undefined)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Fondo oscuro explícito: sin esto, en iOS (userInterfaceStyle light) el fondo del sistema es
  // blanco y los textos claros de fuera de las tarjetas quedan invisibles.
  screen: {
    flex: 1,
    backgroundColor: '#0d1a2b',
  },
  content: {
    // paddingTop se calcula con la zona segura de iOS (useSafeAreaInsets), no fijo: sin esto el
    // titulo se metia debajo de la hora y los iconos de estado del sistema.
    paddingHorizontal: 16,
    paddingBottom: 96,
    gap: 16,
  },
  cityTitle: {
    color: '#f4f8ff',
    fontSize: 34,
    fontWeight: '700',
  },
  currentCard: {
    backgroundColor: '#132740',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  currentTemp: {
    color: '#ffffff',
    fontSize: 54,
    fontWeight: '700',
    textAlign: 'center',
  },
  currentSky: {
    color: '#dbe8ff',
    fontSize: 17,
    textAlign: 'center',
  },
  updatedLine: {
    color: '#b8c6dc',
    fontSize: 15,
    textAlign: 'center',
  },
  detailList: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a4367',
  },
  detailTitle: {
    color: '#b8c6dc',
    fontSize: 15,
  },
  detailValue: {
    color: '#f4f8ff',
    fontSize: 17,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  buttonPrimary: {
    borderRadius: 12,
    backgroundColor: '#1b5ea9',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  // Boton secundario: mismo relleno azul que el primario para que se distinga del fondo oscuro
  // (antes usaba #0e2238, casi identico al fondo y practicamente invisible). El borde claro lo
  // mantiene reconocible como accion secundaria sin perder contraste.
  buttonSecondary: {
    borderRadius: 12,
    backgroundColor: '#1b5ea9',
    borderWidth: 1,
    borderColor: '#7cbcff',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonSecondaryText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  sectionHeader: {
    color: '#eaf3ff',
    fontSize: 20,
    fontWeight: '600',
  },
  daysCard: {
    backgroundColor: '#132740',
    borderRadius: 16,
    overflow: 'hidden',
  },
  note: {
    color: '#b8c6dc',
    fontSize: 15,
  },
  statusNote: {
    color: '#c2d0e6',
    fontSize: 13,
  },
});
