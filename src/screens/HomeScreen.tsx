import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DayDetailModal from '../components/DayDetailModal';
import { CURRENT_LOCATION_ID, usePlaces } from '../state/PlacesContext';
import { DayForecast } from '../types';
import { buildDayDetails, formatFullDate, formatTime } from '../utils/dayDetails';
import { describeWeatherCode } from '../utils/weatherCodes';

interface DayRowProps {
  day: DayForecast;
  isLast: boolean;
  onOpen: () => void;
}

// Fila de día "ajustable": VoiceOver verbaliza cada dato con flick vertical de un
// dedo (mismo rasgo que un deslizador de iOS). Flick abajo avanza al siguiente dato,
// flick arriba vuelve al anterior. Como en iOS un elemento solo puede tener un rol,
// no puede ser "ajustable" y "botón" a la vez; para que la ficha completa siga siendo
// descubrible sin depender de las pistas (que se pueden desactivar), se ofrece por dos
// canales: el doble toque (acción "activar") y una acción personalizada del rotor.
function DayRow({ day, isLast, onOpen }: DayRowProps) {
  const [detailIndex, setDetailIndex] = useState(-1);
  const details = buildDayDetails(day);
  const info = describeWeatherCode(day.weatherCode);
  const label = `${formatFullDate(day.date)}: mínima ${day.tMin ?? 'sin dato'} grados, máxima ${
    day.tMax ?? 'sin dato'
  } grados, ${info.label}, probabilidad de lluvia ${day.rainProbability ?? 0} por ciento`;
  const current = detailIndex >= 0 ? details[detailIndex] : undefined;

  return (
    <Pressable
      style={[styles.dayRow, !isLast && styles.dayRowDivider]}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={current ? { text: `${current.title}: ${current.spoken}` } : { text: '' }}
      accessibilityHint="Toca dos veces para abrir la ficha completa del día"
      accessibilityActions={[
        { name: 'increment' },
        { name: 'decrement' },
        { name: 'activate' },
        { name: 'abrirFicha', label: 'Abrir ficha completa del día' },
      ]}
      onAccessibilityAction={(event) => {
        const action = event.nativeEvent.actionName;
        if (action === 'activate' || action === 'abrirFicha') {
          onOpen();
          return;
        }
        if (action === 'decrement') {
          setDetailIndex((index) => Math.min(index + 1, details.length - 1));
        }
        if (action === 'increment') {
          setDetailIndex((index) => Math.max(index - 1, 0));
        }
      }}
      onPress={onOpen}
    >
      <Text style={styles.dayDate}>{formatFullDate(day.date)}</Text>
      <View style={styles.dayRight}>
        <Text style={styles.daySky}>{info.emoji}</Text>
        <Text style={styles.dayTemp}>
          {day.tMin ?? '-'}º / {day.tMax ?? '-'}º
        </Text>
        <Text style={styles.dayMeta}>💧 {day.rainProbability ?? '-'}%</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const {
    activeId,
    activePlace,
    forecast,
    loadingForecast,
    loadingLocation,
    message,
    refreshCurrentLocation,
    reloadForecast,
  } = usePlaces();
  const [openDay, setOpenDay] = useState<DayForecast | undefined>(undefined);

  const isCurrentLocation = activeId === CURRENT_LOCATION_ID;
  const currentInfo = describeWeatherCode(forecast?.current?.weatherCode);
  const today = forecast?.days[0];
  const sunrise = formatTime(today?.sunrise);
  const sunset = formatTime(today?.sunset);

  return (
    <ScrollView contentContainerStyle={styles.content} accessibilityLabel="Pantalla Hoy">
      {activePlace ? (
        <Text style={styles.cityTitle} accessibilityRole="header">
          {activePlace.name}
        </Text>
      ) : (
        <Text style={styles.note}>Actualiza tu ubicación o añade un lugar en la pestaña Añadir.</Text>
      )}

      {!loadingForecast && forecast && forecast.days.length > 0 && (
        <View style={styles.currentCard}>
          <View
            accessible
            accessibilityLabel={`Ahora mismo: ${forecast.current?.temperature ?? '-'} grados, ${currentInfo.label}`}
          >
            <Text style={styles.currentTemp}>
              {forecast.current?.temperature ?? '-'}º
            </Text>
            <Text style={styles.currentSky}>
              {currentInfo.emoji} {currentInfo.label}
            </Text>
          </View>

          {sunrise && sunset && (
            <Text
              style={styles.sunLine}
              accessibilityLabel={`Amanece a las ${sunrise}, anochece a las ${sunset}`}
            >
              ☀️ {sunrise} · 🌙 {sunset}
            </Text>
          )}
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
        accessibilityHint={isCurrentLocation ? 'Usa el GPS del teléfono para detectar dónde estás' : undefined}
      >
        <Text style={styles.buttonText}>{isCurrentLocation ? 'Actualizar mi ubicación' : 'Actualizar previsión'}</Text>
      </Pressable>

      {(loadingForecast || loadingLocation) && (
        <ActivityIndicator color="#9ed3ff" accessibilityLabel="Cargando" accessibilityRole="progressbar" />
      )}

      {!loadingForecast && forecast && forecast.days.length > 0 && (
        <>
          <Text style={styles.sectionHeader} accessibilityRole="header">
            Próximos días
          </Text>
          <View style={styles.daysCard}>
            {forecast.days.map((day, index) => (
              <DayRow
                key={day.date}
                day={day}
                isLast={index === forecast.days.length - 1}
                onOpen={() => setOpenDay(day)}
              />
            ))}
          </View>
        </>
      )}
      {!loadingForecast && !forecast && <Text style={styles.note}>No hay datos ahora mismo.</Text>}
      <Text style={styles.statusNote}>{message}</Text>

      <DayDetailModal
        visible={openDay !== undefined}
        day={openDay}
        place={activePlace}
        onClose={() => setOpenDay(undefined)}
      />
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
    alignItems: 'center',
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
  sunLine: {
    color: '#b8c6dc',
    fontSize: 15,
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
  dayRow: {
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  dayRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a4367',
  },
  dayDate: {
    color: '#f0f5ff',
    fontSize: 17,
    fontWeight: '600',
  },
  dayRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  daySky: {
    fontSize: 18,
  },
  dayTemp: {
    color: '#ffffff',
    fontSize: 17,
  },
  dayMeta: {
    color: '#b7c7e1',
    fontSize: 15,
    marginLeft: 'auto',
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
