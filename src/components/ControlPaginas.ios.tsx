import AdjustableButton from '../../modules/adjustable-button';
import { Place } from '../types';
import { CONTROL_PAGINAS_HINT, valoresControl } from '../utils/paginasLugar';
import { TempGuardada } from '../utils/tempActual';
import { ControlPaginasContent } from './ControlPaginasContent';

export interface ControlPaginasProps {
  /** Lugares que recorre el control (ubicación actual primero, luego los guardados). */
  lugares: Place[];
  indice: number;
  currentByPlace: Record<string, TempGuardada>;
  /** Momento actual (epoch ms) para la antigüedad; lo inyecta la pantalla. */
  ahora: number;
  onCambiar: (indice: number) => void;
}

/**
 * Variante de iOS. La vista nativa aporta tres cosas que RN no da desde JavaScript: el rasgo de
 * ajustable SIN el de botón (aquí no hay nada que activar), el refresco síncrono de la línea
 * braille dentro del gesto, y el gesto de tres dedos (accessibilityScroll). Ver
 * modules/adjustable-button.
 */
export default function ControlPaginas({
  lugares,
  indice,
  currentByPlace,
  ahora,
  onCambiar,
}: ControlPaginasProps) {
  const actual = Math.min(Math.max(indice, 0), lugares.length - 1);
  const { label, value, valueOnIncrement, valueOnDecrement } = valoresControl(
    lugares,
    actual,
    currentByPlace,
    ahora,
  );

  const anterior = () => onCambiar(Math.max(actual - 1, 0));
  const siguiente = () => onCambiar(Math.min(actual + 1, lugares.length - 1));

  return (
    <AdjustableButton
      label={label}
      value={value}
      valueOnIncrement={valueOnIncrement}
      valueOnDecrement={valueOnDecrement}
      hint={CONTROL_PAGINAS_HINT}
      esBoton={false}
      onAccessibilityIncrement={anterior}
      onAccessibilityDecrement={siguiente}
      // Tres dedos: izquierda avanza, derecha retrocede (como pasar hojas).
      onAccessibilityScrollNext={siguiente}
      onAccessibilityScrollPrevious={anterior}>
      <ControlPaginasContent total={lugares.length} indice={actual} />
    </AdjustableButton>
  );
}
