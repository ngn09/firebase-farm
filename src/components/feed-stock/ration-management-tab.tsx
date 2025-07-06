
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { RationCard } from './ration-card';
import { CreateRationForm } from './create-ration-form';
import type { FeedItem } from './feed-stock-list';


export interface RationFeedItem {
  feedItemId: number;
  name: string;
  quantity: number;
}

export interface Ration {
  id: number;
  name: string;
  animalCount: number;
  autoDeduct: boolean;
  feedItems: RationFeedItem[];
}

export function RationManagementTab({ feedItems }: { feedItems: FeedItem[] }) {
  const [activeRations, setActiveRations] = useState<Ration[]>([]);
  const [archivedRations, setArchivedRations] = useState<Ration[]>([]);
  const [activeTab, setActiveTab] = useState('aktif');
  const [isCreateFormOpen, setCreateFormOpen] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedActive = localStorage.getItem('farm-active-rations');
      const savedArchived = localStorage.getItem('farm-archived-rations');
      if (savedActive) setActiveRations(JSON.parse(savedActive));
      if (savedArchived) setArchivedRations(JSON.parse(savedArchived));
    } catch (e) {
      console.error("Failed to load rations from localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
      localStorage.setItem('farm-active-rations', JSON.stringify(activeRations));
      localStorage.setItem('farm-archived-rations', JSON.stringify(archivedRations));
    } catch(e) { console.error(e); }
  }, [activeRations, archivedRations]);


  const handleArchive = (rationId: number) => {
    const rationToArchive = activeRations.find(r => r.id === rationId);
    if (rationToArchive) {
      setActiveRations(activeRations.filter(r => r.id !== rationId));
      setArchivedRations([rationToArchive, ...archivedRations]);
    }
  };
  
  const handleUnarchive = (rationId: number) => {
    const rationToUnarchive = archivedRations.find(r => r.id === rationId);
    if (rationToUnarchive) {
      setArchivedRations(archivedRations.filter(r => r.id !== rationId));
      setActiveRations([rationToUnarchive, ...activeRations]);
    }
  };
  
  const updateRation = (updatedRation: Ration) => {
    setActiveRations(activeRations.map(r => r.id === updatedRation.id ? updatedRation : r));
  };
  
  const handleRationCreated = (newRationData: Omit<Ration, 'id'>) => {
    const newRation: Ration = {
        ...newRationData,
        id: Math.max(0, ...activeRations.map(r => r.id), ...archivedRations.map(r => r.id)) + 1,
    };
    setActiveRations([newRation, ...activeRations]);
  };


  return (
    <>
        <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
            <CardTitle>Rasyon Yönetimi</CardTitle>
            <CardDescription>Hayvanlarınız için yem rasyonları oluşturun ve yönetin.</CardDescription>
            </div>
            <Button onClick={() => setCreateFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Rasyon Oluştur
            </Button>
        </CardHeader>
        <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
                <TabsTrigger value="aktif">Aktif Rasyonlar ({activeRations.length})</TabsTrigger>
                <TabsTrigger value="arsiv">Arşiv ({archivedRations.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="aktif" className="mt-4 space-y-4">
                {activeRations.length > 0 ? (
                activeRations.map(ration => (
                    <RationCard
                    key={ration.id}
                    ration={ration}
                    onArchive={() => handleArchive(ration.id)}
                    onUpdate={updateRation}
                    isArchived={false}
                    />
                ))
                ) : (
                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Aktif rasyon bulunmuyor.</p>
                </div>
                )}
            </TabsContent>
            <TabsContent value="arsiv" className="mt-4 space-y-4">
                {archivedRations.length > 0 ? (
                archivedRations.map(ration => (
                    <RationCard
                    key={ration.id}
                    ration={ration}
                    onArchive={() => handleUnarchive(ration.id)}
                    onUpdate={() => {}} // No update in archive for now
                    isArchived={true}
                    />
                ))
                ) : (
                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Arşivlenmiş rasyon bulunmuyor.</p>
                </div>
                )}
            </TabsContent>
            </Tabs>
        </CardContent>
        </Card>
        <CreateRationForm
            isOpen={isCreateFormOpen}
            setIsOpen={setCreateFormOpen}
            onRationCreated={handleRationCreated}
            availableFeeds={feedItems}
        />
    </>
  );
}
