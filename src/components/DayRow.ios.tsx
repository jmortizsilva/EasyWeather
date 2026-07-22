import { Pressable } from 'react-native';
import AdjustableButton from '../../modules/adjustable-button';
import { DAY_ROW_HINT, DayRowContent, DayRowProps, dayRowStyles, useDayRow } from './DayRowContent';

// Variante de iOS: la vista nativa combina los rasgos "ajustable" y "botón", algo que React
// Native no permite expresar desde JavaScript. Así VoiceOver anuncia que la fila se puede
// pulsar sin perder el flick vertical para recorrer los datos del día.
export default function DayRow({ day, isLast, onOpen }: DayRowProps) {
  const { info, label, value, next, previous } = useDayRow(day);

  return (
    <AdjustableButton
      style={!isLast && dayRowStyles.dayRowDivider}
      label={label}
      value={value}
      hint={DAY_ROW_HINT}
      onAccessibilityActivate={onOpen}
      onAccessibilityDecrement={next}
      onAccessibilityIncrement={previous}
    >
      {/* Toque normal para quien no usa VoiceOver. Se marca accessible={false} porque la
          fila entera ya es un único elemento accesible en la vista nativa. */}
      <Pressable style={dayRowStyles.dayRow} onPress={onOpen} accessible={false}>
        <DayRowContent day={day} emoji={info.emoji} />
      </Pressable>
    </AdjustableButton>
  );
}
