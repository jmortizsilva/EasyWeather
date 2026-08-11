import { DayForecast, Forecast, HourlyForecast, Place } from '../types';
import { computeMoonInfo } from '../utils/moon';
import { toNumber } from '../utils/text';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const NETWORK_TIMEOUT_MS = 20_000;

async function fetchWithTimeout(url: string, timeoutMs = NETWORK_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') {
      throw new Error(`Tiempo de espera agotado (${timeoutMs}ms)`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=es`;
  const payload = await fetchJson<{ results?: any[] }>(url);

  return (payload.results ?? [])
    .map((item): Place | undefined => {
      const lat = toNumber(item?.latitude);
      const lon = toNumber(item?.longitude);
      const name = String(item?.name ?? '').trim();
      if (lat === undefined || lon === undefined || !name) {
        return undefined;
      }

      const texto = (valor: unknown) => String(valor ?? '').trim() || undefined;
      return {
        id: String(item?.id ?? `${lat},${lon}`),
        name,
        admin1: texto(item?.admin1),
        // Niveles mas finos y pais: no se muestran siempre, solo cuando hacen falta para
        // distinguir dos resultados que se llamarian igual (ver utils/resultadosBusqueda).
        admin2: texto(item?.admin2),
        admin3: texto(item?.admin3),
        country: texto(item?.country),
        countryCode: texto(item?.country_code),
        lat,
        lon,
      };
    })
    .filter((item): item is Place => Boolean(item));
}

export async function getForecast(lat: number, lon: number): Promise<Forecast> {
  const daily = [
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'weather_code',
    'precipitation_probability_max',
    'precipitation_sum',
    'relative_humidity_2m_mean',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant',
    'uv_index_max',
    'sunrise',
    'sunset',
  ].join(',');
  const current = ['temperature_2m', 'weather_code'].join(',');

  const url =
    `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
    `&daily=${daily}&current=${current}&timezone=auto&forecast_days=7`;

  const payload = await fetchJson<any>(url);

  // Desfase horario DEL LUGAR (timezone=auto). Se pasa al cálculo de la luna para que sus horas
  // salgan en la hora local del sitio, iguales en el teléfono y en el servidor.
  const utcOffsetSeconds = toNumber(payload?.utc_offset_seconds) ?? 0;

  const dates: string[] = Array.isArray(payload?.daily?.time) ? payload.daily.time : [];
  const days: DayForecast[] = dates.map((date, index) => ({
    date,
    tMax: toNumber(payload?.daily?.temperature_2m_max?.[index]),
    tMin: toNumber(payload?.daily?.temperature_2m_min?.[index]),
    apparentMax: toNumber(payload?.daily?.apparent_temperature_max?.[index]),
    apparentMin: toNumber(payload?.daily?.apparent_temperature_min?.[index]),
    weatherCode: toNumber(payload?.daily?.weather_code?.[index]),
    rainProbability: toNumber(payload?.daily?.precipitation_probability_max?.[index]),
    precipitationSum: toNumber(payload?.daily?.precipitation_sum?.[index]),
    humidity: toNumber(payload?.daily?.relative_humidity_2m_mean?.[index]),
    windMax: toNumber(payload?.daily?.wind_speed_10m_max?.[index]),
    windGusts: toNumber(payload?.daily?.wind_gusts_10m_max?.[index]),
    windDirection: toNumber(payload?.daily?.wind_direction_10m_dominant?.[index]),
    uvMax: toNumber(payload?.daily?.uv_index_max?.[index]),
    sunrise: payload?.daily?.sunrise?.[index],
    sunset: payload?.daily?.sunset?.[index],
    ...computeMoonInfo(date, lat, lon, utcOffsetSeconds),
  }));

  if (days.length === 0) {
    throw new Error('Open-Meteo no devolvió días de previsión');
  }

  return {
    current: {
      temperature: toNumber(payload?.current?.temperature_2m),
      weatherCode: toNumber(payload?.current?.weather_code),
    },
    days,
  };
}

/** Temperatura actual de un lugar concreto, para la lista y el selector de lugares. */
export interface CurrentByPlace {
  temperature?: number;
  weatherCode?: number;
}

/**
 * Temperatura actual de VARIOS lugares en UNA sola petición. Open-Meteo admite coordenadas
 * separadas por coma y devuelve un array (o un objeto suelto si solo va una), así que N lugares
 * cuestan una llamada, no N: importa para no rozar el límite de la API (ver notas del proyecto).
 * El resultado se indexa por el id del lugar en el mismo orden en que se enviaron las coordenadas.
 */
export async function getCurrentByPlaces(
  places: { id: string; lat: number; lon: number }[],
): Promise<Record<string, CurrentByPlace>> {
  if (places.length === 0) {
    return {};
  }

  const lat = places.map((p) => p.lat).join(',');
  const lon = places.map((p) => p.lon).join(',');
  const current = ['temperature_2m', 'weather_code'].join(',');
  const url =
    `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` + `&current=${current}&timezone=auto`;

  const payload = await fetchJson<any>(url);
  // Con una sola coordenada Open-Meteo devuelve un objeto; con varias, un array. Normalizamos.
  const list: any[] = Array.isArray(payload) ? payload : [payload];

  const result: Record<string, CurrentByPlace> = {};
  places.forEach((place, index) => {
    const item = list[index];
    result[place.id] = {
      temperature: toNumber(item?.current?.temperature_2m),
      weatherCode: toNumber(item?.current?.weather_code),
    };
  });
  return result;
}

export async function getHourlyForecast(
  lat: number,
  lon: number,
  dateISO: string,
): Promise<HourlyForecast[]> {
  const hourly = [
    'temperature_2m',
    'weather_code',
    'precipitation_probability',
    'wind_speed_10m',
  ].join(',');

  const url =
    `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
    `&hourly=${hourly}&timezone=auto&start_date=${dateISO}&end_date=${dateISO}`;

  const payload = await fetchJson<any>(url);

  const times: string[] = Array.isArray(payload?.hourly?.time) ? payload.hourly.time : [];
  return times.map((time, index) => ({
    time,
    temperature: toNumber(payload?.hourly?.temperature_2m?.[index]),
    weatherCode: toNumber(payload?.hourly?.weather_code?.[index]),
    rainProbability: toNumber(payload?.hourly?.precipitation_probability?.[index]),
    windSpeed: toNumber(payload?.hourly?.wind_speed_10m?.[index]),
  }));
}
