import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animal } from '../types';

interface AnimalStore {
  animals: Animal[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addAnimal: (animal: Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnimal: (id: string, updates: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  getAnimalById: (id: string) => Animal | undefined;
  getAnimalsByStatus: (status: Animal['status']) => Animal[];
  searchAnimals: (query: string) => Animal[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAnimals: () => void;
}

export const useAnimalStore = create<AnimalStore>()(
  persist(
    (set, get) => ({
      animals: [],
      loading: false,
      error: null,

      addAnimal: (animalData) => {
        const newAnimal: Animal = {
          ...animalData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          animals: [newAnimal, ...state.animals],
          error: null,
        }));
      },

      updateAnimal: (id, updates) => {
        set((state) => ({
          animals: state.animals.map((animal) =>
            animal.id === id
              ? { ...animal, ...updates, updatedAt: new Date().toISOString() }
              : animal
          ),
          error: null,
        }));
      },

      deleteAnimal: (id) => {
        set((state) => ({
          animals: state.animals.filter((animal) => animal.id !== id),
          error: null,
        }));
      },

      getAnimalById: (id) => {
        return get().animals.find((animal) => animal.id === id);
      },

      getAnimalsByStatus: (status) => {
        return get().animals.filter((animal) => animal.status === status);
      },

      searchAnimals: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return get().animals.filter(
          (animal) =>
            animal.tagNumber.toLowerCase().includes(lowercaseQuery) ||
            animal.species.toLowerCase().includes(lowercaseQuery) ||
            animal.breed.toLowerCase().includes(lowercaseQuery)
        );
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearAnimals: () => set({ animals: [] }),
    }),
    {
      name: 'animal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);