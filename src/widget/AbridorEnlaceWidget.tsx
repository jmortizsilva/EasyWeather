// Al tocar el widget, la app se abre en ese lugar, en «Hoy». Sirve con la app cerrada (el enlace
// llega al arrancar) y con la app ya abierta (llega como evento).

import { useEffect, useRef } from 'react';
import { Linking } from 'react-native';
import { usePestanas } from '../navegacion/PestanasContext';
import { usePlaces } from '../state/PlacesContext';
import { lugarDeEnlace } from './enlaceWidget';

export default function AbridorEnlaceWidget() {
  const { places, currentLocationPlace, setActiveId } = usePlaces();
  const { irA } = usePestanas();
  // Los lugares se cargan del disco después de arrancar, así que el enlace del arranque puede
  // llegar antes que ellos: se guarda aquí y se intenta otra vez cada vez que cambian.
  const pendiente = useRef<string | undefined>(undefined);
  const intentar = useRef(() => {});

  useEffect(() => {
    intentar.current = () => {
      const id = pendiente.current;
      if (!id) return;
      const existe = id === currentLocationPlace?.id || places.some((p) => p.id === id);
      // Un lugar borrado no se abre: la app se queda donde estaba, y el widget ya lo dice.
      if (!existe) return;
      pendiente.current = undefined;
      setActiveId(id);
      irA('hoy');
    };
    intentar.current();
  }, [places, currentLocationPlace, setActiveId, irA]);

  useEffect(() => {
    const recibir = (url: string | null) => {
      pendiente.current = lugarDeEnlace(url);
      intentar.current();
    };
    void Linking.getInitialURL().then(recibir);
    const suscripcion = Linking.addEventListener('url', ({ url }) => recibir(url));
    return () => suscripcion.remove();
  }, []);

  return null;
}
