import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications } from '../../state/NotificationsContext';
import { useColores } from '../../theme/ThemeContext';
import { NivelAviso } from '../../types';
import Cabecera from './Cabecera';
import { crearEstilos } from './estilos';
import Fenomenos from './Fenomenos';
import SwitchRow from './SwitchRow';

// Los tres niveles de AEMET, de menos a mas grave. Cada uno lleva escrito de que avisa, y no por
// adorno: el nivel es una palabra de color, y quien no vea colores necesita saber que significa
// "naranja" sin haber visto nunca un mapa de avisos.
const NIVELES: { valor: NivelAviso; etiqueta: string; pista: string }[] = [
  {
    valor: 'amarillo',
    etiqueta: 'Amarillo y superiores',
    pista: 'Riesgo para actividades concretas',
  },
  { valor: 'naranja', etiqueta: 'Naranja y rojo', pista: 'Riesgo importante' },
  { valor: 'rojo', etiqueta: 'Solo rojo', pista: 'Riesgo extremo' },
];

export default function AvisosOficiales({ onCerrar }: { onCerrar: () => void }) {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { settings, saveAvisosOficiales } = useNotifications();
  const [eligiendoFenomenos, setEligiendoFenomenos] = useState(false);

  const oficiales = settings.avisosOficiales;
  const silenciados = oficiales.fenomenosSilenciados ?? [];

  // Aqui no hay boton Guardar, al contrario que en el aviso de temperatura: alli hay campos de
  // texto que hay que poder corregir antes de confirmar, y esto son elecciones sueltas, sin nada
  // que escribir. Se guarda al tocarlas.
  const guardar = (cambios: Partial<typeof oficiales>) => {
    void saveAvisosOficiales({ ...oficiales, ...cambios });
  };

  return (
    <View style={styles.hoja}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        accessibilityLabel="Avisos oficiales de AEMET"
        accessibilityElementsHidden={eligiendoFenomenos}
        importantForAccessibility={eligiendoFenomenos ? 'no-hide-descendants' : 'auto'}>
        <Cabecera titulo="Avisos oficiales" onCerrar={onCerrar} />

        {/* Lo primero que dice esta nota es lo que NO son. Los tres tipos de aviso de esta pestaña
            llegan por la misma via —una notificacion— y sin decirlo se confundirian: los otros dos
            son reglas que escribes tú; este es informacion oficial de riesgo. */}
        <Text style={styles.note}>
          No son reglas tuyas: son los avisos que emite AEMET por lluvias, tormentas, viento, calor,
          nieve y otros fenómenos. Te llegan si tu ubicación está en la zona avisada. Solo hay
          avisos en España.
        </Text>

        <View style={styles.card}>
          <SwitchRow
            label="Avisos oficiales de AEMET"
            value={oficiales.enabled}
            onValueChange={(enabled) => guardar({ enabled })}
          />
        </View>

        {oficiales.enabled && (
          <>
            <Text style={styles.sectionHeader} accessibilityRole="header">
              A partir de qué nivel
            </Text>
            <Text style={styles.note}>
              El amarillo es muy frecuente: en un día normal de verano puede haber decenas en
              España.
            </Text>

            {/* Botones normales, no accessibilityRole="radio": ese rol hace que VoiceOver diga
                "radio button, checked" en INGLES aunque la app este en español, porque esos
                literales salen de RCTLocalizedString dentro de React Native y su es.lproj no los
                traduce (comprobado en RCTViewComponentView.mm de la 0.86.2). Se usa el estado
                selected, que si es un trait de iOS y se dice en español, y el circulo relleno para
                quien mira. */}
            <View style={styles.card}>
              {NIVELES.map((nivel, index) => {
                const elegido = oficiales.nivelMinimo === nivel.valor;
                return (
                  <Pressable
                    key={nivel.valor}
                    style={[styles.row, index < NIVELES.length - 1 && styles.rowDivider]}
                    onPress={() => guardar({ nivelMinimo: nivel.valor })}
                    accessibilityRole="button"
                    accessibilityState={{ selected: elegido }}
                    accessibilityLabel={`${nivel.etiqueta}${elegido ? ', seleccionado' : ''}`}
                    accessibilityHint={nivel.pista}>
                    <Text style={styles.rowTitle}>
                      {elegido ? '● ' : '○ '}
                      {nivel.etiqueta}
                    </Text>
                    <Text style={styles.rowMeta}>{nivel.pista}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionHeader} accessibilityRole="header">
              Qué fenómenos
            </Text>

            <View style={styles.card}>
              <Pressable
                style={styles.filaNavegacion}
                onPress={() => setEligiendoFenomenos(true)}
                accessibilityRole="button"
                accessibilityLabel={`Qué fenómenos. ${resumenFenomenos(silenciados.length)}`}
                accessibilityHint="Abre la lista para elegir de cuáles quieres que te avise">
                <View style={styles.filaNavegacionTextos}>
                  <Text style={styles.rowTitle}>Qué fenómenos</Text>
                  <Text style={styles.rowMeta}>{resumenFenomenos(silenciados.length)}</Text>
                </View>
                <Text style={styles.chevron} importantForAccessibility="no">
                  ›
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      {eligiendoFenomenos && (
        <Fenomenos
          silenciados={silenciados}
          onCambiar={(fenomenosSilenciados) => guardar({ fenomenosSilenciados })}
          onCerrar={() => setEligiendoFenomenos(false)}
        />
      )}
    </View>
  );
}

function resumenFenomenos(silenciados: number): string {
  if (silenciados === 0) {
    return 'Te avisamos de todos';
  }
  return silenciados === 1 ? '1 fenómeno apagado' : `${silenciados} fenómenos apagados`;
}
