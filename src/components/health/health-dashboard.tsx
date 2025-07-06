
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  HeartPulse,
  CheckCircle2,
  ShieldX,
  CalendarDays,
  Plus,
  Archive,
  MoreHorizontal,
  Trash2,
  ArchiveRestore,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AddExaminationForm } from './add-examination-form';
import { type HealthRecord, type Animal } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


export function HealthDashboard() {
  const [activeRecords, setActiveRecords] = useState<HealthRecord[]>([]);
  const [archivedRecords, setArchivedRecords] = useState<HealthRecord[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isAddFormOpen, setAddFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('aktif');
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedActiveRecords = localStorage.getItem('farm-health-records');
      const savedArchivedRecords = localStorage.getItem('farm-archived-health-records');
      const savedAnimals = localStorage.getItem('farm-animals');

      if (savedActiveRecords) setActiveRecords(JSON.parse(savedActiveRecords));
      if (savedArchivedRecords) setArchivedRecords(JSON.parse(savedArchivedRecords));
      if (savedAnimals) setAnimals(JSON.parse(savedAnimals));
    } catch (error) {
      console.error("Failed to parse health data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
      localStorage.setItem('farm-health-records', JSON.stringify(activeRecords));
      localStorage.setItem('farm-archived-health-records', JSON.stringify(archivedRecords));
    } catch (error) {
       console.error("Failed to save health records to localStorage", error);
    }
  }, [activeRecords, archivedRecords]);


  const handleExaminationAdded = (newRecord: Omit<HealthRecord, 'id'>) => {
    const recordWithId = { ...newRecord, id: Math.max(0, ...activeRecords.map(r => r.id), ...archivedRecords.map(r => r.id)) + 1 };
    setActiveRecords([recordWithId, ...activeRecords]);
  };
  
  const handleDelete = (recordId: number) => {
    setArchivedRecords(archivedRecords.filter(r => r.id !== recordId));
    toast({ variant: 'destructive', title: 'Kayıt Kalıcı Olarak Silindi' });
  }

  const handleArchive = (recordId: number) => {
    const recordToArchive = activeRecords.find(r => r.id === recordId);
    if(recordToArchive) {
      setActiveRecords(activeRecords.filter(r => r.id !== recordId));
      setArchivedRecords([recordToArchive, ...archivedRecords]);
      toast({ title: 'Kayıt Arşivlendi' });
    }
  }

  const handleUnarchive = (recordId: number) => {
    const recordToUnarchive = archivedRecords.find(r => r.id === recordId);
    if(recordToUnarchive) {
      setArchivedRecords(archivedRecords.filter(r => r.id !== recordId));
      setActiveRecords([recordToUnarchive, ...activeRecords]);
      toast({ title: 'Kayıt Geri Yüklendi' });
    }
  }
  
  const handleShowDetails = (record: HealthRecord) => {
    toast({
        title: `${record.animalTag} - ${record.diagnosis}`,
        description: "Detaylı görünüm özelliği yakında eklenecektir."
    })
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Tedavi Altında': return "default";
      case 'İyileşti': return "secondary";
      case 'Öldü': return "destructive";
      default: return "outline";
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR');

  const renderRecordsTable = (data: HealthRecord[], from: 'active' | 'archived') => (
    <div className="rounded-lg border overflow-hidden">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Küpe No</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Teşhis</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Veteriner</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            {from === 'active' ? 'Aktif kayıt bulunamadı.' : 'Arşivde kayıt bulunamadı.'}
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map(record => (
                        <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.animalTag}</TableCell>
                            <TableCell>{formatDate(record.date)}</TableCell>
                            <TableCell>{record.diagnosis}</TableCell>
                            <TableCell><Badge variant={getStatusVariant(record.status)}>{record.status}</Badge></TableCell>
                            <TableCell>{record.veterinarian}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleShowDetails(record)}>Detayları Görüntüle</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => from === 'active' ? handleArchive(record.id) : handleUnarchive(record.id)}>
                                            {from === 'active' ? <><Archive className="mr-2 h-4 w-4" /> Arşivle</> : <><ArchiveRestore className="mr-2 h-4 w-4"/> Arşivden Çıkar</>}
                                        </DropdownMenuItem>
                                        {from === 'archived' && (
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
                                                    Bu işlem geri alınamaz. Kayıt kalıcı olarak silinecektir.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(record.id)}>Evet, Sil</AlertDialogAction>
                                                </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
        <h1 className="text-3xl font-bold text-primary">Sağlık</h1>
        <p className="text-muted-foreground">Hayvanlarınızın sağlık kayıtlarını yönetin.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acil Uyarılar</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRecords.filter(r => r.status === 'Tedavi Altında').length}</div>
            <p className="text-xs text-muted-foreground">Acil müdahale gerekiyor</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Vakalar</CardTitle>
            <HeartPulse className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRecords.length}</div>
            <p className="text-xs text-muted-foreground">Arşivlenmemiş tüm kayıtlar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tedavisi Tamamlananlar</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRecords.filter(r => r.status === 'İyileşti').length}</div>
            <p className="text-xs text-muted-foreground">İyileşen hayvan sayısı</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ölen Hayvanlar</CardTitle>
            <ShieldX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{[...activeRecords, ...archivedRecords].filter(r => r.status === 'Öldü').length}</div>
            <p className="text-xs text-muted-foreground">Toplam kayıp</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aşı Takvimi</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-around">
                <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Planlanmış</p>
                </div>
                 <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Tamamlanan</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div>
                    <CardTitle>Sağlık Kayıtları</CardTitle>
                    <CardDescription>Tüm muayene ve tedavi geçmişini görüntüleyin.</CardDescription>
                </div>
                <Button onClick={() => setAddFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Muayene Ekle
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="aktif"><HeartPulse className="mr-2 h-4 w-4" />Aktif Kayıtlar ({activeRecords.length})</TabsTrigger>
                    <TabsTrigger value="arsiv"><Archive className="mr-2 h-4 w-4" />Arşiv ({archivedRecords.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="aktif" className="mt-4">
                    {renderRecordsTable(activeRecords, 'active')}
                </TabsContent>
                <TabsContent value="arsiv" className="mt-4">
                    {renderRecordsTable(archivedRecords, 'archived')}
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

      <AddExaminationForm 
        isOpen={isAddFormOpen} 
        setIsOpen={setAddFormOpen} 
        onExaminationAdded={handleExaminationAdded}
        animals={animals}
      />
    </div>
  );
}
