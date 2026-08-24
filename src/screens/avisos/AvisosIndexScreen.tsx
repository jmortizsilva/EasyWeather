import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications } from '../../state/NotificationsContext';
import { useColores } from '../../theme/ThemeContext';
import { formatTime } from '../../utils/ajustesAvisos';
import AvisoTemperatura from './AvisoTemperatura';
import AvisosOficiales from './AvisosOficiales';
import AvisosResumen from './AvisosResumen';
import { crearEstilos } from './estilos';

// La pestaña Avisos es un indice, no un formulario. Antes era una sola pantalla con las tres cosas
// seguidas —temperatura, resumenes y avisos oficiales—, y con VoiceOver llegar a la ultima eran
// muchos deslizamientos por delante de cosas que no buscabas. Dos niveles, como las apps de Apple.
//
// Cada fila lleva su estado escrito debajo para no tener que entrar solo a mirarlo.

type Seccion = 'temperatura' | 'resumenes' | 'oficiales';

const TITULOS: Record<Seccion, string> = {
  temperatura: 'Aviso de temperatura',
  resumenes: 'Avisos de resumen',
  oficiales: 'Avisos oficiales de AEMET',
};

export default function AvisosIndexScreen() {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { settings, testNotification, notice } = useNotifications();
  const [abierta, setAbierta] = useState<Seccion | undefined>(undefined);

  // Banner de confirmacion visible: refleja lo mismo que anuncia VoiceOver (guardado, falta
  // permiso, error...) y se autooculta. Se ignoran los avisos previos al montar para no mostrar
  // uno viejo al volver a la pestaña.
  const [banner, setBanner] = useState('');
  const lastNoticeId = useRef(notice?.id ?? 0);
  useEffect(() => {
    if (!notice || notice.id === lastNoticeId.current) {
      return;
    }
    lastNoticeId.current = notice.id;
    setBanner(notice.text);
    const timer = setTimeout(() => setBanner(''), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  // "Activado / Desactivado" en toda la pestaña, y no "encendido / apagado": es la palabra que usa
  // iOS para el estado de un conmutador, y la que VoiceOver dice al leerlos. Mezclar las dos hace
  // dudar de si el resumen de la fila habla de lo mismo que el interruptor de dentro.
  const estados: Record<Seccion, string> = {
    temperatura: settings.threshold.enabled
      ? `Activado · máx ${settings.threshold.maxThreshold}°, mín ${settings.threshold.minThreshold}°`
      : 'Desactivado',
    resumenes: resumenDeResumenes(settings.summaries),
    oficiales: settings.avisosOficiales.enabled
      ? `Desde el ${settings.avisosOficiales.nivelMinimo}`
      : 'Desactivados',
  };

  const cerrar = () => setAbierta(undefined);

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        accessibilityLabel="Pantalla Avisos"
        accessibilityElementsHidden={abierta !== undefined}
        importantForAccessibility={abierta !== undefined ? 'no-hide-descendants' : 'auto'}>
        <Text style={styles.title} accessibilityRole="header">
          Avisos
        </Text>

        <View style={styles.card}>
          {(Object.keys(TITULOS) as Seccion[]).map((seccion, index) => (
            <Pressable
              key={seccion}
              style={[styles.filaNavegacion, index < 2 && styles.rowDivider]}
              onPress={() => setAbierta(seccion)}
              accessibilityRole="button"
              accessibilityLabel={`${TITULOS[seccion]}. ${estados[seccion]}`}
              accessibilityHint="Abre sus ajustes">
              <View style={styles.filaNavegacionTextos}>
                <Text style={styles.rowTitle}>{TITULOS[seccion]}</Text>
                <Text style={styles.rowMeta}>{estados[seccion]}</Text>
              </View>
              <Text style={styles.chevron} importantForAccessibility="no">
                ›
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Aqui y no dentro de una seccion: prueba TODA la cadena de push, no solo la temperatura,
            y hace falta encontrarlo sin tener nada encendido. */}
        <Pressable
          style={styles.buttonSecondary}
          onPress={() => void testNotification()}
          accessibilityRole="button"
          accessibilityLabel="Probar notificación"
          accessibilityHint="Envía una notificación de prueba a este teléfono para comprobar que los avisos llegan">
          <Text style={styles.buttonSecondaryText}>Probar notificación</Text>
        </Pressable>

        <Text style={styles.note}>
          Los avisos los envía un servidor con tu ubicación y tu configuración, para poder avisarte
          del tiempo del sitio donde estés aunque no abras la app. Puedes ver qué datos guarda en la
          política de privacidad.
        </Text>
      </ScrollView>

      {/* UN solo Modal para las tres secciones. Lo que va un nivel mas hondo (el editor de un
          resumen, la lista de fenomenos) es una capa DENTRO de esta hoja y no otro Modal: iOS no
          presenta dos a la vez desde el mismo sitio y la pantalla se queda muerta (ver
          PlacesScreen, donde ya costo un rato averiguarlo). */}
      <Modal
        visible={abierta !== undefined}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={cerrar}>
        <View style={styles.hoja} accessibilityViewIsModal onAccessibilityEscape={cerrar}>
          {abierta === 'temperatura' && <AvisoTemperatura onCerrar={cerrar} />}
          {abierta === 'resumenes' && <AvisosResumen onCerrar={cerrar} />}
          {abierta === 'oficiales' && <AvisosOficiales onCerrar={cerrar} />}

          {banner ? <Toast texto={banner} abajo={insets.bottom + 24} /> : null}
        </View>
      </Modal>

      {banner && abierta === undefined ? <Toast texto={banner} abajo={insets.bottom + 24} /> : null}
    </>
  );
}

// Confirmacion visible flotante. Se oculta de VoiceOver porque el mismo texto ya se anuncio por voz
// al fijar el notice; asi no se lee dos veces.
function Toast({ texto, abajo }: { texto: string; abajo: number }) {
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  return (
    <View
      style={[styles.toast, { bottom: abajo }]}
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden>
      <Text style={styles.toastText}>{texto}</Text>
    </View>
  );
}

function resumenDeResumenes(
  summaries: { enabled: boolean; hour: number; minute: number }[],
): string {
  const activos = summaries.filter((s) => s.enabled);
  if (activos.length === 0) {
    return summaries.length === 0 ? 'Ninguno' : 'Ninguno activado';
  }
  // "1 activado" y no "1 programado": es el mismo estado que dice el conmutador de dentro.
  if (activos.length === 1) {
    return `1 activado · ${formatTime(activos[0].hour, activos[0].minute)}`;
  }
  return `${activos.length} activados`;
}
