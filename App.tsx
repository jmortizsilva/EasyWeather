import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AvisosIndexScreen from './src/screens/avisos/AvisosIndexScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlacesScreen from './src/screens/PlacesScreen';
import { NotificationsProvider } from './src/state/NotificationsContext';
import { PlacesProvider } from './src/state/PlacesContext';
import { TabParamList } from './src/navigation/types';
import { ThemeProvider, useTema } from './src/theme/ThemeContext';
import { useActualizaciones } from './src/utils/actualizaciones';

const Tab = createNativeBottomTabNavigator<TabParamList>();

// La navegacion y la barra de pestanas (nativa) necesitan sus propios colores: no basta con
// pintar las pantallas, o quedan franjas del tema contrario arriba y abajo.
function Navegacion() {
  const { colores, tema } = useTema();
  const base = tema === 'oscuro' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colores.fondo,
      card: colores.tarjeta,
      border: colores.bordeNavegacion,
      primary: colores.acento,
      text: colores.texto,
    },
  };

  return (
    <>
      {/* Iconos de la barra de estado: claros sobre fondo oscuro y al reves. */}
      <StatusBar style={tema === 'oscuro' ? 'light' : 'dark'} />
      <NavigationContainer theme={navigationTheme}>
        {/* PRUEBA EN CURSO (2026-09-15), NO ES EL ESTADO DEFINITIVO. Ver el bloque de abajo.
            Con iOS 27, VoiceOver deja las pestañas ya visitadas como "seleccionadas" y se
            acumulan: al final las tres lo dicen. Aqui se quitan a la vez el fondo propio de la
            barra y los iconos, que son las dos unicas cosas que hacemos distinto de
            Audiocinemateca, que lleva la MISMA libreria en la MISMA version y no falla.

            Por que estas dos y no otras (react-native-bottom-tabs 1.4.0, TabViewImpl.swift):
            - Los iconos: `configureTabBarItemImages` reasigna `item.image` y `item.selectedImage`
              en cada pasada de layout, y ademas DOS veces (una sincrona y otra en un
              `DispatchQueue.main.async`). Sin `tabBarIcon` ese bloque entero no se ejecuta, que es
              justo el caso de Audiocinemateca. Reescribir las imagenes obliga a UIKit a
              reconstruir el boton de la pestaña, y en iOS 26/27 la barra ya la gobiernan objetos
              `UITab` y el delegado nuevo `shouldSelectTab`: ahi es donde puede quedarse pegado el
              rasgo de seleccionado.
            - `tabBarStyle`: pone un `backgroundColor` explicito en el `UITabBarAppearance`, que en
              iOS 26+ sustituye el cristal liquido. Ya hay fallos abiertos en la libreria con esa
              combinacion (callstack/react-native-bottom-tabs#433 y #448).

            Si con esto se arregla, el siguiente update devuelve los ICONOS y deja fuera solo el
            fondo, que es lo que menos duele perder. Si no se arregla, la causa esta en otro sitio
            y toca pasar a las pestañas nativas de react-native-screens. */}
        <Tab.Navigator
          tabBarActiveTintColor={colores.acento}
          tabBarInactiveTintColor={colores.tabInactivo}>
          <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Hoy' }} />
          <Tab.Screen
            name="Places"
            component={PlacesScreen}
            options={{ tabBarLabel: 'Mis lugares' }}
          />
          {/* Buscar ya no es pestaña: su contenido es "añadir un lugar", así que se abre como
              hoja desde el botón "Añadir lugar" de Mis lugares. Una pestaña menos que recorrer. */}
          <Tab.Screen
            name="Alerts"
            component={AvisosIndexScreen}
            options={{ tabBarLabel: 'Avisos' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
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
              <Navegacion />
            </NotificationsProvider>
          </PlacesProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
