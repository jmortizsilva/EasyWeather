import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useNotifications } from '../state/NotificationsContext';
import { usePlaces } from '../state/PlacesContext';
import { DAILY_FIELD_OPTIONS, formatDailyTime } from '../utils/notifications';

export default function AlertsScreen() {
  const { places } = usePlaces();
  const { settings, status, updateSettings } = useNotifications();
  const [maxDraft, setMaxDraft] = useState(String(settings.maxThreshold));
  const [minDraft, setMinDraft] = useState(String(settings.minThreshold));

  const timeValue = useMemo(() => {
    const date = new Date();
    date.setHours(settings.dailyHour, settings.dailyMinute, 0, 0);
    return date;
  }, [settings.dailyHour, settings.dailyMinute]);

  const toggleField = (field: string) => {
    const next = settings.dailyFields.includes(field)
      ? settings.dailyFields.filter((item) => item !== field)
      : [...settings.dailyFields, field];
    void updateSettings({ dailyFields: next });
  };

  const commitThreshold = (raw: string, key: 'maxThreshold' | 'minThreshold') => {
    const parsed = Number(raw.replace(',', '.'));
    if (Number.isFinite(parsed)) {
      void updateSettings({ [key]: parsed } as Parameters<typeof updateSettings>[0]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content} accessibilityLabel="Pantalla Avisos">
      <Text style={styles.title} accessibilityRole="header">
        Avisos
      </Text>

      {status ? <Text style={styles.status}>{status}</Text> : null}

      <Text style={styles.sectionHeader} accessibilityRole="header">
        Lugar de los avisos
      </Text>
      {places.length === 0 ? (
        <Text style={styles.note}>
          Todavía no tienes lugares guardados. Ve a la pestaña Buscar y guarda uno para poder recibir avisos.
        </Text>
      ) : (
        <View style={styles.card}>
          {places.map((place, index) => {
            const selected = settings.placeId === place.id;
            return (
              <Pressable
                key={place.id}
                style={[styles.row, index < places.length - 1 && styles.rowDivider]}
                onPress={() => void updateSettings({ placeId: place.id })}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`Avisos de ${place.name}${place.admin1 ? `, ${place.admin1}` : ''}`}
              >
                <Text style={styles.rowTitle}>
                  {selected ? '● ' : '○ '}
                  {place.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <Text style={styles.sectionHeader} accessibilityRole="header">
        Resumen diario
      </Text>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.rowTitle}>Enviar resumen cada día</Text>
          <Switch
            value={settings.dailyEnabled}
            onValueChange={(value) => void updateSettings({ dailyEnabled: value })}
            accessibilityLabel="Enviar resumen cada día"
          />
        </View>
      </View>

      {settings.dailyEnabled && (
        <>
          <View style={styles.card}>
            <Text style={styles.rowTitle} accessibilityLabel={`Hora del resumen: ${formatDailyTime(settings)}`}>
              Hora del resumen: {formatDailyTime(settings)}
            </Text>
            <DateTimePicker
              value={timeValue}
              mode="time"
              is24Hour
              display="spinner"
              onChange={(_event, date) => {
                if (date) {
                  void updateSettings({ dailyHour: date.getHours(), dailyMinute: date.getMinutes() });
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
                <Text style={styles.rowTitle}>{field}</Text>
                <Switch
                  value={settings.dailyFields.includes(field)}
                  onValueChange={() => toggleField(field)}
                  accessibilityLabel={`Incluir ${field} en el resumen`}
                />
              </View>
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionHeader} accessibilityRole="header">
        Aviso por temperatura
      </Text>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.rowTitle}>Avisar si se pasa de un límite</Text>
          <Switch
            value={settings.thresholdEnabled}
            onValueChange={(value) => void updateSettings({ thresholdEnabled: value })}
            accessibilityLabel="Avisar si la temperatura pasa de un límite"
          />
        </View>
      </View>

      {settings.thresholdEnabled && (
        <View style={styles.card}>
          <View style={[styles.switchRow, styles.rowDivider]}>
            <Text style={styles.rowTitle}>Avisar si sube de</Text>
            <TextInput
              value={maxDraft}
              onChangeText={setMaxDraft}
              onBlur={() => commitThreshold(maxDraft, 'maxThreshold')}
              onSubmitEditing={() => commitThreshold(maxDraft, 'maxThreshold')}
              keyboardType="numbers-and-punctuation"
              style={styles.input}
              accessibilityLabel="Grados máximos a partir de los cuales avisar"
              accessibilityHint="Escribe un número de grados, por ejemplo 40"
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.rowTitle}>Avisar si baja de</Text>
            <TextInput
              value={minDraft}
              onChangeText={setMinDraft}
              onBlur={() => commitThreshold(minDraft, 'minThreshold')}
              onSubmitEditing={() => commitThreshold(minDraft, 'minThreshold')}
              keyboardType="numbers-and-punctuation"
              style={styles.input}
              accessibilityLabel="Grados mínimos por debajo de los cuales avisar"
              accessibilityHint="Escribe un número de grados, por ejemplo 0"
            />
          </View>
        </View>
      )}

      <Text style={styles.note}>
        Los avisos se preparan en el propio teléfono cuando abres la app, así que no sale ningún dato tuyo. Si pasas
        muchos días sin abrirla, dejarán de llegar hasta que vuelvas a entrar.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 8,
  },
});
