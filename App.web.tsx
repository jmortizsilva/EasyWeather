import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AvisosIndexScreen from './src/screens/avisos/AvisosIndexScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlacesScreen from './src/screens/PlacesScreen';
import { ClavePestana, PESTANAS } from './src/navegacion/pestanas';
import { PestanasProvider, usePestanas } from './src/navegacion/PestanasContext';
import { NotificationsProvider } from './src/state/NotificationsContext';
import { PlacesProvider } from './src/state/PlacesContext';
import { ThemeProvider, useColores, useTema } from './src/theme/ThemeContext';

// Variante SOLO para web. La barra de pestañas de iOS es nativa y en web no existe: las
// `Tabs.Screen` de react-native-screens se convierten alli en `View` a secas, asi que las tres
// pantallas saldrian apiladas y sin forma de cambiar de una a otra.
//
// Esto sirve unicamente para poder mirar la app en el navegador durante el desarrollo; en el
// iPhone manda App.tsx. Metro elige el fichero por la extension de plataforma.
//
// Ojo: la pestaña activa sale del MISMO PestanasProvider que en iOS, no de un navegador aparte.
// Antes esto montaba react-navigation solo para web y eran dos modelos de navegacion conviviendo;
// con las pantallas preguntando por la pestaña activa, eso ya no vale.

const PANTALLAS: Record<ClavePestana, () => React.JSX.Element> = {
  hoy: HomeScreen,
  lugares: PlacesScreen,
  avisos: AvisosIndexScreen,
};

const ICONOS: Record<ClavePestana, keyof typeof Ionicons.glyphMap> = {
  hoy: 'sunny-outline',
  lugares: 'list-outline',
  avisos: 'notifications-outline',
};

function Navegacion() {
  const colores = useColores();
  const { tema } = useTema();
  const { activa, irA } = usePestanas();
  const Pantalla = PANTALLAS[activa];

  return (
    <View style={[estilos.raiz, { backgroundColor: colores.fondo }]}>
      <StatusBar style={tema === 'oscuro' ? 'light' : 'dark'} />
      <View style={estilos.contenido}>
        <Pantalla />
      </View>
      <View
        style={[
          estilos.barra,
          { backgroundColor: colores.tarjeta, borderTopColor: colores.bordeNavegacion },
        ]}>
        {PESTANAS.map((pestana) => {
          const elegida = pestana.clave === activa;
          const color = elegida ? colores.acento : colores.tabInactivo;
          return (
            <Pressable
              key={pestana.clave}
              onPress={() => irA(pestana.clave)}
              accessibilityRole="button"
              accessibilityState={{ selected: elegida }}
              accessibilityLabel={pestana.titulo}
              style={estilos.pestana}>
              <Ionicons name={ICONOS[pestana.clave]} color={color} size={24} />
              <Text style={[estilos.etiqueta, { color }]}>{pestana.titulo}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1 },
  contenido: { flex: 1 },
  barra: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingBottom: 6 },
  pestana: { flex: 1, alignItems: 'center', paddingTop: 8, gap: 2 },
  etiqueta: { fontSize: 11 },
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <PlacesProvider>
          <NotificationsProvider>
            <PestanasProvider>
              <Navegacion />
            </PestanasProvider>
          </NotificationsProvider>
        </PlacesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
