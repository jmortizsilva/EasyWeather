import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AvisosIndexScreen from './src/screens/avisos/AvisosIndexScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlacesScreen from './src/screens/PlacesScreen';
import { NotificationsProvider } from './src/state/NotificationsContext';
import { PlacesProvider } from './src/state/PlacesContext';
import { TabParamList } from './src/navigation/types';
import { ThemeProvider, useTema } from './src/theme/ThemeContext';

// Variante solo para web: react-native-bottom-tabs no tiene soporte web, así que aquí
// se usa el navegador de pestañas en JS. Sirve únicamente para poder verificar la app
// en el navegador durante el desarrollo; en iOS/Android se usa App.tsx (pestañas nativas).
// Buscar no es pestaña: se abre como hoja desde "Mis lugares", igual que en iOS.
const Tab = createBottomTabNavigator<TabParamList>();

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
      <StatusBar style={tema === 'oscuro' ? 'light' : 'dark'} />
      <NavigationContainer theme={navigationTheme}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colores.tarjeta,
              borderTopColor: colores.bordeNavegacion,
            },
            tabBarActiveTintColor: colores.acento,
            tabBarInactiveTintColor: colores.tabInactivo,
          }}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Hoy',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="sunny-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Places"
            component={PlacesScreen}
            options={{
              tabBarLabel: 'Mis lugares',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Alerts"
            component={AvisosIndexScreen}
            options={{
              tabBarLabel: 'Avisos',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="notifications-outline" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <PlacesProvider>
          <NotificationsProvider>
            <Navegacion />
          </NotificationsProvider>
        </PlacesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
