
'use client';

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Map } from "lucide-react";
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { useToast } from "@/hooks/use-toast";

interface BlockField {
  id: number;
  key: string;
  value: string;
}

interface Block {
  id: number;
  title: string;
  fields: BlockField[];
  position: { x: number; y: number };
}

export default function FarmMapPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const isInitialMount = useRef(true);

  // Form state
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<BlockField[]>([{ id: 1, key: '', value: '' }]);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedBlocks = localStorage.getItem('farm-map-blocks');
      if (savedBlocks) {
        setBlocks(JSON.parse(savedBlocks));
      }
    } catch (error) {
      console.error("Failed to load map blocks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
      localStorage.setItem('farm-map-blocks', JSON.stringify(blocks));
    } catch (error) {
      console.error("Failed to save map blocks to localStorage", error);
    }
  }, [blocks]);


  const openDialog = (block: Block | null) => {
    setEditingBlock(block);
    if (block) {
      setTitle(block.title);
      setFields(block.fields.length > 0 ? [...block.fields] : [{ id: Date.now(), key: '', value: '' }]);
    } else {
      setTitle('');
      setFields([{ id: Date.now(), key: '', value: '' }]);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Blok başlığı zorunludur.' });
      return;
    }

    const finalFields = fields.filter(f => f.key.trim() !== '' || f.value.trim() !== '');

    if (editingBlock) {
      setBlocks(blocks.map(b =>
        b.id === editingBlock.id ? { ...b, title, fields: finalFields } : b
      ));
      toast({ title: 'Başarılı', description: 'Blok güncellendi.' });
    } else {
      const newBlock: Block = {
        id: blocks.length > 0 ? Math.max(...blocks.map(b => b.id)) + 1 : 1,
        title,
        fields: finalFields,
        position: { x: 20, y: 20 },
      };
      setBlocks([...blocks, newBlock]);
      toast({ title: 'Başarılı', description: 'Yeni blok eklendi.' });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteBlock = (id: number) => {
    setBlocks(blocks.filter(b => b.id !== id));
    toast({ title: 'Blok Silindi', description: 'Blok krokiden kaldırıldı.' });
  };
  
  const handleDragStop = (e: DraggableEvent, data: DraggableData, blockId: number) => {
    setBlocks(blocks.map(b =>
      b.id === blockId ? { ...b, position: { x: data.x, y: data.y } } : b
    ));
  };

  // Field management for the form
  const handleFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const newFields = [...fields];
    newFields[index][field] = value;
    setFields(newFields);
  };

  const addField = () => {
    setFields([...fields, { id: Date.now(), key: '', value: '' }]);
  };

  const removeField = (index: number) => {
    if (fields.length <= 1) return;
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col h-[calc(100vh-80px)]">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingBlock ? 'Blok Düzenle' : 'Yeni Kroki Bloğu Ekle'}</DialogTitle>
            <DialogDescription>
              Krokinize eklenecek bloğun başlığını ve alanlarını girin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="block-title">Başlık</Label>
              <Input id="block-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Düveler" />
            </div>
            <div className="space-y-2">
              <Label>Alanlar</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Alan Adı (Örn: Adet)"
                    value={field.key}
                    onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                  />
                  <Input
                    placeholder="Değer (Örn: 30)"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeField(index)} disabled={fields.length === 1}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addField}>
                <Plus className="mr-2 h-4 w-4" /> Alan Ekle
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">İptal</Button></DialogClose>
            <Button onClick={handleSave}>{editingBlock ? 'Güncelle' : 'Ekle'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <header className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Çiftlik Krokisi</h1>
          <p className="text-muted-foreground">Sürükle-bırak yöntemiyle çiftliğinizin yerleşim planını oluşturun.</p>
        </div>
        <Button onClick={() => openDialog(null)}>
          <Plus className="mr-2 h-4 w-4" /> Blok Ekle
        </Button>
      </header>

      <div className="flex-grow w-full border-2 border-dashed rounded-lg relative bg-muted/30 overflow-auto">
        {blocks.map((block) => {
          const nodeRef = React.createRef<HTMLDivElement>();
          return (
          <Draggable
            key={block.id}
            nodeRef={nodeRef}
            handle=".drag-handle"
            position={block.position}
            onStop={(e, data) => handleDragStop(e, data, block.id)}
            bounds="parent"
          >
            <div ref={nodeRef} className="absolute bg-card shadow-lg rounded-lg border w-64 cursor-default">
              <CardHeader className="p-2 border-b flex flex-row items-center justify-between bg-muted/50">
                <div className="flex items-center gap-2">
                   <GripVertical className="h-5 w-5 text-muted-foreground cursor-move drag-handle" />
                   <CardTitle className="text-base font-semibold cursor-pointer" onClick={() => openDialog(block)}>{block.title}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteBlock(block.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="p-3 text-sm">
                {block.fields.length > 0 ? (
                  <ul className="space-y-1">
                    {block.fields.map(field => (
                      <li key={field.id} className="flex justify-between">
                        <span className="text-muted-foreground">{field.key}:</span>
                        <span className="font-medium">{field.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-2 cursor-pointer" onClick={() => openDialog(block)}>İçerik ekle...</p>
                )}
              </CardContent>
            </div>
          </Draggable>
        )})}
        {blocks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-muted-foreground">
                    <Map className="w-16 h-16 mx-auto mb-4"/>
                    <p className="font-semibold text-lg">Kroki boş.</p>
                    <p>Başlamak için 'Blok Ekle' düğmesini kullanın.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
