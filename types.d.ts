/**
 * Globale Typdeklarationen
 */

// __DEV__ ist eine globale Variable, die von Expo/React Native bereitgestellt wird
declare const __DEV__: boolean;

// Definiere Umgebungsvariablen für TypeScript
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    EXPO_PUBLIC_APP_MODE?: string;
    APP_MODE?: string;
    EXPO_PUBLIC_APP_ENV?: string;
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_API_KEY?: string;
    EXPO_PUBLIC_DEBUG_MODE?: "true" | "false";
    ANDROID_HOME?: string;
    npm_package_version?: string;
  }
}

// Weitere globale Typdefinitionen können hier hinzugefügt werden 

/**
 * Typdeklarationen für Ressourcendateien
 * Diese Datei erlaubt TypeScript, die Importe von Bild- und Schriftartdateien zu verstehen
 */

// Schriftarten
declare module '*.ttf';
declare module '*.otf';

// Bilder
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.webp';

// Andere Medien
declare module '*.mp4';
declare module '*.webm';

// Andere mögliche Ressourcen
declare module '*.json'; 

// Ladekomponenten-Props
interface LoadingComponentProps {
  size?: number | "small" | "large" | undefined;
  color?: string;
}

// Hilfstyp für React-Komponenten mit Kindern
interface WithChildren {
  children: React.ReactNode;
}

// Hilfstyp für eine Funktion ohne Parameter und Rückgabewert
type VoidFunction = () => void;

// Hilfstyp für asynchrone Status
type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

// Hilfstyp für Authentifizierungsstatus
type AuthStatus = "authenticated" | "unauthenticated" | "loading";

// Hilfstyp für eine asynchrone Funktion ohne Parameter und booleschen Rückgabewert
type AsyncBooleanFunction = () => Promise<boolean>;

// Hilfstyp für eine asynchrone Funktion mit Parameter und booleschen Rückgabewert
type AsyncBooleanFunctionWithParam<T> = (param: T) => Promise<boolean>; 