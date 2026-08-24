import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CURRENT_LOCATION_ID } from '../../state/PlacesContext';
import { useNotifications } from '../../state/NotificationsContext';
import { useColores } from '../../theme/ThemeContext';
import { SummaryAlert } from '../../types';
import { createSummaryAlert, DAILY_FIELD_OPTIONS, formatTime } from '../../utils/ajustesAvisos';
import Cabecera from './Cabecera';
import { crearEstilos } from './estilos';
import { PlaceOption, placeName, usePlaceOptions } from './lugares';
import SwitchRow from './SwitchRow';

// Editor de un aviso de resumen. Mantiene su propio borrador; nada se guarda hasta pulsar Guardar.
//
// Es una CAPA sobre esta pantalla, no otro Modal: la hoja de Avisos ya es uno, y iOS no presenta
// dos a la vez desde el mismo sitio (descarta el segundo en silencio y la pantalla se queda muerta,
// ver PlacesScreen). Mismo patron que la vista previa de un lugar.
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
    <View style={styles.capa} accessibilityViewIsModal onAccessibilityEscape={onClose}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        accessibilityLabel={isNew ? 'Nuevo aviso de resumen' : 'Editar aviso de resumen'}
        style={styles.hoja}>
        <Cabecera
          titulo={isNew ? 'Nuevo aviso' : 'Editar aviso'}
          destino="Avisos de resumen"
          onVolver={onClose}
        />

        <Text style={styles.sectionHeader} accessibilityRole="header">
          Lugar
        </Text>
        {/* Misma eleccion que en los niveles de AEMET: rol de boton con el estado `selected`, que
            iOS ya anuncia en español. La etiqueta no lo repite a mano o sonaria dos veces. */}
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
                accessibilityLabel={option.name}>
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
    </View>
  );
}

export default function AvisosResumen({ onCerrar }: { onCerrar: () => void }) {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const options = usePlaceOptions();
  const { settings, saveSummary, deleteSummary } = useNotifications();
  const [editing, setEditing] = useState<{ summary: SummaryAlert; isNew: boolean } | undefined>(
    undefined,
  );

  return (
    <View style={styles.hoja}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        accessibilityLabel="Avisos de resumen"
        // Mientras el editor esta encima, lo de debajo sale del recorrido de VoiceOver.
        accessibilityElementsHidden={editing !== undefined}
        importantForAccessibility={editing !== undefined ? 'no-hide-descendants' : 'auto'}>
        <Cabecera titulo="Avisos de resumen" destino="Avisos" onVolver={onCerrar} />

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
    </View>
  );
}
