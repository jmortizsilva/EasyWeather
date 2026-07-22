import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DayForecast } from '../types';
import { buildDayDetails, formatFullDate } from '../utils/dayDetails';
import { describeWeatherCode } from '../utils/weatherCodes';

export interface DayRowProps {
  day: DayForecast;
  isLast: boolean;
  onOpen: () => void;
}

export const DAY_ROW_HINT = 'Toca dos veces para abrir la ficha completa del día';

// Lógica compartida por las dos variantes de la fila (la nativa de iOS y la del resto de
// plataformas): qué dato del día se está verbalizando y las etiquetas que lee VoiceOver.
export function useDayRow(day: DayForecast) {
  const [detailIndex, setDetailIndex] = useState(-1);
  const details = buildDayDetails(day);
  const info = describeWeatherCode(day.weatherCode);
  const label = `${formatFullDate(day.date)}: mínima ${day.tMin ?? 'sin dato'} grados, máxima ${
    day.tMax ?? 'sin dato'
  } grados, ${info.label}, probabilidad de lluvia ${day.rainProbability ?? 0} por ciento`;
  const current = detailIndex >= 0 ? details[detailIndex] : undefined;
  const value = current ? `${current.title}: ${current.spoken}` : '';

  // Flick abajo avanza al siguiente dato, flick arriba vuelve al anterior.
  const next = () => setDetailIndex((index) => Math.min(index + 1, details.length - 1));
  const previous = () => setDetailIndex((index) => Math.max(index - 1, 0));

  return { info, label, value, next, previous };
}

export function DayRowContent({ day, emoji }: { day: DayForecast; emoji: string }) {
  return (
    <>
      <Text style={dayRowStyles.dayDate}>{formatFullDate(day.date)}</Text>
      <View style={dayRowStyles.dayRight}>
        <Text style={dayRowStyles.daySky}>{emoji}</Text>
        <Text style={dayRowStyles.dayTemp}>
          {day.tMin ?? '-'}º / {day.tMax ?? '-'}º
        </Text>
        <Text style={dayRowStyles.dayMeta}>💧 {day.rainProbability ?? '-'}%</Text>
      </View>
    </>
  );
}

export const dayRowStyles = StyleSheet.create({
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
});
