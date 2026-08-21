import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { NivelDeAviso, Paleta } from '../theme/colores';
import { useColores } from '../theme/ThemeContext';
import { AvisosLugar } from '../types';

// El anuncio de que hay avisos OFICIALES, arriba del todo de la pantalla de un lugar.
//
// Va arriba y es lo primero que se lee a propósito: un aviso rojo por lluvias no puede estar por
// debajo de la temperatura, ni a tres deslizamientos de VoiceOver. Pero solo resume: el detalle
// entero está a un toque, porque con cinco avisos habría que oírlos todos antes de llegar al
// tiempo, que es a lo que se entra normalmente.
//
// Si no hay avisos NO se pinta nada. Nada de "no hay avisos activos": sería una parada más de
// VoiceOver en todas las pantallas y todos los días para decir que no pasa nada. Y tampoco sería
// del todo cierto: que aquí no haya nada puede significar que el servidor no ha contestado.

interface Props {
  avisos: AvisosLugar | undefined;
  onAbrir: () => void;
}

export default function AnuncioAvisos({ avisos, onAbrir }: Props) {
  const colores = useColores();
  const resumen = avisos?.resumen ?? undefined;
  const styles = useMemo(
    () => crearEstilos(colores, resumen?.nivel ?? 'amarillo'),
    [colores, resumen?.nivel],
  );

  if (!resumen) {
    return null;
  }

  return (
    <Pressable
      style={styles.anuncio}
      onPress={onAbrir}
      accessibilityRole="button"
      // El nivel va escrito en el título ("Aviso naranja por..."), así que quien no vea el color
      // sabe igual de qué se trata. El color no informa de nada que no esté también en el texto.
      accessibilityLabel={resumen.spoken}
      accessibilityHint="Abre el detalle de los avisos oficiales de AEMET">
      <Text style={styles.titulo}>⚠ {resumen.titulo}</Text>
      <Text style={styles.detalle}>{resumen.detalle}</Text>
      <Text style={styles.fuente}>Aviso oficial de AEMET · toca para ver el detalle</Text>
    </Pressable>
  );
}

const crearEstilos = (c: Paleta, nivel: NivelDeAviso) => {
  const color = c.aviso[nivel];
  return StyleSheet.create({
    anuncio: {
      backgroundColor: color.fondo,
      borderColor: color.borde,
      // Borde grueso para que el bloque se distinga del resto sin depender solo del relleno.
      borderWidth: 2,
      borderRadius: 14,
      padding: 14,
      gap: 4,
      // Altura mínima de zona táctil de iOS.
      minHeight: 44,
    },
    titulo: {
      color: color.texto,
      fontSize: 18,
      fontWeight: '700',
    },
    detalle: {
      color: color.texto,
      fontSize: 15,
    },
    fuente: {
      color: color.texto,
      fontSize: 13,
      opacity: 0.85,
    },
  });
};
