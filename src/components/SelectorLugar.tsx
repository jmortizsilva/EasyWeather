import { Pressable } from 'react-native';
import { Place } from '../types';
import { TempGuardada, textoLugar } from '../utils/tempActual';
import { SELECTOR_HINT, SelectorLugarContent, valoresSelector } from './SelectorLugarContent';

interface Props {
  seleccionables: Place[];
  indiceSeleccionado: number;
  currentByPlace: Record<string, TempGuardada>;
  ahora: number;
  onCambiar: (indice: number) => void;
  onSeleccionar: (place: Place) => void;
}

// Variante para plataformas que no son iOS (y el preview web). Solo puede declarar un rol, así que
// se queda con "ajustable": el flick recorre los lugares y el doble toque selecciona. En iOS se usa
// SelectorLugar.ios.tsx, que además transmite el rol de botón (ver DayRow, mismo patrón).
export default function SelectorLugar({
  seleccionables,
  indiceSeleccionado,
  currentByPlace,
  ahora,
  onCambiar,
  onSeleccionar,
}: Props) {
  const indice = Math.min(Math.max(indiceSeleccionado, 0), seleccionables.length - 1);
  const lugar = seleccionables[indice];
  const { value } = valoresSelector(seleccionables, indice, currentByPlace, ahora);
  const visible = textoLugar(lugar.name, currentByPlace[lugar.id], ahora).visible;

  const anterior = () => onCambiar(Math.max(indice - 1, 0));
  const siguiente = () => onCambiar(Math.min(indice + 1, seleccionables.length - 1));
  const seleccionar = () => onSeleccionar(lugar);

  return (
    <Pressable
      accessibilityRole="adjustable"
      accessibilityLabel="Lugar"
      accessibilityValue={{ text: value }}
      accessibilityHint={SELECTOR_HINT}
      // Las acciones estándar se atienden aquí pero NO se declaran en accessibilityActions, para que
      // no aparezcan como acciones del rotor (igual que DayRow).
      onAccessibilityAction={(event) => {
        const action = event.nativeEvent.actionName;
        if (action === 'activate') {
          seleccionar();
        } else if (action === 'increment') {
          anterior();
        } else if (action === 'decrement') {
          siguiente();
        }
      }}
      onPress={seleccionar}>
      <SelectorLugarContent
        texto={visible}
        onAnterior={anterior}
        onSiguiente={siguiente}
        onSeleccionar={seleccionar}
        puedeAnterior={indice > 0}
        puedeSiguiente={indice < seleccionables.length - 1}
      />
    </Pressable>
  );
}
