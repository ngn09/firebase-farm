
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Filter, Boxes, MoreHorizontal, Trash2, Pencil, TrendingUp, Wrench, ShieldAlert, Archive, ArchiveRestore } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { AddInventoryItemForm } from './add-inventory-item-form';
import { EditInventoryItemForm } from './edit-inventory-item-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { type InventoryItem } from '@/lib/mock-data';

export function InventoryList() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [archivedItems, setArchivedItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState('aktif');
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('farm-inventory');
      const savedArchivedItems = localStorage.getItem('farm-archived-inventory');
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedArchivedItems) setArchivedItems(JSON.parse(savedArchivedItems));
    } catch (error) {
      console.error("Failed to parse inventory from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
      localStorage.setItem('farm-inventory', JSON.stringify(items));
      localStorage.setItem('farm-archived-inventory', JSON.stringify(archivedItems));
    } catch (error) {
      console.error("Failed to save inventory to localStorage", error);
    }
  }, [items, archivedItems]);

  const handleItemAdded = (newItem: Omit<InventoryItem, 'id'>) => {
    const itemWithId = { ...newItem, id: Math.max(0, ...items.map(a => a.id || 0), ...archivedItems.map(a => a.id || 0)) + 1 };
    setItems([itemWithId, ...items]);
  };

  const handleItemUpdated = (updatedItem: InventoryItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
  };
  
  const handleArchive = (itemId: number) => {
    const itemToArchive = items.find(i => i.id === itemId);
    if (itemToArchive) {
      setItems(items.filter(i => i.id !== itemId));
      setArchivedItems([itemToArchive, ...archivedItems]);
      toast({ title: "Demirbaş Arşivlendi" });
    }
  };

  const handleUnarchive = (itemId: number) => {
    const itemToUnarchive = archivedItems.find(i => i.id === itemId);
    if (itemToUnarchive) {
      setArchivedItems(archivedItems.filter(i => i.id !== itemId));
      setItems([itemToUnarchive, ...items]);
      toast({ title: "Demirbaş Geri Yüklendi" });
    }
  };

  const handleDelete = (itemId: number) => {
    setArchivedItems(archivedItems.filter(a => a.id !== itemId));
    toast({ title: "Demirbaş Kalıcı Olarak Silindi", variant: "destructive" });
  };
  
  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Aktif': return "default";
      case 'Bakımda': return "secondary";
      case 'Arızalı': return "destructive";
      default: return "outline";
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(value));
  };
  
  const formatDate = (dateString?: string) => {
    if(!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const filteredItems = useMemo(() => {
    const source = activeTab === 'aktif' ? items : archivedItems;
    return source.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, archivedItems, searchTerm, activeTab]);

  const totalValue = items.reduce((acc, item) => acc + Number(item.value), 0);
  
  const renderItemTable = (data: InventoryItem[], from: 'active' | 'archived') => (
    <div className="rounded-lg border overflow-hidden">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[10px]"><Checkbox/></TableHead>
                <TableHead>Demirbaş Adı</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Alım Tarihi</TableHead>
                <TableHead>Değer</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Sonraki Bakım</TableHead>
                <TableHead className="text-right">Eylemler</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="h-24 text-center">Kayıt bulunamadı.</TableCell></TableRow>
                ) : (
                    data.map(item => (
                    <TableRow key={item.id}>
                        <TableCell><Checkbox/></TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{formatDate(item.purchaseDate)}</TableCell>
                        <TableCell>{formatCurrency(item.value)}</TableCell>
                        <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                        <TableCell>{formatDate(item.nextMaintenanceDate)}</TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Menüyü aç</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {from === 'active' && (
                                  <>
                                    <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                        <Pencil className="mr-2 h-4 w-4"/> Düzenle
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleArchive(item.id!)}>
                                        <Archive className="mr-2 h-4 w-4" /> Arşivle
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {from === 'archived' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleUnarchive(item.id!)}>
                                        <ArchiveRestore className="mr-2 h-4 w-4"/> Arşivden Çıkar
                                    </DropdownMenuItem>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <button className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive">
                                              <Trash2 className="mr-2 h-4 w-4"/> Sil
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Bu işlem geri alınamaz. Demirbaş kalıcı olarak silinecektir.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>İptal</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(item.id!)}>Evet, Sil</AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                  </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary">Envanter</h1>
        <p className="text-muted-foreground">Çiftliğinizdeki tüm demirbaşları yönetin.</p>
      </header>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Demirbaş</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">Toplam envanter kalem sayısı</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Değer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(String(totalValue))}</div>
            <p className="text-xs text-muted-foreground">Tüm demirbaşların toplam değeri</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bakımdakiler</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.filter(i => i.status === 'Bakımda').length}</div>
            <p className="text-xs text-muted-foreground">Şu an bakımda olan demirbaşlar</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arızalılar</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.filter(i => i.status === 'Arızalı').length}</div>
            <p className="text-xs text-muted-foreground">Arızalı olarak işaretlenenler</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle>Demirbaş Listesi</CardTitle>
                    <CardDescription>Çiftliğinizdeki demirbaşları yönetin.</CardDescription>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <AddInventoryItemForm onItemAdded={handleItemAdded} />
                </div>
            </div>
            <div className="relative pt-4">
                <Filter className="absolute left-3 top-1/2 -translate-y-px h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Ad, kategori veya duruma göre filtrele..." 
                    className="pl-10 w-full md:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
            </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="aktif">Aktif ({items.length})</TabsTrigger>
              <TabsTrigger value="arsiv">Arşiv ({archivedItems.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="aktif" className="mt-4">
              {renderItemTable(filteredItems, 'active')}
            </TabsContent>
            <TabsContent value="arsiv" className="mt-4">
              {renderItemTable(filteredItems, 'archived')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {editingItem && (
        <EditInventoryItemForm
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            item={editingItem}
            onItemUpdated={handleItemUpdated}
        />
      )}
    </div>
  );
}
