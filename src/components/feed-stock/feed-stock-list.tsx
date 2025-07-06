
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { AddFeedItemForm } from './add-feed-item-form';
import { ExportFeedStockForm } from './export-feed-stock-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RationManagementTab } from './ration-management-tab';
import { type FeedItem } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export function FeedStockList() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isAddFormOpen, setAddFormOpen] = useState(false);
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedFeedItems = localStorage.getItem('farm-feed-stock');
      if (savedFeedItems) {
        setFeedItems(JSON.parse(savedFeedItems));
      }
    } catch (error) {
      console.error("Failed to load feed stock from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
      localStorage.setItem('farm-feed-stock', JSON.stringify(feedItems));
    } catch (error) {
      console.error("Failed to save feed stock to localStorage", error);
    }
  }, [feedItems]);

  const handleItemAdded = (newItem: Omit<FeedItem, 'id'>) => {
    const itemWithId = { ...newItem, id: Math.max(0, ...feedItems.map(item => item.id || 0)) + 1 };
    setFeedItems([itemWithId, ...feedItems]);
  };
  
  const handleDelete = (itemId: number) => {
      setFeedItems(feedItems.filter(item => item.id !== itemId));
      toast({ variant: 'destructive', title: "Yem Silindi", description: "Yem stoğunuzdan kalıcı olarak kaldırıldı."})
  }

  const formatDate = (dateString?: string) => {
    if(!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  }

  const renderFeedTable = () => (
     <div className="rounded-lg border overflow-hidden">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Yem Adı</TableHead>
                    <TableHead>Türü</TableHead>
                    <TableHead>Mevcut Miktar</TableHead>
                    <TableHead>Alım Tarihi</TableHead>
                    <TableHead>Tedarikçi</TableHead>
                    <TableHead className="text-right">Eylemler</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {feedItems.map(item => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell><Badge variant="secondary">{item.type}</Badge></TableCell>
                        <TableCell>{item.quantity} {item.unit}</TableCell>
                        <TableCell>{formatDate(item.purchaseDate)}</TableCell>
                        <TableCell>{item.supplier || '-'}</TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Menüyü aç</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4"/> Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(item.id!)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4"/> Sil
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Yem Stok Yönetimi</h1>
      <Tabs defaultValue="stock-list">
        <TabsList>
          <TabsTrigger value="stock-list">Stok Listesi</TabsTrigger>
          <TabsTrigger value="ration-management">Rasyon Yönetimi</TabsTrigger>
        </TabsList>
        <TabsContent value="stock-list" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Yem Stok Listesi</CardTitle>
                <CardDescription>Mevcut yem stoğunuzu yönetin ve takip edin.</CardDescription>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button onClick={() => setAddFormOpen(true)}><Plus className="mr-2 h-4 w-4" />Yeni Yem Ekle</Button>
                <ExportFeedStockForm feedItems={feedItems} />
              </div>
            </CardHeader>
            <CardContent>
              {feedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Henüz Yem Eklenmemiş</h3>
                    <p className="text-muted-foreground mb-4">İlk yem öğenizi ekleyerek başlayın.</p>
                    <Button variant="outline" onClick={() => setAddFormOpen(true)}><Plus className="mr-2 h-4 w-4" />İlk Yemi Ekle</Button>
                </div>
              ) : (
                renderFeedTable()
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ration-management" className="mt-4">
           <RationManagementTab feedItems={feedItems} />
        </TabsContent>
      </Tabs>
      <AddFeedItemForm onItemAdded={handleItemAdded} isOpen={isAddFormOpen} setIsOpen={setAddFormOpen} />
    </div>
  );
}
