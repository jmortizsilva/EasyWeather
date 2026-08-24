import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFenomenos } from '../../services/avisos';
import { useColores } from '../../theme/ThemeContext';
import { FenomenoAviso } from '../../types';
import Cabecera from './Cabecera';
import { crearEstilos } from './estilos';
import SwitchRow from './SwitchRow';

// De que fenomenos quiero que me llegue una notificacion.
//
// Los interruptores estan en positivo ("avisarme de esto") y no en negativo ("silenciar esto"):
// un conmutador que hay que APAGAR para que pase algo se lee al reves de como suena. Lo que se
// guarda por dentro si es la lista de los apagados, por la razon de siempre: lo que nadie toca
// sigue avisando, y un fenomeno nuevo de AEMET no nace callado.
export default function Fenomenos({
  silenciados,
  onCambiar,
  onCerrar,
}: {
  silenciados: string[];
  onCambiar: (silenciados: string[]) => void;
  onCerrar: () => void;
}) {
  const insets = useSafeAreaInsets();
  const colores = useColores();
  const styles = useMemo(() => crearEstilos(colores), [colores]);

  // undefined mientras se pide; null si no se ha podido y no habia copia guardada.
  const [catalogo, setCatalogo] = useState<FenomenoAviso[] | undefined | null>(undefined);

  useEffect(() => {
    let vivo = true;
    void getFenomenos().then((lista) => {
      if (vivo) {
        setCatalogo(lista ?? null);
      }
    });
    return () => {
      vivo = false;
    };
  }, []);

  const alternar = (codigo: string, avisar: boolean) => {
    onCambiar(
      avisar ? silenciados.filter((c) => c !== codigo) : [...new Set([...silenciados, codigo])],
    );
  };

  return (
    <View style={styles.capa} accessibilityViewIsModal onAccessibilityEscape={onCerrar}>
      <ScrollView
        style={styles.hoja}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        accessibilityLabel="Fenómenos de los que avisar">
        <Cabecera titulo="Qué fenómenos" destino="Avisos oficiales" onVolver={onCerrar} />

        <Text style={styles.note}>
          Desactiva los que no quieras que te suenen. Aunque desactives uno, si AEMET avisa de él
          seguirás viéndolo en la pantalla del lugar: esto solo decide cuándo suena el teléfono.
        </Text>

        {catalogo === undefined && <Text style={styles.aviso}>Cargando la lista…</Text>}

        {/* Nunca una lista vacia sin explicacion: si no se ha podido preguntar, se dice. */}
        {catalogo === null && (
          <Text style={styles.aviso}>
            No se ha podido cargar la lista de fenómenos. Comprueba tu conexión e inténtalo más
            tarde; mientras tanto seguirás recibiendo los avisos de todos ellos.
          </Text>
        )}

        {catalogo && catalogo.length > 0 && (
          <View style={styles.card}>
            {catalogo.map((fenomeno, index) => (
              <SwitchRow
                key={fenomeno.codigo}
                label={fenomeno.nombre}
                value={!silenciados.includes(fenomeno.codigo)}
                onValueChange={(avisar) => alternar(fenomeno.codigo, avisar)}
                divider={index < catalogo.length - 1}
                hint="Desactívalo para no recibir notificaciones de este fenómeno"
              />
            ))}
          </View>
        )}

        <Text style={styles.note}>
          La lista la da AEMET y crece con el tiempo: cuando avisa de un fenómeno nuevo, aparece
          aquí. Lo que no esté en la lista siempre te avisa.
        </Text>
      </ScrollView>
    </View>
  );
}
