"use client";

import { useState, useEffect } from "react";
import WeatherDisplay from "@/components/WeatherDisplay";
import CitySearch from "@/components/CitySearch";
import { WeatherData } from "@/types/weather";
import axios from "axios";

export default function Home() {
  const [city, setCity] = useState<string>("上海");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/weather?city=${encodeURIComponent(cityName)}`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError("获取天气数据失败，请稍后重试");
      console.error("天气数据获取错误:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-8">
          未来七天天气预报
        </h1>
        <CitySearch onCityChange={handleCityChange} defaultCity={city} />

        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
            {error}
          </div>
        )}

        {weatherData && !loading && (
          <WeatherDisplay weatherData={weatherData} city={city} />
        )}
      </div>
    </main>
  );
}
