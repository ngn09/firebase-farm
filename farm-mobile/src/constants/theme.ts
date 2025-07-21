import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Farm-themed colors
const farmColors = {
  // Primary - Earthy Green
  primary: '#4A7C59',
  primaryLight: '#6B9B7A',
  primaryDark: '#2E5233',
  
  // Secondary - Warm Orange (for livestock)
  secondary: '#D2691E',
  secondaryLight: '#E6904E',
  secondaryDark: '#A0520D',
  
  // Accent - Sky Blue (for freshness)
  accent: '#87CEEB',
  accentLight: '#B0E0E6',
  accentDark: '#4682B4',
  
  // Status colors
  success: '#228B22',
  warning: '#FFD700',
  error: '#DC143C',
  info: '#4169E1',
  
  // Neutral colors
  background: '#F5F5DC', // Beige
  surface: '#FFFFFF',
  surfaceVariant: '#F0F8E8',
  outline: '#8B7355',
  
  // Text colors
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onSurface: '#2F4F2F',
  onSurfaceVariant: '#556B2F',
  onBackground: '#2F4F2F',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: farmColors.primary,
    primaryContainer: farmColors.surfaceVariant,
    secondary: farmColors.secondary,
    secondaryContainer: '#FFF3E0',
    tertiary: farmColors.accent,
    surface: farmColors.surface,
    surfaceVariant: farmColors.surfaceVariant,
    background: farmColors.background,
    error: farmColors.error,
    errorContainer: '#FFEBEE',
    onPrimary: farmColors.onPrimary,
    onPrimaryContainer: farmColors.onSurface,
    onSecondary: farmColors.onSecondary,
    onSecondaryContainer: farmColors.onSurface,
    onSurface: farmColors.onSurface,
    onSurfaceVariant: farmColors.onSurfaceVariant,
    onBackground: farmColors.onBackground,
    outline: farmColors.outline,
    outlineVariant: '#D3C4B2',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: farmColors.primaryLight,
    primaryContainer: farmColors.primaryDark,
    secondary: farmColors.secondaryLight,
    secondaryContainer: farmColors.secondaryDark,
    tertiary: farmColors.accentLight,
    surface: '#1A1A1A',
    surfaceVariant: '#2A2A2A',
    background: '#121212',
    error: '#FF6B6B',
    errorContainer: farmColors.error,
    onPrimary: '#000000',
    onPrimaryContainer: '#E8F5E8',
    onSecondary: '#000000',
    onSecondaryContainer: '#FFE4CC',
    onSurface: '#E8E8E8',
    onSurfaceVariant: '#C8C8C8',
    onBackground: '#E8E8E8',
    outline: '#A8A8A8',
    outlineVariant: '#484848',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};