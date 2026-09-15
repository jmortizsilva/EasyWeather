import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeSyntheticEvent } from 'react-native';
import { Tabs, TabSelectedEvent } from 'react-native-screens';
import AvisosIndexScreen from './src/screens/avisos/AvisosIndexScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlacesScreen from './src/screens/PlacesScreen';
import { ClavePestana, PESTANAS } from './src/navegacion/pestanas';
import { PestanasProvider, usePestanas } from './src/navegacion/PestanasContext';
import { NotificationsProvider } from './src/state/NotificationsContext';
import { PlacesProvider } from './src/state/PlacesContext';
import { ThemeProvider, useTema } from './src/theme/ThemeContext';
import { useActualizaciones } from './src/utils/actualizaciones';

const PANTALLAS: Record<ClavePestana, () => React.JSX.Element> = {
  hoy: HomeScreen,
  lugares: PlacesScreen,
  avisos: AvisosIndexScreen,
};

// La barra de pestañas es la NATIVA de iOS (UITabBarController), servida por react-native-screens.
// El porque de no usar react-navigation ni react-native-bottom-tabs esta en navegacion/pestanas.ts:
// resumido, la otra libreria rompia el rasgo de "seleccionado" de VoiceOver en iOS 27.
//
// Aqui NO se pinta el fondo de la barra a proposito. Se deja el material del sistema, que en iOS 26
// y 27 es el cristal liquido y se adapta solo a claro y oscuro. El tema de la app sale de
// useColorScheme y app.json declara userInterfaceStyle "automatic", asi que app y barra leen el
// mismo interruptor del iPhone y no pueden desparejarse.
function Navegacion() {
  const { colores, tema } = useTema();
  const { peticion, alSeleccionarNativo } = usePestanas();

  return (
    <>
      {/* Iconos de la barra de estado: claros sobre fondo oscuro y al reves. */}
      <StatusBar style={tema === 'oscuro' ? 'light' : 'dark'} />
      <Tabs.Host
        navStateRequest={peticion}
        onTabSelected={(evento: NativeSyntheticEvent<TabSelectedEvent>) =>
          alSeleccionarNativo(evento.nativeEvent)
        }
        // El fondo del contenedor nativo, no el de la barra: sin el se ve el blanco del sistema
        // durante el cambio de pestaña.
        nativeContainerStyle={{ backgroundColor: colores.fondo }}
        ios={{ tabBarTintColor: colores.acento }}>
        {PESTANAS.map((pestana) => {
          const Pantalla = PANTALLAS[pestana.clave];
          return (
            <Tabs.Screen
              key={pestana.clave}
              screenKey={pestana.clave}
              title={pestana.titulo}
              style={{ backgroundColor: colores.fondo }}
              ios={{ icon: { type: 'sfSymbol', name: pestana.sfSymbol } }}>
              <Pantalla />
            </Tabs.Screen>
          );
        })}
      </Tabs.Host>
    </>
  );
}

export default function App() {
  // Comprueba updates al abrir y al volver a primer plano, y avisa de novedades tras actualizar.
  useActualizaciones();

  return (
    // GestureHandlerRootView es obligatorio para react-native-gesture-handler (v2) y tiene que
    // envolverlo TODO: sin él, el deslizamiento de las filas de "Mis lugares" no llega a activarse.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <PlacesProvider>
            <NotificationsProvider>
              {/* Envuelve a Navegacion, no al reves: las pantallas de dentro preguntan por la
                  pestaña activa (useAlEntrarEnPestana) y "Mis lugares" pide saltar a Hoy. */}
              <PestanasProvider>
                <Navegacion />
              </PestanasProvider>
            </NotificationsProvider>
          </PlacesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
