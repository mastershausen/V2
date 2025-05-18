# Neue Kernstruktur des Mode-Systems

Dieses Dokument definiert die neue, verbesserte Struktur des Mode-Systems, das alle Redundanzen eliminiert und eine klare Trennung der Konzepte bietet.

## 1. Typdefinitionen

```typescript
/**
 * @file features/mode/types.ts
 * @description Kern-Typdefinitionen für das vereinfachte Mode-System
 */

/**
 * Die grundlegenden Betriebsmodi der App
 * - demo: Simulierte Daten, keine echte Backend-Kommunikation
 * - live: Echte Daten, vollständige Backend-Kommunikation
 */
export type AppMode = "demo" | "live";

/**
 * Der Status des Benutzers im System
 * - authenticated: Vollständig authentifizierter Benutzer mit allen Berechtigungen
 * - demo: Benutzer mit eingeschränkten Demo-Berechtigungen
 * - guest: Nicht eingeloggter Benutzer mit minimalen Berechtigungen
 */
export type UserStatus = "authenticated" | "demo" | "guest";

/**
 * Fehlertypen bei Mode-Operationen
 */
export type ModeErrorType =
  | "network_error" // Netzwerkprobleme
  | "auth_required" // Authentifizierung erforderlich
  | "permission_denied" // Keine Berechtigung für diese Operation
  | "invalid_state" // Ungültiger Zustandsübergang
  | "unknown"; // Unbekannter Fehler
```

## 2. Store-Interface

```typescript
/**
 * @file features/mode/stores/types.ts
 * @description Interface-Definitionen für den Mode-Store
 */

import { AppMode, ModeErrorType, UserStatus } from "../types";

/**
 * Primitive Grundzustände des Mode-Systems
 * Nur absolute Basisdaten, keine abgeleiteten Werte
 */
export interface ModeState {
  // Grundlegende Modi
  appMode: AppMode; // Aktueller Betriebsmodus der App
  userStatus: UserStatus; // Aktueller Status des Benutzers

  // Operative Zustände
  isTransitioning: boolean; // Ob gerade ein Moduswechsel stattfindet

  // Fehlertracking
  lastError: string | null; // Letzte Fehlermeldung
  lastErrorType: ModeErrorType | null; // Letzter Fehlertyp
  lastModeChange: string | null; // Timestamp des letzten Moduswechsels
}

/**
 * Aktionen für den Mode-Store
 * Reine Funktionen, die Zustandsübergänge auslösen
 */
export interface ModeActions {
  // Basisfunktionen für Moduswechsel
  setAppMode: (mode: AppMode) => Promise<boolean>;
  setUserStatus: (status: UserStatus) => Promise<boolean>;

  // Store-Management
  resetError: () => void;
  initializeStore: () => void;
}

/**
 * Gesamtdefinition des Mode-Stores
 * Vereint Zustand und Aktionen
 */
export type ModeStore = ModeState & ModeActions;
```

## 3. Hook-Interface

