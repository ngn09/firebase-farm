// Application constants
export const APP_CONFIG = {
  NAME: 'Çiftlik Asistanı',
  VERSION: '1.0.0',
  STORAGE_KEYS: {
    FARM_NAME: 'farmName',
    FARM_LOGO: 'farmLogo',
    ANIMALS: 'farm-animals',
    ARCHIVED_ANIMALS: 'farm-archived-animals',
    FEED_STOCK: 'farm-feed-stock',
    HEALTH_RECORDS: 'farm-health-records',
    ARCHIVED_HEALTH_RECORDS: 'farm-archived-health-records',
    INVENTORY: 'farm-inventory',
    ARCHIVED_INVENTORY: 'farm-archived-inventory',
    TASKS: 'farm-tasks',
    ARCHIVED_TASKS: 'farm-archived-tasks',
    CAMERAS: 'farm-cameras',
    USERS: 'farm-users',
    ACTIVE_RATIONS: 'farm-active-rations',
    ARCHIVED_RATIONS: 'farm-archived-rations',
    SELECTED_LOCATION: 'selectedLocation',
    SIDEBAR_COLLAPSED: 'sidebar-collapsed',
  },
  LIMITS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_ANIMALS: 1000,
    MAX_FEED_ITEMS: 500,
    MAX_INVENTORY_ITEMS: 500,
  },
  WEATHER_API: {
    BASE_URL: 'https://api.open-meteo.com/v1/forecast',
    TIMEOUT: 10000,
  },
} as const;

export const LOCATIONS = [
  { name: 'İstanbul', id: 'istanbul', lat: 41.01, lon: 28.98 },
  { name: 'Ankara', id: 'ankara', lat: 39.93, lon: 32.86 },
  { name: 'İzmir', id: 'izmir', lat: 38.42, lon: 27.14 },
  { name: 'Konya', id: 'konya', lat: 37.87, lon: 32.49 },
  { name: 'Bursa', id: 'bursa', lat: 40.18, lon: 29.06 },
  { name: 'Antalya', id: 'antalya', lat: 36.88, lon: 30.70 },
] as const;

export const MOCK_USERS = [
  "Ali Veli", 
  "Ayşe Fatma", 
  "Ahmet Yılmaz", 
  "Mehmet Demir",
  "Fatma Kaya",
  "Atanmamış"
] as const;

export const ROLES_WITH_DESCRIPTIONS = {
  'Yönetici': 'Tüm yönetim ve ayar yetkilerine sahiptir.',
  'Veteriner': 'Hayvan sağlığı kayıtlarına erişebilir ve düzenleyebilir.',
  'Bakıcı': 'Hayvanların günlük bakım ve görevlerini yönetir.',
  'İşçi': 'Atanan görevleri ve temel çiftlik bilgilerini görüntüler.',
} as const;

export const ANIMAL_GROUPS = [
  { id: 'sut-inekleri', name: 'Süt İnekleri', count: 15 },
  { id: 'besi-danalari', name: 'Besi Danaları', count: 25 },
  { id: 'kuzular', name: 'Kuzular', count: 50 },
  { id: 'keciler', name: 'Keçiler', count: 30 },
  { id: 'tavuklar', name: 'Tavuklar', count: 100 },
] as const;