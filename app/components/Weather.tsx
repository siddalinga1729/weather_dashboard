"use client";

import React, { createContext, useContext, useCallback, useReducer, useEffect, memo } from 'react';
import WeatherDisplay from './WeatherDisplay';

// Add popular cities
const popularCities = [
  "London",
  "New York",
  "Tokyo",
  "Paris",
  "Sydney",
  "Dubai",
  "Singapore",
  "Mumbai",
  "Toronto",
  "Berlin"
];

// Create Weather Context
const WeatherContext = createContext<{
  state: WeatherState;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCitySelect: (city: string) => void;
} | null>(null);

// Custom hook to use Weather Context
const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

// Memoized Header Component
const Header = memo(({ date }: { date: string }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-2">
      <img 
        src="https://cdn-icons-png.flaticon.com/512/4052/4052984.png"
        alt="Weather Dashboard" 
        className="h-8 w-8 object-contain"
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Weather Dashboard</h1>
        <p className="text-sm text-gray-500">Real-time Weather Updates</p>
      </div>
    </div>
    <div className="text-sm text-gray-500">
      {date}
    </div>
  </div>
));

// Memoized Search Component
const SearchBar = memo(({ 
  searchQuery, 
  suggestions, 
  onSearchChange, 
  onCitySelect 
}: { 
  searchQuery: string;
  suggestions: string[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCitySelect: (city: string) => void;
}) => (
  <div className="relative mb-4">
    <input
      type="text"
      placeholder="Search for a city..."
      value={searchQuery}
      onChange={onSearchChange}
      className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
    />
    {suggestions.length > 0 && searchQuery && (
      <div className="absolute z-10 w-full bg-white mt-1 rounded-lg shadow-lg border">
        {suggestions.map((city) => (
          <button
            key={city}
            onClick={() => onCitySelect(city)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 outline-none"
          >
            {city}
          </button>
        ))}
      </div>
    )}
  </div>
));

// Memoized City Navigation Component
const CityNavigation = memo(({ 
  popularCities, 
  selectedCity, 
  onCitySelect 
}: { 
  popularCities: string[];
  selectedCity: string;
  onCitySelect: (city: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {popularCities.map((city) => (
      <button
        key={city}
        onClick={() => onCitySelect(city)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
          ${selectedCity === city 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
      >
        {city}
      </button>
    ))}
  </div>
));

// Memoize the city selection UI
const CitySelectionUI = memo(({ 
  searchQuery, 
  suggestions, 
  selectedCity, 
  onSearchChange, 
  onCitySelect 
}: { 
  searchQuery: string;
  suggestions: string[];
  selectedCity: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCitySelect: (city: string) => void;
}) => (
  <div className="mb-6">
    <SearchBar 
      searchQuery={searchQuery}
      suggestions={suggestions}
      onSearchChange={onSearchChange}
      onCitySelect={onCitySelect}
    />
    <CityNavigation 
      popularCities={popularCities}
      selectedCity={selectedCity}
      onCitySelect={onCitySelect}
    />
  </div>
));

// Memoized City Selection Component
const CitySelection = memo(() => {
  console.log('CitySelection rendered');
  const { state, handleSearchChange, handleCitySelect } = useWeather();
  
  return (
    <CitySelectionUI 
      searchQuery={state.searchQuery}
      suggestions={state.suggestions}
      selectedCity={state.selectedCity}
      onSearchChange={handleSearchChange}
      onCitySelect={handleCitySelect}
    />
  );
});

// Memoized Skeleton Component
const WeatherSkeleton = memo(() => (
  <div className="max-w-6xl mx-auto p-4 space-y-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        <div>
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
    </div>

    <div className="mb-6">
      <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse mb-4"></div>
      <div className="flex flex-wrap gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="h-[400px] bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
      <div className="space-y-6">
        <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
      ))}
    </div>

    <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
  </div>
));

// Memoized Weather Content Component
const WeatherContent = memo(() => {
  console.log('WeatherContent rendered');
  const { state } = useWeather();

  if (state.loading) {
    return <WeatherSkeleton />;
  }

  if (state.error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {state.error.message}</span>
      </div>
    );
  }

  return state.weatherData ? <WeatherDisplay weatherData={state.weatherData} /> : null;
});

// Weather State Types
type WeatherState = {
  weatherData: any | null;
  loading: boolean;
  error: Error | null;
  selectedCity: string;
  searchQuery: string;
  suggestions: string[];
};

type WeatherAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_WEATHER_DATA'; payload: any }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_SELECTED_CITY'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CITY_AND_FETCH'; payload: string };

// Optimize the reducer to batch state updates
const weatherReducer = (state: WeatherState, action: WeatherAction): WeatherState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_WEATHER_DATA':
      return { 
        ...state, 
        weatherData: action.payload,
        loading: false,
        error: null
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SELECTED_CITY':
      return { ...state, selectedCity: action.payload };
    case 'SET_CITY_AND_FETCH':
      return { 
        ...state, 
        selectedCity: action.payload,
        loading: true,
        searchQuery: "",
        suggestions: []
      };
    case 'SET_SEARCH_QUERY':
      const query = action.payload;
      const filtered = popularCities.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
      );
      return { 
        ...state, 
        searchQuery: query,
        suggestions: filtered
      };
    default:
      return state;
  }
};

// Main Weather Component
const Weather = () => {
  console.log('Weather component rendered');
  const [state, dispatch] = useReducer(weatherReducer, {
    weatherData: null,
    loading: true,
    error: null,
    selectedCity: "London",
    searchQuery: "",
    suggestions: []
  });

  const fetchWeather = useCallback(async (city: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      dispatch({ type: 'SET_WEATHER_DATA', payload: data });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error : new Error('Unknown error') 
      });
    }
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  }, []);

  const handleCitySelect = useCallback((city: string) => {
    dispatch({ type: 'SET_CITY_AND_FETCH', payload: city });
  }, []);

  useEffect(() => {
    if (state.selectedCity) {
      fetchWeather(state.selectedCity);
    }
  }, [state.selectedCity, fetchWeather]);

  return (
    <WeatherContext.Provider value={{ state, handleSearchChange, handleCitySelect }}>
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <Header date={new Date().toLocaleDateString()} />
        <CitySelection />
        <WeatherContent />
      </div>
    </WeatherContext.Provider>
  );
};

export default Weather;