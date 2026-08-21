import { CurrentObservation, Forecast } from '../types';
import { describirObservacion } from './observacionTexto';
import { numeroEs } from './text';
import { describeWeatherCode } from './weatherCodes';

// Texto que sale de la app al compartir. Puro y probado con Jest: es lo único que se puede
// comprobar aquí sin dispositivo, porque la hoja de compartir de iOS es del sistema.
//
// Dos cosas que este texto NO puede perder al salir de la app:
//   - La distinción entre PREVISTO y MEDIDO. Fuera de la pantalla ya no hay rótulos ni tarjetas que
//     lo expliquen: si el texto no lo dice, quien lo reciba no tiene forma de saberlo.
//   - La atribución. Compartir es redistribuir, y la licencia de Open-Meteo (CC BY 4.0) la exige
//     también fuera de la app; AEMET pide que se la cite como autora de lo que mide.

/** El cielo va en medio de una frase, y ahí "Cielo despejado" con mayúscula chirría. */
function enMinuscula(texto: string): string {
  return texto.charAt(0).toLowerCase() + texto.slice(1);
}

export interface DatosParaCompartir {
  nombre: string;
  forecast: Forecast | undefined;
  observacion: CurrentObservation | undefined;
}

/**
 * Devuelve el texto a compartir, o cadena vacía si no hay previsión que contar (y entonces no se
 * ofrece el botón).
 */
export function textoParaCompartir({ nombre, forecast, observacion }: DatosParaCompartir): string {
  if (!forecast) {
    return '';
  }

  const lineas: string[] = [`El tiempo en ${nombre}`, ''];

  const cielo = describeWeatherCode(forecast.current?.weatherCode);
  const temperatura = forecast.current?.temperature;
  if (temperatura !== undefined) {
    const sensacion =
      forecast.current?.apparent !== undefined
        ? ` Sensación térmica: ${numeroEs(forecast.current.apparent)}º.`
        : '';
    lineas.push(
      `Previsto para esta hora: ${numeroEs(temperatura)}º, ${enMinuscula(cielo.label)}.${sensacion}`,
    );
  }

  // La medición reutiliza el mismo texto que se ve en pantalla, con su hora y su estación: sin esos
  // dos datos deja de ser una medición y pasa a ser un número suelto (ver observacionTexto).
  const medicion = describirObservacion(observacion);
  if (medicion) {
    lineas.push(`${medicion.principal} · ${medicion.estacion}`);
  }

  const hoy = forecast.days[0];
  if (hoy && (hoy.tMin !== undefined || hoy.tMax !== undefined)) {
    const lluvia =
      hoy.rainProbability !== undefined ? `, probabilidad de lluvia ${hoy.rainProbability}%` : '';
    lineas.push(`Hoy: mínima ${hoy.tMin ?? '-'}º, máxima ${hoy.tMax ?? '-'}º${lluvia}.`);
  }

  lineas.push('');
  lineas.push(
    medicion
      ? 'Previsión de Open-Meteo.com. Observación de AEMET.'
      : 'Previsión de Open-Meteo.com.',
  );

  return lineas.join('\n');
}
