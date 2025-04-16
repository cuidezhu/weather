"use client";

import { useState } from "react";

interface CitySearchProps {
  onCityChange: (city: string) => void;
  defaultCity: string;
}

export default function CitySearch({
  onCityChange,
  defaultCity,
}: CitySearchProps) {
  const [inputValue, setInputValue] = useState(defaultCity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onCityChange(inputValue.trim());
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入城市名称"
          className="flex-grow p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          查询天气
        </button>
      </form>
      <p className="text-gray-600 mt-2 text-sm">当前城市: {defaultCity}</p>
    </div>
  );
}
