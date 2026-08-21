import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AnuncioAvisos from './AnuncioAvisos';
import DayRow from './DayRow';
import { CURRENT_LOCATION_ID, PrevisionGuardada } from '../state/PlacesContext';
import { Paleta } from '../theme/colores';
import { AvisosLugar, CurrentObservation, DayForecast, Place } from '../types';
import { textoParaCompartir } from '../utils/compartir';
import { buildDayDetails, formatUpdatedAt } from '../utils/dayDetails';
import { describirObservacion } from '../utils/observacionTexto';
import { numeroEs } from '../utils/text';
import { describeWeatherCode } from '../utils/weatherCodes';

// La previsión de UN lugar. La usan la pantalla Hoy (una por página del carrusel) y la vista
// previa de un lugar buscado, para que las dos muestren y lean exactamente lo mismo.

type Estilos = ReturnType<typeof crearEstilos>;

interface PaginaProps {
  place: Place;
  prevision: PrevisionGuardada | undefined;
  /**
   * Medición real de una estación, si hay alguna que represente este lugar. Falta a menudo (fuera
   * de España siempre), y su ausencia no se anuncia: la página se queda con la previsión.
   */
  observacion?: CurrentObservation;
  /**
   * Avisos OFICIALES de AEMET de este lugar. Que falte significa que aun no se han pedido, y que
   * venga con la lista vacia, que no hay ninguno: en los dos casos no se pinta nada.
   */
  avisos?: AvisosLugar;
  esActiva: boolean;
  cargando: boolean;
  message: string;
  styles: Estilos;
  colorCarga: string;
  onActualizar: () => void;
  onAbrirDia: (day: DayForecast, showSummary: boolean) => void;
  onAbrirAvisos: () => void;
  /** En una consulta de paso no se ofrece refrescar: los datos se acaban de pedir. */
  ocultarActualizar?: boolean;
}

