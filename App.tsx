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
        {/* SIN `tabBarStyle` A PROPOSITO (2026-09-15). No es un descuido ni una simplificacion.

            Con iOS 27, VoiceOver dejaba las pestañas ya visitadas dichas como "seleccionadas" y se
            acumulaban: al recorrer las tres, las tres lo decian. La barra es nativa, asi que el
            rasgo no lo ponemos nosotros y no hay nada que corregir desde aqui.

            Lo localizo comparar con Audiocinemateca, que lleva la MISMA libreria en la MISMA
            version (1.4.0) y no falla. Solo haciamos dos cosas distintas: fondo propio de la barra
            e iconos. Quitando las dos, VoiceOver volvio a decirlo solo en la pestaña activa
            (comprobado en el iPhone el 2026-09-15). Los iconos vuelven aqui porque la app tiene que
            ser accesible Y verse bien; el fondo se queda fuera, que es lo que menos cuesta perder.

            Por que el fondo es el sospechoso que se queda fuera: `tabBarStyle.backgroundColor`
            acaba en un `backgroundColor` explicito del `UITabBarAppearance`
            (react-native-bottom-tabs 1.4.0, ios/TabViewImpl.swift, configureStandardAppearance),
            que en iOS 26+ sustituye al cristal liquido. Ya hay fallos abiertos en la libreria con
            esa combinacion (callstack/react-native-bottom-tabs#433 y #448).

            SI EL FALLO VUELVE CON LOS ICONOS, entonces eran ellos y no el fondo: la libreria
            reasigna `item.image` y `item.selectedImage` en cada pasada de layout y por duplicado
            (una sincrona y otra en un `DispatchQueue.main.async`), lo que obliga a UIKit a
            reconstruir el boton de la pestaña por detras de los objetos `UITab` y del delegado
            `shouldSelectTab` de iOS 27. En ese caso la salida NO es quedarse sin iconos, es cambiar
            a las pestañas nativas de react-native-screens (TabsHost/TabsScreen), que ya esta
            instalado y compilado, usa la API clasica de UITabBarController, trae SF Symbols y
            expone `tabItemAccessibilityLabel` como prop. */}
        <Tab.Navigator
          tabBarActiveTintColor={colores.acento}
          tabBarInactiveTintColor={colores.tabInactivo}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Hoy',
              tabBarIcon: () => ({ sfSymbol: 'sun.max.fill' }),
            }}
          />
          <Tab.Screen
            name="Places"
            component={PlacesScreen}
            options={{
              tabBarLabel: 'Mis lugares',
              tabBarIcon: () => ({ sfSymbol: 'list.bullet' }),
            }}
          />
          {/* Buscar ya no es pestaña: su contenido es "añadir un lugar", así que se abre como
              hoja desde el botón "Añadir lugar" de Mis lugares. Una pestaña menos que recorrer. */}
          <Tab.Screen
            name="Alerts"
            component={AvisosIndexScreen}
            options={{
              tabBarLabel: 'Avisos',
              tabBarIcon: () => ({ sfSymbol: 'bell.fill' }),
            }}
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
