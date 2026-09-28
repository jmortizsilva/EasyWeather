import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getEstaciones } from '../services/observacion';
import { Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';
import { Place } from '../types';
import { EstacionCandidata, filaAutomatica, filaEstacion } from '../utils/estaciones';
import { usePlaces } from '../state/PlacesContext';
import { vibrarConfirmacion } from '../utils/haptica';

// Elegir la estacion de AEMET de un lugar. Se abre tocando la linea de la medicion.
//
// Por que existe: el servidor elige por cercania, y no siempre acierta. La estacion mas cerca puede
// estar en otro valle o en otra vertiente, y quien vive alli lo sabe mejor que la formula. Lo pidio
// un usuario.
//
// Se enseñan TAMBIEN las que la app no cogeria sola, diciendo por que. Esconderlas convertiria la
// eleccion en una apuesta a ciegas, y hay casos legitimos para preferir una de 30 km.

interface Props {
  visible: boolean;
  place: Place;
  /** Altitud del terreno, de la prevision. Sin ella el servidor no puede calcular el desnivel. */
  elevacion?: number;
  onClose: () => void;
}

export default function EstacionModal({ visible, place, elevacion, onClose }: Props) {
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);
  const { estacionPorLugar, elegirEstacion } = usePlaces();
  const elegida = estacionPorLugar[place.id];

  // Este componente se MONTA al abrirlo (la pantalla lo pinta solo cuando hay lugar elegido), asi
  // que el estado inicial ya es el bueno y no hay que ponerlo desde el efecto: hacerlo alli encadena
  // renderizados de mas, y el linter lo caza.
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'fallo'>('cargando');
  const [estaciones, setEstaciones] = useState<EstacionCandidata[]>([]);
  const [automaticaId, setAutomaticaId] = useState<string | null>(null);

  // Se pide al abrir, y no antes: es una consulta que solo hace falta si alguien quiere cambiar la
  // estacion, que es algo que se hace una vez y no en cada apertura de la app.
  useEffect(() => {
    let vigente = true;
    void getEstaciones(place.lat, place.lon, elevacion).then((lista) => {
      if (!vigente) {
        return;
      }
      if (!lista) {
        setEstado('fallo');
        return;
      }
      setEstaciones(lista.estaciones);
      setAutomaticaId(lista.automatica);
      setEstado('listo');
    });
    return () => {
      vigente = false;
    };
  }, [place.lat, place.lon, elevacion]);

  const automatica = estaciones.find((e) => e.id === automaticaId);
  const filaAuto = filaAutomatica(automatica);

  const elegir = async (estacion: EstacionCandidata | undefined) => {
    vibrarConfirmacion();
    onClose();
    // Se cierra ANTES de pedir: la respuesta tarda, y dejar la hoja abierta mientras tanto haria
    // dudar de si el toque ha servido de algo. El anuncio de VoiceOver lo lanza el contexto.
    await elegirEstacion(
      place,
      estacion ? { id: estacion.id, nombre: estacion.nombre } : undefined,
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop} onAccessibilityEscape={onClose}>
        <View style={styles.sheet} accessibilityViewIsModal onAccessibilityEscape={onClose}>
          <View style={styles.grabber} importantForAccessibility="no" />
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title} accessibilityRole="header">
                Estación de AEMET
              </Text>
              <Text style={styles.subtitle}>{place.name}</Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar la lista de estaciones">
              <Text style={styles.closeText}>Cerrar</Text>
            </Pressable>
          </View>

          {estado === 'cargando' && (
            <View style={styles.centrado}>
              <ActivityIndicator color={colores.primario} />
              <Text style={styles.nota}>Buscando estaciones cerca de {place.name}…</Text>
            </View>
          )}

          {estado === 'fallo' && (
            <Text style={styles.nota}>
              No se ha podido cargar la lista de estaciones. Inténtalo más tarde.
            </Text>
          )}

          {estado === 'listo' && (
            <ScrollView>
              <Pressable
                style={[styles.fila, !elegida && styles.filaElegida]}
                onPress={() => void elegir(undefined)}
                accessibilityRole="button"
                accessibilityState={{ selected: !elegida }}
                accessibilityLabel={filaAuto.spoken}>
                <Text style={styles.filaTitulo}>{filaAuto.titulo}</Text>
                <Text style={styles.filaDetalle}>{filaAuto.detalle}</Text>
              </Pressable>

              {estaciones.map((estacion) => {
                const fila = filaEstacion(estacion);
                const esLaElegida = elegida?.id === estacion.id;
                return (
                  <Pressable
                    key={estacion.id}
                    style={[styles.fila, esLaElegida && styles.filaElegida]}
                    onPress={() => void elegir(estacion)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: esLaElegida }}
                    accessibilityLabel={fila.spoken}>
                    <Text style={styles.filaTitulo}>{fila.titulo}</Text>
                    <Text style={styles.filaDetalle}>{fila.detalle}</Text>
                  </Pressable>
                );
              })}

              {estaciones.length === 0 && (
                <Text style={styles.nota}>
                  No hay ninguna estación de AEMET midiendo cerca de este sitio. Fuera de España no
                  las hay: la app se queda con la previsión.
                </Text>
              )}

              <Text style={styles.aclaracion}>
                La app coge sola la estación más cercana que valga. Aquí puedes cambiarla si conoces
                el sitio mejor que ella. Si la que elijas deja de publicar, se te dirá: no se pondrá
                en su lugar el dato de otra.
              </Text>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const crearEstilos = (c: Paleta) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: c.tarjeta,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 16,
      paddingBottom: 24,
      maxHeight: '85%',
    },
    grabber: {
      alignSelf: 'center',
      width: 36,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.agarre,
      marginTop: 8,
      marginBottom: 4,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 8,
    },
    headerText: {
      flex: 1,
      gap: 2,
    },
    title: {
      color: c.texto,
      fontSize: 22,
      fontWeight: '700',
    },
    subtitle: {
      color: c.textoTenue,
      fontSize: 15,
    },
    closeButton: {
      borderRadius: 12,
      backgroundColor: c.primario,
      paddingHorizontal: 16,
      minHeight: 44,
      justifyContent: 'center',
    },
    closeText: {
      color: c.textoPrimario,
      fontSize: 17,
      fontWeight: '600',
    },
    centrado: {
      paddingVertical: 24,
      alignItems: 'center',
      gap: 12,
    },
    fila: {
      minHeight: 44,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 8,
      gap: 2,
      backgroundColor: c.fondo,
    },
    filaElegida: {
      backgroundColor: c.tarjetaSeleccionada,
    },
    filaTitulo: {
      color: c.textoFila,
      fontSize: 17,
      fontWeight: '600',
    },
    filaDetalle: {
      color: c.textoMeta,
      fontSize: 15,
    },
    nota: {
      color: c.textoTenue,
      fontSize: 15,
      paddingVertical: 8,
    },
    aclaracion: {
      color: c.textoTenue,
      fontSize: 14,
      paddingTop: 12,
      paddingBottom: 4,
    },
  });
