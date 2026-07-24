import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { CURRENT_LOCATION_ID, usePlaces } from '../state/PlacesContext';
import { useNotifications } from '../state/NotificationsContext';
import { Place, SummaryAlert } from '../types';
import { createSummaryAlert, DAILY_FIELD_OPTIONS, DEFAULT_THRESHOLD, formatTime } from '../utils/notifications';

interface PlaceOption {
  id: string;
  name: string;
}

function usePlaceOptions(): PlaceOption[] {
  const { places, currentLocationPlace } = usePlaces();
  return useMemo(
    () => [
      { id: CURRENT_LOCATION_ID, name: currentLocationPlace ? `Mi ubicación (${currentLocationPlace.name})` : 'Mi ubicación actual' },
      ...places.map((p) => ({ id: p.id, name: p.name })),
    ],
    [places, currentLocationPlace]
  );
}

function placeName(options: PlaceOption[], id: string): string {
  return options.find((o) => o.id === id)?.name ?? 'Lugar no disponible';
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
        contentContainerStyle={styles.content}
        accessibilityLabel={isNew ? 'Nuevo aviso de resumen' : 'Editar aviso de resumen'}
        style={styles.modalRoot}
      >
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
                accessibilityLabel={`${option.name}${selected ? ', seleccionado' : ''}`}
              >
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
          <Text style={styles.rowTitle} accessibilityLabel={`Hora del aviso: ${formatTime(draft.hour, draft.minute)}`}>
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
            <View key={field} style={[styles.switchRow, index < DAILY_FIELD_OPTIONS.length - 1 && styles.rowDivider]}>
              {/* El texto se oculta a VoiceOver: la etiqueta va en el propio conmutador para que
                  se lea "Temperatura, conmutador" y no dos elementos. */}
              <Text style={styles.rowTitle} importantForAccessibility="no">
                {field}
              </Text>
              <Switch
                value={draft.fields.includes(field)}
                onValueChange={() => toggleField(field)}
                accessibilityLabel={field}
              />
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.rowTitle} importantForAccessibility="no">
              Aviso activado
            </Text>
            <Switch
              value={draft.enabled}
              onValueChange={(value) => setDraft((d) => ({ ...d, enabled: value }))}
              accessibilityLabel="Aviso activado"
            />
          </View>
        </View>

        <Pressable
          style={styles.buttonPrimary}
          onPress={() => onSave(draft)}
          accessibilityRole="button"
          accessibilityLabel="Guardar aviso"
        >
          <Text style={styles.buttonPrimaryText}>Guardar</Text>
        </Pressable>

        {!isNew && (
          <Pressable
            style={styles.buttonDanger}
            onPress={() => onDelete(draft.id)}
            accessibilityRole="button"
            accessibilityLabel="Eliminar este aviso"
          >
            <Text style={styles.buttonDangerText}>Eliminar aviso</Text>
          </Pressable>
        )}

        <Pressable style={styles.buttonSecondary} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cancelar">
          <Text style={styles.buttonSecondaryText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
}

