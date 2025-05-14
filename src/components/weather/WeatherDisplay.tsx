"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
  city: {
    name: string;
    country: string;
  };
}

interface WeatherDisplayProps {
  lat?: number;
  lon?: number;
  location?: string;
}

export default function WeatherDisplay({
  lat = 28.6139,
  lon = 77.2090,
  location = "Delhi, India",
}: WeatherDisplayProps) {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use our API route to fetch weather data
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
          fetch(`/api/weather?lat=${lat}&lon=${lon}&type=current`),
          fetch(`/api/weather?lat=${lat}&lon=${lon}&type=forecast`)
        ]);

        if (!currentWeatherResponse.ok || !forecastResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        setCurrentWeather(currentWeatherData);
        setForecast(forecastData);
        setLoading(false);
      } catch (err: any) {
        console.error('Weather fetch error:', err);
        setError(err.message || "Failed to fetch weather data");
        setLoading(false);
      }
    };
    
    fetchWeatherData();
  }, [lat, lon, location]);
  
  // Weather icon mapping
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      "01d": "☀️", // clear sky day
      "01n": "🌙", // clear sky night
      "02d": "⛅", // few clouds day
      "02n": "⛅", // few clouds night
      "03d": "☁️", // scattered clouds
      "03n": "☁️",
      "04d": "☁️", // broken clouds
      "04n": "☁️",
      "09d": "🌧️", // shower rain
      "09n": "🌧️",
      "10d": "🌦️", // rain day
      "10n": "🌧️", // rain night
      "11d": "⛈️", // thunderstorm
      "11n": "⛈️",
      "13d": "❄️", // snow
      "13n": "❄️",
      "50d": "🌫️", // mist
      "50n": "🌫️",
    };
    
    return iconMap[iconCode] || "🌡️";
  };
  
  // Format date for forecast
  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };
  
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-glow"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/30 p-4 rounded-md border border-red-500/30">
        <p className="text-red-400">Error: {error}</p>
        <p className="text-sm text-gray-400 mt-2">
          Please try again later or check your connection.
        </p>
      </div>
    );
  }
  
  if (!currentWeather || !forecast) {
    return (
      <div className="bg-yellow-900/30 p-4 rounded-md border border-yellow-500/30">
        <p className="text-yellow-400">No weather data available</p>
      </div>
    );
  }
  
  // Process forecast data to get daily forecast
  const dailyForecast = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);
  
  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <div className="bg-dark-800 backdrop-blur-sm rounded-lg shadow-neuro overflow-hidden border border-gray-700/50">
        <div className="bg-gradient-to-r from-cyan-glow to-magenta-glow text-white p-4">
          <h2 className="text-xl font-semibold">Current Weather</h2>
          <p>{currentWeather.name}, {currentWeather.sys.country}</p>
        </div>
        
        <div className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-5xl mr-4">
                {getWeatherIcon(currentWeather.weather[0].icon)}
              </span>
              <div>
                <p className="text-4xl font-bold">{Math.round(currentWeather.main.temp)}°C</p>
                <p className="text-gray-300">{currentWeather.weather[0].description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-300">Feels like: {Math.round(currentWeather.main.feels_like)}°C</p>
              <p className="text-gray-300">Humidity: {currentWeather.main.humidity}%</p>
              <p className="text-gray-300">Wind: {currentWeather.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Forecast */}
      <div className="bg-dark-800 backdrop-blur-sm rounded-lg shadow-neuro overflow-hidden border border-gray-700/50">
        <div className="bg-gradient-to-r from-cyan-glow to-magenta-glow text-white p-4">
          <h2 className="text-xl font-semibold">5-Day Forecast</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {dailyForecast.map((day) => (
              <div
                key={day.dt}
                className="flex flex-col items-center bg-dark-900/50 p-4 rounded-lg border border-gray-700/50"
              >
                <p className="font-medium text-white mb-2">{formatDay(day.dt_txt)}</p>
                <span className="text-3xl mb-2">
                  {getWeatherIcon(day.weather[0].icon)}
                </span>
                <p className="text-lg font-semibold text-white">{Math.round(day.main.temp)}°C</p>
                <p className="text-sm text-gray-400">{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Additional Weather Info */}
      <div className="bg-dark-800 backdrop-blur-sm rounded-lg shadow-neuro overflow-hidden border border-gray-700/50">
        <div className="bg-gradient-to-r from-cyan-glow to-magenta-glow text-white p-4">
          <h2 className="text-xl font-semibold">Weather Details</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center bg-dark-900/50 p-4 rounded-lg border border-gray-700/50">
              <p className="text-sm text-gray-400 mb-1">Humidity</p>
              <p className="text-2xl font-bold text-white">{currentWeather.main.humidity}%</p>
            </div>
            
            <div className="flex flex-col items-center bg-dark-900/50 p-4 rounded-lg border border-gray-700/50">
              <p className="text-sm text-gray-400 mb-1">Pressure</p>
              <p className="text-2xl font-bold text-white">{currentWeather.main.pressure} hPa</p>
            </div>
            
            <div className="flex flex-col items-center bg-dark-900/50 p-4 rounded-lg border border-gray-700/50">
              <p className="text-sm text-gray-400 mb-1">Wind Speed</p>
              <p className="text-2xl font-bold text-white">{currentWeather.wind.speed} m/s</p>
            </div>
            
            <div className="flex flex-col items-center bg-dark-900/50 p-4 rounded-lg border border-gray-700/50">
              <p className="text-sm text-gray-400 mb-1">Wind Direction</p>
              <p className="text-2xl font-bold text-white">{currentWeather.wind.deg}°</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 