"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Cloud, CloudRain, AlertTriangle } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LOCATIONS, APP_CONFIG } from "@/lib/constants";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedLocation = useMemo(() => 
    LOCATIONS.find(l => l.id === selectedLocationId), 
    [selectedLocationId]
  );

  const fetchWeatherData = useCallback(async () => {
    if (!selectedLocation) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.WEATHER_API.TIMEOUT);

      const response = await fetch(
        `${APP_CONFIG.WEATHER_API.BASE_URL}?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lon}&current=temperature_2m,weather_code`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Hava durumu alınamadı');
      
      const data = await response.json();
      const { icon, condition } = getWeatherInfoFromCode(data.current.weather_code);
      
      setWeatherData({
        temp: Math.round(data.current.temperature_2m),
        condition,
        icon,
      });
    } catch (err) {
      setError("Veri alınamadı");
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const handleLocationChange = useCallback((newLocationId: string) => {
    setSelectedLocationId(newLocationId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.SELECTED_LOCATION, newLocationId);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 animate-pulse bg-muted rounded" />
          <div className="h-8 w-16 animate-pulse bg-muted rounded" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center text-destructive py-2">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    
    if (weatherData) {
      const WeatherIcon = weatherData.icon;
      return (
        <>
          <div className="flex items-center space-x-2">
            <WeatherIcon className="h-8 w-8 text-yellow-500" />
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
          <SelectTrigger className="w-auto h-auto p-0 focus:ring-0 border-none shadow-none bg-transparent text-xs text-muted-foreground">
            <SelectValue />
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