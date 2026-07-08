import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getHourlyForecast } from '../services/openMeteo';
import { DayForecast, HourlyForecast, Place } from '../types';
import { buildDayDetails, formatFullDate, formatTime } from '../utils/dayDetails';
import { describeWeatherCode } from '../utils/weatherCodes';

interface Props {
  visible: boolean;
  day: DayForecast | undefined;
  place: Place | undefined;
  onClose: () => void;
}

export default function DayDetailModal({ visible, day, place, onClose }: Props) {
  const [hours, setHours] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible || !day || !place) {
      return;
    }

    setLoading(true);
    setError('');
    getHourlyForecast(place.lat, place.lon, day.date)
      .then(setHours)
      .catch((err) => setError(String((err as Error).message ?? err)))
      .finally(() => setLoading(false));
  }, [visible, day, place]);

  const skyInfo = describeWeatherCode(day?.weatherCode);
  const details = day ? buildDayDetails(day) : [];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} accessibilityViewIsModal>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.grabber} importantForAccessibility="no" />
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title} accessibilityRole="header">
                {day ? formatFullDate(day.date) : 'Detalle del día'}
              </Text>
              <Text style={styles.subtitle}>
                {skyInfo.emoji} {skyInfo.label}
              </Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar detalle del día"
            >
              <Text style={styles.closeText}>Cerrar</Text>
            </Pressable>
          </View>

          <ScrollView>
            <Text style={styles.sectionHeader} accessibilityRole="header">
              Resumen del día
            </Text>
            {details.map((line) => (
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

            <Text style={styles.sectionHeader} accessibilityRole="header">
              Por horas
            </Text>
            {loading && <ActivityIndicator color="#9ed3ff" accessibilityLabel="Cargando previsión por horas" />}
            {!loading && error ? <Text style={styles.note}>Error: {error}</Text> : null}

            {!loading &&
              !error &&
              hours.map((item) => {
                const info = describeWeatherCode(item.weatherCode);
                const label = `${formatTime(item.time) ?? item.time}: ${item.temperature ?? 'sin dato'} grados, ${
                  info.label
                }, probabilidad de lluvia ${item.rainProbability ?? 0} por ciento, viento ${
                  item.windSpeed ?? 'sin dato'
                } kilómetros por hora`;
                return (
                  <View key={item.time} style={styles.hourRow} accessible accessibilityLabel={label}>
                    <Text style={styles.hourTime}>{formatTime(item.time) ?? item.time}</Text>
                    <Text style={styles.hourIcon}>{info.emoji}</Text>
                    <Text style={styles.hourTemp}>{item.temperature ?? '-'}º</Text>
                    <View style={styles.hourMeta}>
                      <Text style={styles.hourMetaText}>Lluvia {item.rainProbability ?? '-'}%</Text>
                      <Text style={styles.hourMetaText}>Viento {item.windSpeed ?? '-'} km/h</Text>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#132740',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#3a5578',
    marginTop: 8,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: '#f4f8ff',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#b8c6dc',
    fontSize: 15,
  },
  closeButton: {
    borderRadius: 12,
    backgroundColor: '#1b5ea9',
    paddingHorizontal: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  closeText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  sectionHeader: {
    color: '#eaf3ff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
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
  note: {
    color: '#b8c6dc',
    fontSize: 15,
  },
  hourRow: {
    borderRadius: 12,
    backgroundColor: '#0e2238',
    padding: 12,
    marginBottom: 8,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  hourTime: {
    color: '#dbe8ff',
    width: 56,
    fontSize: 17,
    fontWeight: '600',
  },
  hourIcon: {
    fontSize: 20,
  },
  hourTemp: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    width: 56,
    textAlign: 'center',
  },
  hourMeta: {
    alignItems: 'flex-end',
    gap: 2,
  },
  hourMetaText: {
    color: '#b7c7e1',
    fontSize: 13,
  },
});
