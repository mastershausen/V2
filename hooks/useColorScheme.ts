import { useColorScheme as _useColorScheme } from 'react-native';

/**
 *
 */
export function useColorScheme(): 'light' | 'dark' {
  // Wir überschreiben den Standard-Hook und geben immer 'light' zurück
  return 'light';
}
