import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { Animal } from '../types';

const storage = new MMKV();

// Performance optimized storage
const persistStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    storage.set(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

interface AnimalStore {
  animals: Animal[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedStatus: Animal['status'] | 'Tümü';
  sortBy: 'tagNumber' | 'species' | 'birthDate' | 'status';
  sortOrder: 'asc' | 'desc';
  
  // Actions
  addAnimal: (animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnimal: (id: string, updates: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  bulkDeleteAnimals: (ids: string[]) => void;
  bulkUpdateAnimals: (ids: string[], updates: Partial<Animal>) => void;
  getAnimalById: (id: string) => Animal | undefined;
  getAnimalsByStatus: (status: Animal['status']) => Animal[];
  getFilteredAnimals: () => Animal[];
  setSearchQuery: (query: string) => void;
  setSelectedStatus: (status: Animal['status'] | 'Tümü') => void;
  setSorting: (sortBy: AnimalStore['sortBy'], sortOrder: AnimalStore['sortOrder']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAnimals: () => void;
  getStatistics: () => {
    total: number;
    byStatus: Record<Animal['status'], number>;
    bySpecies: Record<string, number>;
    byGender: Record<Animal['gender'], number>;
    averageAge: number;
  };
}

export const useAnimalStore = create<AnimalStore>()(
  subscribeWithSelector((set, get) => {
    // Load initial data from storage
    const initialAnimals = persistStorage.getItem('animals') || [];
    
    return {
      animals: [],
      loading: false,
      error: null,
      searchQuery: '',
      selectedStatus: 'Tümü',
      sortBy: 'tagNumber',
      sortOrder: 'asc',

      addAnimal: (animalData) => {
        const newAnimal: Animal = {
          ...animalData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => {
          const newAnimals = [newAnimal, ...state.animals];
          persistStorage.setItem('animals', newAnimals);
          return {
            animals: newAnimals,
            error: null,
          };
        });
      },

      updateAnimal: (id, updates) => {
        set((state) => {
          const updatedAnimals = state.animals.map((animal) =>
            animal.id === id
              ? { ...animal, ...updates, updatedAt: new Date().toISOString() }
              : animal
          );
          persistStorage.setItem('animals', updatedAnimals);
          return {
            animals: updatedAnimals,
            error: null,
          };
        });
      },

      deleteAnimal: (id) => {
        set((state) => {
          const filteredAnimals = state.animals.filter((animal) => animal.id !== id);
          persistStorage.setItem('animals', filteredAnimals);
          return {
            animals: filteredAnimals,
            error: null,
          };
        });
      },

      bulkDeleteAnimals: (ids) => {
        set((state) => {
          const filteredAnimals = state.animals.filter((animal) => !ids.includes(animal.id));
          persistStorage.setItem('animals', filteredAnimals);
          return {
            animals: filteredAnimals,
            error: null,
          };
        });
      },

      bulkUpdateAnimals: (ids, updates) => {
        set((state) => {
          const updatedAnimals = state.animals.map((animal) =>
            ids.includes(animal.id)
              ? { ...animal, ...updates, updatedAt: new Date().toISOString() }
              : animal
          );
          persistStorage.setItem('animals', updatedAnimals);
          return {
            animals: updatedAnimals,
            error: null,
          };
        });
      },

      getAnimalById: (id) => {
        return get().animals.find((animal) => animal.id === id);
      },

      getAnimalsByStatus: (status) => {
        return get().animals.filter((animal) => animal.status === status);
      },

      getFilteredAnimals: () => {
        const { animals, searchQuery, selectedStatus, sortBy, sortOrder } = get();
        
        let filtered = animals;

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (animal) =>
              animal.tagNumber.toLowerCase().includes(query) ||
              animal.species.toLowerCase().includes(query) ||
              animal.breed.toLowerCase().includes(query)
          );
        }

        // Apply status filter
        if (selectedStatus !== 'Tümü') {
          filtered = filtered.filter((animal) => animal.status === selectedStatus);
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let aValue: any = a[sortBy];
          let bValue: any = b[sortBy];

          if (sortBy === 'birthDate') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          }

          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSelectedStatus: (status) => {
        set({ selectedStatus: status });
      },

      setSorting: (sortBy, sortOrder) => {
        set({ sortBy, sortOrder });
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearAnimals: () => {
        persistStorage.removeItem('animals');
        set({ animals: [] });
      },

      getStatistics: () => {
        const { animals } = get();
        
        const stats = {
          total: animals.length,
          byStatus: {} as Record<Animal['status'], number>,
          bySpecies: {} as Record<string, number>,
          byGender: {} as Record<Animal['gender'], number>,
          averageAge: 0,
        };

        // Initialize counters
        const statuses: Animal['status'][] = ['Aktif', 'Hamile', 'Hasta', 'Satıldı', 'Öldü'];
        const genders: Animal['gender'][] = ['Erkek', 'Dişi'];
        
        statuses.forEach(status => stats.byStatus[status] = 0);
        genders.forEach(gender => stats.byGender[gender] = 0);

        let totalAge = 0;
        
        animals.forEach(animal => {
          // Count by status
          stats.byStatus[animal.status]++;
          
          // Count by species
          stats.bySpecies[animal.species] = (stats.bySpecies[animal.species] || 0) + 1;
          
          // Count by gender
          stats.byGender[animal.gender]++;
          
          // Calculate age
          const birthDate = new Date(animal.birthDate);
          const today = new Date();
          const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                             (today.getMonth() - birthDate.getMonth());
          totalAge += ageInMonths;
        });

        stats.averageAge = animals.length > 0 ? totalAge / animals.length : 0;
        
        return stats;
      },
    };
  })
);