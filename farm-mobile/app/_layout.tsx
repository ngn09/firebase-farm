import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { lightTheme } from '../src/constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={lightTheme}>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: lightTheme.colors.primary,
              },
              headerTintColor: 'white',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="(tabs)" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="animal/[id]" 
              options={{ 
                title: 'Hayvan Detayı',
                presentation: 'modal' 
              }} 
            />
            <Stack.Screen 
              name="add-animal" 
              options={{ 
                title: 'Yeni Hayvan Ekle',
                presentation: 'modal' 
              }} 
            />
          </Stack>
          <Toast />
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}