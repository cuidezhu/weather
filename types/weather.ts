export interface DailyWeather {
  date: string;
  day: string;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  humidity: number;
  windSpeed: number;
  weather: {
    description: string;
    icon: string;
  };
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weather: {
    description: string;
    icon: string;
  };
  updateTime: string;
}

export interface WeatherData {
  city: string;
  now: CurrentWeather;
  daily: DailyWeather[];
}
