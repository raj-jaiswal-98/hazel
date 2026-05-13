import { useEffect, useRef } from 'react';
import { OmniboxContainer } from './components/Omnibox';
import { HeroSection } from './components/Hero';
import { AtmosphericBackground, CanvasLayer } from './components/Background';
import { BuddyComponent } from './components/Background/BuddyComponent';
import { WeatherGrid } from './components/Weather';
import { ForecastTimeline } from './components/Forecast';
import { CityInformationLayout } from './components/CityInformationLayout';
import { DraggableWidget } from './components/DraggableWidget';
import { SettingsPanel } from './components/Settings';
import { useCityStore } from './stores/useCityStore';
import { useWeatherStore } from './stores/useWeatherStore';
import { useSettingsStore } from './stores/useSettingsStore';
import { useUIStore } from './stores/useUIStore';
import { useLocalTime } from './hooks/useLocalTime';
import { generateNarration } from './services/narrationService';
import { weatherCodeToLabel } from './types/weather';

function App() {
  const { selectedCity, fetchImage, fetchWiki, fetchPulse, cityImage } = useCityStore();
  const { current, daily, fetchWeatherData, isLoading: weatherLoading } = useWeatherStore();
  const { openaqApiKey, narrationProvider, openaiApiKey, geminiApiKey, unsplashApiKey } = useSettingsStore();
  const { showHero, showWeather, showForecast, showCityIntel, revealSections, setNarration, setNarrationLoading, resetUI } = useUIStore();
  const { timeOfDay } = useLocalTime(selectedCity?.timezone);

  // Fetch weather and image when city changes
  useEffect(() => {
    if (!selectedCity) {
      resetUI();
      return;
    }

    fetchWeatherData(selectedCity.latitude, selectedCity.longitude, openaqApiKey);
    
    if (unsplashApiKey) {
      fetchImage(selectedCity.name, unsplashApiKey);
    }

    fetchWiki(selectedCity.name);
    fetchPulse(selectedCity.name);
  }, [selectedCity, fetchWeatherData, fetchImage, fetchWiki, fetchPulse, openaqApiKey, unsplashApiKey, resetUI]);

  // Reveal sections after weather loads
  useEffect(() => {
    if (current && selectedCity) {
      revealSections();
    }
  }, [current, selectedCity, revealSections]);

  const lastNarrationRef = useRef<string | null>(null);

  // Generate narration when weather data arrives
  useEffect(() => {
    if (!current || !selectedCity) return;

    // Deduplication key
    const stateKey = `${selectedCity.id}-${current.weatherCode}-${timeOfDay}`;
    if (lastNarrationRef.current === stateKey) return;

    const apiKey = narrationProvider === 'openai' ? openaiApiKey : geminiApiKey;
    if (!apiKey && narrationProvider !== 'template') return;

    lastNarrationRef.current = stateKey;
    setNarrationLoading(true);

    generateNarration(
      {
        city: selectedCity.name,
        country: selectedCity.country,
        weather: weatherCodeToLabel(current.weatherCode),
        temp: current.temperature,
        timeOfDay,
        humidity: current.humidity,
        windSpeed: current.windSpeed,
      },
      narrationProvider,
      apiKey
    ).then((result) => {
      // Only set if we actually got text back (lock might have blocked concurrent)
      if (result.text) {
        setNarration(result.text, result.source);
      }
    });
  }, [current, selectedCity, narrationProvider, openaiApiKey, geminiApiKey, timeOfDay, setNarration, setNarrationLoading, lastNarrationRef]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <AtmosphericBackground
        condition={current?.condition}
        timeOfDay={timeOfDay}
        cloudCover={current?.cloudCover}
        imageUrl={cityImage?.url}
        cityName={selectedCity?.name}
      />
      <CanvasLayer />
      <BuddyComponent />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Omnibox — always visible */}
        <OmniboxContainer />

        {/* Hero Section */}
        {showHero && selectedCity && current && (
          <HeroSection />
        )}

        {/* Weather Layer */}
        {showWeather && current && !weatherLoading && (
          <DraggableWidget id="weather-bar" className="w-full max-w-6xl px-6 mt-8">
            <WeatherGrid />
          </DraggableWidget>
        )}

        {/* Unified City Information Dashboard (Left: Info/Photo, Right: Map/Feed) */}
        {(showForecast || showCityIntel) && selectedCity && (
          <DraggableWidget id="city-dashboard" className="w-full flex flex-col items-center pb-16">
            <CityInformationLayout />
            
            {/* Forecast Timeline at the bottom of the dashboard */}
            {showForecast && daily.length > 0 && (
              <div className="w-full max-w-7xl px-6 mt-8">
                <ForecastTimeline />
              </div>
            )}
          </DraggableWidget>
        )}
      </div>

      {/* Settings Panel */}
      <SettingsPanel />

      {/* Settings Toggle */}
      <button
        id="settings-toggle"
        onClick={useSettingsStore.getState().toggleSettingsPanel}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full glass glass-hover flex items-center justify-center text-bloom-text-secondary hover:text-bloom-text-primary transition-colors cursor-pointer"
        aria-label="Open settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
    </div>
  );
}

export default App;
