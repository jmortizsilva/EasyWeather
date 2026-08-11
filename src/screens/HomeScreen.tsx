import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ControlPaginas from '../components/ControlPaginas';
import DayDetailModal from '../components/DayDetailModal';
import DayRow from '../components/DayRow';
import { CURRENT_LOCATION_ID, PrevisionGuardada, usePlaces } from '../state/PlacesContext';
import { Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';
import { DayForecast, Place } from '../types';
import { buildDayDetails, formatUpdatedAt } from '../utils/dayDetails';
import { describeWeatherCode } from '../utils/weatherCodes';

type Estilos = ReturnType<typeof crearEstilos>;

interface PaginaProps {
  place: Place;
  prevision: PrevisionGuardada | undefined;
  esActiva: boolean;
  cargando: boolean;
  message: string;
  styles: Estilos;
  colorCarga: string;
  onActualizar: () => void;
  onAbrirDia: (day: DayForecast, showSummary: boolean) => void;
}

// Una página del carrusel: la previsión de UN lugar. Se pinta con lo que ya está cargado de ese
// lugar (mapa forecastByPlace), así que al deslizar no aparece un hueco en blanco ni se dispara
// ninguna consulta de más: la que toque la hace el lugar activo, como siempre.
function PaginaLugar({
  place,
  prevision,
  esActiva,
  cargando,
  message,
  styles,
  colorCarga,
  onActualizar,
  onAbrirDia,
}: PaginaProps) {
  const forecast = prevision?.forecast;
  const currentInfo = describeWeatherCode(forecast?.current?.weatherCode);
  const today = forecast?.days[0];
  const todayDetails = today ? buildDayDetails(today) : [];
  const upcomingDays = forecast?.days.slice(1) ?? [];
  const updatedAt = formatUpdatedAt(prevision?.updatedAt);
  const esUbicacionActual = place.id === CURRENT_LOCATION_ID;

  return (
    <ScrollView
      style={styles.pagina}
      contentContainerStyle={styles.content}
      accessibilityLabel={`Previsión de ${place.name}`}>
      {today && (
        <View style={styles.currentCard}>
          <View
            accessible
            accessibilityLabel={`Ahora: ${forecast?.current?.temperature ?? '-'} grados, ${currentInfo.label}`}>
            <Text style={styles.currentTemp}>{forecast?.current?.temperature ?? '-'}º</Text>
            <Text style={styles.currentSky}>
              {currentInfo.emoji} {currentInfo.label}
            </Text>
          </View>

          {updatedAt && (
            <Text
              style={styles.updatedLine}
              accessibilityLabel={`Datos actualizados el ${updatedAt}`}>
              Actualizado: {updatedAt}
            </Text>
          )}

          <View style={styles.detailList}>
            {todayDetails.map((line) => (
              <View
                key={line.title}
                style={styles.detailRow}
                accessible
                accessibilityLabel={`${line.title}: ${line.spoken}`}>
                <Text style={styles.detailTitle}>{line.title}</Text>
                <Text style={styles.detailValue}>{line.value}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.buttonSecondary}
            onPress={() => onAbrirDia(today, false)}
            accessibilityRole="button"
            accessibilityLabel="Ver hoy (hora a hora)">
            <Text style={styles.buttonSecondaryText}>Hoy (hora a hora)</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        style={styles.buttonPrimary}
        onPress={onActualizar}
        accessibilityRole="button"
        accessibilityLabel={esUbicacionActual ? 'Actualizar mi ubicación' : 'Actualizar previsión'}
        accessibilityHint={
          esUbicacionActual ? 'Usa el GPS del teléfono para detectar dónde estás' : undefined
        }>
        <Text style={styles.buttonText}>
          {esUbicacionActual ? 'Actualizar mi ubicación' : 'Actualizar previsión'}
        </Text>
      </Pressable>

      {esActiva && cargando && (
        <ActivityIndicator
          color={colorCarga}
          accessibilityLabel="Cargando"
          accessibilityRole="progressbar"
        />
      )}

      {upcomingDays.length > 0 && (
        <>
          <Text style={styles.sectionHeader} accessibilityRole="header">
            Próximos días
          </Text>
          <View style={styles.daysCard}>
            {upcomingDays.map((day, index) => (
              <DayRow
                key={day.date}
                day={day}
                isLast={index === upcomingDays.length - 1}
                onOpen={() => onAbrirDia(day, true)}
              />
            ))}
          </View>
        </>
      )}

      {!forecast && !cargando && <Text style={styles.note}>Todavía no hay datos disponibles.</Text>}
      {esActiva && <Text style={styles.statusNote}>{message}</Text>}
    </ScrollView>
  );
}

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

// Los estilos dependen del tema, así que se construyen con la paleta activa (memoizados en el
// componente). Fondo siempre explícito: sin él, el de iOS asoma y los textos quedan invisibles.
const crearEstilos = (c: Paleta) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.fondo,
    },
    // paddingTop se calcula con la zona segura de iOS (useSafeAreaInsets), no fijo: sin esto el
    // titulo se metia debajo de la hora y los iconos de estado del sistema.
    cabecera: {
      paddingHorizontal: 16,
      gap: 8,
      backgroundColor: c.fondo,
    },
    pagina: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 96,
      gap: 16,
    },
    cityTitle: {
      color: c.texto,
      fontSize: 34,
      fontWeight: '700',
    },
    currentCard: {
      backgroundColor: c.tarjeta,
      borderRadius: 16,
      padding: 20,
      gap: 12,
    },
    currentTemp: {
      color: c.textoFuerte,
      fontSize: 54,
      fontWeight: '700',
      textAlign: 'center',
    },
    currentSky: {
      color: c.textoCampo,
      fontSize: 17,
      textAlign: 'center',
    },
    updatedLine: {
      color: c.textoTenue,
      fontSize: 15,
      textAlign: 'center',
    },
    detailList: {
      marginTop: 4,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      minHeight: 44,
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.borde,
    },
    detailTitle: {
      color: c.textoTenue,
      fontSize: 15,
    },
    detailValue: {
      color: c.texto,
      fontSize: 17,
      fontWeight: '600',
      flexShrink: 1,
      textAlign: 'right',
    },
    buttonPrimary: {
      borderRadius: 12,
      backgroundColor: c.primario,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    buttonText: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    // Boton secundario: mismo relleno que el primario para que se distinga del fondo (antes usaba
    // un tono casi identico al fondo y era practicamente invisible). El borde lo mantiene
    // reconocible como accion secundaria; va del color del TEXTO del boton, que contrasta con el
    // relleno en las dos paletas (un borde de acento se volvia invisible en la clara).
    buttonSecondary: {
      borderRadius: 12,
      backgroundColor: c.primario,
      borderWidth: 1,
      borderColor: c.textoPrimario,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    buttonSecondaryText: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    sectionHeader: {
      color: c.textoSeccion,
      fontSize: 20,
      fontWeight: '600',
    },
    daysCard: {
      backgroundColor: c.tarjeta,
      borderRadius: 16,
      overflow: 'hidden',
    },
    note: {
      color: c.textoTenue,
      fontSize: 15,
    },
    statusNote: {
      color: c.textoMeta,
      fontSize: 13,
    },
  });
