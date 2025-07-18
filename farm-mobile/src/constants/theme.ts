import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#8FBC8F',
    primaryContainer: '#F1F5E8',
    secondary: '#E07A5F',
    secondaryContainer: '#FFF3F0',
    tertiary: '#467546',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5DC',
    background: '#F1F5E8',
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#467546',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#8B2500',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',
    onBackground: '#1C1B1F',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#A5D6A5',
    primaryContainer: '#2E5A2E',
    secondary: '#FFB4A0',
    secondaryContainer: '#5D2F1F',
    tertiary: '#7FB67F',
    surface: '#1C1B1F',
    surfaceVariant: '#49454F',
    background: '#1C1B1F',
    error: '#FFB4AB',
    errorContainer: '#93000A',
    onPrimary: '#003A00',
    onPrimaryContainer: '#C7F2C7',
    onSecondary: '#2D1600',
    onSecondaryContainer: '#FFDBCF',
    onSurface: '#E6E1E5',
    onSurfaceVariant: '#CAC4D0',
    onBackground: '#E6E1E5',
    outline: '#938F99',
    outlineVariant: '#49454F',
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