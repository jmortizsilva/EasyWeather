interface WeatherCodeInfo {
  label: string;
  emoji: string;
}

// Tabla estándar de códigos WMO usados por Open-Meteo (weather_code).
const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { label: 'Cielo despejado', emoji: '☀️' },
  1: { label: 'Mayormente despejado', emoji: '🌤️' },
  2: { label: 'Parcialmente nuboso', emoji: '⛅' },
  3: { label: 'Nuboso', emoji: '☁️' },
  45: { label: 'Niebla', emoji: '🌫️' },
  48: { label: 'Niebla con escarcha', emoji: '🌫️' },
  51: { label: 'Llovizna débil', emoji: '🌦️' },
  53: { label: 'Llovizna moderada', emoji: '🌦️' },
  55: { label: 'Llovizna intensa', emoji: '🌦️' },
  56: { label: 'Llovizna helada débil', emoji: '🌧️' },
  57: { label: 'Llovizna helada intensa', emoji: '🌧️' },
  61: { label: 'Lluvia débil', emoji: '🌧️' },
  63: { label: 'Lluvia moderada', emoji: '🌧️' },
  65: { label: 'Lluvia intensa', emoji: '🌧️' },
  66: { label: 'Lluvia helada débil', emoji: '🌧️' },
  67: { label: 'Lluvia helada intensa', emoji: '🌧️' },
  71: { label: 'Nevada débil', emoji: '🌨️' },
  73: { label: 'Nevada moderada', emoji: '🌨️' },
  75: { label: 'Nevada intensa', emoji: '❄️' },
  77: { label: 'Granos de nieve', emoji: '❄️' },
  80: { label: 'Chubascos débiles', emoji: '🌦️' },
  81: { label: 'Chubascos moderados', emoji: '🌦️' },
  82: { label: 'Chubascos violentos', emoji: '⛈️' },
  85: { label: 'Chubascos de nieve débiles', emoji: '🌨️' },
  86: { label: 'Chubascos de nieve intensos', emoji: '🌨️' },
  95: { label: 'Tormenta', emoji: '⛈️' },
  96: { label: 'Tormenta con granizo débil', emoji: '⛈️' },
  99: { label: 'Tormenta con granizo intenso', emoji: '⛈️' },
};

export function describeWeatherCode(code: number | undefined): WeatherCodeInfo {
  if (code === undefined || !(code in WEATHER_CODES)) {
    return { label: 'Sin datos de cielo', emoji: '❔' };
  }

  return WEATHER_CODES[code];
}
