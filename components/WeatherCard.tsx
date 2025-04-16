"use client";

import { DailyWeather } from "@/types/weather";

interface WeatherCardProps {
  day: DailyWeather;
  isToday: boolean;
}

export default function WeatherCard({ day, isToday }: WeatherCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        isToday ? "border-2 border-blue-500" : ""
      }`}
    >
      <div
        className={`p-4 ${
          isToday ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"
        }`}
      >
        <h3 className="font-bold text-lg">{day.day}</h3>
        <p className="text-sm">{day.date}</p>
        {isToday && (
          <span className="inline-block bg-yellow-400 text-xs text-blue-900 px-2 py-1 rounded-full mt-1">
            今天
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <img
              src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
              alt={day.weather.description}
              className="w-16 h-16 mx-auto"
            />
            <p className="text-gray-700">{day.weather.description}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-800">
              {Math.round(day.temp.day)}°C
            </p>
            <p className="text-sm text-gray-600">
              {Math.round(day.temp.min)}° / {Math.round(day.temp.max)}°
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>湿度:</span>
            <span className="font-medium">{day.humidity}%</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>风速:</span>
            <span className="font-medium">{day.windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