```typescript
/**
 * @file features/mode/hooks/types.ts
 * @description Interface-Definitionen für den Mode-Hook
 */

import { AppMode, ModeErrorType, UserStatus } from "../types";
import { UserMode } from "../compat/types";
import { AppStateStatus } from "react-native";

/**
 * Rückgabetyp für eine Modus-Änderungsoperation
 */
export interface ModeChangeResult {
  success: boolean; // Ob die Operation erfolgreich war
  currentMode: AppMode; // Der aktuelle Modus nach der Operation
  requiresAuth: boolean; // Ob Authentifizierung benötigt wird
  error?: string; // Optionale Fehlermeldung
  errorType?: ModeErrorType; // Optionaler Fehlertyp
}

/**
 * Rückgabetyp für den primären useAppMode Hook
 * Enthält alle notwendigen Funktionen und Zustände
 */
export interface UseAppModeResult {
  // Primitive Grundzustände (direkt aus dem Store)
  appMode: AppMode; // Aktueller App-Modus
  userStatus: UserStatus; // Aktueller Benutzerstatus
  isTransitioning: boolean; // Ob ein Moduswechsel stattfindet
  lastError: string | null; // Letzte Fehlermeldung

  // Abgeleitete Zustandswerte (berechnet im Hook)
  isDemoMode: () => boolean; // Funktion zur Prüfung, ob Demo-Modus aktiv ist
  isLiveMode: () => boolean; // Funktion zur Prüfung, ob Live-Modus aktiv ist
  isAuthenticated: boolean; // Ob Benutzer authentifiziert ist
  isDemoUser: boolean; // Ob Benutzer ein Demo-Benutzer ist
  isGuest: boolean; // Ob Benutzer ein Gast ist

  // Feature-Flags (berechnet im Hook)
  usesMockData: boolean; // Ob die App Mock-Daten verwendet
  showsDebugButtons: boolean; // Ob Debug-Buttons angezeigt werden

  // Status-Informationen (berechnet oder extern bezogen)
  canSwitchModes: boolean; // Ob Moduswechsel möglich ist
  hasNetworkConnection: boolean; // Ob eine Netzwerkverbindung besteht
  appState: AppStateStatus; // Aktueller App-Status (aktiv, Hintergrund, etc.)

  // Aktionen
  setMode: (mode: AppMode) => Promise<ModeChangeResult>;
  setUserStatus: (status: UserStatus) => Promise<boolean>;
  switchToDemoMode: () => Promise<ModeChangeResult>;
  switchToLiveMode: () => Promise<ModeChangeResult>;

  // Hilfsfunktionen
  resetError: () => void;
  getModeDisplayName: (mode: AppMode) => string;
}

/**
 * Rückgabetyp für eine Modus-Wechsel-Operation im erweiterten Manager
 */
export interface SwitchModeResult {
  success: boolean; // Ob die Operation erfolgreich war
  newMode: AppMode; // Der neue Modus nach der Operation
  requiresAuth: boolean; // Ob Authentifizierung benötigt wird
  error?: string; // Optionale Fehlermeldung
}

/**
 * Rückgabetyp für den erweiterten useModeManager-Hook
 * Bietet zusätzliche Funktionalität für komplexere Anwendungsfälle
 */
export interface UseModeManagerResult {
  // Basis-Zustände (von useMode)
  currentAppMode: AppMode; // Der aktuelle App-Modus
  currentUserMode: UserMode; // Der aktuelle Benutzer-Modus
  isDemoMode: () => boolean; // Funktion zur Prüfung, ob Demo-Modus aktiv ist
  isLiveMode: () => boolean; // Funktion zur Prüfung, ob Live-Modus aktiv ist
  isDemoAccount: boolean; // Ob ein Demo-Account verwendet wird
  isChangingMode: boolean; // Ob gerade ein Moduswechsel stattfindet

  // Erweiterte Zustandsinformationen
  isSessionValid: boolean; // Ob die aktuelle Session gültig ist
  isLoggingIn: boolean; // Ob gerade ein Login-Vorgang stattfindet
  needsReauthentication: boolean; // Ob eine Reauthentifizierung benötigt wird
  canSwitchToDemoMode: boolean; // Ob ein Wechsel zum Demo-Modus möglich ist
  canSwitchToLiveMode: boolean; // Ob ein Wechsel zum Live-Modus möglich ist
  hasNetworkConnection: boolean; // Ob eine Netzwerkverbindung besteht
  appState: AppStateStatus; // Aktueller App-Status

  // Erweiterte Modus-Wechsel-Funktionen
  switchToDemoMode: () => Promise<SwitchModeResult>; // Wechselt zum Demo-Modus
  switchToLiveMode: () => Promise<SwitchModeResult>; // Wechselt zum Live-Modus
  switchToMode: (targetMode: AppMode) => Promise<SwitchModeResult>; // Wechselt zum angegebenen Modus

  // Erweiterte Session-Funktionen
  checkLiveSession: () => Promise<boolean>; // Prüft, ob eine gültige Live-Session besteht
  resetSession: () => Promise<void>; // Setzt die aktuelle Session zurück

  // UI-Feedback-Funktionen
  showModeChangeMessage: (newMode: AppMode) => void; // Zeigt eine Meldung zum Moduswechsel an
  clearModeChangeMessage: () => void; // Löscht die Meldung zum Moduswechsel
  getModeDisplayName: (mode: AppMode) => string; // Gibt den Anzeigenamen für einen Modus zurück

  // Fehlerbehandlung
  lastError: string | null; // Letzter aufgetretener Fehler
  resetModeError: () => void; // Setzt den letzten Fehler zurück

  // Performance-Optimierungen
  deferAction: <T>(action: () => Promise<T>) => Promise<T>; // Verzögert eine Aktion für bessere Performance
}
```

