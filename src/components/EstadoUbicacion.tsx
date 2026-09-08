import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { AppState, Text, TextStyle, StyleProp } from 'react-native';
import { hayModuloDeUbicacion, seguimientoActivo } from '../../modules/ubicacion-significativa';
import { textoSeguimiento } from '../utils/estadoSeguimiento';

// Dice si los avisos van a saber donde estas. El texto lo decide `utils/estadoSeguimiento`, que es
// puro y se prueba; aqui solo esta la fontaneria de preguntarle al sistema.
//
// Se relee al volver a primer plano porque el permiso se cambia FUERA de la app, en Ajustes de iOS.
// Y porque iOS pregunta dias despues si quieres mantener el "Siempre": si contestas que no, esto es
// lo unico que lo delataria.

export default function EstadoUbicacion({
  algunAvisoActivo,
  style,
}: {
  algunAvisoActivo: boolean;
  style?: StyleProp<TextStyle>;
}) {
  const [texto, setTexto] = useState<string | undefined>(undefined);

  useEffect(() => {
    let vivo = true;

    const mirar = async () => {
      let permisoSiempre = false;
      try {
        permisoSiempre = (await Location.getBackgroundPermissionsAsync()).status === 'granted';
      } catch {
        // Sin poder consultarlo se asume que no: es el caso que hay que contar.
      }
      const activo = await seguimientoActivo();
      if (vivo) {
        setTexto(
          textoSeguimiento({
            hayModulo: hayModuloDeUbicacion,
            permisoSiempre,
            activo,
            algunAvisoActivo,
          }),
        );
      }
    };

    void mirar();
    const sub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') {
        void mirar();
      }
    });
    return () => {
      vivo = false;
      sub.remove();
    };
  }, [algunAvisoActivo]);

  if (!texto) {
    return null;
  }
  return <Text style={style}>{texto}</Text>;
}
