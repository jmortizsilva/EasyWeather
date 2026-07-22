import { Pressable } from 'react-native';
import { DAY_ROW_HINT, DayRowContent, DayRowProps, dayRowStyles, useDayRow } from './DayRowContent';

// Variante para plataformas que no son iOS (y para el preview web). Solo puede declarar un
// rol, así que se queda con "ajustable": el flick vertical recorre los datos y el doble
// toque abre la ficha. En iOS se usa DayRow.ios.tsx, que además transmite el rol de botón.
export default function DayRow({ day, isLast, onOpen }: DayRowProps) {
  const { info, label, value, next, previous } = useDayRow(day);

  return (
    <Pressable
      style={[dayRowStyles.dayRow, !isLast && dayRowStyles.dayRowDivider]}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: value }}
      accessibilityHint={DAY_ROW_HINT}
      // Las acciones estándar se manejan aquí pero NO se declaran en accessibilityActions:
      // declararlas las hacía aparecer como acciones del rotor, que no se quieren.
      onAccessibilityAction={(event) => {
        const action = event.nativeEvent.actionName;
        if (action === 'activate') {
          onOpen();
          return;
        }
        if (action === 'decrement') {
          next();
        }
        if (action === 'increment') {
          previous();
        }
      }}
      onPress={onOpen}
    >
      <DayRowContent day={day} emoji={info.emoji} />
    </Pressable>
  );
}
