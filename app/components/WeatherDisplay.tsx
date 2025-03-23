"use client";

import React, { useCallback, useMemo, memo } from 'react';

// Add weather condition mapping for better descriptions
const weatherConditions: { [key: string]: { color: string, description: string } } = {
  "Clear": { color: "text-yellow-500", description: "Clear skies" },
  "Clouds": { color: "text-gray-500", description: "Cloudy conditions" },
  "Rain": { color: "text-blue-500", description: "Rainfall expected" },
  "Snow": { color: "text-blue-200", description: "Snowfall expected" },
  "Thunderstorm": { color: "text-purple-500", description: "Thunderstorms" },
  "Drizzle": { color: "text-blue-400", description: "Light rain" },
  "Mist": { color: "text-gray-400", description: "Misty conditions" },
};

// Using free weather images from Unsplash
const weatherImages: { [key: string]: string } = {
  Clear: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1000",
  Clouds: "https://images.unsplash.com/photo-1611928482473-7b27d24eab80?q=80&w=1000",
  Rain: "https://images.unsplash.com/photo-1618557703025-7ec58c97e081?q=80&w=1000",
  Snow: "https://images.unsplash.com/photo-1516431883659-655d41c09bf9?q=80&w=1000",
  Thunderstorm: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1000",
  Drizzle: "https://images.unsplash.com/photo-1541919329513-35f7af297129?q=80&w=1000",
  Mist: "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=80&w=1000",
  default: "https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?q=80&w=1000"
};

// Using a weather-themed logo from a free icon service
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/4052/4052984.png";

// Memoized Main Weather Card Component
const MainWeatherCard = memo(({ 
  weatherData, 
  weatherInfo, 
  getWeatherIcon, 
  getBackgroundImage 
}: { 
  weatherData: any;
  weatherInfo: any;
  getWeatherIcon: (iconCode: string) => string;
  getBackgroundImage: (weatherType: string) => string;
}) => (
  <div 
    className="rounded-xl shadow-lg overflow-hidden relative min-h-[400px]"
    style={{
      backgroundImage: `url(${getBackgroundImage(weatherData.weather[0].main)})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
    <div className="relative p-6 text-white h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{weatherData.name}</h2>
          <p className="text-lg opacity-90">{weatherData.sys.country}</p>
          <p className="text-sm opacity-75">
            {new Date(weatherData.dt * 1000).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <img 
            src={getWeatherIcon(weatherData.weather[0].icon)}
            alt={weatherData.weather[0].description}
            className="w-24 h-24 inline-block drop-shadow-lg"
          />
        </div>
      </div>

      <div className="text-center py-6">
        <div className="text-7xl font-bold tracking-tighter text-shadow">
          {weatherInfo.temperature}°C
        </div>
        <p className="text-2xl mt-2 capitalize">
          {weatherData.weather[0].description}
        </p>
        <p className="text-lg mt-1 opacity-75">
          {weatherInfo.weatherStyle.description}
        </p>
      </div>

      <div className="flex justify-center space-x-6 text-lg bg-black/30 rounded-lg p-3 backdrop-blur-sm">
        <div>
          <span className="opacity-75">↓</span> {Math.round(weatherData.main.temp_min)}°C
        </div>
        <div className="border-l border-white/20 pl-6">
          <span className="opacity-75">↑</span> {Math.round(weatherData.main.temp_max)}°C
        </div>
      </div>
    </div>
  </div>
));

// Memoized Side Panel Component
const SidePanel = memo(({ weatherInfo, weatherData }: { weatherInfo: any; weatherData: any }) => (
  <div className="space-y-6">
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Comfort Levels</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Feels Like</p>
          <div className="flex items-center">
            <span className="text-2xl font-bold">{weatherInfo.feelsLike}°C</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Humidity</p>
          <div className="flex items-center">
            <span className="text-2xl font-bold">{weatherInfo.humidity}%</span>
            <div className="ml-2 flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${weatherInfo.humidity}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Wind Status</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Wind Speed</p>
          <p className="text-2xl font-bold">{weatherInfo.windSpeed} m/s</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Wind Direction</p>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">{weatherInfo.windDirection}</span>
            <svg 
              className="w-6 h-6 transform"
              style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M12 2L9 9h6zM12 2v7.5" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
        {weatherData.wind.gust && (
          <div>
            <p className="text-sm text-gray-500">Wind Gusts</p>
            <p className="text-2xl font-bold">{weatherData.wind.gust} m/s</p>
          </div>
        )}
      </div>
    </div>
  </div>
));

// Memoized Bottom Panel Component
const BottomPanel = memo(({ weatherInfo }: { weatherInfo: any }) => (
  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-2">Visibility</h3>
      <p className="text-3xl font-bold">{weatherInfo.visibility} km</p>
    </div>
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-2">Pressure</h3>
      <p className="text-3xl font-bold">{weatherInfo.pressure} hPa</p>
    </div>
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-2">Sunrise</h3>
      <p className="text-3xl font-bold">{weatherInfo.sunrise}</p>
    </div>
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-2">Sunset</h3>
      <p className="text-3xl font-bold">{weatherInfo.sunset}</p>
    </div>
  </div>
));

// Memoized Location Details Component
const LocationDetails = memo(({ weatherInfo }: { weatherInfo: any }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4">Location Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-gray-500">Coordinates</p>
        <p className="text-lg">Lat: {weatherInfo.coordinates.lat}°, Lon: {weatherInfo.coordinates.lon}°</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Timezone</p>
        <p className="text-lg">UTC {(weatherInfo.timezone / 3600) >= 0 ? '+' : ''}{weatherInfo.timezone / 3600}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Local Time</p>
        <p className="text-lg">{weatherInfo.localTime}</p>
      </div>
    </div>
  </div>
));

interface WeatherDisplayProps {
  weatherData: any;
}

const WeatherDisplay = memo(({ weatherData }: WeatherDisplayProps) => {
  
  // Memoize utility functions
  const getWeatherIcon = useCallback((iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }, []);

  const formatTime = useCallback((timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  }, []);

  const getWindDirection = useCallback((degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }, []);

  const getBackgroundImage = useCallback((weatherType: string) => {
    return weatherImages[weatherType] || weatherImages.default;
  }, []);

  // Memoize weather data calculations
  const weatherInfo = useMemo(() => {
    if (!weatherData) return null;

    const mainWeatherType = weatherData.weather[0].main;
    const weatherStyle = weatherConditions[mainWeatherType] || { color: "text-gray-600", description: "Current conditions" };

    return {
      mainWeatherType,
      weatherStyle,
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      windDirection: getWindDirection(weatherData.wind.deg),
      visibility: (weatherData.visibility / 1000).toFixed(1),
      pressure: weatherData.main.pressure,
      sunrise: formatTime(weatherData.sys.sunrise),
      sunset: formatTime(weatherData.sys.sunset),
      coordinates: {
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon
      },
      timezone: weatherData.timezone,
      localTime: new Date((weatherData.dt + weatherData.timezone) * 1000).toLocaleTimeString()
    };
  }, [weatherData, getWindDirection, formatTime]);

  if (!weatherInfo) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MainWeatherCard 
            weatherData={weatherData}
            weatherInfo={weatherInfo}
            getWeatherIcon={getWeatherIcon}
            getBackgroundImage={getBackgroundImage}
          />
        </div>

        <SidePanel weatherInfo={weatherInfo} weatherData={weatherData} />
      </div>

      <BottomPanel weatherInfo={weatherInfo} />
      <LocationDetails weatherInfo={weatherInfo} />
    </div>
  );
});

export default WeatherDisplay; 