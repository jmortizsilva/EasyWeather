import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DayDetailModal from '../components/DayDetailModal';
import { CURRENT_LOCATION_ID, usePlaces } from '../state/PlacesContext';
import { DayForecast } from '../types';
import { buildDayDetails, formatFullDate, formatUpdatedAt } from '../utils/dayDetails';
import { describeWeatherCode } from '../utils/weatherCodes';

interface DayRowProps {
  day: DayForecast;
  isLast: boolean;
  onOpen: () => void;
}

// Fila de día "ajustable": VoiceOver verbaliza cada dato con flick vertical de un dedo
// (flick abajo avanza al siguiente dato, flick arriba vuelve al anterior) y el doble toque
// abre la ficha completa. Las acciones estándar (increment/decrement/activate) se manejan en
// onAccessibilityAction pero NO se declaran en accessibilityActions a propósito: declararlas
// las hacía aparecer como acciones del rotor, algo que el usuario no quiere.
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
      onAccessibilityAction={(event) => {
        const action = event.nativeEvent.actionName;
        if (action === 'activate') {
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
    forecastUpdatedAt,
    loadingForecast,
    loadingLocation,
    message,
    refreshCurrentLocation,
    reloadForecast,
  } = usePlaces();
  const [detail, setDetail] = useState<{ day: DayForecast; showSummary: boolean } | undefined>(undefined);

  // Refresca la previsión cada vez que se entra en la pestaña Hoy (y, al ser la
  // pestaña inicial, también al abrir la app). Silencioso si ya hay datos.
  useFocusEffect(
    useCallback(() => {
      reloadForecast(true);
    }, [reloadForecast])
  );

  const isCurrentLocation = activeId === CURRENT_LOCATION_ID;
  const currentInfo = describeWeatherCode(forecast?.current?.weatherCode);
  const today = forecast?.days[0];
  const todayDetails = today ? buildDayDetails(today) : [];
  const upcomingDays = forecast?.days.slice(1) ?? [];
  const updatedAt = formatUpdatedAt(forecastUpdatedAt);

  return (
    <ScrollView contentContainerStyle={styles.content} accessibilityLabel="Pantalla Hoy">
      {activePlace ? (
        <Text style={styles.cityTitle} accessibilityRole="header">
          {activePlace.name}
        </Text>
      ) : (
        <Text style={styles.note}>Actualiza tu ubicación o busca un lugar en la pestaña Buscar.</Text>
      )}

      {today && (
        <View style={styles.currentCard}>
          <View
            accessible
            accessibilityLabel={`Ahora: ${forecast?.current?.temperature ?? '-'} grados, ${currentInfo.label}`}
          >
            <Text style={styles.currentTemp}>{forecast?.current?.temperature ?? '-'}º</Text>
            <Text style={styles.currentSky}>
              {currentInfo.emoji} {currentInfo.label}
            </Text>
          </View>

          {updatedAt && (
            <Text style={styles.updatedLine} accessibilityLabel={`Datos actualizados ${updatedAt}`}>
              Actualizado {updatedAt}
            </Text>
          )}

          <View style={styles.detailList}>
            {todayDetails.map((line) => (
              <View
                key={line.title}
                style={styles.detailRow}
                accessible
                accessibilityLabel={`${line.title}: ${line.spoken}`}
              >
                <Text style={styles.detailTitle}>{line.title}</Text>
                <Text style={styles.detailValue}>{line.value}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.buttonSecondary}
            onPress={() => setDetail({ day: today, showSummary: false })}
            accessibilityRole="button"
            accessibilityLabel="Ver hoy hora a hora"
          >
            <Text style={styles.buttonSecondaryText}>Hoy hora a hora</Text>
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
        accessibilityHint={isCurrentLocation ? 'Usa el GPS del teléfono para detectar dónde estás' : undefined}
      >
        <Text style={styles.buttonText}>{isCurrentLocation ? 'Actualizar mi ubicación' : 'Actualizar previsión'}</Text>
      </Pressable>

      {(loadingForecast || loadingLocation) && (
        <ActivityIndicator color="#9ed3ff" accessibilityLabel="Cargando" accessibilityRole="progressbar" />
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
      {!loadingForecast && !forecast && <Text style={styles.note}>Todavía no hay datos disponibles.</Text>}
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
  buttonSecondary: {
    borderRadius: 12,
    backgroundColor: '#0e2238',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonSecondaryText: {
    color: '#dbe8ff',
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
