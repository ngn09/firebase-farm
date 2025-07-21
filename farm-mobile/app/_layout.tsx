import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { lightTheme } from '../src/constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (reduced for mobile)
      retry: 2, // Reduced retries for mobile
      refetchOnWindowFocus: false, // Disable for mobile
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={lightTheme}>
            <StatusBar style="dark" backgroundColor={lightTheme.colors.background} />
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: lightTheme.colors.surface,
                },
                headerTintColor: lightTheme.colors.primary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                headerShadowVisible: false,
                animation: 'slide_from_right',
              },
            >
              <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="animal/[id]" 
                options={{ 
                  title: '🐄 Hayvan Detayı',
                  presentation: 'modal',
                  gestureEnabled: true,
                }} 
              />
              <Stack.Screen 
                name="add-animal" 
                options={{ 
                  title: '➕ Yeni Hayvan Ekle',
                  presentation: 'modal',
                  gestureEnabled: true,
                }} 
              />
            </Stack>
            <Toast />
          </PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}