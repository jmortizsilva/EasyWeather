import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { StatusBar } from 'expo-status-bar';
import SearchScreen from './src/screens/SearchScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlacesScreen from './src/screens/PlacesScreen';
import { PlacesProvider } from './src/state/PlacesContext';
import { TabParamList } from './src/navigation/types';

const Tab = createNativeBottomTabNavigator<TabParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0d1a2b',
    card: '#132740',
    border: '#244061',
    primary: '#7cbcff',
  },
};

export default function App() {
  return (
    <PlacesProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={navigationTheme}>
        <Tab.Navigator
          tabBarStyle={{ backgroundColor: '#132740' }}
          tabBarActiveTintColor="#7cbcff"
          tabBarInactiveTintColor="#a9bcd6"
        >
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
        </Tab.Navigator>
      </NavigationContainer>
    </PlacesProvider>
  );
}
