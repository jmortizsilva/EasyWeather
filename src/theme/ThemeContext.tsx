import { createContext, ReactNode, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { NombreTema, Paleta, PALETAS } from './colores';
import { temaDelSistema } from './temaSistema';

interface TemaContextValue {
  /** Colores ya resueltos: es lo que usan las pantallas. */
  colores: Paleta;
  /** Tema efectivo ('claro' u 'oscuro'), para la barra de estado y el tema de navegacion. */
  tema: NombreTema;
}

const TemaContext = createContext<TemaContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // useColorScheme se apoya en useSyncExternalStore, asi que el cambio de Ajustes del iPhone entra
  // en vivo sin recargar la app. Requiere userInterfaceStyle "automatic" en app.json: con "dark"
  // fijo, iOS responde siempre 'dark' haga lo que haga el usuario.
  //
  // No hay ajuste propio de aspecto: la app respeta lo que haya en el dispositivo, y punto.
  const tema = temaDelSistema(useColorScheme());

  return (
    <TemaContext.Provider value={{ colores: PALETAS[tema], tema }}>{children}</TemaContext.Provider>
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
