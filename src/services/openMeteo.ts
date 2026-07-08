import { DayForecast, Forecast, HourlyForecast, Place } from '../types';
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

      return {
        id: String(item?.id ?? `${lat},${lon}`),
        name,
        admin1: String(item?.admin1 ?? '').trim() || undefined,
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

export async function getHourlyForecast(lat: number, lon: number, dateISO: string): Promise<HourlyForecast[]> {
  const hourly = ['temperature_2m', 'weather_code', 'precipitation_probability', 'wind_speed_10m'].join(',');

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
