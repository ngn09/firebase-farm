
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Cloud, CloudRain, Thermometer, AlertTriangle } from "lucide-react";
import React, { useState, useEffect } from "react";

const locations = [
    { name: 'İstanbul', id: 'istanbul', lat: 41.01, lon: 28.98 },
    { name: 'Ankara', id: 'ankara', lat: 39.93, lon: 32.86 },
    { name: 'İzmir', id: 'izmir', lat: 38.42, lon: 27.14 },
    { name: 'Konya', id: 'konya', lat: 37.87, lon: 32.49 },
];

const getWeatherInfoFromCode = (code: number) => {
    if (code === 0) return { condition: "Açık", icon: Sun };
    if (code >= 1 && code <= 3) return { condition: "Parçalı Bulutlu", icon: Cloud };
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { condition: "Yağmurlu", icon: CloudRain };
    return { condition: "Bulutlu", icon: Cloud };
}


export function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('istanbul');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation && locations.some(l => l.id === savedLocation)) {
      setSelectedLocationId(savedLocation);
    }
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
        setIsLoading(true);
        setError(null);

        const location = locations.find(l => l.id === selectedLocationId);
        if (!location) {
            setError("Konum bulunamadı.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code`);
            if (!response.ok) {
                throw new Error('Hava durumu verisi alınamadı.');
            }
            const data = await response.json();
            const { icon, condition } = getWeatherInfoFromCode(data.current.weather_code);
            
            setWeatherData({
                temp: Math.round(data.current.temperature_2m),
                condition,
                icon,
            });

        } catch (err) {
            setError("Veri alınırken hata oluştu.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    fetchWeatherData();
  }, [selectedLocationId]);

  const handleLocationChange = (newLocationId: string) => {
      setSelectedLocationId(newLocationId);
      localStorage.setItem('selectedLocation', newLocationId);
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
            <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-4 w-24 mt-1" />
        </>
      );
    }

    if (error) {
        return (
            <div className="flex items-center text-destructive">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p className="text-sm">{error}</p>
            </div>
        )
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
        )
    }

    return null;
  }

  return (
    <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hava Durumu</CardTitle>
             <Select value={selectedLocationId} onValueChange={handleLocationChange}>
                <SelectTrigger className="w-auto h-auto p-0 focus:ring-0 focus:ring-offset-0 border-none shadow-none bg-transparent text-xs text-muted-foreground">
                    <SelectValue placeholder="Konum" />
                </SelectTrigger>
                <SelectContent>
                    {locations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id} className="text-xs">{loc.name}</SelectItem>
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
