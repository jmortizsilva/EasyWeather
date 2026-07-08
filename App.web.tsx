import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import AddPlaceScreen from './src/screens/AddPlaceScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlacesScreen from './src/screens/PlacesScreen';
import { PlacesProvider } from './src/state/PlacesContext';
import { TabParamList } from './src/navigation/types';

// Variante solo para web: react-native-bottom-tabs no tiene soporte web, así que aquí
// se usa el navegador de pestañas en JS. Sirve únicamente para poder verificar la app
// en el navegador durante el desarrollo; en iOS/Android se usa App.tsx (pestañas nativas).
const Tab = createBottomTabNavigator<TabParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0d1a2b',
    card: '#132740',
    border: '#244061',
    primary: '#6eb4ff',
  },
};

export default function App() {
  return (
    <PlacesProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={navigationTheme}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: '#132740', borderTopColor: '#244061' },
            tabBarActiveTintColor: '#6eb4ff',
            tabBarInactiveTintColor: '#9eb2ce',
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Hoy',
              tabBarIcon: ({ color, size }) => <Ionicons name="sunny-outline" color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="Places"
            component={PlacesScreen}
            options={{
              tabBarLabel: 'Mis lugares',
              tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="AddPlace"
            component={AddPlaceScreen}
            options={{
              tabBarLabel: 'Añadir',
              tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" color={color} size={size} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PlacesProvider>
  );
}
