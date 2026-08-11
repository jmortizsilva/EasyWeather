import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlPaginas from '../components/ControlPaginas';
import DayDetailModal from '../components/DayDetailModal';
import { crearEstilos, PaginaLugar } from '../components/PrevisionLugar';
import { CURRENT_LOCATION_ID, PrevisionGuardada, usePlaces } from '../state/PlacesContext';
import { useColores } from '../theme/ThemeContext';
import { DayForecast, Place } from '../types';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { width: anchoPantalla } = useWindowDimensions();
  const {
    places,
    currentLocationPlace,
    activeId,
    activePlace,
    loadingForecast,
    loadingLocation,
    message,
    currentByPlace,
    forecastByPlace,
    detectCurrentLocation,
    refreshCurrentLocation,
    refreshCurrentTemps,
    reloadForecast,
    setActiveId,
  } = usePlaces();
  const [detail, setDetail] = useState<{ day: DayForecast; showSummary: boolean } | undefined>(
    undefined,
  );
  const scrollRef = useRef<ScrollView>(null);

  // Páginas del carrusel: la ubicación actual primero, luego los guardados.
  const seleccionables = [currentLocationPlace, ...places].filter((p): p is NonNullable<typeof p> =>
    Boolean(p),
  );
  const indiceActivo = seleccionables.findIndex((p) => p.id === activeId);
  // Con un solo destino no hay nada que pasar; y si se está viendo un lugar buscado sin guardar
  // (no está en la lista), tampoco: esa vista es de un único lugar.
  const hayPaginas = seleccionables.length >= 2 && indiceActivo >= 0;

  // Página mostrada. Se lleva aparte de activeId porque el scroll físico va por delante del estado.
  const [indicePagina, setIndicePagina] = useState(Math.max(indiceActivo, 0));

  // Si el lugar activo cambia por fuera (GPS, Mis lugares, Buscar), la página se pone al día.
  // Ajuste de estado durante el render (patrón recomendado de React) en vez de un efecto: no
  // provoca renders en cascada. Del scroll se encarga el efecto de abajo, no el render.
  const [activeIdPrevio, setActiveIdPrevio] = useState(activeId);
  if (activeId !== activeIdPrevio) {
    setActiveIdPrevio(activeId);
    if (indiceActivo >= 0 && indiceActivo !== indicePagina) {
      setIndicePagina(indiceActivo);
    }
  }

  // Página en la que ya está el scroll de verdad. Evita reordenar el carrusel cuando el cambio
  // vino del propio dedo del usuario (ahí el scroll ya está donde toca y animarlo daría un tirón).
  const paginaDesplazada = useRef(Math.max(indiceActivo, 0));

  // Mover el scroll es un efecto sobre una vista nativa: no puede hacerse durante el render.
  useEffect(() => {
    if (paginaDesplazada.current === indicePagina) {
      return;
    }
    paginaDesplazada.current = indicePagina;
    scrollRef.current?.scrollTo({ x: indicePagina * anchoPantalla, animated: true });
  }, [indicePagina, anchoPantalla]);

  // Momento actual para calcular la antigüedad de las temperaturas. Se fija al recibir el foco (no
  // Date.now en render, que sería impuro); mientras tanto 0 hace que se traten como frescas.
  const [ahora, setAhora] = useState(0);

  // Cambio de página desde el control de puntos (flick vertical o gesto de tres dedos). Se mueve
  // el scroll Y se cambia el lugar activo: en este diseño la página ES la selección.
  const irAPagina = (indice: number) => {
    if (indice === indicePagina) {
      return;
    }
    setIndicePagina(indice);
    const destino = seleccionables[indice];
    if (destino && destino.id !== activeId) {
      setActiveId(destino.id);
    }
  };

  // Deslizamiento con el dedo: el scroll ya se ha movido, solo hay que igualar el estado. Se marca
  // la página como ya desplazada para que el efecto no vuelva a animarla hasta donde ya está.
  const alTerminarDeslizamiento = (evento: NativeSyntheticEvent<NativeScrollEvent>) => {
    const indice = Math.round(evento.nativeEvent.contentOffset.x / anchoPantalla);
    if (indice === indicePagina || indice < 0 || indice >= seleccionables.length) {
      return;
    }
    paginaDesplazada.current = indice;
    setIndicePagina(indice);
    const destino = seleccionables[indice];
    if (destino && destino.id !== activeId) {
      setActiveId(destino.id);
    }
  };

  // Al entrar en la pestaña Hoy se comprueba si el usuario se ha movido de ciudad y se
  // refresca la previsión. Silencioso si ya hay datos. También se refrescan las temperaturas
  // que muestra el control de páginas.
  useFocusEffect(
    useCallback(() => {
      setAhora(Date.now());
      void detectCurrentLocation();
      reloadForecast(true);
      void refreshCurrentTemps();
    }, [detectCurrentLocation, reloadForecast, refreshCurrentTemps]),
  );

  const actualizar = (place: Place) => {
    if (place.id === CURRENT_LOCATION_ID) {
      void refreshCurrentLocation();
    } else {
      reloadForecast();
    }
  };

  // SIEMPRE del mapa por lugar, nunca del `forecast` vivo. Tomarlo del vivo cuando el lugar era el
  // activo parecía razonable, pero era un fallo: al cambiar de página, `activeId` pasa al lugar
  // nuevo de inmediato mientras `forecast` sigue teniendo los datos del ANTERIOR hasta que termina
  // la carga, así que la página nueva se pintaba con la previsión del lugar viejo. El mapa se
  // escribe a la vez que `forecast` (aplicarPrevision), así que no se pierde nada.
  const previsionDe = (place: Place): PrevisionGuardada | undefined => forecastByPlace[place.id];

  const abrirDia = (day: DayForecast, showSummary: boolean) => setDetail({ day, showSummary });
  const cargando = loadingForecast || loadingLocation;
  // Título: el lugar de la página que se está viendo.
  const lugarVisible = hayPaginas ? seleccionables[indicePagina] : activePlace;

  return (
    <View style={styles.screen}>
      {/* Cabecera fija (no se desliza con las páginas): título y, justo detrás, el control de
          páginas, que es el orden que se pidió para VoiceOver. */}
      <View style={[styles.cabecera, { paddingTop: insets.top + 12 }]}>
        {lugarVisible ? (
          <Text style={styles.cityTitle} accessibilityRole="header">
            {lugarVisible.name}
          </Text>
        ) : (
          <Text style={styles.note}>Actualiza tu ubicación o busca un lugar para empezar.</Text>
        )}

        {hayPaginas && (
          <ControlPaginas
            lugares={seleccionables}
            indice={indicePagina}
            currentByPlace={currentByPlace}
            ahora={ahora}
            onCambiar={irAPagina}
          />
        )}
      </View>

      {hayPaginas ? (
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={alTerminarDeslizamiento}
          // Es un UIScrollView de verdad: de ahí que el gesto de tres dedos de VoiceOver pase de
          // página cuando el foco está dentro de una.
          contentOffset={{ x: indicePagina * anchoPantalla, y: 0 }}>
          {seleccionables.map((place, indice) => (
            <View
              key={place.id}
              style={{ width: anchoPantalla }}
              // SOLO la página visible está en el árbol de accesibilidad. Es lo que hace la app
              // Tiempo de iOS con su UIPageViewController, que mantiene únicamente la página
              // actual en la jerarquía. Sin esto, las N páginas siguen siendo elementos de
              // VoiceOver aunque estén fuera de pantalla, y un flick a la derecha desde el control
              // de páginas se iba al contenido de la PRIMERA página en vez de al de la que se ve.
              accessibilityElementsHidden={indice !== indicePagina}
              importantForAccessibility={indice === indicePagina ? 'auto' : 'no-hide-descendants'}>
              <PaginaLugar
                place={place}
                prevision={previsionDe(place)}
                esActiva={place.id === activeId}
                cargando={cargando}
                message={message}
                styles={styles}
                colorCarga={colores.acentoSuave}
                onActualizar={() => actualizar(place)}
                onAbrirDia={abrirDia}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        activePlace && (
          <PaginaLugar
            place={activePlace}
            prevision={previsionDe(activePlace)}
            esActiva
            cargando={cargando}
            message={message}
            styles={styles}
            colorCarga={colores.acentoSuave}
            onActualizar={() => actualizar(activePlace)}
            onAbrirDia={abrirDia}
          />
        )
      )}

      <DayDetailModal
        visible={detail !== undefined}
        day={detail?.day}
        place={activePlace}
        showSummary={detail?.showSummary ?? true}
        onClose={() => setDetail(undefined)}
      />
    </View>
  );
}
