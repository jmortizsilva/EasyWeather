import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeSyntheticEvent, useWindowDimensions } from 'react-native';
import { Tabs, TabSelectedEvent } from 'react-native-screens';
import AvisosIndexScreen from './src/screens/avisos/AvisosIndexScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlacesScreen from './src/screens/PlacesScreen';
import { useNavegacionDelPuente } from './src/desarrollo/navegacion';
import { usePuenteDeDesarrollo } from './src/desarrollo/usePuente';
import { ClavePestana, PESTANAS } from './src/navegacion/pestanas';
import { PestanasProvider, usePestanas } from './src/navegacion/PestanasContext';
import { NotificationsProvider } from './src/state/NotificationsContext';
import { PlacesProvider } from './src/state/PlacesContext';
import PublicadorWidget from './src/widget/PublicadorWidget';
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
  const { peticion, alSeleccionarNativo, irA } = usePestanas();

  // Puente de desarrollo (src/desarrollo/): capturas, rastro de accesibilidad y servicios desde la
  // terminal del ordenador. En una build publicada las dos llamadas no hacen nada: __DEV__ es falso
  // y hostUri no existe. Va aqui y no en App porque necesita el irA de PestanasProvider.
  usePuenteDeDesarrollo();
  useNavegacionDelPuente(irA);

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

  // Tamano de letra del sistema. Se usa como `key` de Navegacion: ver el comentario de abajo.
  const { fontScale } = useWindowDimensions();

  return (
    // GestureHandlerRootView es obligatorio para react-native-gesture-handler (v2) y tiene que
    // envolverlo TODO: sin él, el deslizamiento de las filas de "Mis lugares" no llega a activarse.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <PlacesProvider>
            <PublicadorWidget />
            <NotificationsProvider>
              {/* Envuelve a Navegacion, no al reves: las pantallas de dentro preguntan por la
                  pestaña activa (useAlEntrarEnPestana) y "Mis lugares" pide saltar a Hoy. */}
              {/* La `key` con el tamano de letra NO es un apano decorativo: sin ella, subir el
                  tamano con la app abierta la deja ILEGIBLE hasta cerrarla y abrirla. Medido el
                  2026-10-06 con el puente, a escala 3,571 (el maximo de iOS): el texto se dibuja
                  grande pero las cajas se quedan medidas para el tamano viejo, y las letras salen
                  cortadas por la mitad. Tras relanzar, la misma pantalla se ve perfecta.

                  Y no es que React Native no se entere: avisa a JavaScript (RCTDeviceInfo emite
                  `didUpdateDimensions` con el fontScale nuevo) y recoloca la superficie. Lo que no
                  escucha ese cambio es react-native-screens 4.26.2, que es quien hospeda estas
                  pantallas en un UITabBarController nativo. Cambiar la key vuelve a montar el
                  arbol, que es lo que fuerza a medir de nuevo.

                  Va en Navegacion y no mas arriba a proposito: PestanasProvider queda fuera, asi
                  que la pestaña en la que estabas sobrevive al remontaje. Pasa una vez cada mucho,
                  y quien sube la letra prefiere un parpadeo a una pantalla que no puede leer. */}
              <PestanasProvider>
                <Navegacion key={fontScale} />
              </PestanasProvider>
            </NotificationsProvider>
          </PlacesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
