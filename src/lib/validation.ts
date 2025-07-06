import { z } from 'zod';

// Enhanced validation schemas with better error messages
export const animalSchema = z.object({
  id: z.number().optional(),
  tagNumber: z.string()
    .min(1, 'Küpe numarası gerekli.')
    .max(50, 'Küpe numarası çok uzun.')
    .regex(/^[A-Z0-9-]+$/, 'Küpe numarası sadece büyük harf, rakam ve tire içerebilir.'),
  species: z.string().min(1, 'Tür seçimi gerekli.'),
  breed: z.string().min(1, 'Cins gerekli.').max(100, 'Cins adı çok uzun.'),
  gender: z.enum(['Erkek', 'Dişi'], { errorMap: () => ({ message: 'Geçerli bir cinsiyet seçin.' }) }),
  birthDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." })
    .refine((date) => new Date(date) <= new Date(), { message: "Doğum tarihi gelecekte olamaz." }),
  status: z.enum(['Aktif', 'Hamile', 'Hasta', 'Satıldı', 'Öldü'], {
    errorMap: () => ({ message: 'Geçerli bir durum seçin.' })
  }),
  notes: z.string().max(500, 'Notlar çok uzun.').optional(),
});

export const feedItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Yem adı gerekli.').max(100, 'Yem adı çok uzun.'),
  type: z.enum(['Kaba Yem', 'Konsantre Yem', 'Tahıl', 'Vitamin/Mineral', 'Diğer'], {
    errorMap: () => ({ message: 'Geçerli bir yem türü seçin.' })
  }),
  quantity: z.string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Geçerli bir miktar girin." })
    .refine(val => parseFloat(val) <= 10000, { message: "Miktar çok büyük." }),
  unit: z.enum(['kg', 'ton', 'çuval'], {
    errorMap: () => ({ message: 'Geçerli bir birim seçin.' })
  }),
  supplier: z.string().max(100, 'Tedarikçi adı çok uzun.').optional(),
  purchaseDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." })
    .refine((date) => new Date(date) <= new Date(), { message: "Alım tarihi gelecekte olamaz." }),
  notes: z.string().max(500, 'Notlar çok uzun.').optional(),
});

export const healthRecordSchema = z.object({
  id: z.number(),
  animalTag: z.string().min(1, 'Hayvan seçimi gerekli.'),
  date: z.string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." })
    .refine((date) => new Date(date) <= new Date(), { message: "Muayene tarihi gelecekte olamaz." }),
  diagnosis: z.string().min(1, 'Teşhis gerekli.').max(500, 'Teşhis çok uzun.'),
  treatment: z.string().min(1, 'Tedavi bilgisi gerekli.').max(500, 'Tedavi bilgisi çok uzun.'),
  status: z.enum(['Tedavi Altında', 'İyileşti', 'Takip', 'Öldü'], {
    errorMap: () => ({ message: 'Geçerli bir durum seçin.' })
  }),
  veterinarian: z.string().min(1, 'Veteriner adı gerekli.').max(100, 'Veteriner adı çok uzun.'),
  mediaUrls: z.string().url('Geçerli bir URL girin.').optional().or(z.literal('')),
  notes: z.string().max(500, 'Notlar çok uzun.').optional(),
});

export const inventoryItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Demirbaş adı gerekli.').max(100, 'Demirbaş adı çok uzun.'),
  category: z.enum(['Ekipman', 'Araç', 'Bina', 'Arazi', 'Diğer'], {
    errorMap: () => ({ message: 'Geçerli bir kategori seçin.' })
  }),
  purchaseDate: z.string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." })
    .refine((date) => new Date(date) <= new Date(), { message: "Alım tarihi gelecekte olamaz." }),
  value: z.string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Geçerli bir değer girin." })
    .refine(val => parseFloat(val) <= 10000000, { message: "Değer çok büyük." }),
  status: z.enum(['Aktif', 'Bakımda', 'Arızalı', 'Satıldı'], {
    errorMap: () => ({ message: 'Geçerli bir durum seçin.' })
  }),
  lastMaintenanceDate: z.string()
    .refine((date) => date === '' || !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." })
    .optional(),
  nextMaintenanceDate: z.string()
    .refine((date) => date === '' || !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." })
    .optional(),
  notes: z.string().max(500, 'Notlar çok uzun.').optional(),
});

export const taskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır.").max(100, 'Başlık çok uzun.'),
  description: z.string().max(500, 'Açıklama çok uzun.').optional(),
  dueDate: z.string()
    .min(1, "Bitiş tarihi gereklidir.")
    .refine((date) => !isNaN(Date.parse(date)), { message: "Geçerli bir tarih girin." }),
  priority: z.enum(['Düşük', 'Orta', 'Yüksek'], {
    errorMap: () => ({ message: 'Geçerli bir öncelik seçin.' })
  }),
  status: z.enum(['Bekliyor', 'Devam Ediyor', 'Tamamlandı', 'İptal Edildi'], {
    errorMap: () => ({ message: 'Geçerli bir durum seçin.' })
  }),
  assignee: z.string().max(100, 'Sorumlu kişi adı çok uzun.').optional(),
});

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Ad soyad gerekli.').max(100, 'Ad soyad çok uzun.'),
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  role: z.enum(['Yönetici', 'Veteriner', 'Bakıcı', 'İşçi'], {
    errorMap: () => ({ message: 'Geçerli bir rol seçin.' })
  }),
  status: z.enum(['Aktif', 'Pasif'], {
    errorMap: () => ({ message: 'Geçerli bir durum seçin.' })
  }),
});

// File validation
export const validateFile = (file: File, maxSize: number = 10 * 1024 * 1024) => {
  const errors: string[] = [];
  
  if (file.size > maxSize) {
    errors.push(`Dosya boyutu ${Math.round(maxSize / 1024 / 1024)}MB'dan küçük olmalıdır.`);
  }
  
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'video/mp4',
    'video/webm'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Desteklenmeyen dosya türü.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export types
export type Animal = z.infer<typeof animalSchema>;
export type FeedItem = z.infer<typeof feedItemSchema>;
export type HealthRecord = z.infer<typeof healthRecordSchema>;
export type InventoryItem = z.infer<typeof inventoryItemSchema>;
export type Task = z.infer<typeof taskSchema>;
export type User = z.infer<typeof userSchema>;