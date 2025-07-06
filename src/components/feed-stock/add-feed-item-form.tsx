'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Yem adı gerekli.'),
  type: z.string().min(1, 'Yem türü gerekli.'),
  quantity: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Geçerli bir miktar girin." }),
  unit: z.string().min(1, 'Birim seçimi gerekli.'),
  supplier: z.string().optional(),
  purchaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." }),
  notes: z.string().optional(),
});

interface AddFeedItemFormProps {
  onItemAdded: (item: z.infer<typeof formSchema>) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AddFeedItemForm({ onItemAdded, isOpen, setIsOpen }: AddFeedItemFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: '',
      quantity: '0',
      unit: '',
      supplier: '',
      purchaseDate: '',
      notes: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onItemAdded(values);
    toast({
      title: "Başarılı!",
      description: `${values.name} stoğa başarıyla eklendi.`,
    });
    setIsOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Yeni Yem Ekle</DialogTitle>
          <DialogDescription>
            Stoğa yeni bir yem eklemek için bilgileri doldurun.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Yem Adı</FormLabel><FormControl><Input placeholder="Örn: Mısır Silajı" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="type" render={({ field }) => ( <FormItem><FormLabel>Yem Türü</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Bir tür seçin" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Kaba Yem">Kaba Yem</SelectItem><SelectItem value="Konsantre Yem">Konsantre Yem</SelectItem><SelectItem value="Tahıl">Tahıl</SelectItem><SelectItem value="Vitamin/Mineral">Vitamin/Mineral</SelectItem><SelectItem value="Diğer">Diğer</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="quantity" render={({ field }) => ( <FormItem><FormLabel>Miktar</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="unit" render={({ field }) => ( <FormItem><FormLabel>Birim</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Bir birim seçin" /></SelectTrigger></FormControl><SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="ton">ton</SelectItem><SelectItem value="çuval">çuval</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="supplier" render={({ field }) => ( <FormItem><FormLabel>Tedarikçi (İsteğe Bağlı)</FormLabel><FormControl><Input placeholder="Tedarikçi adı" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="purchaseDate" render={({ field }) => ( <FormItem><FormLabel>Alım Tarihi</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="notes" render={({ field }) => ( <FormItem><FormLabel>Notlar (İsteğe Bağlı)</FormLabel><FormControl><Textarea placeholder="Yemle ilgili ek notlar..." {...field} /></FormControl><FormMessage /></FormItem>)} />

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">İptal</Button>
                    </DialogClose>
                    <Button type="submit">Stoğa Ekle</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
