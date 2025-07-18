export interface Animal {
  id: string;
  tagNumber: string;
  species: string;
  breed: string;
  gender: 'Erkek' | 'Dişi';
  birthDate: string;
  status: 'Aktif' | 'Hamile' | 'Hasta' | 'Satıldı' | 'Öldü';
  notes?: string;
  imageUri?: string;
  weight?: number;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  animalId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  status: 'Tedavi Altında' | 'İyileşti' | 'Takip' | 'Öldü';
  veterinarian: string;
  notes?: string;
  imageUris?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FeedItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: 'kg' | 'ton' | 'çuval';
  supplier?: string;
  purchaseDate: string;
  expiryDate?: string;
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'Düşük' | 'Orta' | 'Yüksek';
  status: 'Bekliyor' | 'Devam Ediyor' | 'Tamamlandı' | 'İptal Edildi';
  assignee?: string;
  animalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Yönetici' | 'Veteriner' | 'Bakıcı' | 'İşçi';
  farmId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  ownerId: string;
  logoUri?: string;
  createdAt: string;
  updatedAt: string;
}