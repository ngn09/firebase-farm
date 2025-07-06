import { z } from 'zod';

// Animal Data
export const animalSchema = z.object({
  id: z.number().optional(),
  tagNumber: z.string(),
  species: z.string(),
  breed: z.string(),
  gender: z.string(),
  birthDate: z.string(),
  status: z.string(),
  notes: z.string().optional(),
});
export type Animal = z.infer<typeof animalSchema>;


// Feed Stock Data
export const feedItemSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  type: z.string(),
  quantity: z.string(),
  unit: z.string(),
  supplier: z.string().optional(),
  purchaseDate: z.string(),
  notes: z.string().optional(),
});
export type FeedItem = z.infer<typeof feedItemSchema>;


// Health Data
export const healthRecordSchema = z.object({
  id: z.number(),
  animalTag: z.string(),
  date: z.string(),
  diagnosis: z.string(),
  treatment: z.string(),
  status: z.string(),
  veterinarian: z.string(),
  mediaUrls: z.string().optional(),
  notes: z.string().optional(),
});
export type HealthRecord = z.infer<typeof healthRecordSchema>;

// Inventory Data
export const inventoryItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Demirbaş adı gerekli.'),
  category: z.string().min(1, 'Kategori seçimi gerekli.'),
  purchaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." }),
  value: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Geçerli bir değer girin." }),
  status: z.string().min(1, 'Durum seçimi gerekli.'),
  lastMaintenanceDate: z.string().optional(),
  nextMaintenanceDate: z.string().optional(),
  notes: z.string().optional(),
});
export type InventoryItem = z.infer<typeof inventoryItemSchema>;


// Camera Data
export interface Camera {
  id: number;
  name: string;
  url?: string;
  status: 'active' | 'offline';
}

// Task Data
export const taskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır."),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Bitiş tarihi gereklidir."),
  priority: z.enum(['Düşük', 'Orta', 'Yüksek']),
  status: z.enum(['Bekliyor', 'Devam Ediyor', 'Tamamlandı', 'İptal Edildi']),
  assignee: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema>;
