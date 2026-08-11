import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AlertsScreen from './src/screens/AlertsScreen';
import SearchScreen from './src/screens/SearchScreen';
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
        <Tab.Navigator
          tabBarStyle={{ backgroundColor: colores.tarjeta }}
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
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
              tabBarLabel: 'Buscar',
              tabBarIcon: () => ({ sfSymbol: 'magnifyingglass' }),
              role: 'search',
            }}
          />
          <Tab.Screen
            name="Alerts"
            component={AlertsScreen}
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
    <SafeAreaProvider>
      <ThemeProvider>
        <PlacesProvider>
          <NotificationsProvider>
            <Navegacion />
          </NotificationsProvider>
        </PlacesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
