// Los lugares que se pueden elegir en un aviso de resumen: la ubicación actual primero y luego los
// guardados. Vive aparte porque lo usan la lista y el editor.

import { useMemo } from 'react';
import { CURRENT_LOCATION_ID, usePlaces } from '../../state/PlacesContext';

export interface PlaceOption {
  id: string;
  name: string;
}

export function usePlaceOptions(): PlaceOption[] {
  const { places, currentLocationPlace } = usePlaces();
  return useMemo(
    () => [
      {
        id: CURRENT_LOCATION_ID,
        name: currentLocationPlace
          ? `Mi ubicación (${currentLocationPlace.name})`
          : 'Mi ubicación actual',
      },
      ...places.map((p) => ({ id: p.id, name: p.name })),
    ],
    [places, currentLocationPlace],
  );
}

export function placeName(options: PlaceOption[], id: string): string {
  return options.find((o) => o.id === id)?.name ?? 'Lugar no disponible';
}
