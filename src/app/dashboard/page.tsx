
'use client';

import { useState, useEffect } from 'react';
import { WeatherWidget } from "@/components/dashboard/weather-widget";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Rabbit, Database, Heart, ClipboardCheck, Send, Menu } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Animal, FeedItem, HealthRecord, Task } from '@/lib/mock-data';


interface Message {
    sender: string;
    text: string;
}

export default function DashboardPage() {
  const [quickMessage, setQuickMessage] = useState('');
  const [quickChatMessages, setQuickChatMessages] = useState<Message[]>([]);
  const { setIsMobileSheetOpen } = useSidebar();
  const isMobile = useIsMobile();
  
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    try {
      const savedAnimals = localStorage.getItem('farm-animals');
      const savedFeedItems = localStorage.getItem('farm-feed-stock');
      const savedHealthRecords = localStorage.getItem('farm-health-records');
      const savedTasks = localStorage.getItem('farm-tasks');
      
      if (savedAnimals) setAnimals(JSON.parse(savedAnimals));
      if (savedFeedItems) setFeedItems(JSON.parse(savedFeedItems));
      if (savedHealthRecords) setHealthRecords(JSON.parse(savedHealthRecords));
      if (savedTasks) setTasks(JSON.parse(savedTasks));

    } catch (error) {
      console.error("Failed to load dashboard data from localStorage", error);
    }
  }, []);

  // Calculate stats
  const totalAnimals = animals.length;

  const totalFeedInKg = feedItems.reduce((total, item) => {
    const quantity = parseFloat(item.quantity);
    if (item.unit === 'ton') {
      return total + (quantity * 1000);
    }
    if (item.unit === 'çuval') {
        return total + (quantity * 50);
    }
    return total + quantity;
  }, 0);
  const totalFeedInTons = (totalFeedInKg / 1000).toFixed(1);

  const healthAlerts = healthRecords.filter(record => record.status === 'Tedavi Altında').length;

  const pendingTasks = tasks.filter(
    task => task.status === 'Bekliyor' || task.status === 'Devam Ediyor'
  ).length;

  const handleQuickChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickMessage.trim() === '') return;
    
    setQuickChatMessages(prev => [...prev, { sender: 'Siz', text: quickMessage.trim() }]);
    
    setTimeout(() => {
        setQuickChatMessages(prev => [...prev, { sender: 'Asistan', text: "Mesajınız alındı. En kısa sürede yanıtlanacaktır." }]);
    }, 1000);

    setQuickMessage('');
  };

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
            <p className="text-muted-foreground">Çiftlik Asistanınıza hoş geldiniz. Burası genel bakış paneliniz.</p>
        </div>
      </header>
      <div className="space-y-6">
        
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/animals" className="block hover:shadow-lg transition-shadow duration-300 rounded-lg">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Hayvan Sayısı</CardTitle>
                <Rabbit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAnimals}</div>
                <p className="text-xs text-muted-foreground">Aktif hayvan sayısı</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/feed-stock" className="block hover:shadow-lg transition-shadow duration-300 rounded-lg">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Yem Stoğu (Ton)</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFeedInTons} Ton</div>
                <p className="text-xs text-muted-foreground">Toplam yem stoğu</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/health" className="block hover:shadow-lg transition-shadow duration-300 rounded-lg">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sağlık Uyarıları</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthAlerts}</div>
                <p className="text-xs text-muted-foreground">Acil müdahale gerekiyor</p>
              </CardContent>
            </Card>
          </Link>

           <Link href="/tasks" className="block hover:shadow-lg transition-shadow duration-300 rounded-lg">
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bekleyen Görevler</CardTitle>
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingTasks}</div>
                  <p className="text-xs text-muted-foreground">aktif görevler</p>
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
            {/* Quick Chat Card */}
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
                                        <div className={`p-3 rounded-lg text-sm ${msg.sender === 'Siz' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
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
                        />
                        <Button type="submit" size="icon">
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Gönder</span>
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
