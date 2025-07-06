
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  tagNumber: z.string().min(1, 'Küpe numarası gerekli.'),
  species: z.string().min(1, 'Tür seçimi gerekli.'),
  breed: z.string().min(1, 'Cins gerekli.'),
  gender: z.string().min(1, 'Cinsiyet seçimi gerekli.'),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." }),
  status: z.string().min(1, 'Durum seçimi gerekli.'),
  notes: z.string().optional(),
});

interface AddAnimalFormProps {
  onAnimalAdded: (animal: z.infer<typeof formSchema>) => void;
}

export function AddAnimalForm({ onAnimalAdded }: AddAnimalFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagNumber: '',
      species: '',
      breed: '',
      gender: '',
      birthDate: '',
      status: 'Aktif',
      notes: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    onAnimalAdded(values);
    toast({
      title: "Başarılı!",
      description: `Hayvan (Küpe No: ${values.tagNumber}) başarıyla eklendi.`,
    });
    setIsOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Hayvan Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Yeni Hayvan Ekle</DialogTitle>
          <DialogDescription>
            Yeni bir hayvan eklemek için aşağıdaki bilgileri doldurun.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tagNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Küpe Numarası</FormLabel>
                          <FormControl>
                            <Input placeholder="TR-34001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doğum Tarihi</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="species"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tür</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Bir tür seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="İnek">İnek</SelectItem>
                              <SelectItem value="Koyun">Koyun</SelectItem>
                              <SelectItem value="Keçi">Keçi</SelectItem>
                              <SelectItem value="Tavuk">Tavuk</SelectItem>
                              <SelectItem value="Diğer">Diğer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cins</FormLabel>
                          <FormControl>
                            <Input placeholder="örn. Holstein" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cinsiyet</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Cinsiyet seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Erkek">Erkek</SelectItem>
                              <SelectItem value="Dişi">Dişi</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durum</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Durum seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Aktif">Aktif</SelectItem>
                              <SelectItem value="Hamile">Hamile</SelectItem>
                              <SelectItem value="Hasta">Hasta</SelectItem>
                               <SelectItem value="Satıldı">Satıldı</SelectItem>
                                <SelectItem value="Öldü">Öldü</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2">
                        <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Notlar</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Hayvanla ilgili ek notlar..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">İptal</Button>
                    </DialogClose>
                    <Button type="submit">Hayvanı Kaydet</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
