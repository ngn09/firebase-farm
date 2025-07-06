'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Rabbit, Database, Heart, ClipboardCheck, Send, Menu } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { APP_CONFIG } from '@/lib/constants';

// Dynamic imports for better performance
const WeatherWidget = dynamic(() => import("@/components/dashboard/weather-widget").then(mod => ({ default: mod.WeatherWidget })), {
  loading: () => <div className="h-32 bg-muted animate-pulse rounded" />,
  ssr: false
});

interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

interface Animal {
  id?: number;
  status: string;
}

interface FeedItem {
  id?: number;
  quantity: string;
  unit: string;
}

interface HealthRecord {
  id: number;
  status: string;
}

interface Task {
  id?: number;
  status: string;
}

export default function DashboardPage() {
  const [quickMessage, setQuickMessage] = useState('');
  const [quickChatMessages, setQuickChatMessages] = useState<Message[]>([]);
  const { setIsMobileSheetOpen } = useSidebar();
  const isMobile = useIsMobile();
  
  const [animals] = useLocalStorage<Animal[]>(APP_CONFIG.STORAGE_KEYS.ANIMALS, []);
  const [feedItems] = useLocalStorage<FeedItem[]>(APP_CONFIG.STORAGE_KEYS.FEED_STOCK, []);
  const [healthRecords] = useLocalStorage<HealthRecord[]>(APP_CONFIG.STORAGE_KEYS.HEALTH_RECORDS, []);
  const [tasks] = useLocalStorage<Task[]>(APP_CONFIG.STORAGE_KEYS.TASKS, []);

  // Memoized calculations
  const stats = useMemo(() => {
    const totalAnimals = animals.length;
    
    const totalFeedInKg = feedItems.reduce((total, item) => {
      const qty = parseFloat(item.quantity);
      if (isNaN(qty)) return total;
      
      switch (item.unit) {
        case 'ton': return total + (qty * 1000);
        case 'çuval': return total + (qty * 50);
        default: return total + qty;
      }
    }, 0);
    
    const totalFeedInTons = (totalFeedInKg / 1000).toFixed(1);
    const healthAlerts = healthRecords.filter(record => record.status === 'Tedavi Altında').length;
    const pendingTasks = tasks.filter(task => task.status === 'Bekliyor' || task.status === 'Devam Ediyor').length;

    return { totalAnimals, totalFeedInTons, healthAlerts, pendingTasks };
  }, [animals, feedItems, healthRecords, tasks]);

  const handleQuickChatSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;
    
    const newMessage: Message = {
      sender: 'Siz',
      text: quickMessage.trim(),
      timestamp: Date.now()
    };
    
    setQuickChatMessages(prev => [...prev, newMessage]);
    setQuickMessage('');
    
    // Simulate response
    setTimeout(() => {
      const assistantMessage: Message = {
        sender: 'Asistan',
        text: "Mesajınız alındı.",
        timestamp: Date.now()
      };
      setQuickChatMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  }, [quickMessage]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8 flex items-center gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsMobileSheetOpen(true)}>
            <Menu />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Gösterge Paneli</h1>
          <p className="text-muted-foreground">Çiftlik Asistanınıza hoş geldiniz.</p>
        </div>
      </header>
      
      <div className="space-y-6">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/animals" className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Hayvan</CardTitle>
                <Rabbit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAnimals}</div>
                <p className="text-xs text-muted-foreground">Aktif hayvan sayısı</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/feed-stock" className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Yem Stoğu</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFeedInTons} Ton</div>
                <p className="text-xs text-muted-foreground">Toplam yem stoğu</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/health" className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sağlık Uyarıları</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.healthAlerts}</div>
                <p className="text-xs text-muted-foreground">Acil müdahale</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tasks" className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bekleyen Görevler</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingTasks}</div>
                <p className="text-xs text-muted-foreground">Aktif görevler</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <WeatherWidget />
          </div>
          <div className="xl:col-span-2">
            <Card className="flex flex-col h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Hızlı Sohbet</CardTitle>
                <Button asChild variant="link" className="pr-0">
                  <Link href="/chat">Tümünü Gör</Link>
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-48 p-6">
                  <div className="space-y-4">
                    {quickChatMessages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground pt-10">
                        Henüz mesaj bulunmuyor
                      </div>
                    ) : (
                      quickChatMessages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'Siz' ? 'justify-end' : ''}`}>
                          {msg.sender !== 'Siz' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`flex flex-col ${msg.sender === 'Siz' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-lg text-sm max-w-xs ${msg.sender === 'Siz' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              <p>{msg.text}</p>
                            </div>
                          </div>
                          {msg.sender === 'Siz' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <form onSubmit={handleQuickChatSubmit} className="flex w-full items-center space-x-2">
                  <Input 
                    placeholder="Mesaj..."
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    maxLength={200}
                  />
                  <Button type="submit" size="icon" disabled={!quickMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}