## 4. Verbindung der Komponenten

```typescript
/**
 * @file features/mode/index.ts
 * @description Hauptexportdatei für das vereinfachte Mode-Feature
 */

// Typen exportieren
export { AppMode, UserStatus, ModeErrorType } from "./types";

// Hook exportieren (Haupteintrittspunkt für Komponenten)
export { useAppMode } from "./hooks/useAppMode";
export type { UseAppModeResult, ModeChangeResult } from "./hooks/types";

// Store exportieren (für Testzwecke und interne Verwendung)
export { useModeStore } from "./stores/modeStore";

// Konstanten
export { MODE_COLORS, MODE_LABELS } from "./constants";

// Optionale Komponenten
export { AppModeIndicator } from "./components/AppModeIndicator";
export { AppModeToggle } from "./components/AppModeToggle";
```

## 5. Vorteile der neuen Struktur

1. **Klare Trennung** zwischen primitiven Daten (im Store) und abgeleiteten Werten (im Hook)
2. **Minimale Redundanz** durch Konzentration auf wenige Kernzustände
3. **Verbesserte Typsicherheit** durch präzise Typ-Definitionen
4. **Einfache Nutzung** für Komponenten durch einen einzigen Hook-Eintrittspunkt
5. **Bessere Wartbarkeit** durch klare Verantwortlichkeiten und Schnittstellen

Alle abgeleiteten Werte werden nur im Hook berechnet und nie im Store gespeichert, was Inkonsistenzen verhindert.

## 6. Funktionaler Ansatz für Status-Abfragen

Ein zentrales Konzept dieser Architektur ist der funktionale Ansatz für Status-Abfragen wie `isDemoMode()` und `isLiveMode()`. Diese werden bewusst als Funktionen statt als einfache Boolesche Werte implementiert, was mehrere wichtige Vorteile bietet:

1. **Robustheit und Fehlerbehandlung**: Funktionen können fehlende oder inkonsistente Zustände abfangen und garantieren typkonsistente Rückgabewerte.

2. **Kapselung von Implementierungsdetails**: Die interne Logik zur Bestimmung des Modus kann geändert werden, ohne dass Aufrufer angepasst werden müssen.

3. **Lazy Evaluation**: Die Berechnung des Status erfolgt erst bei tatsächlichem Aufruf, was in bestimmten Szenarien Performance-Vorteile bietet.

4. **Bessere Testbarkeit**: Funktionsaufrufe können in Tests einfacher gemockt werden als Zustandsvariablen.

5. **Konsistenz über die Zeit**: Auch wenn sich der Zustand ändert, liefert die Funktion bei jedem Aufruf ein zum aktuellen Zeitpunkt korrektes Ergebnis.

Da die Mode-Logik nur im DevBuild implementiert ist und nicht in kritischen Renderingpfaden verwendet wird, überwiegen die Vorteile durch bessere Codequalität und Wartbarkeit gegenüber dem minimalen Performance-Overhead.

Dieser funktionale Ansatz für Zustandsabfragen ist ein wichtiger Teil unserer Architekturphilosophie und sollte bei der weiteren Entwicklung beibehalten werden.
