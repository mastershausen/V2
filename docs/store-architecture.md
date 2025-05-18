# Store-Architektur für Solvbox

Diese Dokumentation beschreibt die zentrale Zustandsverwaltung (State Management) der Solvbox-App.

## Übersicht

Die Zustandsverwaltung in Solvbox verwendet Zustand als State-Management-Bibliothek und ist in mehrere logische Bereiche unterteilt:

1. **Core-Stores**: Zentrale, anwendungsweite Zustandsverwaltung

   - `userStore`: Authentifizierung und Benutzerdaten
   - `appModeStore`: App-Modus (demo, development, production) und damit verbundene Funktionen
   - `uiStore`: UI-Einstellungen und Theme

2. **Feature-Stores**: Funktionsspezifische Zustandsverwaltung
   - `mysolvboxStore`: Tab-Verwaltung und Daten für MySolvbox
   - `solvboxaiStore`: Tab-Verwaltung und Daten für SolvboxAI

## Store-Struktur

Jeder Store ist nach einem einheitlichen Pattern strukturiert:

```
stores/
  ├── utils/
  │   └── createStore.ts         # Factory-Funktion für Stores
  ├── types/
  │   └── [storeName]Types.ts    # TypeScript-Typen für den Store
  ├── actions/
  │   └── [storeName]Actions.ts  # Aktionen für den Store
  ├── constants/
  │   └── [storeName]Constants.ts # Konstanten für den Store
  └── [storeName].ts             # Store-Definition und Export
```

## Store-Kommunikation

Stores kommunizieren über ein Event-System miteinander, insbesondere zwischen dem `appModeStore` und dem `userStore`:

```typescript
// In appModeStore.ts
export type AppModeEvent =
  | {
      type: "LOGIN_WITH_DEMO_ACCOUNT";
    }
  | {
      type: "DEMO_MODE_CHANGED";
      mode: UserStatus;
    }
  | {
      type: "DEMO_ACCOUNT_CHANGED";
      isDemoAccount: boolean;
    };

// Event-Subscription in userActions.ts
const unsubscribe = subscribeToAppModeEvents((event: AppModeEvent) => {
  switch (event.type) {
    case "LOGIN_WITH_DEMO_ACCOUNT":
      // Reagiere auf Event
      break;
    // weitere Event-Typen
  }
});
```

## Core-Stores

### UserStore

Der `userStore` verwaltet den Authentifizierungszustand und die Benutzerdaten.

```typescript
import { useUserStore } from "@/stores/userStore";

// Überprüfen, ob der Benutzer angemeldet ist
const { isAuthenticated } = useUserStore();
if (isAuthenticated()) {
  // Benutzer ist angemeldet
}

// Anmelden
const { login } = useUserStore();
await login("user@example.com", "password");

// Abmelden
const { logout } = useUserStore();
logout();

// Benutzerdaten abrufen
const { user } = useUserStore();
console.log(user?.username);

// Rollenverwaltung
const { hasRole, isPremium, hasMinimumRole } = useUserStore();
if (hasRole("admin")) {
  // Admin-spezifische Funktionen
}
```

### AppModeStore

Der `appModeStore` verwaltet den App-Modus (demo, development, production) und ist für die Demo-Funktionalität verantwortlich.

```typescript
import { useAppModeStore } from "@/stores/appModeStore";

// App-Modus abrufen
const { getAppMode, isProduction } = useAppModeStore();
const currentMode = getAppMode(); // 'demo', 'development', 'production'

// Demo-Modus aktivieren/deaktivieren
const { enableDemoMode, disableDemoMode, isDemoMode } = useAppModeStore();
enableDemoMode();

// Mit Demo-Konto anmelden
const { loginWithDemoAccount } = useAppModeStore();
loginWithDemoAccount();
```

### UIStore

Der `uiStore` verwaltet UI-bezogene Einstellungen wie das Theme und globale UI-Zustände.

```typescript
import { useUIStore } from "@/stores/uiStore";

// Aktuelles Theme abrufen
const { currentTheme, themeColors } = useUIStore();
console.log("Current theme:", currentTheme());

// Theme ändern
const { setThemeMode } = useUIStore();
setThemeMode("dark");
// oder
setThemeMode("light");
// oder
setThemeMode("system");

// Theme umschalten (zwischen light, dark und system)
const { toggleTheme } = useUIStore();
toggleTheme();
```

## Feature-Stores

### MySolvboxStore und SolvboxaiStore

Diese Stores verwalten Tab-spezifische Zustände und Daten für die jeweiligen Features.

```typescript
import { useMysolvboxStore } from "@/stores/mysolvboxStore";

// Aktiven Tab abrufen
const { activeTab } = useMysolvboxStore();

// Tab wechseln
const { setActiveTab } = useMysolvboxStore();
setActiveTab("save");

// Kacheln für den aktiven Tab laden
const { loadTabTiles } = useMysolvboxStore();
await loadTabTiles();

// Alle verfügbaren Tabs abrufen
const { getTabs } = useMysolvboxStore();
const tabs = getTabs();
```

## CreateStore-Utility

Die `createStore`-Utility-Funktion vereinfacht die Erstellung von Stores und fügt automatisch Funktionen wie Persistenz hinzu:

```typescript
// stores/utils/createStore.ts
export function createStore<T>(
  createState: StateCreator<T>,
  options: CreateStoreOptions = {}
) {
  const { name, persist, partialize } = options;

  // Basiszustand erstellen
  let store = create<T>()(createState);

  // Persistenz hinzufügen, wenn aktiviert
  if (persist) {
    store = persist(store, {
      name,
      partialize,
    });
  }

  return store;
}

// Verwendung
export const useMyStore = createStore<MyStore>(
  (set, get) => ({
    // Store-Definition
  }),
  {
    name: "my-store",
    persist: true,
    partialize: (state) => ({
      // Nur bestimmte Felder persistieren
    }),
  }
);
```

## Erweitern des Store-Systems

Um einen neuen Store hinzuzufügen:

1. Definiere Typen in `stores/types/newStoreTypes.ts`
2. Erstelle Aktionen in `stores/actions/newStoreActions.ts`
3. Falls benötigt, definiere Konstanten in `stores/constants/newStoreConstants.ts`
4. Erstelle den Store in `stores/newStore.ts` mit der `createStore`-Funktion
5. Exportiere den Store in `stores/index.ts`

## Best Practices

1. **Verwende TypeScript**: Alle Store-Typen sollten klar definiert sein
2. **Trenne Zustand und Logik**: Halte den Zustand einfach und lege Logik in Aktionen
3. **Dokumentiere mit JSDoc**: Versehe alle öffentlichen Aktionen mit JSDoc-Kommentaren
4. **Teste Store-Aktionen**: Schreibe Unit-Tests für Store-Aktionen
5. **Verwende das Event-System für Store-Kommunikation**: Vermeide direkte Abhängigkeiten
6. **Partielle Persistenz**: Persistiere nur die notwendigen Teile des Zustands
7. **Fehlerbehandlung in Aktionen**: Fange Fehler in Aktionen ab und protokolliere sie