// Una página del carrusel: la previsión de UN lugar. Se pinta con lo que ya está cargado de ese
// lugar (mapa forecastByPlace), así que al deslizar no aparece un hueco en blanco ni se dispara
// ninguna consulta de más: la que toque la hace el lugar activo, como siempre.
export function PaginaLugar({
  place,
  prevision,
  observacion,
  avisos,
  esActiva,
  cargando,
  message,
  styles,
  colorCarga,
  onActualizar,
  onAbrirDia,
  onAbrirAvisos,
  ocultarActualizar = false,
}: PaginaProps) {
  const forecast = prevision?.forecast;
  const currentInfo = describeWeatherCode(forecast?.current?.weatherCode);
  const today = forecast?.days[0];
  const todayDetails = today ? buildDayDetails(today) : [];
  const upcomingDays = forecast?.days.slice(1) ?? [];
  const updatedAt = formatUpdatedAt(prevision?.updatedAt);
  const esUbicacionActual = place.id === CURRENT_LOCATION_ID;
  const medicion = describirObservacion(observacion);
  // Con coma decimal, como la línea de la medición que va justo debajo: Open-Meteo devuelve
  // decimales y antes salían con punto, mezclando dos criterios en la misma tarjeta.
  const temperaturaAhora =
    forecast?.current?.temperature !== undefined
      ? numeroEs(forecast.current.temperature)
      : undefined;
  const sensacion =
    forecast?.current?.apparent !== undefined ? numeroEs(forecast.current.apparent) : undefined;
  const textoCompartir = textoParaCompartir({ nombre: place.name, forecast, observacion });

  // La hoja de compartir es del sistema; si el usuario la cancela, Share resuelve sin más. Un fallo
  // de verdad (no hay nada que compartir) tampoco merece un aviso: no ha roto nada de la pantalla.
  const compartir = () => {
    void Share.share({ message: textoCompartir }).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.pagina}
      contentContainerStyle={styles.content}
      accessibilityLabel={`Previsión de ${place.name}`}>
      {/* Los avisos oficiales van ARRIBA DEL TODO, antes que la temperatura. Un aviso rojo por
          lluvias no puede quedar por debajo del número grande ni a tres deslizamientos de
          VoiceOver. Si no hay ninguno, esto no pinta nada y la pantalla queda como estaba. */}
      <AnuncioAvisos avisos={avisos} onAbrir={onAbrirAvisos} />

      {today && (
        <View style={styles.currentCard}>
          {/* Antes ponía "Ahora", y era mentira: este número es lo que el modelo de Open-Meteo
              PREVÉ para la hora en curso, no algo que nadie haya medido. El rótulo lo dice ahora,
              y la medición de verdad —cuando la hay— va debajo, con su hora y su estación. */}
          <View
            accessible
            accessibilityLabel={
              `Previsto para esta hora: ${temperaturaAhora ?? '-'} grados, ` +
              `${currentInfo.label}${sensacion !== undefined ? `. Sensación térmica ${sensacion} grados` : ''}`
            }>
            <Text style={styles.currentLabel}>Previsto para esta hora</Text>
            <Text style={styles.currentTemp}>{temperaturaAhora ?? '-'}º</Text>
            <Text style={styles.currentSky}>
              {currentInfo.emoji} {currentInfo.label}
            </Text>
            {/* La sensación térmica es previsión, igual que el número grande, así que va DENTRO de
                este bloque. Debajo de la línea empieza lo medido, y ahí no pinta nada: AEMET no la
                publica y deducirla de su medición sería colar una cuenta nuestra como medición. */}
            {sensacion !== undefined && (
              <Text style={styles.currentSensacion}>Sensación térmica {sensacion}º</Text>
            )}
          </View>

          {medicion && (
            <View style={styles.medicionBloque} accessible accessibilityLabel={medicion.spoken}>
              <Text style={styles.medicionPrincipal}>{medicion.principal}</Text>
              <Text style={styles.medicionEstacion}>{medicion.estacion}</Text>
            </View>
          )}

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

          {textoCompartir ? (
            <Pressable
              style={styles.buttonSecondary}
              onPress={compartir}
              accessibilityRole="button"
              accessibilityLabel={`Compartir el tiempo de ${place.name}`}
              accessibilityHint="Abre la hoja para compartir de iOS">
              <Text style={styles.buttonSecondaryText}>Compartir</Text>
            </Pressable>
          ) : null}
        </View>
      )}

      {!ocultarActualizar && (
        <Pressable
          style={styles.buttonPrimary}
          onPress={onActualizar}
          accessibilityRole="button"
          accessibilityLabel={
            esUbicacionActual ? 'Actualizar mi ubicación' : 'Actualizar previsión'
          }
          accessibilityHint={
            esUbicacionActual ? 'Usa el GPS del teléfono para detectar dónde estás' : undefined
          }>
          <Text style={styles.buttonText}>
            {esUbicacionActual ? 'Actualizar mi ubicación' : 'Actualizar previsión'}
          </Text>
        </Pressable>
      )}

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

      {/* Atribución que exige la licencia de Open-Meteo (CC BY 4.0): tiene que ir junto a los
          datos, dentro de la app, no solo en la ficha del App Store. Va la última de la página a
          propósito: es una parada más de VoiceOver y no debe estorbar a quien viene a consultar el
          tiempo. Solo aparece una vez en el árbol de accesibilidad porque HomeScreen oculta las
          páginas que no se ven. */}
      <Pressable
        style={styles.atribucion}
        onPress={() => {
          void Linking.openURL('https://open-meteo.com/');
        }}
        accessibilityRole="link"
        // "punto com" a mano: VoiceOver lee ".com" de forma irregular según el contexto.
        accessibilityLabel="Previsión de Open-Meteo punto com"
        accessibilityHint="Abre la web de Open-Meteo en el navegador">
        <Text style={styles.atribucionTexto}>Previsión de Open-Meteo.com</Text>
      </Pressable>

      {/* AEMET autoriza el uso citando a AEMET como autora, y el "· AEMET" de la línea de la
          estación no es una atribución: es parte del dato. Solo se pone si de verdad hay medición;
          citar una fuente que no se ha usado sería tan falso como no citar la que sí. */}
      {medicion && (
        <Pressable
          style={styles.atribucion}
          onPress={() => {
            void Linking.openURL('https://www.aemet.es/');
          }}
          accessibilityRole="link"
          accessibilityLabel="Observación de AEMET, Agencia Estatal de Meteorología"
          accessibilityHint="Abre la web de AEMET en el navegador">
          <Text style={styles.atribucionTexto}>Observación de AEMET</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

// Los estilos dependen del tema, así que se construyen con la paleta activa (memoizados en el
// componente). Fondo siempre explícito: sin él, el de iOS asoma y los textos quedan invisibles.
export const crearEstilos = (c: Paleta) =>
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
    // Rotulo del bloque previsto. Va en mayusculas de tamano pequeno como encabezado visual, pero
    // el texto real lleva sus minusculas: VoiceOver deletrea las mayusculas sostenidas.
    currentLabel: {
      color: c.textoTenue,
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
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
    // Un punto por debajo del cielo: es un dato de apoyo del número grande, no otro titular.
    currentSensacion: {
      color: c.textoTenue,
      fontSize: 15,
      textAlign: 'center',
    },
    // La medicion se separa del bloque previsto con una linea, no con un color: la informacion no
    // puede depender del color (y ademas hay que verla en las dos paletas).
    medicionBloque: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.borde,
      paddingTop: 12,
      gap: 2,
    },
    medicionPrincipal: {
      color: c.texto,
      fontSize: 17,
      fontWeight: '600',
      textAlign: 'center',
    },
    medicionEstacion: {
      color: c.textoTenue,
      fontSize: 15,
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
    // 44 de alto porque es tocable, igual que los botones: un enlace de una línea de texto queda
    // por debajo del tamaño mínimo de toque y falla a quien apunta con poca precisión.
    atribucion: {
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Subrayado, no solo color: un enlace que solo se distingue por ser azul depende del color
    // para transmitir su significado, que es justo lo que no se hace en esta app.
    atribucionTexto: {
      color: c.acento,
      fontSize: 13,
      textDecorationLine: 'underline',
    },
  });
