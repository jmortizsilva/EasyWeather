import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { useCallback, useEffect, useRef } from 'react';
import { AccessibilityInfo, Alert, AppState } from 'react-native';
import { NOVEDADES } from '../novedades';
import { decidirAvisoNovedades, INCRUSTADO } from './actualizaciones-logica';

const STORAGE_ULTIMO_UPDATE = 'tiempo.updates.lastId';

async function instalarActualizacion(): Promise<void> {
  try {
    // Anuncio inmediato: durante la descarga no hay Alert, solo esto para VoiceOver.
    AccessibilityInfo.announceForAccessibility('Descargando la actualizacion.');
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  } catch {
    AccessibilityInfo.announceForAccessibility('No se ha podido instalar la actualizacion.');
    Alert.alert(
      'Actualizacion',
      'No se ha podido instalar la actualizacion. Se reintentara mas tarde.',
    );
  }
}

// Comprueba al abrir y al volver a primer plano si hay version nueva, y ofrece instalarla.
// Muestra las novedades una vez, tras aplicar un update. Sin boton manual: todo automatico.
export function useActualizaciones(): void {
  const comprobando = useRef(false);

  // Novedades: al arrancar, comparar el id del update en marcha con el ultimo visto.
  useEffect(() => {
    void (async () => {
      const idActual = Updates.updateId ?? INCRUSTADO;
      const idGuardado = await AsyncStorage.getItem(STORAGE_ULTIMO_UPDATE);
      const { avisar, idParaGuardar } = decidirAvisoNovedades(idGuardado, idActual);
      if (idParaGuardar !== idGuardado) {
        await AsyncStorage.setItem(STORAGE_ULTIMO_UPDATE, idParaGuardar);
      }
      // Lista vacia = el update no traia novedades que contar (o se acaba de estrenar una build
      // y aun no se ha publicado nada encima): mejor callarse que abrir un Alert en blanco.
      if (avisar && NOVEDADES.length > 0) {
        // El Alert lo lee VoiceOver solo al recibir el foco; no hace falta anuncio aparte.
        Alert.alert('Novedades', NOVEDADES.map((n) => `• ${n}`).join('\n'));
      }
    })();
  }, []);

  const comprobar = useCallback(async () => {
    // En desarrollo Updates.isEnabled es false: no se comprueba nada. Deduplicado con un flag
    // para que abrir y volver a primer plano casi a la vez no lancen dos comprobaciones.
    if (!Updates.isEnabled || comprobando.current) {
      return;
    }
    comprobando.current = true;
    try {
      const resultado = await Updates.checkForUpdateAsync();
      if (resultado.isAvailable) {
        Alert.alert(
          'Nueva version disponible',
          'La app se reiniciara para instalarla. Se instalara igualmente en el proximo arranque.',
          [
            { text: 'Ahora no', style: 'cancel' },
            { text: 'Instalar', onPress: () => void instalarActualizacion() },
          ],
        );
      }
    } catch {
      // Sin red o en un contexto donde checkForUpdateAsync no aplica: se ignora en silencio.
    } finally {
      comprobando.current = false;
    }
  }, []);

  useEffect(() => {
    void comprobar();
    const sub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') {
        void comprobar();
      }
    });
    return () => sub.remove();
  }, [comprobar]);
}
