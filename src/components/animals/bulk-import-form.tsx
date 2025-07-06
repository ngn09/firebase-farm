'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { extractAnimalsFromDocument } from '@/ai/flows/extract-animals-from-document';
import type { Animal } from '@/lib/mock-data';

interface BulkImportFormProps {
    onAnimalsImported: (animals: Omit<Animal, 'id'>[]) => void;
}

export function BulkImportForm({ onAnimalsImported }: BulkImportFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Geçersiz Dosya Türü",
          description: "Lütfen bir Excel (.xlsx) veya PDF dosyası seçin.",
        });
        setFile(null);
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Dosya Seçilmedi",
        description: "Lütfen içe aktarmak için bir dosya seçin.",
      });
      return;
    }
    
    setIsImporting(true);

    const readFileAsDataURL = (fileToRead: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(fileToRead);
      });
    };

    try {
      const documentDataUri = await readFileAsDataURL(file);
      const result = await extractAnimalsFromDocument({ documentDataUri });

      if (result.animals && result.animals.length > 0) {
        onAnimalsImported(result.animals);
      } else {
        toast({
            variant: "destructive",
            title: "Hayvan Bulunamadı",
            description: "Belgede ayrıştırılacak hayvan kaydı bulunamadı veya dosya boş.",
        });
      }

    } catch (error) {
        console.error("İçe aktarma hatası:", error);
        toast({
            variant: "destructive",
            title: "Eyvah! Bir şeyler ters gitti.",
            description: "Dosya işlenirken bir hata oluştu. Dosya formatını veya içeriğini kontrol edin.",
        });
    } finally {
        setIsImporting(false);
        setIsOpen(false);
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Toplu İçe Aktar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Toplu Hayvan İçe Aktarma</DialogTitle>
          <DialogDescription>
             Excel (.xlsx) veya PDF dosyası kullanarak birden çok hayvanı aynı anda içe aktarın.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2 text-sm">Dosya Formatı Bilgisi</h4>
                <p className="text-sm text-muted-foreground mb-3">
                   Excel (.xlsx) veya PDF dosyası yükleyebilirsiniz. Dosyanızda şu sütunlar bulunmalıdır:
                </p>
                <ul className="space-y-1 text-sm list-disc list-inside">
                    <li><span className="font-semibold">Küpe No:</span> Hayvanın benzersiz kimlik numarası</li>
                    <li><span className="font-semibold">Tür:</span> İnek, Koyun, Keçi, Tavuk, Diğer</li>
                    <li><span className="font-semibold">Cins:</span> Hayvan cinsi (örn: Holstein)</li>
                    <li><span className="font-semibold">Cinsiyet:</span> Erkek, Dişi</li>
                    <li><span className="font-semibold">Doğum Tarihi:</span> YYYY-MM-DD formatında (örn: 2023-01-15)</li>
                    <li><span className="font-semibold">Durum:</span> Aktif, Hamile, Hasta (opsiyonel, varsayılan: Aktif)</li>
                </ul>
            </div>
            <div className="space-y-2">
                <Label htmlFor="file-upload">Dosya Seç</Label>
                <div 
                    className="flex items-center justify-center w-full p-2 border-2 border-dashed rounded-lg cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Input id="file-upload" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.pdf" />
                    <span className="text-sm text-muted-foreground">{file ? file.name : "Dosya Seç veya Sürükle Bırak"}</span>
                </div>
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">İptal</Button>
          </DialogClose>
          <Button onClick={handleImport} disabled={!file || isImporting}>
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Hayvanları İçe Aktar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
