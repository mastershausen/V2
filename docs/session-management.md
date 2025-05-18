# Session-Management in Solvbox App

Dieses Dokument beschreibt die Implementierung des Session-Managements in der Solvbox App, mit besonderem Fokus auf die Lösung für Session-Persistenz bei App-Neuinstallation und App-Beendigung.

## 🔍 Das Problem

Wir hatten zwei Hauptprobleme mit unserem Session-Management:

1. **Problem bei App-Neuinstallation**: Wenn ein Benutzer die App löscht und neu installiert, wurden die AsyncStorage-Daten nicht vollständig gelöscht (ein bekanntes Verhalten auf manchen Geräten). Dies führte dazu, dass ein Benutzer nach der Neuinstallation immer noch als angemeldet betrachtet wurde.

2. **Problem bei App-Beendigung**: Wenn die App im Hintergrund beendet wurde, wurde die Sitzung nicht richtig zurückgesetzt, was zu inkonsistenten Zuständen führen konnte.

## 💡 Die Lösung

Unsere Lösung behandelt beide Probleme:

### 1. Erkennung von App-Neuinstallationen

Wir haben einen Mechanismus eingeführt, um App-Neuinstallationen zu erkennen und den Storage zurückzusetzen:

```typescript
// In app/_layout.tsx
import * as Application from 'expo-application';

const INSTALLATION_TIME_KEY = '@app_installation_time';

useEffect(() => {
  const checkInstallation = async () => {
    try {
      // Hole die Installationszeit der App
      const currentInstallTime = await Application.getInstallationTimeAsync();
      const installTimeMs = typeof currentInstallTime === 'number' 
        ? currentInstallTime 
        : currentInstallTime instanceof Date 
          ? currentInstallTime.getTime() 
          : Date.now();
      
      // Lade die gespeicherte Installationszeit
      const savedInstallTime = await AsyncStorage.getItem(INSTALLATION_TIME_KEY);
      const savedTimeMs = savedInstallTime ? parseInt(savedInstallTime, 10) : 0;
      
      // Wenn keine gespeicherte Installationszeit existiert oder sie sich geändert hat
      if (!savedInstallTime || savedTimeMs !== installTimeMs) {
        logger.info('🔄 Neue App-Installation erkannt - Setze AsyncStorage zurück');
        
        // Speichere die aktuelle Installationszeit
        await AsyncStorage.setItem(INSTALLATION_TIME_KEY, String(installTimeMs));
        
        // Setze alle Sitzungsdaten zurück
        const keys = await AsyncStorage.getAllKeys();
        const keysToReset = keys.filter(key => 
          key.startsWith('@auth_') || 
          key.startsWith('@session_') || 
          key.includes('persist:')
        );
        
        if (keysToReset.length > 0) {
          await AsyncStorage.multiRemove(keysToReset);
          logger.debug(`🗑️ ${keysToReset.length} Schlüssel gelöscht`);
        }
        
        // Setze Reset-Flags
        await AsyncStorage.setItem(AUTH_STORAGE_KEYS.RESET_ON_APP_START, 'true');
        await AsyncStorage.setItem(AUTH_STORAGE_KEYS.HAS_VALID_LIVE_SESSION, 'false');
      }
    } catch (error) {
      logger.error('Fehler bei der Überprüfung der App-Installation', error);
    }
  };
  
  checkInstallation();
}, []);
```

### 2. Verbesserte App-Zustandsbehandlung

Wir haben den `AppStateHandler` verbessert, um besser auf App-Zustandsänderungen zu reagieren:

```typescript
export function AppStateHandler() {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const backgroundTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user, authStatus, logout } = useAuthStore();
  
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;
      
      // Wenn die App in den Hintergrund wechselt
      if ((previousAppState === 'active' && (nextAppState === 'background' || nextAppState === 'inactive'))) {
        // Sofort das APP_WAS_CLOSED-Flag setzen
        await saveObject(AUTH_STORAGE_KEYS.APP_WAS_CLOSED, true);
        
        // Bereinigen Sie die Sitzung über den SessionService
        await sessionService.clearOnAppExit();
        
        // Setzen Sie einen Timer für den Fall, dass die App für längere Zeit im Hintergrund ist
        if (backgroundTimerRef.current) {
          clearTimeout(backgroundTimerRef.current);
        }
        
        // Nach 5 Minuten im Hintergrund den Status zurücksetzen
        backgroundTimerRef.current = setTimeout(() => {
          saveObject(AUTH_STORAGE_KEYS.RESET_ON_APP_START, true);
        }, 5 * 60 * 1000); // 5 Minuten
      } 
      // Wenn die App wieder in den Vordergrund kommt
      else if (nextAppState === 'active' && previousAppState !== 'active') {
        // Timer löschen, wenn die App wieder aktiv wird
        if (backgroundTimerRef.current) {
          clearTimeout(backgroundTimerRef.current);
          backgroundTimerRef.current = null;
        }
        
        // Überprüfen der Sitzungsgültigkeit
        if (user && authStatus === 'authenticated') {
          const isValid = await sessionService.hasValidLiveSession();
          
          if (!isValid) {
            // Wenn die Sitzung nicht mehr gültig ist, abmelden
            logout();
          }
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (backgroundTimerRef.current) {
        clearTimeout(backgroundTimerRef.current);
      }
    };
  }, [user, authStatus, logout]);

  return null;
}
```

### 3. Verbesserte Zustandspersistenz

Wir haben die Zustandspersistenz verbessert, indem wir sicherstellen, dass nur die notwendigen Daten persistiert werden:

```typescript
// In stores/authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    // ... Store-Definition ...
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Wichtig: Diese Felder werden nicht persistiert
      partialize: (state) => ({
        // Nur user und appMode persistieren
        user: state.user,
        appMode: state.appMode,
        // Andere Felder werden explizit ausgelassen
      }),
      version: 1,
    }
  )
);
```

## 🛠️ Implementierungsdetails

### SessionService

Der `SessionService` ist verantwortlich für:

1. **Sitzungsspeicherung**: Speichert Benutzersitzungen basierend auf dem aktuellen App-Modus (Demo/Live)
2. **Sitzungsladung**: Lädt Benutzersitzungen und validiert sie
3. **Sitzungsbereinigung**: Bereinigt Sitzungsdaten beim App-Beenden oder bei Timeout

```typescript
class SessionService implements ISessionService {
  // ... andere Methoden ...
  
  async clearOnAppExit(): Promise<void> {
    try {
      // Flag setzen, dass die App beendet wurde
      await saveObject(AUTH_STORAGE_KEYS.APP_WAS_CLOSED, true);

      // Nur im Live-Modus beenden wir die Sitzung
      if (isLiveMode()) {
        await this.cleanupInvalidSession();
      }
    } catch (error) {
      logger.error('Fehler beim Bereinigen der Sitzungsdaten', error);
    }
  }
  
  // ... andere Methoden ...
}
```

## 🧪 Testbarkeit

Die Implementierung ist so gestaltet, dass sie leicht zu testen ist:

1. **Interface-basiert**: Der `SessionService` implementiert das `ISessionService`-Interface, das für Tests gemockt werden kann.
2. **Klare Verantwortlichkeiten**: Jede Komponente hat eine klare, einzige Verantwortung.
3. **Geringe Kopplung**: Die Komponenten sind locker gekoppelt und kommunizieren über gut definierte Schnittstellen.

## 📊 Fehlerbehandlung und Protokollierung

Wir haben eine umfassende Fehlerbehandlung und Protokollierung implementiert:

1. **Strukturierte Logs**: Alle wichtigen Ereignisse werden mit klaren Präfixen protokolliert.
2. **Fehlerbehandlung**: Alle asynchronen Operationen sind in try-catch-Blöcke eingeschlossen.
3. **Fallbacks**: Bei Fehlern gibt es immer ein definiertes Fallback-Verhalten.

## 🔒 Sicherheit

Die Implementierung berücksichtigt Sicherheitsaspekte:

1. **Sitzungsablauf**: Sitzungen laufen automatisch ab, wenn sie zu alt sind.
2. **Validierung**: Alle geladenen Sitzungsdaten werden vor der Verwendung validiert.
3. **Bereinigung**: Sensible Daten werden bei Abmeldung oder App-Beendigung bereinigt.

## 🚀 Zukünftige Verbesserungen

Für zukünftige Versionen planen wir:

1. **Biometrische Authentifizierung**: Integration von Touch ID/Face ID für sicherere Anmeldungen.
2. **Token-Rotation**: Automatische Rotation von Auth-Tokens für verbesserte Sicherheit.
3. **Mehrgeräte-Unterstützung**: Bessere Unterstützung für Benutzer, die auf mehreren Geräten angemeldet sind. 