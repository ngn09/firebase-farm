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
import type { Animal, HealthRecord } from '@/lib/mock-data';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  animalTag: z.string().min(1, 'Hayvan seçimi gerekli.'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." }),
  diagnosis: z.string().min(1, 'Teşhis gerekli.'),
  treatment: z.string().min(1, 'Tedavi bilgisi gerekli.'),
  veterinarian: z.string().min(1, 'Veteriner adı gerekli.'),
  status: z.string().min(1, 'Durum seçimi gerekli.'),
  mediaUrls: z.string().optional(),
  notes: z.string().optional(),
});

interface AddExaminationFormProps {
  onExaminationAdded: (examination: Omit<HealthRecord, 'id'>) => void;
  animals: Animal[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AddExaminationForm({ onExaminationAdded, animals, isOpen, setIsOpen }: AddExaminationFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      animalTag: '',
      date: '',
      diagnosis: '',
      treatment: '',
      veterinarian: '',
      status: 'Tedavi Altında',
      mediaUrls: '',
      notes: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onExaminationAdded(values);
    toast({
      title: "Başarılı!",
      description: `Muayene kaydı başarıyla eklendi.`,
    });
    setIsOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Yeni Muayene Ekle</DialogTitle>
          <DialogDescription>
            Hayvan için yeni bir sağlık kaydı oluşturun.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="animalTag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hayvan (Küpe No)</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Bir hayvan seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {animals.map(animal => (
                                <SelectItem key={animal.id} value={animal.tagNumber}>
                                    {animal.tagNumber} ({animal.species})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Muayene Tarihi</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teşhis</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Hayvanın teşhisi..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uygulanan Tedavi</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Uygulanan tedavi veya ilaçlar..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="veterinarian"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Veteriner</FormLabel>
                          <FormControl>
                            <Input placeholder="Veterinerin adı" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vaka Durumu</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Durum seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Tedavi Altında">Tedavi Altında</SelectItem>
                              <SelectItem value="İyileşti">İyileşti</SelectItem>
                              <SelectItem value="Takip">Takip</SelectItem>
                              <SelectItem value="Öldü">Öldü</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
                 <FormField
                  control={form.control}
                  name="mediaUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Görsel/Video URL'leri (virgülle ayırın)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://ornek.com/resim.jpg, https://ornek.com/video.mp4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Veya Cihazdan Yükle</Label>
                  <Input id="file-upload" type="file" multiple accept="image/*,video/*" />
                </div>
                 <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ek Notlar</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Muayene ile ilgili ek notlar..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">İptal</Button>
                    </DialogClose>
                    <Button type="submit">Kaydı Oluştur</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
