import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getHourlyForecast } from '../services/openMeteo';
import { Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';
import { DayForecast, HourlyForecast, Place } from '../types';
import { buildDayDetails, formatFullDate } from '../utils/dayDetails';
import { filaHora } from '../utils/horaTexto';
import { describeWeatherCode } from '../utils/weatherCodes';

interface Props {
  visible: boolean;
  day: DayForecast | undefined;
  place: Place | undefined;
  onClose: () => void;
  /** Oculta el resumen diario cuando ya se muestra fuera (p. ej. en la pantalla Hoy). */
  showSummary?: boolean;
}

export default function DayDetailModal({
  visible,
  day,
  place,
  onClose,
  showSummary = true,
}: Props) {
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const [hours, setHours] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible || !day || !place) {
      return;
    }

    // Indicadores antes de una carga asincrona (getHourlyForecast): el aviso set-state-in-effect
    // es un falso positivo aqui, no hay repintado en cascada real.
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoading(true);
    setError('');
    /* eslint-enable react-hooks/set-state-in-effect */
    getHourlyForecast(place.lat, place.lon, day.date)
      .then(setHours)
      .catch((err) => setError(String((err as Error).message ?? err)))
      .finally(() => setLoading(false));
  }, [visible, day, place]);

  const skyInfo = describeWeatherCode(day?.weatherCode);
  const details = day ? buildDayDetails(day) : [];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* onAccessibilityEscape: gesto de escape de VoiceOver (frotar con dos dedos,
          la "Z") para cerrar la ficha, igual que el "atrás" estándar del sistema.
          Se pone tanto en el fondo como en el contenedor de la ficha (padre del
          ScrollView, donde vive el foco) para que el gesto lo capture con seguridad. */}
      <View style={styles.backdrop} onAccessibilityEscape={onClose}>
        <View style={styles.sheet} accessibilityViewIsModal onAccessibilityEscape={onClose}>
          <View style={styles.grabber} importantForAccessibility="no" />
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title} accessibilityRole="header">
                {day ? formatFullDate(day.date) : 'Detalle del día'}
              </Text>
              <Text style={styles.subtitle}>
                {skyInfo.emoji} {skyInfo.label}
              </Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar detalle del día">
              <Text style={styles.closeText}>Cerrar</Text>
            </Pressable>
          </View>

          <ScrollView>
            {showSummary && (
              <>
                <Text style={styles.sectionHeader} accessibilityRole="header">
                  Resumen del día
                </Text>
                {details.map((line) => (
                  <View
                    key={line.title}
                    style={styles.detailRow}
                    accessible
                    accessibilityLabel={`${line.title}: ${line.spoken}`}>
                    <Text style={styles.detailTitle}>{line.title}</Text>
                    <Text style={styles.detailValue}>{line.value}</Text>
                  </View>
                ))}
              </>
            )}

            <Text style={styles.sectionHeader} accessibilityRole="header">
              Por horas
            </Text>
            {loading && (
              <ActivityIndicator
                color={colores.acentoSuave}
                accessibilityLabel="Cargando previsión por horas"
              />
            )}
            {!loading && error ? <Text style={styles.note}>Error: {error}</Text> : null}

            {!loading &&
              !error &&
              hours.map((item) => {
                const fila = filaHora(item);
                return (
                  <View
                    key={item.time}
                    style={styles.hourRow}
                    accessible
                    accessibilityLabel={fila.spoken}>
                    <Text style={styles.hourTime} numberOfLines={1}>
                      {fila.hora}
                    </Text>
                    <Text style={styles.hourIcon}>{fila.emoji}</Text>
                    <Text style={styles.hourTemp} numberOfLines={1}>
                      {fila.temperatura}
                    </Text>
                    <View style={styles.hourMeta}>
                      <Text style={styles.hourMetaText}>{fila.lluvia}</Text>
                      <Text style={styles.hourMetaText}>{fila.viento}</Text>
                      {/* El rumbo va en su propia línea: "Viento 12 km/h del noroeste" seguido no
                          cabe en esta columna con los tamaños de letra grandes. */}
                      {fila.direccion ? (
                        <Text style={styles.hourMetaText}>{fila.direccion}</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const crearEstilos = (c: Paleta) =>
  StyleSheet.create({
    // El velo se queda negro translucido en las dos paletas: es lo que hace iOS con sus hojas
    // modales, y en claro tambien separa bien la hoja del fondo.
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: c.tarjeta,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 16,
      paddingBottom: 24,
      maxHeight: '85%',
    },
    grabber: {
      alignSelf: 'center',
      width: 36,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.agarre,
      marginTop: 8,
      marginBottom: 4,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 8,
    },
    headerText: {
      flex: 1,
      gap: 2,
    },
    title: {
      color: c.texto,
      fontSize: 22,
      fontWeight: '700',
    },
    subtitle: {
      color: c.textoTenue,
      fontSize: 15,
    },
    closeButton: {
      borderRadius: 12,
      backgroundColor: c.primario,
      paddingHorizontal: 16,
      minHeight: 44,
      justifyContent: 'center',
    },
    closeText: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    sectionHeader: {
      color: c.textoSeccion,
      fontSize: 20,
      fontWeight: '600',
      marginTop: 16,
      marginBottom: 8,
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
    note: {
      color: c.textoTenue,
      fontSize: 15,
    },
    // La pastilla de cada hora va sobre la hoja (que ya es "tarjeta"): en claro necesita un borde,
    // porque campo y tarjeta son ambos blancos y si no se pierde la separacion entre horas.
    hourRow: {
      borderRadius: 12,
      backgroundColor: c.campo,
      borderWidth: 1,
      borderColor: c.borde,
      padding: 12,
      marginBottom: 8,
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    // Anchos holgados y numberOfLines={1}: con 56 el "0" de los minutos (10:00) y el simbolo de
    // grados saltaban a otra linea en las temperaturas de dos digitos o negativas.
    hourTime: {
      color: c.textoCampo,
      width: 64,
      flexShrink: 0,
      fontSize: 17,
      fontWeight: '600',
    },
    hourIcon: {
      fontSize: 20,
    },
    hourTemp: {
      color: c.texto,
      fontSize: 17,
      fontWeight: '700',
      width: 64,
      flexShrink: 0,
      textAlign: 'center',
    },
    hourMeta: {
      alignItems: 'flex-end',
      gap: 2,
    },
    hourMetaText: {
      color: c.textoMeta,
      fontSize: 13,
    },
  });
