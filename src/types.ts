export interface Place {
  id: string;
  name: string;
  admin1?: string;
  lat: number;
  lon: number;
}

export interface DayForecast {
  date: string;
  tMin?: number;
  tMax?: number;
  weatherCode?: number;
  rainProbability?: number;
  windMax?: number;
  windGusts?: number;
  windDirection?: number;
  apparentMin?: number;
  apparentMax?: number;
  humidity?: number;
  uvMax?: number;
  precipitationSum?: number;
  sunrise?: string;
  sunset?: string;
}

export interface CurrentConditions {
  temperature?: number;
  weatherCode?: number;
}

export interface Forecast {
  current?: CurrentConditions;
  days: DayForecast[];
}

export interface HourlyForecast {
  time: string;
  temperature?: number;
  weatherCode?: number;
  rainProbability?: number;
  windSpeed?: number;
}
