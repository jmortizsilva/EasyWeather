import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';
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
  /** Volver a la búsqueda, que sigue montada debajo con sus resultados. */
  onCerrar: () => void;
  /** Guardado el lugar, ya no se busca nada: se cierra todo, igual que el botón de la lista. */
  onGuardado: () => void;
}

/**
 * Previsión de un lugar buscado y todavía sin guardar. Existe porque antes esta consulta se hacía
 * metiendo el lugar como activo en "Hoy": al no estar en la lista de lugares, el carrusel
 * desaparecía y no había forma de volver a la previsión normal. Aquí siempre hay salida.
 *
 * Se monta como CAPA dentro de la hoja de búsqueda (ver PlacesScreen), no como hoja propia: su
 * raíz se estira sobre el hueco del padre y tapa la búsqueda, que sigue viva debajo.
 */
export default function VistaPreviaLugar({ place, onCerrar, onGuardado }: Props) {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const estilosPrevision = useMemo(() => crearEstilosPrevision(colores), [colores]);
  const { places, forecastByPlace, cargarPrevision, addPlace } = usePlaces();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const tituloRef = useRef<Text>(null);
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

  // Al no ser una hoja modal de iOS, nadie avisa a VoiceOver de que esto ha aparecido: el foco se
  // quedaría en el resultado de la búsqueda que se acaba de ocultar. 'focus' es el único evento que
  // iOS admite aquí y publica layoutChanged CON la vista, que es justo lo que hace falta: invalida
  // el árbol y lleva el foco al título.
  //
  // Se dispara desde onLayout del título, NO tras un retardo: un temporizador se calibra sin querer
  // con el móvil en el que se prueba y en uno más lento salta antes de que la vista exista, sin dar
  // error. El guardado por id evita repetirlo en cada recolocación.
  const focoPuestoEn = useRef<string | undefined>(undefined);
  const moverFocoAlTitulo = () => {
    if (focoPuestoEn.current === place.id || !tituloRef.current) {
      return;
    }
    focoPuestoEn.current = place.id;
    AccessibilityInfo.sendAccessibilityEvent(tituloRef.current, 'focus');
  };

  // Se vibra porque VoiceOver no anuncia nada al desaparecer la hoja, y sin confirmación no se
  // sabe si se llegó a guardar (mismo motivo que en la lista de resultados).
  const guardar = async () => {
    await addPlace(place);
    vibrarConfirmacion();
    onGuardado();
  };

  return (
    <View
      style={styles.raiz}
      accessibilityViewIsModal
      // Gesto de escape de VoiceOver (frotar con dos dedos), además del botón visible.
      onAccessibilityEscape={onCerrar}>
      <View style={[styles.cabecera, { paddingTop: insets.top + 12 }]}>
        <View style={styles.filaCabecera}>
          <Text
            ref={tituloRef}
            style={styles.titulo}
            accessibilityRole="header"
            onLayout={moverFocoAlTitulo}>
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
    // Ocupa todo el hueco del padre por encima de la búsqueda. El fondo opaco no es estético: sin
    // él se transparentarían los resultados de debajo y se leerían los dos textos superpuestos.
    raiz: {
      // absoluteFill, no absoluteFillObject: en RN 0.86 ya no existe el segundo y el primero es
      // el objeto plano, así que se puede esparcir.
      ...StyleSheet.absoluteFill,
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
