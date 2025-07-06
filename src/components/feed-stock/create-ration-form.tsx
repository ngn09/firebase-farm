'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FeedItem } from './feed-stock-list';
import type { Ration } from './ration-management-tab';

const formSchema = z.object({
  name: z.string().min(1, 'Rasyon adı gerekli.'),
  animalGroupId: z.string().min(1, 'Hayvan grubu seçimi gerekli.'),
  animalCount: z.coerce.number().min(1, 'Hayvan sayısı en az 1 olmalı.'),
  feedItems: z.array(z.object({
    feedItemId: z.string().min(1, 'Yem seçimi gerekli.'),
    quantity: z.coerce.number().min(0.1, 'Miktar 0\'dan büyük olmalı.'),
  })).min(1, 'En az bir yem öğesi eklenmelidir.'),
});

// Mock data for animal groups - This should be replaced with dynamic data from your backend.
const animalGroups: { id: string, name: string, count: number }[] = [
    { id: 'sut-inekleri', name: 'Süt İnekleri', count: 15 },
    { id: 'besi-danalari', name: 'Besi Danaları', count: 25 },
    { id: 'kuzular', name: 'Kuzular', count: 50 },
];

interface CreateRationFormProps {
  onRationCreated: (ration: Omit<Ration, 'id'>) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  availableFeeds: FeedItem[];
}

export function CreateRationForm({ onRationCreated, isOpen, setIsOpen, availableFeeds }: CreateRationFormProps) {
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState<(typeof animalGroups)[0] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      animalGroupId: '',
      animalCount: 0,
      feedItems: [{ feedItemId: '', quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'feedItems',
  });

  useEffect(() => {
    if (isOpen) {
        const defaultGroup = animalGroups.length > 0 ? animalGroups[0] : null;
        setSelectedGroup(defaultGroup);
        form.reset({
            name: '',
            animalGroupId: defaultGroup?.id || '',
            animalCount: defaultGroup?.count || 0,
            feedItems: [{ feedItemId: '', quantity: 0 }]
        });
    }
  }, [isOpen, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedFeedItems = values.feedItems.map(item => {
        const feed = availableFeeds.find(f => String(f.id) === item.feedItemId);
        return {
            feedItemId: Number(item.feedItemId),
            name: feed?.name || 'Bilinmeyen Yem',
            quantity: item.quantity
        }
    });

    const newRation: Omit<Ration, 'id'> = {
      name: values.name,
      animalCount: values.animalCount,
      autoDeduct: false,
      feedItems: selectedFeedItems,
    };

    onRationCreated(newRation);
    toast({
      title: "Başarılı!",
      description: `"${values.name}" rasyonu başarıyla oluşturuldu.`,
    });
    setIsOpen(false);
  }

  const handleGroupChange = (groupId: string) => {
    const group = animalGroups.find(g => g.id === groupId);
    if(group) {
        setSelectedGroup(group);
        form.setValue('animalCount', group.count);
        form.setValue('animalGroupId', group.id);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Yeni Rasyon Oluştur</DialogTitle>
          <DialogDescription>
            Hayvan grubu için günlük yem rasyonu oluşturun.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rasyon Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Süt İneği Günlük Rasyonu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="animalGroupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hayvan Grubu</FormLabel>
                  <Select onValueChange={handleGroupChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Bir hayvan grubu seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {animalGroups.length === 0 && <SelectItem value="-" disabled>Hayvan grubu bulunamadı</SelectItem>}
                      {animalGroups.map(group => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.count} hayvan)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Card className="bg-muted/30">
                <CardContent className="p-4">
                    <FormLabel>Hayvan Sayısı Güncelle</FormLabel>
                     <div className="flex items-center gap-4 mt-2">
                        <FormField
                            control={form.control}
                            name="animalCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="number" className="w-24" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <span className="text-sm text-muted-foreground">Mevcut: {selectedGroup?.count ?? 0} hayvan</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex-row items-center justify-between p-4">
                    <CardTitle className="text-lg">Yem Öğeleri</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ feedItemId: '', quantity: 0 })}>
                        <Plus className="mr-2 h-4 w-4" /> Yem Ekle
                    </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                   {fields.map((field, index) => (
                     <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name={`feedItems.${index}.feedItemId`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Yem</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Yem seçin" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableFeeds.length === 0 && <SelectItem value="-" disabled>Stokta yem bulunamadı</SelectItem>}
                                                {availableFeeds.map(feed => (
                                                    <SelectItem key={feed.id} value={String(feed.id)}>
                                                        {feed.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-40">
                             <FormField
                                control={form.control}
                                name={`feedItems.${index}.quantity`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Miktar (kg/gün)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                   ))}
                </CardContent>
            </Card>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">İptal</Button>
              </DialogClose>
              <Button type="submit">Oluştur</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
