// Application constants - Optimized
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
    TIMEOUT: 5000, // Reduced timeout
  },
} as const;

export const LOCATIONS = [
  { name: 'İstanbul', id: 'istanbul', lat: 41.01, lon: 28.98 },
  { name: 'Ankara', id: 'ankara', lat: 39.93, lon: 32.86 },
  { name: 'İzmir', id: 'izmir', lat: 38.42, lon: 27.14 },
  { name: 'Konya', id: 'konya', lat: 37.87, lon: 32.49 },
] as const;

export const MOCK_USERS = [
  "Ali Veli", 
  "Ayşe Fatma", 
  "Ahmet Yılmaz", 
  "Atanmamış"
] as const;