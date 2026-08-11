import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlaces } from '../state/PlacesContext';
import { Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';
import { DayForecast, Place } from '../types';
import { vibrarConfirmacion } from '../utils/haptica';
import DayDetailModal from './DayDetailModal';
import { crearEstilos as crearEstilosPrevision, PaginaLugar } from './PrevisionLugar';

interface Props {
  place: Place;
  onCerrar: () => void;
}

/**
 * Previsión de un lugar buscado y todavía sin guardar. Existe porque antes esta consulta se hacía
 * metiendo el lugar como activo en "Hoy": al no estar en la lista de lugares, el carrusel
 * desaparecía y no había forma de volver a la previsión normal. Aquí siempre hay salida.
 */
export default function VistaPreviaLugar({ place, onCerrar }: Props) {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const estilosPrevision = useMemo(() => crearEstilosPrevision(colores), [colores]);
  const { places, forecastByPlace, cargarPrevision, addPlace } = usePlaces();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState<{ day: DayForecast; showSummary: boolean } | undefined>(
    undefined,
  );

  const guardado = places.some((p) => p.id === place.id);

  useEffect(() => {
    let vigente = true;
    // Indicador antes de una carga asíncrona: el aviso set-state-in-effect es un falso positivo.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCargando(true);
    cargarPrevision(place)
      .catch((e) => {
        if (vigente) {
          setError(String((e as Error).message ?? e));
        }
      })
      .finally(() => {
        if (vigente) {
          setCargando(false);
        }
      });
    return () => {
      vigente = false;
    };
  }, [place, cargarPrevision]);

  const guardar = async () => {
    await addPlace(place);
    vibrarConfirmacion();
    onCerrar();
  };

  return (
    <View
      style={styles.raiz}
      accessibilityViewIsModal
      // Gesto de escape de VoiceOver (frotar con dos dedos), además del botón visible.
      onAccessibilityEscape={onCerrar}>
      <View style={[styles.cabecera, { paddingTop: insets.top + 12 }]}>
        <View style={styles.filaCabecera}>
          <Text style={styles.titulo} accessibilityRole="header">
            {place.name}
          </Text>
          <Pressable
            style={styles.botonCerrar}
            onPress={onCerrar}
            accessibilityRole="button"
            accessibilityLabel="Cerrar la previsión y volver a la búsqueda">
            <Text style={styles.textoCerrar}>Atrás</Text>
          </Pressable>
        </View>

        {!guardado && (
          <Pressable
            style={styles.botonGuardar}
            onPress={() => void guardar()}
            accessibilityRole="button"
            accessibilityLabel={`Guardar ${place.name} en mis lugares`}>
            <Text style={styles.textoGuardar}>Guardar en mis lugares</Text>
          </Pressable>
        )}

        {error ? <Text style={styles.error}>Error de previsión: {error}</Text> : null}
      </View>

      <PaginaLugar
        place={place}
        prevision={forecastByPlace[place.id]}
        esActiva
        cargando={cargando}
        // El pie de estado es de la pantalla Hoy; aquí sobra.
        message=""
        styles={estilosPrevision}
        colorCarga={colores.acentoSuave}
        // Refrescar a mano no aporta en una consulta de paso: los datos se acaban de pedir.
        onActualizar={() => {}}
        onAbrirDia={(day, showSummary) => setDetail({ day, showSummary })}
        ocultarActualizar
      />

      <DayDetailModal
        visible={detail !== undefined}
        day={detail?.day}
        place={place}
        showSummary={detail?.showSummary ?? true}
        onClose={() => setDetail(undefined)}
      />
    </View>
  );
}

const crearEstilos = (c: Paleta) =>
  StyleSheet.create({
    raiz: {
      flex: 1,
      backgroundColor: c.fondo,
    },
    cabecera: {
      paddingHorizontal: 16,
      gap: 12,
    },
    filaCabecera: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    titulo: {
      color: c.texto,
      fontSize: 28,
      fontWeight: '700',
      flexShrink: 1,
    },
    botonCerrar: {
      borderRadius: 12,
      backgroundColor: c.primario,
      paddingHorizontal: 16,
      minHeight: 44,
      justifyContent: 'center',
    },
    textoCerrar: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    botonGuardar: {
      borderRadius: 12,
      backgroundColor: c.primario,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    textoGuardar: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    error: {
      color: c.textoTenue,
      fontSize: 15,
    },
  });
