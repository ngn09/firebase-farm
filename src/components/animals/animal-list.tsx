
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, PawPrint, MoreHorizontal, Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { AddAnimalForm } from './add-animal-form';
import { BulkImportForm } from './bulk-import-form';
import { BulkExportForm } from './bulk-export-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { type Animal } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


export function AnimalList() {
  const [ageLimit, setAgeLimit] = useState(12);
  const [activeTab, setActiveTab] = useState('aktif');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [archivedAnimals, setArchivedAnimals] = useState<Animal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedAnimals = localStorage.getItem('farm-animals');
      const savedArchivedAnimals = localStorage.getItem('farm-archived-animals');
      if (savedAnimals) {
        setAnimals(JSON.parse(savedAnimals));
      }
      if (savedArchivedAnimals) {
        setArchivedAnimals(JSON.parse(savedArchivedAnimals));
      }
    } catch (error) {
      console.error("Failed to parse animals from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
      localStorage.setItem('farm-animals', JSON.stringify(animals));
      localStorage.setItem('farm-archived-animals', JSON.stringify(archivedAnimals));
    } catch (error) {
       console.error("Failed to save animals to localStorage", error);
    }
  }, [animals, archivedAnimals]);


  const handleAnimalAdded = (newAnimal: Omit<Animal, 'id'>) => {
    const animalWithId = { ...newAnimal, id: Math.max(0, ...animals.map(a => a.id || 0), ...archivedAnimals.map(a => a.id || 0)) + 1 };
    setAnimals([animalWithId, ...animals]);
  };
  
  const handleAnimalsImported = (importedAnimals: Omit<Animal, 'id'>[]) => {
    let lastId = Math.max(0, ...animals.map(a => a.id || 0), ...archivedAnimals.map(a => a.id || 0));
    const newAnimalsWithIds = importedAnimals.map(animal => {
        lastId++;
        return { ...animal, id: lastId };
    });

    setAnimals(prev => [...newAnimalsWithIds, ...prev]);

    toast({
        title: "İçe Aktarma Başarılı!",
        description: `${newAnimalsWithIds.length} hayvan listeye eklendi.`,
    });
  };

  const handleArchive = (animalId: number) => {
    const animalToArchive = animals.find(a => a.id === animalId);
    if(animalToArchive) {
      setAnimals(animals.filter(a => a.id !== animalId));
      setArchivedAnimals([animalToArchive, ...archivedAnimals]);
      toast({ title: "Hayvan Arşivlendi", description: `${animalToArchive.tagNumber} küpe numaralı hayvan arşive taşındı.` });
    }
  }
  
  const handleUnarchive = (animalId: number) => {
    const animalToUnarchive = archivedAnimals.find(a => a.id === animalId);
    if(animalToUnarchive) {
      setArchivedAnimals(archivedAnimals.filter(a => a.id !== animalId));
      setAnimals([animalToUnarchive, ...animals]);
      toast({ title: "Hayvan Geri Yüklendi", description: `${animalToUnarchive.tagNumber} küpe numaralı hayvan aktif listeye geri taşındı.` });
    }
  }

  const handleDelete = (animalId: number, from: 'active' | 'archived') => {
      if(from === 'active') {
          setAnimals(animals.filter(a => a.id !== animalId));
      } else {
          setArchivedAnimals(archivedAnimals.filter(a => a.id !== animalId));
      }
      toast({ variant: "destructive", title: "Hayvan Kalıcı Olarak Silindi" });
  }

  const handleShowDetails = (animal: Animal) => {
    toast({
        title: `${animal.tagNumber} Detayları`,
        description: "Detaylı görünüm özelliği yakında eklenecektir."
    })
  }
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Aktif': return "default";
      case 'Hamile': return "secondary";
      case 'Hasta': return "destructive";
      default: return "outline";
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
        years--;
        months += 12;
    }
    return `${years} yaş ${months} ay`;
  }
  
  const youngAnimalsCount = animals.filter(animal => {
    const birth = new Date(animal.birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    return ageInMonths < ageLimit;
  }).length;
  
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal =>
        animal.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [animals, searchTerm]);

  const filteredArchivedAnimals = useMemo(() => {
    return archivedAnimals.filter(animal =>
        animal.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [archivedAnimals, searchTerm]);


  const renderAnimalTable = (data: Animal[], from: 'active' | 'archived') => (
    <div className="rounded-lg border overflow-hidden">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[10px]"><Checkbox/></TableHead>
                <TableHead>Küpe No</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Cins</TableHead>
                <TableHead>Yaş</TableHead>
                <TableHead>Cinsiyet</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">Eylemler</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                            {from === 'active' ? 'Aktif hayvan bulunamadı.' : 'Arşivde hayvan bulunamadı.'}
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map(animal => (
                    <TableRow key={animal.id}>
                        <TableCell><Checkbox/></TableCell>
                        <TableCell className="font-medium">{animal.tagNumber}</TableCell>
                        <TableCell>{animal.species}</TableCell>
                        <TableCell>{animal.breed}</TableCell>
                        <TableCell>{calculateAge(animal.birthDate)}</TableCell>
                        <TableCell>{animal.gender}</TableCell>
                        <TableCell><Badge variant={getStatusVariant(animal.status)}>{animal.status}</Badge></TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Menüyü aç</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleShowDetails(animal)}>Detayları Görüntüle</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => from === 'active' ? handleArchive(animal.id!) : handleUnarchive(animal.id!)}>
                                    {from === 'active' ? <><Archive className="mr-2 h-4 w-4" />Arşivle</> : <><ArchiveRestore className="mr-2 h-4 w-4" />Arşivden Çıkar</>}
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
                                          Bu işlem geri alınamaz. Hayvan kalıcı olarak silinecektir.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>İptal</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(animal.id!, 'archived')}>Evet, Sil</AlertDialogAction>
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
        <h1 className="text-3xl font-bold text-primary">Hayvanlar</h1>
        <p className="text-muted-foreground">Çiftliğinizdeki tüm hayvanlarınızı yönetin.</p>
      </header>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Hayvan</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animals.length}</div>
            <p className="text-xs text-muted-foreground">Aktif hayvan sayısı</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erkek</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animals.filter(a => a.gender === 'Erkek').length}</div>
            <p className="text-xs text-muted-foreground">Toplam erkek hayvan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dişi</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animals.filter(a => a.gender === 'Dişi').length}</div>
            <p className="text-xs text-muted-foreground">Toplam dişi hayvan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buzağı/Kuzu</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{youngAnimalsCount}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Yaş sınırı (ay):</span>
              <Input
                type="number"
                value={ageLimit}
                onChange={(e) => setAgeLimit(Number(e.target.value))}
                className="h-6 w-14 ml-2 p-1 border rounded text-center"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle>Hayvan Listesi</CardTitle>
                    <CardDescription>Çiftliğinizdeki hayvanları yönetin.</CardDescription>
                </div>
                <div className="flex shrink-0 items-center gap-2 flex-wrap">
                    <BulkExportForm animals={animals} />
                    <BulkImportForm onAnimalsImported={handleAnimalsImported} />
                    <AddAnimalForm onAnimalAdded={handleAnimalAdded} />
                </div>
            </div>
            <div className="relative pt-4">
                <Filter className="absolute left-3 top-1/2 -translate-y-px h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Küpe no, tür, veya cinse göre filtrele..." 
                    className="pl-10 w-full md:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="aktif">Aktif ({animals.length})</TabsTrigger>
              <TabsTrigger value="arsiv">Arşiv ({archivedAnimals.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="aktif" className="mt-4">
              {renderAnimalTable(filteredAnimals, 'active')}
            </TabsContent>
            <TabsContent value="arsiv" className="mt-4">
              {renderAnimalTable(filteredArchivedAnimals, 'archived')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
