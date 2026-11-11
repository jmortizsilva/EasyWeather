import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications } from '../../state/NotificationsContext';
import { useColores } from '../../theme/ThemeContext';
import { AvisoLluviaAlert } from '../../types';
import { horaDeMinutos, OPCIONES_INTENSIDAD, OPCIONES_RADIO } from '../../utils/avisoLluvia';
import Cabecera from './Cabecera';
import { crearEstilos } from './estilos';
import SelectorAjustable from './SelectorAjustable';
import SwitchRow from './SwitchRow';
import { useAccionesDeDesarrollo } from '../../desarrollo/automatizacion';
import { useDesplazableDePuente } from '../../desarrollo/desplazables';

// Lo que se espera tras el último cambio antes de guardar. Pasar de 10 a 50 km son tres
// deslizamientos, y cada guardado lee el GPS y llama al servidor: así se guarda una vez y no tres.
const ESPERA_GUARDAR_MS = 1000;

export default function AvisoLluvia({ onCerrar }: { onCerrar: () => void }) {
  const refDesplazable = useDesplazableDePuente('aviso-lluvia');
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { settings, saveAvisoLluvia } = useNotifications();

  const [borrador, setBorrador] = useState(settings.avisoLluvia);
  const borradorRef = useRef(borrador);
  const pendiente = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const guardarRef = useRef(saveAvisoLluvia);
  useEffect(() => {
    guardarRef.current = saveAvisoLluvia;
  }, [saveAvisoLluvia]);

  // Lo guardado puede cambiar por fuera: si se niega el permiso de notificaciones, se guarda
  // desactivado. Mientras haya un cambio por guardar, manda el borrador.
  useEffect(() => {
    if (pendiente.current) return;
    borradorRef.current = settings.avisoLluvia;
    setBorrador(settings.avisoLluvia);
  }, [settings.avisoLluvia]);

  // Al salir de la pantalla no se pierde lo que estuviera esperando.
  useEffect(
    () => () => {
      if (pendiente.current) {
        clearTimeout(pendiente.current);
        void guardarRef.current(borradorRef.current, 'soloSiFalla');
      }
    },
    [],
  );

  const aplicar = (cambios: Partial<AvisoLluviaAlert>) => {
    const nuevo = { ...borradorRef.current, ...cambios };
    borradorRef.current = nuevo;
    setBorrador(nuevo);
    return nuevo;
  };

  // Distancia, intensidad, segundo aviso y franja: VoiceOver ya dice el valor nuevo, así que solo
  // se anuncia si no se ha podido guardar.
  const cambiar = (cambios: Partial<AvisoLluviaAlert>) => {
    aplicar(cambios);
    clearTimeout(pendiente.current);
    pendiente.current = setTimeout(() => {
      pendiente.current = undefined;
      void saveAvisoLluvia(borradorRef.current, 'soloSiFalla');
    }, ESPERA_GUARDAR_MS);
  };

  // Activar y desactivar sí se confirma, y al momento: es ahí donde se pide el permiso.
  const activar = (enabled: boolean) => {
    clearTimeout(pendiente.current);
    pendiente.current = undefined;
    void saveAvisoLluvia(aplicar({ enabled }));
  };

  const cambiarHora = (extremo: 'desde' | 'hasta', date: Date | undefined) => {
    if (date) {
      const minutos = date.getHours() * 60 + date.getMinutes();
      cambiar({ noche: { ...borrador.noche, [extremo]: minutos } });
    }
  };

  // Para las capturas del puente: enseña todos los controles SIN guardar, así no se pide permiso ni
  // se da de alta nada en el servidor desde el simulador. En una build publicada no registra nada.
  useAccionesDeDesarrollo({
    verControlesLluvia: () =>
      setBorrador((b) => ({ ...b, enabled: true, noche: { ...b.noche, activada: true } })),
  });

  const noche = borrador.noche;
  const fecha = (minutos: number) => {
    const d = new Date();
    d.setHours(Math.floor(minutos / 60), minutos % 60, 0, 0);
    return d;
  };

  return (
    <ScrollView
      ref={refDesplazable}
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      accessibilityLabel="Aviso de lluvia">
      <Cabecera titulo="Aviso de lluvia" destino="Avisos" onVolver={onCerrar} />

      <Text style={styles.note}>
        Te avisa cuando el radar de AEMET ve lluvia cerca de tu ubicación actual, una vez cada vez
        que empieza a llover cerca. Solo funciona en España.
      </Text>

      <View style={styles.card}>
        <SwitchRow
          label="Avisarme cuando se acerque la lluvia"
          value={borrador.enabled}
          onValueChange={activar}
        />
      </View>

      {borrador.enabled && (
        <>
          <View style={styles.card}>
            <View style={styles.rowDivider}>
              <SelectorAjustable
                etiqueta="Distancia"
                opciones={OPCIONES_RADIO}
                valor={borrador.radioKm}
                onCambiar={(radioKm) => cambiar({ radioKm })}
              />
            </View>
            <SelectorAjustable
              etiqueta="Intensidad"
              opciones={OPCIONES_INTENSIDAD}
              valor={borrador.intensidad}
              onCambiar={(intensidad) => cambiar({ intensidad })}
            />
          </View>

          <View style={styles.card}>
            <SwitchRow
              label="Avisar otra vez cuando esté a menos de 5 km"
              etiquetaHablada="Avisar otra vez cuando esté a menos de 5 kilómetros"
              value={borrador.segundoAviso}
              onValueChange={(segundoAviso) => cambiar({ segundoAviso })}
            />
          </View>

          <View style={styles.card}>
            <SwitchRow
              label="Sin avisos de noche"
              value={noche.activada}
              divider={noche.activada}
              onValueChange={(activada) => cambiar({ noche: { ...noche, activada } })}
            />
            {noche.activada && (
              <>
                <View style={[styles.row, styles.rowDivider]}>
                  <Text style={styles.rowTitle}>Desde: {horaDeMinutos(noche.desde)}</Text>
                  <DateTimePicker
                    value={fecha(noche.desde)}
                    mode="time"
                    is24Hour
                    display="spinner"
                    onChange={(_event, date) => cambiarHora('desde', date)}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowTitle}>Hasta: {horaDeMinutos(noche.hasta)}</Text>
                  <DateTimePicker
                    value={fecha(noche.hasta)}
                    mode="time"
                    is24Hour
                    display="spinner"
                    onChange={(_event, date) => cambiarHora('hasta', date)}
                  />
                </View>
              </>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}