export default function AlertsScreen() {
  const { currentLocationPlace } = usePlaces();
  const options = usePlaceOptions();
  const { settings, status, saveSummary, deleteSummary, saveThreshold, testNotification } = useNotifications();

  const [editing, setEditing] = useState<{ summary: SummaryAlert; isNew: boolean } | undefined>(undefined);

  const [thresholdEnabled, setThresholdEnabled] = useState(settings.threshold.enabled);
  const [maxDraft, setMaxDraft] = useState(String(settings.threshold.maxThreshold));
  const [minDraft, setMinDraft] = useState(String(settings.threshold.minThreshold));

  // Sincroniza el borrador del aviso de temperatura cuando cambian los ajustes guardados.
  useEffect(() => {
    setThresholdEnabled(settings.threshold.enabled);
    setMaxDraft(String(settings.threshold.maxThreshold));
    setMinDraft(String(settings.threshold.minThreshold));
  }, [settings.threshold]);

  const thresholdValues = () => {
    const max = Number(maxDraft.replace(',', '.'));
    const min = Number(minDraft.replace(',', '.'));
    return {
      maxThreshold: Number.isFinite(max) ? max : DEFAULT_THRESHOLD.maxThreshold,
      minThreshold: Number.isFinite(min) ? min : DEFAULT_THRESHOLD.minThreshold,
    };
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
      <ScrollView contentContainerStyle={styles.content} accessibilityLabel="Pantalla Avisos">
        <Text style={styles.title} accessibilityRole="header">
          Avisos
        </Text>
        {status ? (
          <Text style={styles.status} accessibilityLiveRegion="polite">
            {status}
          </Text>
        ) : null}

        <Text style={styles.sectionHeader} accessibilityRole="header">
          Avisos de resumen
        </Text>
        <Text style={styles.note}>
          Cada aviso te llega a la hora que elijas, con los datos que quieras, de tu ubicación o de una ciudad. Puedes
          tener varios.
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
                  summary.minute
                )}, ${summary.enabled ? 'activado' : 'desactivado'}`}
                accessibilityHint="Toca dos veces para editarlo. En el rotor de acciones puedes eliminarlo"
                accessibilityActions={[{ name: 'eliminar', label: 'Eliminar aviso' }]}
                onAccessibilityAction={(event) => {
                  if (event.nativeEvent.actionName === 'eliminar') {
                    void deleteSummary(summary.id);
                  }
                }}
              >
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
          onPress={() => setEditing({ summary: createSummaryAlert(CURRENT_LOCATION_ID), isNew: true })}
          accessibilityRole="button"
          accessibilityLabel="Añadir aviso de resumen"
        >
          <Text style={styles.buttonPrimaryText}>Añadir aviso de resumen</Text>
        </Pressable>

        <Text style={styles.sectionHeader} accessibilityRole="header">
          Aviso de temperatura
        </Text>
        <Text style={styles.note}>
          La app vigila tu ubicación actual y te avisa cuando la temperatura sube de tu máximo o baja de tu mínimo.
        </Text>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.rowTitle} importantForAccessibility="no">
              Aviso de temperatura
            </Text>
            <Switch
              value={thresholdEnabled}
              onValueChange={onToggleThreshold}
              accessibilityLabel="Aviso de temperatura"
            />
          </View>
        </View>

        {thresholdEnabled && (
          <>
            {!currentLocationPlace && (
              <Text style={styles.note}>Para usar este aviso, actualiza antes tu ubicación en la pestaña Hoy.</Text>
            )}

            <View style={styles.card}>
              <View style={[styles.switchRow, styles.rowDivider]}>
                <Text style={styles.rowTitle} importantForAccessibility="no">
                  Avisar si sube de
                </Text>
                <TextInput
                  value={maxDraft}
                  onChangeText={setMaxDraft}
                  keyboardType="numbers-and-punctuation"
                  style={styles.input}
                  accessibilityLabel="Grados máximos a partir de los cuales avisar"
                  accessibilityHint="Escribe un número de grados, por ejemplo 30"
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.rowTitle} importantForAccessibility="no">
                  Avisar si baja de
                </Text>
                <TextInput
                  value={minDraft}
                  onChangeText={setMinDraft}
                  keyboardType="numbers-and-punctuation"
                  style={styles.input}
                  accessibilityLabel="Grados mínimos por debajo de los cuales avisar"
                  accessibilityHint="Escribe un número de grados, por ejemplo 3"
                />
              </View>
            </View>

            <Pressable
              style={styles.buttonPrimary}
              onPress={onSaveThreshold}
              accessibilityRole="button"
              accessibilityLabel="Guardar aviso de temperatura"
            >
              <Text style={styles.buttonPrimaryText}>Guardar aviso de temperatura</Text>
            </Pressable>

            <Pressable
              style={styles.buttonSecondary}
              onPress={() => void testNotification()}
              accessibilityRole="button"
              accessibilityLabel="Probar notificación"
              accessibilityHint="Envía una notificación de prueba a este teléfono para comprobar que los avisos llegan"
            >
              <Text style={styles.buttonSecondaryText}>Probar notificación</Text>
            </Pressable>
          </>
        )}

        <Text style={styles.note}>
          Los avisos de resumen se preparan en el propio teléfono. El aviso de temperatura lo gestiona un servidor para
          poder avisarte aunque no abras la app; puedes ver qué datos guarda en la política de privacidad.
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
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    backgroundColor: '#0d1a2b',
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  title: {
    color: '#f4f8ff',
    fontSize: 34,
    fontWeight: '700',
  },
  sectionHeader: {
    color: '#eaf3ff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#132740',
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
    borderBottomColor: '#2a4367',
  },
  rowTitle: {
    color: '#f0f5ff',
    fontSize: 17,
    flexShrink: 1,
  },
  rowMeta: {
    color: '#c2d0e6',
    fontSize: 15,
    marginTop: 2,
  },
  input: {
    minWidth: 80,
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#0e2238',
    color: '#ffffff',
    fontSize: 17,
    textAlign: 'right',
  },
  status: {
    color: '#c2d0e6',
    fontSize: 15,
  },
  note: {
    color: '#b8c6dc',
    fontSize: 15,
  },
  buttonPrimary: {
    borderRadius: 12,
    backgroundColor: '#1b5ea9',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonSecondary: {
    borderRadius: 12,
    backgroundColor: '#0e2238',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonSecondaryText: {
    color: '#dbe8ff',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonDanger: {
    borderRadius: 12,
    backgroundColor: '#7a2a38',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonDangerText: {
    color: '#ffe8ed',
    fontSize: 17,
    fontWeight: '600',
  },
});
