"use client";

import { WeatherData } from "@/types/weather";
import WeatherCard from "./WeatherCard";

interface WeatherDisplayProps {
  weatherData: WeatherData;
  city: string;
}

export default function WeatherDisplay({
  weatherData,
  city,
}: WeatherDisplayProps) {
  if (!weatherData || !weatherData.daily || weatherData.daily.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">暂无天气数据</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {city} - 未来七天天气
        </h2>
        <p className="text-gray-600">
          {new Date().toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          数据更新
        </p>
      </div>

      {/* 显示实时天气 */}
      {weatherData.now && (
        <div className="bg-white rounded-lg shadow-lg p-5 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.now.weather.icon}@2x.png`}
                alt={weatherData.now.weather.description}
                className="w-20 h-20"
              />
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-800">当前天气</h3>
                <p className="text-gray-600">
                  {weatherData.now.weather.description}
                </p>
                <p className="text-xs text-gray-500">
                  更新时间:{" "}
                  {new Date(weatherData.now.updateTime).toLocaleTimeString(
                    "zh-CN"
                  )}
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-5xl font-bold text-gray-800">
                {Math.round(weatherData.now.temp)}°C
              </p>
              <p className="text-gray-600">
                体感温度: {Math.round(weatherData.now.feelsLike)}°C
              </p>
              <div className="flex justify-center md:justify-end space-x-4 mt-2">
                <p className="text-sm text-gray-600">
                  湿度: {weatherData.now.humidity}%
                </p>
                <p className="text-sm text-gray-600">
                  风速: {weatherData.now.windSpeed} m/s
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {weatherData.daily.map((day, index) => (
          <WeatherCard key={index} day={day} isToday={index === 0} />
        ))}
      </div>
    </div>
  );
}
