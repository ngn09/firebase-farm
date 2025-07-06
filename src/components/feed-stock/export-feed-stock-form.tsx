'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FeedItem } from '@/lib/mock-data';

interface ExportFeedStockFormProps {
  feedItems: FeedItem[];
}

export function ExportFeedStockForm({ feedItems }: ExportFeedStockFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<'xlsx' | 'pdf'>('xlsx');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (feedItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Dışa Aktarılacak Veri Yok",
        description: "Lütfen önce yem stoğu ekleyin.",
      });
      return;
    }

    setIsExporting(true);

    try {
        if (format === 'xlsx') {
            const XLSX = await import('xlsx');
            const dataToExport = feedItems.map(({ id, notes, ...rest }) => rest);
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Yem Stoğu');
            XLSX.writeFile(workbook, 'yem-stok-listesi.xlsx');
        } else if (format === 'pdf') {
            const { default: jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');
            const doc = new jsPDF();
            
            doc.text("Yem Stok Listesi", 14, 15);
            
            autoTable(doc, {
                startY: 20,
                head: [['Adı', 'Türü', 'Miktar', 'Birim', 'Tedarikçi', 'Alım Tarihi']],
                body: feedItems.map(item => [
                    item.name,
                    item.type,
                    item.quantity,
                    item.unit,
                    item.supplier || '-',
                    new Date(item.purchaseDate).toLocaleDateString('tr-TR'),
                ]),
                styles: { font: 'helvetica', fontSize: 10 },
                headStyles: { fillColor: [143, 188, 143] },
            });
            doc.save('yem-stok-listesi.pdf');
        }

        toast({
            title: "Dışa Aktarma Başarılı!",
            description: `Yem stok listesi ${format.toUpperCase()} formatında başarıyla indirildi.`,
        });
        setIsOpen(false);
    } catch(error) {
        console.error("Dışa aktarma hatası:", error);
        toast({
            variant: "destructive",
            title: "Eyvah! Bir şeyler ters gitti.",
            description: "Dışa aktarma sırasında bir hata oluştu.",
        });
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Dışa Aktar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verileri Dışa Aktar</DialogTitle>
          <DialogDescription>
            Yem stok listesini Excel (.xlsx) veya PDF formatında dışa aktarmak için bir format seçin.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <Label>Format Seçimi</Label>
            <RadioGroup defaultValue="xlsx" onValueChange={(value: 'xlsx' | 'pdf') => setFormat(value)} className="space-y-2">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="xlsx" id="r1" />
                    <Label htmlFor="r1" className="font-normal">Excel (.xlsx)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id="r2" />
                    <Label htmlFor="r2" className="font-normal">PDF</Label>
                </div>
            </RadioGroup>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isExporting}>İptal</Button>
          </DialogClose>
          <Button onClick={handleExport} disabled={isExporting}>
             {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Dışa Aktar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
