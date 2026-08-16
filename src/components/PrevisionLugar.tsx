import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DayRow from './DayRow';
import { CURRENT_LOCATION_ID, PrevisionGuardada } from '../state/PlacesContext';
import { Paleta } from '../theme/colores';
import { CurrentObservation, DayForecast, Place } from '../types';
import { buildDayDetails, formatUpdatedAt } from '../utils/dayDetails';
import { describirObservacion } from '../utils/observacionTexto';
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
  esActiva: boolean;
  cargando: boolean;
  message: string;
  styles: Estilos;
  colorCarga: string;
  onActualizar: () => void;
  onAbrirDia: (day: DayForecast, showSummary: boolean) => void;
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
  esActiva,
  cargando,
  message,
  styles,
  colorCarga,
  onActualizar,
  onAbrirDia,
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

  return (
    <ScrollView
      style={styles.pagina}
      contentContainerStyle={styles.content}
      accessibilityLabel={`Previsión de ${place.name}`}>
      {today && (
        <View style={styles.currentCard}>
          {/* Antes ponía "Ahora", y era mentira: este número es lo que el modelo de Open-Meteo
              PREVÉ para la hora en curso, no algo que nadie haya medido. El rótulo lo dice ahora,
              y la medición de verdad —cuando la hay— va debajo, con su hora y su estación. */}
          <View
            accessible
            accessibilityLabel={`Previsto para esta hora: ${forecast?.current?.temperature ?? '-'} grados, ${currentInfo.label}`}>
            <Text style={styles.currentLabel}>Previsto para esta hora</Text>
            <Text style={styles.currentTemp}>{forecast?.current?.temperature ?? '-'}º</Text>
            <Text style={styles.currentSky}>
              {currentInfo.emoji} {currentInfo.label}
            </Text>
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
  });
