import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { NombreTema, Paleta, PALETAS } from './colores';
import {
  leerPreferencia,
  PREFERENCIA_POR_DEFECTO,
  PreferenciaTema,
  resolverTema,
} from './preferencia';

const STORAGE_TEMA = 'tiempo.tema.v1';

interface TemaContextValue {
  /** Colores ya resueltos: es lo que usan las pantallas. */
  colores: Paleta;
  /** Tema efectivo ('claro' u 'oscuro'), para la barra de estado y el tema de navegacion. */
  tema: NombreTema;
  /** Lo elegido por el usuario (puede ser 'automatico'). */
  preferencia: PreferenciaTema;
  cambiarPreferencia: (valor: PreferenciaTema) => void;
}

const TemaContext = createContext<TemaContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // useColorScheme se apoya en useSyncExternalStore, asi que el cambio de Ajustes del iPhone entra
  // en vivo sin recargar la app. Requiere userInterfaceStyle "automatic" en app.json: con "dark"
  // fijo, iOS responde siempre 'dark' haga lo que haga el usuario.
  const esquemaSistema = useColorScheme();
  const [preferencia, setPreferencia] = useState<PreferenciaTema>(PREFERENCIA_POR_DEFECTO);

  useEffect(() => {
    let vigente = true;
    void AsyncStorage.getItem(STORAGE_TEMA).then((guardado) => {
      if (vigente) {
        setPreferencia(leerPreferencia(guardado));
      }
    });
    return () => {
      vigente = false;
    };
  }, []);

  const cambiarPreferencia = useCallback((valor: PreferenciaTema) => {
    setPreferencia(valor);
    void AsyncStorage.setItem(STORAGE_TEMA, valor);
  }, []);

  const tema = resolverTema(preferencia, esquemaSistema);

  return (
    <TemaContext.Provider value={{ colores: PALETAS[tema], tema, preferencia, cambiarPreferencia }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema(): TemaContextValue {
  const contexto = useContext(TemaContext);
  if (!contexto) {
    throw new Error('useTema debe usarse dentro de ThemeProvider');
  }
  return contexto;
}

/** Atajo para el caso habitual: solo los colores. */
export function useColores(): Paleta {
  return useTema().colores;
}
