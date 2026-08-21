import { HourlyForecast } from '../types';
import { formatTime } from './dayDetails';
import { describeWindDirection } from './meteo';
import { describeWeatherCode } from './weatherCodes';

// Textos de una fila de la previsión por horas. Vive aparte del componente y sin un solo import de
// React Native: así se prueba con Jest, que es la única forma de comprobar aquí lo que lee VoiceOver
// sin tener el iPhone delante.

export interface FilaHora {
  hora: string;
  emoji: string;
  /** Con el símbolo º, que es lo que se ve; lo hablado va en `spoken`. */
  temperatura: string;
  lluvia: string;
  viento: string;
  /** Rumbo en palabras ("del noroeste"), en su propia línea. Vacío si no hay dato. */
  direccion: string;
  /** La fila entera de una tirada, con "grados" y "kilómetros por hora" escritos con todas sus
   *  letras: el símbolo º se lee como ordinal y "km/h" no siempre se expande. */
  spoken: string;
}

export function filaHora(item: HourlyForecast): FilaHora {
  const cielo = describeWeatherCode(item.weatherCode);
  const hora = formatTime(item.time) ?? item.time;
  const rumbo = describeWindDirection(item.windDirection);

  // La dirección solo se dice si además hay velocidad: un rumbo suelto, sin saber si sopla o no,
  // no informa de nada. Open-Meteo devuelve un rumbo aunque el viento sea de 0 km/h.
  const hayViento = item.windSpeed !== undefined;
  const direccion = hayViento && rumbo ? `del ${rumbo}` : '';

  const vientoHablado = hayViento
    ? `viento ${item.windSpeed} kilómetros por hora${direccion ? ` ${direccion}` : ''}`
    : 'viento sin dato';

  return {
    hora,
    emoji: cielo.emoji,
    temperatura: `${item.temperature ?? '-'}º`,
    lluvia: `Lluvia ${item.rainProbability ?? '-'}%`,
    viento: `Viento ${item.windSpeed ?? '-'} km/h`,
    direccion,
    spoken:
      `${hora}: ${item.temperature ?? 'sin dato'} grados, ${cielo.label}, ` +
      `probabilidad de lluvia ${item.rainProbability ?? 0} por ciento, ${vientoHablado}`,
  };
}
