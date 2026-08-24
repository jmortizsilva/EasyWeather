import { useEffect, useMemo, useState } from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlaces } from '../../state/PlacesContext';
import { useNotifications } from '../../state/NotificationsContext';
import { useColores } from '../../theme/ThemeContext';
import { DEFAULT_THRESHOLD } from '../../utils/ajustesAvisos';
import Cabecera from './Cabecera';
import { crearEstilos } from './estilos';
import SwitchRow from './SwitchRow';

// Id de la barra "Listo" que se ancla sobre el teclado numerico (solo iOS): sin ella, el teclado
// tapa el boton "Guardar aviso" y no habia forma clara de cerrarlo. Los teclados numericos no traen
// tecla de retorno visible, asi que la barra es la unica salida accesible.
const TECLADO_GRADOS_ID = 'avisoTemperaturaTeclado';

export default function AvisoTemperatura({ onCerrar }: { onCerrar: () => void }) {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { currentLocationPlace } = usePlaces();
  const { settings, saveThreshold } = useNotifications();

  const [thresholdEnabled, setThresholdEnabled] = useState(settings.threshold.enabled);
  const [maxDraft, setMaxDraft] = useState(String(settings.threshold.maxThreshold));
  const [minDraft, setMinDraft] = useState(String(settings.threshold.minThreshold));

  // Sincroniza el borrador cuando cambian los ajustes guardados. Es un sync de estado local desde
  // una fuente externa (los ajustes persistidos), no una cascada.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setThresholdEnabled(settings.threshold.enabled);
    setMaxDraft(String(settings.threshold.maxThreshold));
    setMinDraft(String(settings.threshold.minThreshold));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [settings.threshold]);

  const thresholdValues = () => {
    const max = Number(maxDraft.replace(',', '.'));
    const min = Number(minDraft.replace(',', '.'));
    return {
      maxThreshold: Number.isFinite(max) ? max : DEFAULT_THRESHOLD.maxThreshold,
      minThreshold: Number.isFinite(min) ? min : DEFAULT_THRESHOLD.minThreshold,
    };
  };

  // Al apagar el conmutador se guarda de inmediato (da de baja del servidor); al encenderlo solo
  // se muestran los ajustes, que se confirman con el botón Guardar (ahí se pide el permiso).
  const onToggleThreshold = (value: boolean) => {
    setThresholdEnabled(value);
    if (!value) {
      void saveThreshold({ enabled: false, ...thresholdValues() });
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      accessibilityLabel="Aviso de temperatura">
      <Cabecera titulo="Aviso de temperatura" destino="Avisos" onVolver={onCerrar} />

      <Text style={styles.note}>
        La app vigila tu ubicación actual y te avisa cuando la temperatura sube de tu máximo o baja
        de tu mínimo.
      </Text>

      <View style={styles.card}>
        <SwitchRow
          label="Aviso de temperatura"
          value={thresholdEnabled}
          onValueChange={onToggleThreshold}
        />
      </View>

      {thresholdEnabled && (
        <>
          {!currentLocationPlace && (
            <Text style={styles.note}>
              Para usar este aviso, actualiza antes tu ubicación en la pestaña Hoy.
            </Text>
          )}

          <View style={styles.card}>
            <View style={[styles.switchRow, styles.rowDivider]}>
              {/* La etiqueta visible se oculta a VoiceOver (envuelta en una vista que oculta sus
                  descendientes); el campo ya lleva su propia etiqueta descriptiva. */}
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <Text style={styles.rowTitle}>Avisar si sube de</Text>
              </View>
              <TextInput
                value={maxDraft}
                onChangeText={setMaxDraft}
                keyboardType="numbers-and-punctuation"
                style={styles.input}
                inputAccessoryViewID={Platform.OS === 'ios' ? TECLADO_GRADOS_ID : undefined}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                accessibilityLabel="Grados máximos a partir de los cuales avisar"
                accessibilityHint="Escribe un número de grados, por ejemplo 30"
              />
            </View>
            <View style={styles.switchRow}>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <Text style={styles.rowTitle}>Avisar si baja de</Text>
              </View>
              <TextInput
                value={minDraft}
                onChangeText={setMinDraft}
                keyboardType="numbers-and-punctuation"
                style={styles.input}
                inputAccessoryViewID={Platform.OS === 'ios' ? TECLADO_GRADOS_ID : undefined}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                accessibilityLabel="Grados mínimos por debajo de los cuales avisar"
                accessibilityHint="Escribe un número de grados, por ejemplo 3"
              />
            </View>
          </View>

          <Pressable
            style={styles.buttonPrimary}
            onPress={() => void saveThreshold({ enabled: thresholdEnabled, ...thresholdValues() })}
            accessibilityRole="button"
            accessibilityLabel="Guardar aviso de temperatura">
            <Text style={styles.buttonPrimaryText}>Guardar aviso de temperatura</Text>
          </Pressable>

          {/* Barra sobre el teclado numerico para cerrarlo y llegar al boton Guardar. Solo iOS. */}
          {Platform.OS === 'ios' && (
            <InputAccessoryView nativeID={TECLADO_GRADOS_ID}>
              <View style={styles.tecladoBarra}>
                <Pressable
                  onPress={() => Keyboard.dismiss()}
                  accessibilityRole="button"
                  accessibilityLabel="Listo, cerrar teclado"
                  style={styles.tecladoBoton}>
                  <Text style={styles.tecladoBotonTexto}>Listo</Text>
                </Pressable>
              </View>
            </InputAccessoryView>
          )}
        </>
      )}
    </ScrollView>
  );
}
