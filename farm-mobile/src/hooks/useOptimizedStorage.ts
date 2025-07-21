import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

// MMKV instance for fast synchronous storage
const storage = new MMKV();

interface StorageOptions {
  persist?: boolean;
  compress?: boolean;
  encrypt?: boolean;
}

export const useOptimizedStorage = <T>(
  key: string,
  initialValue: T,
  options: StorageOptions = {}
) => {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try MMKV first (faster)
        const mmkvData = storage.getString(key);
        if (mmkvData) {
          setValue(JSON.parse(mmkvData));
          isInitialized.current = true;
          setLoading(false);
          return;
        }

        // Fallback to AsyncStorage for persisted data
        if (options.persist) {
          const asyncData = await AsyncStorage.getItem(key);
          if (asyncData) {
            const parsedData = JSON.parse(asyncData);
            setValue(parsedData);
            // Migrate to MMKV for faster access
            storage.set(key, asyncData);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Storage error');
        console.error(`Storage error for key ${key}:`, err);
      } finally {
        isInitialized.current = true;
        setLoading(false);
      }
    };

    loadData();
  }, [key, options.persist]);

  const updateValue = useCallback(
    async (newValue: T | ((prev: T) => T)) => {
      try {
        setError(null);
        const updatedValue = typeof newValue === 'function' 
          ? (newValue as (prev: T) => T)(value)
          : newValue;

        setValue(updatedValue);

        const serializedValue = JSON.stringify(updatedValue);

        // Always store in MMKV for fast access
        storage.set(key, serializedValue);

        // Also store in AsyncStorage if persistence is enabled
        if (options.persist) {
          await AsyncStorage.setItem(key, serializedValue);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Storage error');
        console.error(`Storage update error for key ${key}:`, err);
      }
    },
    [key, value, options.persist]
  );

  const removeValue = useCallback(async () => {
    try {
      setError(null);
      setValue(initialValue);
      storage.delete(key);
      
      if (options.persist) {
        await AsyncStorage.removeItem(key);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Storage error');
      console.error(`Storage removal error for key ${key}:`, err);
    }
  }, [key, initialValue, options.persist]);

  return {
    value,
    setValue: updateValue,
    removeValue,
    loading,
    error,
    isInitialized: isInitialized.current,
  };
};