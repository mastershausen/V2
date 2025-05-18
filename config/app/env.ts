/**
 * Umgebungskonfiguration für die Solvbox App
 * 
 * Diese Datei enthält nur statische Konfigurationsparameter und DARF KEINE
 * Abhängigkeiten zu Stores oder anderen Laufzeitkomponenten haben.
 * Für dynamische Konfigurationen, siehe runtime.ts.
 */

// Lokale Definition statt Import, um zyklische Abhängigkeiten zu vermeiden
export type AppMode = 'development' | 'demo' | 'live';

// Verwende den EnvHelper statt serviceHelper.ts, um zirkuläre Abhängigkeiten zu vermeiden
import { APP_MODES, checkDemoMode } from './envHelper';

// Re-exportiere die Modi-Konstanten
export { APP_MODES };

// Konfiguration für die App je nach Modus
export interface AppConfig {
  apiBaseUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  useMockData: boolean;
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
  demoButtonVisible: boolean;
  autoLoginDemo: boolean;
  defaultDemoUserId: string;
}

// Konfigurationen für die verschiedenen Modi
const configs: Record<AppMode, AppConfig> = {
  // Entwicklungsumgebung: Für lokale Entwicklung
  development: {
    apiBaseUrl: 'http://localhost:3000',
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'dummy-key-for-development',
    useMockData: true,
    enableAnalytics: false,
    enableCrashReporting: false,
    demoButtonVisible: true,
    autoLoginDemo: false,
    defaultDemoUserId: 'demo-user'
  },
  
  // Demo-Umgebung: Für App-Store-Reviews und Testbenutzer
  demo: {
    apiBaseUrl: 'https://api.demo.solvbox.com',
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'dummy-key-for-demo',
    useMockData: true,
    enableAnalytics: false,
    enableCrashReporting: false,
    demoButtonVisible: false,
    autoLoginDemo: true,
    defaultDemoUserId: 'demo-user'
  },
  
  // Live-Umgebung (Production): Live-System
  live: {
    apiBaseUrl: 'https://api.solvbox.com',
    supabaseUrl: 'https://production.supabase.co',
    supabaseAnonKey: 'production-key',
    useMockData: false,
    enableAnalytics: true,
    enableCrashReporting: true,
    demoButtonVisible: false,
    autoLoginDemo: false,
    defaultDemoUserId: 'demo-user'
  }
};

// Variable für den überschriebenen App-Modus (wird nur im Entwicklungsmodus verwendet)
let overriddenAppMode: AppMode | null = null;

/**
 * Setzt den überschriebenen App-Modus
 * Diese Funktion ist nur im Entwicklungsmodus verfügbar und wird vom Debug-Modul verwendet.
 * @param {AppMode | null} mode - Der zu setzende App-Modus oder null für Zurücksetzung
 */
export function _setOverriddenAppMode(mode: AppMode | null): void {
  if (__DEV__) {
    const oldMode = overriddenAppMode;
    overriddenAppMode = mode;
    
    if (oldMode !== mode) {
      // eslint-disable-next-line no-console
      console.log(`[ENV] App-Modus überschrieben: ${mode || 'deaktiviert'} (war: ${oldMode || 'nicht überschrieben'})`);
    }
  }
}

// Aktueller App-Modus, kann durch Umgebungsvariablen beeinflusst werden
export const appMode: AppMode = 
  overriddenAppMode ||
  ((process.env.EXPO_PUBLIC_APP_ENV || process.env.APP_ENV) as AppMode) || 
  'development';

// Aktuelle Konfiguration basierend auf App-Modus
export const config = configs[appMode];

/**
 * Prüft, ob Mock-Daten verwendet werden sollen
 * STATISCHE VERSION - Für die laufzeitbasierte Version siehe runtime.ts
 * @returns {boolean} true, wenn Mock-Daten verwendet werden sollen
 */
export function shouldUseMockData() {
  return config.useMockData;
}

/**
 * Prüft, ob die App im Entwicklungsmodus läuft
 * @returns {boolean} true, wenn im Entwicklungsmodus
 */
export function isDevelopmentMode(): boolean {
  return __DEV__;
}

/**
 * Prüft, ob die App im Demo-Modus läuft
 * STATISCHE VERSION - Für die laufzeitbasierte Version siehe runtime.ts
 * @returns {boolean} true, wenn im Demo-Modus basierend auf Umgebungsvariablen
 */
export function isDemoMode(): boolean {
  return checkDemoMode();
}

// Export für Modultests und erweiterte Konfiguration
export const allConfigs = configs;
