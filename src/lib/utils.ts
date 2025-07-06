import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(dateString: string | undefined, locale: string = 'tr-TR'): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString(locale);
  } catch {
    return '-';
  }
}

export function formatDateTime(dateString: string | undefined, locale: string = 'tr-TR'): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleString(locale);
  } catch {
    return '-';
  }
}

// Currency formatting
export function formatCurrency(value: string | number, currency: string = 'TRY', locale: string = 'tr-TR'): string {
  try {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '₺0,00';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(numValue);
  } catch {
    return '₺0,00';
  }
}

// Number formatting
export function formatNumber(value: string | number, locale: string = 'tr-TR'): string {
  try {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '0';
    return new Intl.NumberFormat(locale).format(numValue);
  } catch {
    return '0';
  }
}

// Age calculation
export function calculateAge(birthDate: string): string {
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    
    if (months < 0) months = 0;
    
    return `${years} yaş ${months} ay`;
  } catch {
    return 'Bilinmiyor';
  }
}

// File size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Sanitize string for display
export function sanitizeString(str: string): string {
  return str.replace(/[<>]/g, '');
}

// Check if string is valid URL
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

// Convert feed quantity to kg
export function convertToKg(quantity: string, unit: string): number {
  const qty = parseFloat(quantity);
  if (isNaN(qty)) return 0;
  
  switch (unit) {
    case 'ton':
      return qty * 1000;
    case 'çuval':
      return qty * 50; // Assuming 50kg per sack
    case 'kg':
    default:
      return qty;
  }
}

// Get status badge variant
export function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const statusMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'Aktif': 'default',
    'Hamile': 'secondary',
    'Hasta': 'destructive',
    'Tedavi Altında': 'destructive',
    'İyileşti': 'default',
    'Bekliyor': 'secondary',
    'Devam Ediyor': 'default',
    'Tamamlandı': 'outline',
    'İptal Edildi': 'destructive',
    'Bakımda': 'secondary',
    'Arızalı': 'destructive',
    'Satıldı': 'outline',
    'Öldü': 'destructive',
  };
  
  return statusMap[status] || 'outline';
}

// Get priority badge variant
export function getPriorityVariant(priority: string): "default" | "secondary" | "destructive" {
  const priorityMap: Record<string, "default" | "secondary" | "destructive"> = {
    'Yüksek': 'destructive',
    'Orta': 'default',
    'Düşük': 'secondary',
  };
  
  return priorityMap[priority] || 'secondary';
}

// Error handling utility
export function handleError(error: unknown, fallbackMessage: string = 'Bir hata oluştu'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallbackMessage;
}

// Retry function with exponential backoff
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }
  
  throw lastError!;
}