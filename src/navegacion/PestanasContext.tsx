import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import {
  alConfirmarNativo,
  alPedirDesdeJs,
  ClavePestana,
  ESTADO_INICIAL,
  EstadoPestanas,
  SeleccionNativa,
} from './pestanas';

interface Pestanas {
  activa: ClavePestana;
  /** Cambia de pestaña desde la app (no desde un toque en la barra). */
  irA: (clave: ClavePestana) => void;
  /** Lo que hay que pasarle a `TabsHost` como `navStateRequest`. */
  peticion: { selectedScreenKey: string; baseProvenance: number };
  /** Lo que hay que colgar del `onTabSelected` de `TabsHost`. */
  alSeleccionarNativo: (evento: SeleccionNativa) => void;
}

const Contexto = createContext<Pestanas | undefined>(undefined);

export function PestanasProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoPestanas>(ESTADO_INICIAL);

  const valor = useMemo<Pestanas>(
    () => ({
      activa: estado.clave,
      irA: (clave) => setEstado((actual) => alPedirDesdeJs(actual, clave)),
      peticion: { selectedScreenKey: estado.clave, baseProvenance: estado.confirmado },
      alSeleccionarNativo: (evento) => setEstado((actual) => alConfirmarNativo(actual, evento)),
    }),
    [estado],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usePestanas(): Pestanas {
  const valor = useContext(Contexto);
  if (!valor) {
    throw new Error('usePestanas fuera de PestanasProvider');
  }
  return valor;
}

/**
 * Ejecuta algo cada vez que se entra en una pestaña, y tambien al arrancar si es la inicial.
 *
 * Sustituye a `useFocusEffect` de react-navigation, que se fue con ella. Mismo comportamiento para
 * lo que esta app necesita: refrescar al entrar. No admite limpieza al salir porque ninguna de las
 * dos pantallas que lo usan la tenia, y anadir una sin usarla solo invita a confiar en algo que no
 * se ha probado.
 *
 * `efecto` tiene que venir en un `useCallback`, igual que con useFocusEffect: si cambia de
 * identidad en cada render, esto se dispara en cada render.
 */
export function useAlEntrarEnPestana(clave: ClavePestana, efecto: () => void): void {
  const { activa } = usePestanas();
  const estaActiva = activa === clave;
  useEffect(() => {
    if (estaActiva) {
      efecto();
    }
  }, [estaActiva, efecto]);
}
