// Deja en el App Group lo que el widget tiene que enseñar, cada vez que cambia algo de los lugares.
// No pinta nada. Los textos se deciden en datosWidget.ts; aquí solo se escriben y se avisa a iOS.

import { ExtensionStorage } from '@bacons/apple-targets';
import * as Application from 'expo-application';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { usePlaces } from '../state/PlacesContext';
import { eleccionAplicable } from '../utils/estaciones';
import { destinoDeWidget } from '../utils/servidorPropio';
import { sincronizarSeguimientoWidget } from '../utils/ubicacionFondo';
import { FuenteLugar, datosWidget } from './datosWidget';

/** Clave en el almacén compartido; el widget la lee con el mismo nombre (Datos.swift). */
const CLAVE = 'datosWidget';
/** Al cargar un lugar llegan previsión, medición y avisos casi a la vez: se escribe una vez. */
const ESPERA_MS = 1000;

export default function PublicadorWidget() {
  const {
    places,
    currentLocationPlace,
    forecastByPlace,
    observacionByPlace,
    avisosByPlace,
    estacionPorLugar,
  } = usePlaces();

  // El seguimiento que avisa al widget al moverte: al abrir y al volver a la app, por si el
  // permiso de ubicación ha cambiado mientras tanto.
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    void sincronizarSeguimientoWidget();
    const suscripcion = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') void sincronizarSeguimientoWidget();
    });
    return () => suscripcion.remove();
  }, []);

  useEffect(() => {
    // El grupo sale del identificador REAL de la app, no del de app.json: con Metro, la
    // configuración de Expo dice el de la app publicada aunque esto sea la de pruebas.
    const id = Application.applicationId;
    if (Platform.OS !== 'ios' || !id) return;

    const temporizador = setTimeout(() => {
      const lugares = currentLocationPlace ? [currentLocationPlace, ...places] : places;
      const fuentes: FuenteLugar[] = lugares.map((place) => ({
        place,
        forecast: forecastByPlace[place.id]?.forecast,
        updatedAt: forecastByPlace[place.id]?.updatedAt,
        observacion: observacionByPlace[place.id],
        avisos: avisosByPlace[place.id],
        estacion: eleccionAplicable(estacionPorLugar[place.id], place)
          ? estacionPorLugar[place.id]?.id
          : undefined,
      }));
      const datos = datosWidget(fuentes, destinoDeWidget());
      new ExtensionStorage(`group.${id}`).set(CLAVE, JSON.stringify(datos));
      ExtensionStorage.reloadWidget();
    }, ESPERA_MS);
    return () => clearTimeout(temporizador);
  }, [
    places,
    currentLocationPlace,
    forecastByPlace,
    observacionByPlace,
    avisosByPlace,
    estacionPorLugar,
  ]);

  return null;
}
