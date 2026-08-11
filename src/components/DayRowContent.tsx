import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColores } from '../theme/ThemeContext';
import { DayForecast } from '../types';
import { buildDayDetails, formatFullDate, valoresFilaDia } from '../utils/dayDetails';
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
  // Se aterriza en la primera opcion (la prevision completa del dia).
  const [detailIndex, setDetailIndex] = useState(0);
  const details = buildDayDetails(day);
  const info = describeWeatherCode(day.weatherCode);
  // La etiqueta es solo el dia: como es un prefijo permanente en la linea braille, no debe llevar
  // texto que cambia. La prevision, que antes vivia aqui, pasa a ser la primera opcion del
  // ajustable, y asi sale de la linea en cuanto se entra en los detalles.
  const label = formatFullDate(day.date);
  const resumen = `mínima ${day.tMin ?? 'sin dato'} grados, máxima ${
    day.tMax ?? 'sin dato'
  } grados, ${info.label}, probabilidad de lluvia ${day.rainProbability ?? 0} por ciento`;
  const opciones = [resumen, ...details.map((linea) => `${linea.title}: ${linea.spoken}`)];

  // value y los valores vecinos se calculan por adelantado: la vista nativa de iOS los usa para
  // refrescar la línea braille de forma síncrona en el flick (ver modules/adjustable-button).
  const { value, valueOnIncrement, valueOnDecrement } = valoresFilaDia(opciones, detailIndex);

  // Flick abajo avanza a la siguiente opcion, flick arriba vuelve a la anterior (arriba = resumen).
  const next = () => setDetailIndex((index) => Math.min(index + 1, opciones.length - 1));
  const previous = () => setDetailIndex((index) => Math.max(index - 1, 0));

  return { info, label, value, valueOnIncrement, valueOnDecrement, next, previous };
}

export function DayRowContent({ day, emoji }: { day: DayForecast; emoji: string }) {
  const colores = useColores();
  return (
    <>
      <Text style={[dayRowStyles.dayDate, { color: colores.textoFila }]}>
        {formatFullDate(day.date)}
      </Text>
      <View style={dayRowStyles.dayRight}>
        <Text style={dayRowStyles.daySky}>{emoji}</Text>
        <Text style={[dayRowStyles.dayTemp, { color: colores.textoFuerte }]}>
          {day.tMin ?? '-'}º / {day.tMax ?? '-'}º
        </Text>
        <Text style={[dayRowStyles.dayMeta, { color: colores.textoMeta }]}>
          💧 {day.rainProbability ?? '-'}%
        </Text>
      </View>
    </>
  );
}

/** Separador entre filas. El color va aparte porque depende del tema. */
export function useDayRowDivider() {
  const colores = useColores();
  return { ...dayRowStyles.dayRowDivider, borderBottomColor: colores.borde };
}

// Solo medidas: el color lo ponen los componentes con los tokens del tema.
export const dayRowStyles = StyleSheet.create({
  dayRow: {
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  dayRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dayDate: {
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
    fontSize: 17,
  },
  dayMeta: {
    fontSize: 15,
    marginLeft: 'auto',
  },
});
