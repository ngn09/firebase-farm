
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Trash2, Pencil, Filter, Archive, ArchiveRestore } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { taskSchema, type Task } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const mockUsers = ["Ali Veli", "Ayşe Fatma", "Ahmet Yılmaz", "Atanmamış"];

function TaskFormDialog({
  isOpen,
  setIsOpen,
  onSave,
  taskToEdit,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (task: Task) => void;
  taskToEdit: Task | null;
}) {
  const form = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: taskToEdit || {
      title: "",
      description: "",
      dueDate: "",
      priority: 'Orta',
      status: 'Bekliyor',
      assignee: 'Atanmamış',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(taskToEdit || {
        title: "",
        description: "",
        dueDate: "",
        priority: 'Orta',
        status: 'Bekliyor',
        assignee: 'Atanmamış',
      });
    }
  }, [taskToEdit, isOpen, form]);

  const handleSubmit = (values: Task) => {
    onSave(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}</DialogTitle>
          <DialogDescription>
            Görevin ayrıntılarını doldurun ve kaydedin.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Başlık</FormLabel><FormControl><Input placeholder="örn. Sulama sistemini onar" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Açıklama (İsteğe bağlı)</FormLabel><FormControl><Textarea placeholder="Görevle ilgili ek detaylar..." {...field} /></FormControl><FormMessage /></FormItem> )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="dueDate" render={({ field }) => ( <FormItem><FormLabel>Bitiş Tarihi</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="assignee" render={({ field }) => ( <FormItem><FormLabel>Sorumlu Kişi</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Bir kişi seçin" /></SelectTrigger></FormControl><SelectContent>{mockUsers.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="priority" render={({ field }) => ( <FormItem><FormLabel>Öncelik</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Öncelik seçin" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Düşük">Düşük</SelectItem><SelectItem value="Orta">Orta</SelectItem><SelectItem value="Yüksek">Yüksek</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="status" render={({ field }) => ( <FormItem><FormLabel>Durum</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Durum seçin" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Bekliyor">Bekliyor</SelectItem><SelectItem value="Devam Ediyor">Devam Ediyor</SelectItem><SelectItem value="Tamamlandı">Tamamlandı</SelectItem><SelectItem value="İptal Edildi">İptal Edildi</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild><Button type="button" variant="outline">İptal</Button></DialogClose>
              <Button type="submit">Görevi Kaydet</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [priorityFilter, setPriorityFilter] = useState('Tümü');
  const [activeTab, setActiveTab] = useState('aktif');
  const { toast } = useToast();
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('farm-tasks');
      const savedArchivedTasks = localStorage.getItem('farm-archived-tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedArchivedTasks) setArchivedTasks(JSON.parse(savedArchivedTasks));
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
      localStorage.setItem('farm-tasks', JSON.stringify(tasks));
      localStorage.setItem('farm-archived-tasks', JSON.stringify(archivedTasks));
    } catch (error) {
       console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks, archivedTasks]);


  const handleSaveTask = (taskData: Task) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: editingTask.id } : t));
      toast({ title: "Başarılı", description: "Görev başarıyla güncellendi." });
    } else {
      const newTask: Task = {
        ...taskData,
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id!), ...archivedTasks.map(t => t.id!)) + 1 : 1,
      };
      setTasks([newTask, ...tasks]);
      toast({ title: "Başarılı", description: "Yeni görev başarıyla eklendi." });
    }
    setDialogOpen(false);
    setEditingTask(null);
  };
  
  const handleOpenDialog = (task: Task | null) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    setArchivedTasks(archivedTasks.filter(task => task.id !== taskId));
    toast({ title: "Görev Kalıcı Olarak Silindi", variant: "destructive" });
  };
  
  const handleArchiveTask = (taskId: number) => {
    const taskToArchive = tasks.find(t => t.id === taskId);
    if (taskToArchive) {
      setTasks(tasks.filter(t => t.id !== taskId));
      setArchivedTasks([taskToArchive, ...archivedTasks]);
      toast({ title: "Görev Arşivlendi" });
    }
  };

  const handleUnarchiveTask = (taskId: number) => {
    const taskToUnarchive = archivedTasks.find(t => t.id === taskId);
    if (taskToUnarchive) {
      setArchivedTasks(archivedTasks.filter(t => t.id !== taskId));
      setTasks([taskToUnarchive, ...tasks]);
      toast({ title: "Görev Geri Yüklendi" });
    }
  };

  const getStatusVariant = (status: Task['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Tamamlandı': return "outline";
      case 'Devam Ediyor': return "default";
      case 'İptal Edildi': return "destructive";
      case 'Bekliyor': return "secondary";
      default: return "secondary";
    }
  };

  const getPriorityVariant = (priority: Task['priority']): "default" | "secondary" | "destructive" => {
    switch (priority) {
      case 'Yüksek': return "destructive";
      case 'Orta': return "default";
      case 'Düşük': return "secondary";
      default: return "secondary";
    }
  }

  const filteredTasks = useMemo(() => {
    const source = activeTab === 'aktif' ? tasks : archivedTasks;
    return source.filter(task => {
        const statusMatch = statusFilter === 'Tümü' || task.status === statusFilter;
        const priorityMatch = priorityFilter === 'Tümü' || task.priority === priorityFilter;
        return statusMatch && priorityMatch;
    });
  }, [tasks, archivedTasks, statusFilter, priorityFilter, activeTab]);

  const renderTaskTable = (data: Task[], from: 'active' | 'archived') => (
    <div className="rounded-lg border overflow-hidden">
      <Table>
          <TableHeader>
          <TableRow>
              <TableHead>Görev</TableHead>
              <TableHead>Sorumlu</TableHead>
              <TableHead>Bitiş Tarihi</TableHead>
              <TableHead>Öncelik</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">Eylemler</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
          {data.length === 0 ? (
              <TableRow>
              <TableCell colSpan={6} className="h-48 text-center">
                 Kriterlere uyan görev bulunamadı.
              </TableCell>
              </TableRow>
          ) : (
              data.map(task => (
              <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell><Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge></TableCell>
                  <TableCell><Badge variant={getStatusVariant(task.status)}>{task.status}</Badge></TableCell>
                  <TableCell className="text-right">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menüyü aç</span>
                          <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(task)}>
                              <Pencil className="mr-2 h-4 w-4" /> Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => from === 'active' ? handleArchiveTask(task.id!) : handleUnarchiveTask(task.id!)}>
                              {from === 'active' ? <><Archive className="mr-2 h-4 w-4"/> Arşivle</> : <><ArchiveRestore className="mr-2 h-4 w-4"/> Arşivden Çıkar</>}
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
                                          Bu işlem geri alınamaz. Görev kalıcı olarak silinecektir.
                                      </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                      <AlertDialogCancel>İptal</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteTask(task.id!)}>Evet, Sil</AlertDialogAction>
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
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
           <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-2">
                    <Label htmlFor="status-filter" className="text-sm font-medium whitespace-nowrap">Duruma Göre</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger id="status-filter" className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Filtrele" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Tümü">Tümü</SelectItem>
                            <SelectItem value="Bekliyor">Bekliyor</SelectItem>
                            <SelectItem value="Devam Ediyor">Devam Ediyor</SelectItem>
                            <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
                            <SelectItem value="İptal Edildi">İptal Edildi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="priority-filter" className="text-sm font-medium whitespace-nowrap">Önceliğe Göre</Label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger id="priority-filter" className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Filtrele" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Tümü">Tümü</SelectItem>
                            <SelectItem value="Düşük">Düşük</SelectItem>
                            <SelectItem value="Orta">Orta</SelectItem>
                            <SelectItem value="Yüksek">Yüksek</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button onClick={() => handleOpenDialog(null)} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni Görev Ekle
            </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                  <TabsTrigger value="aktif">Aktif ({tasks.length})</TabsTrigger>
                  <TabsTrigger value="arsiv">Arşiv ({archivedTasks.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="aktif" className="mt-4">
                  {renderTaskTable(filteredTasks, 'active')}
              </TabsContent>
              <TabsContent value="arsiv" className="mt-4">
                  {renderTaskTable(filteredTasks, 'archived')}
              </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <TaskFormDialog 
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
      />
    </>
  );
}
