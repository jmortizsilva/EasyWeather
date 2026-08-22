import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CURRENT_LOCATION_ID, usePlaces } from '../state/PlacesContext';
import { useNotifications } from '../state/NotificationsContext';
import { Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';
import { NivelAviso, SummaryAlert } from '../types';
import {
  createSummaryAlert,
  DAILY_FIELD_OPTIONS,
  DEFAULT_THRESHOLD,
  formatTime,
} from '../utils/ajustesAvisos';

// Id de la barra "Listo" que se ancla sobre el teclado numerico (solo iOS): sin ella, el teclado
// tapa el boton "Guardar aviso" y no habia forma clara de cerrarlo. Los teclados numericos no traen
// tecla de retorno visible, asi que la barra es la unica salida accesible.
const TECLADO_GRADOS_ID = 'avisoTemperaturaTeclado';

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

interface PlaceOption {
  id: string;
  name: string;
}

function usePlaceOptions(): PlaceOption[] {
  const { places, currentLocationPlace } = usePlaces();
  return useMemo(
    () => [
      {
        id: CURRENT_LOCATION_ID,
        name: currentLocationPlace
          ? `Mi ubicación (${currentLocationPlace.name})`
          : 'Mi ubicación actual',
      },
      ...places.map((p) => ({ id: p.id, name: p.name })),
    ],
    [places, currentLocationPlace],
  );
}

function placeName(options: PlaceOption[], id: string): string {
  return options.find((o) => o.id === id)?.name ?? 'Lugar no disponible';
}

// Fila-conmutador accesible: toda la fila es UN solo elemento con rol "conmutador", para que
// VoiceOver lea "Temperatura, conmutador, activado" en un único flick (en vez de leer el texto y
// el interruptor por separado). El interruptor visual queda como adorno, sin foco ni toque.
function SwitchRow({
  label,
  value,
  onValueChange,
  divider,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  divider?: boolean;
}) {
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  return (
    <Pressable
      style={[styles.switchRow, divider && styles.rowDivider]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      onPress={() => onValueChange(!value)}>
      <Text style={styles.rowTitle}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        style={styles.switchControl}
        importantForAccessibility="no-hide-descendants"
      />
    </Pressable>
  );
}

// Editor de un aviso de resumen. Mantiene su propio borrador; nada se guarda hasta pulsar Guardar.
function SummaryEditor({
  initial,
  options,
  isNew,
  onSave,
  onDelete,
  onClose,
}: {
  initial: SummaryAlert;
  options: PlaceOption[];
  isNew: boolean;
  onSave: (summary: SummaryAlert) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const [draft, setDraft] = useState<SummaryAlert>(initial);

  const timeValue = useMemo(() => {
    const date = new Date();
    date.setHours(draft.hour, draft.minute, 0, 0);
    return date;
  }, [draft.hour, draft.minute]);

  const toggleField = (field: string) => {
    setDraft((d) => ({
      ...d,
      fields: d.fields.includes(field) ? d.fields.filter((f) => f !== field) : [...d.fields, field],
    }));
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        accessibilityLabel={isNew ? 'Nuevo aviso de resumen' : 'Editar aviso de resumen'}
        style={styles.modalRoot}>
        <Text style={styles.title} accessibilityRole="header">
          {isNew ? 'Nuevo aviso' : 'Editar aviso'}
        </Text>

        <Text style={styles.sectionHeader} accessibilityRole="header">
          Lugar
        </Text>
        <View style={styles.card}>
          {options.map((option, index) => {
            const selected = draft.placeId === option.id;
            return (
              <Pressable
                key={option.id}
                style={[styles.row, index < options.length - 1 && styles.rowDivider]}
                onPress={() => setDraft((d) => ({ ...d, placeId: option.id }))}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${option.name}${selected ? ', seleccionado' : ''}`}>
                <Text style={styles.rowTitle}>
                  {selected ? '● ' : '○ '}
                  {option.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionHeader} accessibilityRole="header">
          Hora
        </Text>
        <View style={styles.card}>
          <Text
            style={styles.rowTitle}
            accessibilityLabel={`Hora del aviso: ${formatTime(draft.hour, draft.minute)}`}>
            Hora del aviso: {formatTime(draft.hour, draft.minute)}
          </Text>
          <DateTimePicker
            value={timeValue}
            mode="time"
            is24Hour
            display="spinner"
            onChange={(_event, date) => {
              if (date) {
                setDraft((d) => ({ ...d, hour: date.getHours(), minute: date.getMinutes() }));
              }
            }}
          />
        </View>

        <Text style={styles.sectionHeader} accessibilityRole="header">
          Datos a incluir
        </Text>
        <View style={styles.card}>
          {DAILY_FIELD_OPTIONS.map((field, index) => (
            <SwitchRow
              key={field}
              label={field}
              value={draft.fields.includes(field)}
              onValueChange={() => toggleField(field)}
              divider={index < DAILY_FIELD_OPTIONS.length - 1}
            />
          ))}
        </View>

        <View style={styles.card}>
          <SwitchRow
            label="Aviso activado"
            value={draft.enabled}
            onValueChange={(value) => setDraft((d) => ({ ...d, enabled: value }))}
          />
        </View>

        <Pressable
          style={styles.buttonPrimary}
          onPress={() => onSave(draft)}
          accessibilityRole="button"
          accessibilityLabel="Guardar aviso">
          <Text style={styles.buttonPrimaryText}>Guardar</Text>
        </Pressable>

        {!isNew && (
          <Pressable
            style={styles.buttonDanger}
            onPress={() => onDelete(draft.id)}
            accessibilityRole="button"
            accessibilityLabel="Eliminar este aviso">
            <Text style={styles.buttonDangerText}>Eliminar aviso</Text>
          </Pressable>
        )}

        <Pressable
          style={styles.buttonSecondary}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cancelar">
          <Text style={styles.buttonSecondaryText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
}

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { currentLocationPlace } = usePlaces();
  const options = usePlaceOptions();
  const {
    settings,
    saveSummary,
    deleteSummary,
    saveThreshold,
    saveAvisosOficiales,
    testNotification,
    notice,
  } = useNotifications();

  const [editing, setEditing] = useState<{ summary: SummaryAlert; isNew: boolean } | undefined>(
    undefined,
  );

  // Banner de confirmacion visible: refleja lo mismo que anuncia VoiceOver (guardado, falta permiso,
  // error...) y se autooculta. Se ignoran los avisos previos al montar para no mostrar uno viejo al
  // volver a la pestaña.
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

  const [thresholdEnabled, setThresholdEnabled] = useState(settings.threshold.enabled);
  const [maxDraft, setMaxDraft] = useState(String(settings.threshold.maxThreshold));
  const [minDraft, setMinDraft] = useState(String(settings.threshold.minThreshold));

  // Sincroniza el borrador del aviso de temperatura cuando cambian los ajustes guardados. Es un
  // sync de estado local desde una fuente externa (los ajustes persistidos), no una cascada.
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

  const oficiales = settings.avisosOficiales;

  // Aqui no hay boton Guardar, al contrario que en el aviso de temperatura: alli hay campos de
  // texto que hay que poder corregir antes de confirmar, y esto es una eleccion entre tres, sin
  // nada que escribir. Se guarda al tocarla.
  const onToggleOficiales = (value: boolean) => {
    void saveAvisosOficiales({ ...oficiales, enabled: value });
  };

  const onElegirNivel = (nivelMinimo: NivelAviso) => {
    void saveAvisosOficiales({ ...oficiales, nivelMinimo });
  };

  const onSaveThreshold = () => {
    void saveThreshold({ enabled: thresholdEnabled, ...thresholdValues() });
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
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        accessibilityLabel="Pantalla Avisos">
        <Text style={styles.title} accessibilityRole="header">
          Avisos
        </Text>

        <Text style={styles.sectionHeader} accessibilityRole="header">
          Avisos de resumen
        </Text>
        <Text style={styles.note}>
          Cada aviso te llega a la hora que elijas, con los datos que quieras, de tu ubicación o de
          una ciudad. Puedes tener varios.
        </Text>

        {settings.summaries.length > 0 && (
          <View style={styles.card}>
            {settings.summaries.map((summary, index) => (
              <Pressable
                key={summary.id}
                style={[styles.row, index < settings.summaries.length - 1 && styles.rowDivider]}
                onPress={() => setEditing({ summary, isNew: false })}
                accessibilityRole="button"
                accessibilityLabel={`Editar aviso de ${placeName(options, summary.placeId)} a las ${formatTime(
                  summary.hour,
                  summary.minute,
                )}, ${summary.enabled ? 'activado' : 'desactivado'}`}
                accessibilityHint="Toca dos veces para editarlo. En el rotor de acciones puedes eliminarlo"
                accessibilityActions={[{ name: 'eliminar', label: 'Eliminar aviso' }]}
                onAccessibilityAction={(event) => {
                  if (event.nativeEvent.actionName === 'eliminar') {
                    void deleteSummary(summary.id);
                  }
                }}>
                <Text style={styles.rowTitle}>
                  {placeName(options, summary.placeId)} · {formatTime(summary.hour, summary.minute)}
                </Text>
                <Text style={styles.rowMeta}>{summary.enabled ? 'Activado' : 'Desactivado'}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable
          style={styles.buttonPrimary}
          onPress={() =>
            setEditing({ summary: createSummaryAlert(CURRENT_LOCATION_ID), isNew: true })
          }
          accessibilityRole="button"
          accessibilityLabel="Añadir aviso de resumen">
          <Text style={styles.buttonPrimaryText}>Añadir aviso de resumen</Text>
        </Pressable>

        <Text style={styles.sectionHeader} accessibilityRole="header">
          Aviso de temperatura
        </Text>
        <Text style={styles.note}>
          La app vigila tu ubicación actual y te avisa cuando la temperatura sube de tu máximo o
          baja de tu mínimo.
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
                    descendientes); el campo ya lleve su propia etiqueta descriptiva. */}
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
              onPress={onSaveThreshold}
              accessibilityRole="button"
              accessibilityLabel="Guardar aviso de temperatura">
              <Text style={styles.buttonPrimaryText}>Guardar aviso de temperatura</Text>
            </Pressable>

            <Pressable
              style={styles.buttonSecondary}
              onPress={() => void testNotification()}
              accessibilityRole="button"
              accessibilityLabel="Probar notificación"
              accessibilityHint="Envía una notificación de prueba a este teléfono para comprobar que los avisos llegan">
              <Text style={styles.buttonSecondaryText}>Probar notificación</Text>
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

        <Text style={styles.sectionHeader} accessibilityRole="header">
          Avisos oficiales de AEMET
        </Text>
        {/* Lo primero que dice esta nota es lo que NO son. Los tres tipos de aviso de esta pantalla
            llegan por la misma via —una notificacion— y sin decirlo se confundirian: los dos de
            arriba son reglas que escribes tú; este es informacion oficial de riesgo. */}
        <Text style={styles.note}>
          No son reglas tuyas: son los avisos que emite AEMET por lluvias, tormentas, viento, calor,
          nieve y otros fenómenos. Te llegan si tu ubicación está en la zona avisada. Solo hay
          avisos en España.
        </Text>

        <View style={styles.card}>
          <SwitchRow
            label="Avisos oficiales de AEMET"
            value={oficiales.enabled}
            onValueChange={onToggleOficiales}
          />
        </View>

        {oficiales.enabled && (
          <>
            <Text style={styles.note}>
              A partir de qué nivel quieres que te avise. El amarillo es muy frecuente: en un día
              normal de verano puede haber decenas en España.
            </Text>

            <View style={styles.card} accessibilityRole="radiogroup">
              {NIVELES.map((nivel, index) => (
                <Pressable
                  key={nivel.valor}
                  style={[styles.row, index < NIVELES.length - 1 && styles.rowDivider]}
                  onPress={() => onElegirNivel(nivel.valor)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: oficiales.nivelMinimo === nivel.valor }}
                  accessibilityLabel={nivel.etiqueta}
                  accessibilityHint={nivel.pista}>
                  <Text style={styles.rowTitle}>
                    {oficiales.nivelMinimo === nivel.valor ? '✓ ' : '   '}
                    {nivel.etiqueta}
                  </Text>
                  <Text style={styles.rowMeta}>{nivel.pista}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Text style={styles.note}>
          Los avisos los envía un servidor con tu ubicación y tu configuración, para poder avisarte
          del tiempo del sitio donde estés aunque no abras la app. Puedes ver qué datos guarda en la
          política de privacidad.
        </Text>
      </ScrollView>

      {editing && (
        <SummaryEditor
          initial={editing.summary}
          options={options}
          isNew={editing.isNew}
          onSave={(summary) => {
            void saveSummary(summary);
            setEditing(undefined);
          }}
          onDelete={(id) => {
            void deleteSummary(id);
            setEditing(undefined);
          }}
          onClose={() => setEditing(undefined)}
        />
      )}

      {/* Confirmacion visible flotante. Se oculta de VoiceOver (importantForAccessibility) porque el
          mismo texto ya se anuncio por voz al fijar el notice; asi no se lee dos veces. */}
      {banner ? (
        <View
          style={[styles.toast, { bottom: insets.bottom + 24 }]}
          pointerEvents="none"
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden>
          <Text style={styles.toastText}>{banner}</Text>
        </View>
      ) : null}
    </>
  );
}

const crearEstilos = (c: Paleta) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.fondo,
    },
    modalRoot: {
      backgroundColor: c.fondo,
    },
    content: {
      paddingTop: 24,
      paddingHorizontal: 16,
      paddingBottom: 96,
      gap: 12,
    },
    title: {
      color: c.texto,
      fontSize: 34,
      fontWeight: '700',
    },
    sectionHeader: {
      color: c.textoSeccion,
      fontSize: 20,
      fontWeight: '600',
      marginTop: 8,
    },
    card: {
      backgroundColor: c.tarjeta,
      borderRadius: 16,
      overflow: 'hidden',
      paddingHorizontal: 16,
    },
    row: {
      minHeight: 44,
      justifyContent: 'center',
      paddingVertical: 12,
    },
    switchRow: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 8,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.borde,
    },
    rowTitle: {
      color: c.textoFila,
      fontSize: 17,
      flexShrink: 1,
    },
    rowMeta: {
      color: c.textoMeta,
      fontSize: 15,
      marginTop: 2,
    },
    // El campo lleva borde: en la paleta clara su relleno es blanco como el de la tarjeta y sin
    // borde no se distinguiria donde se escribe.
    input: {
      minWidth: 80,
      minHeight: 44,
      borderRadius: 12,
      paddingHorizontal: 12,
      backgroundColor: c.campo,
      borderWidth: 1,
      borderColor: c.borde,
      color: c.textoCampo,
      fontSize: 17,
      textAlign: 'right',
    },
    // El interruptor visual no captura el toque: la fila-conmutador (Pressable) es quien cambia.
    switchControl: {
      pointerEvents: 'none',
    },
    note: {
      color: c.textoTenue,
      fontSize: 15,
    },
    buttonPrimary: {
      borderRadius: 12,
      backgroundColor: c.primario,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 4,
    },
    buttonPrimaryText: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    // Boton secundario: relleno visible + borde del color del texto (un borde de acento se volvia
    // invisible en la paleta clara, donde acento y primario coinciden). Antes el relleno era casi
    // identico al fondo y "Probar notificación" / "Cancelar" apenas se veian.
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
    // Aviso visible flotante (toast) para confirmar acciones sin depender solo de VoiceOver.
    toast: {
      position: 'absolute',
      left: 16,
      right: 16,
      borderRadius: 12,
      backgroundColor: c.exitoFondo,
      borderWidth: 1,
      borderColor: c.exitoBorde,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    toastText: {
      color: c.exitoTexto,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    // Barra "Listo" sobre el teclado numerico.
    tecladoBarra: {
      backgroundColor: c.tarjeta,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.borde,
      paddingHorizontal: 12,
      paddingVertical: 8,
      alignItems: 'flex-end',
    },
    tecladoBoton: {
      minHeight: 44,
      minWidth: 72,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: c.primario,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tecladoBotonTexto: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    buttonDanger: {
      borderRadius: 12,
      backgroundColor: c.peligro,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    buttonDangerText: {
      color: c.textoPeligro,
      fontSize: 17,
      fontWeight: '600',
    },
  });
