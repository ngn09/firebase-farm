"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Sun, Cloud, CloudRain, Thermometer, AlertTriangle } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { LOCATIONS, APP_CONFIG } from "@/lib/constants";
import { storage } from "@/lib/storage";
import { retry } from "@/lib/utils";

interface WeatherData {
  temp: number;
  condition: string;
  icon: React.ElementType;
}

const getWeatherInfoFromCode = (code: number) => {
  if (code === 0) return { condition: "Açık", icon: Sun };
  if (code >= 1 && code <= 3) return { condition: "Parçalı Bulutlu", icon: Cloud };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { condition: "Yağmurlu", icon: CloudRain };
  return { condition: "Bulutlu", icon: Cloud };
};

export function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('istanbul');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedLocation = storage.get<string>(APP_CONFIG.STORAGE_KEYS.SELECTED_LOCATION);
    if (savedLocation && LOCATIONS.some(l => l.id === savedLocation)) {
      setSelectedLocationId(savedLocation);
    }
  }, []);

  const fetchWeatherData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const location = LOCATIONS.find(l => l.id === selectedLocationId);
    if (!location) {
      setError("Konum bulunamadı.");
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.WEATHER_API.TIMEOUT);

      const data = await retry(async () => {
        const response = await fetch(
          `${APP_CONFIG.WEATHER_API.BASE_URL}?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code`,
          { 
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            }
          }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      }, 3, 1000);

      const { icon, condition } = getWeatherInfoFromCode(data.current.weather_code);
      
      setWeatherData({
        temp: Math.round(data.current.temperature_2m),
        condition,
        icon,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Veri alınırken hata oluştu.";
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocationId]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const handleLocationChange = (newLocationId: string) => {
    setSelectedLocationId(newLocationId);
    storage.set(APP_CONFIG.STORAGE_KEYS.SELECTED_LOCATION, newLocationId);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner size="md" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center text-destructive py-2">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    
    if (weatherData) {
      const WeatherIcon = weatherData.icon;
      return (
        <>
          <div className="flex items-center space-x-2">
            <WeatherIcon className="h-8 w-8 text-yellow-500 flex-shrink-0" />
            <div className="text-3xl font-bold">{weatherData.temp}°C</div>
          </div>
          <p className="text-sm text-muted-foreground pt-1">{weatherData.condition}</p>
        </>
      );
    }

    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Hava Durumu</CardTitle>
        <Select value={selectedLocationId} onValueChange={handleLocationChange}>
          <SelectTrigger className="w-auto h-auto p-0 focus:ring-0 focus:ring-offset-0 border-none shadow-none bg-transparent text-xs text-muted-foreground">
            <SelectValue placeholder="Konum" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map(loc => (
              <SelectItem key={loc.id} value={loc.id} className="text-xs">
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2">
        {renderContent()}
      </CardContent>
    </Card>
  );
}