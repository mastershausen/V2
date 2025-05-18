# Authentifizierungs-Flow Diagramm

Dieses Dokument enthält Flussdiagramme der wichtigsten Authentifizierungsprozesse in der Solvbox-App.

## Authentifizierungsfluss

```mermaid
flowchart TD
    A[Start: App öffnen] --> B{Hat gültige\nSitzung?}
    B -->|Ja| C[Dashboard anzeigen]
    B -->|Nein| D[Login-Bildschirm anzeigen]
    
    D --> E{App-Modus?}
    E -->|Demo| F[Demo-Login]
    E -->|Live| G[Echte Anmeldedaten prüfen]
    
    F --> H[Demo-Session erstellen]
    G -->|Erfolgreich| I[Live-Session erstellen]
    G -->|Fehlgeschlagen| J[Fehlermeldung anzeigen]
    
    H --> C
    I --> C
    J --> D
    
    C --> K[Benutzer interagiert mit App]
    K --> L{Sitzung\nabgelaufen?}
    L -->|Ja| M[Benutzer abmelden]
    L -->|Nein| K
    
    M --> D
```

## Login-Prozess

```mermaid
sequenceDiagram
    participant User as Benutzer
    participant UI as Login-Bildschirm
    participant Form as useAuthForm
    participant Auth as useAuth
    participant Session as SessionService
    participant API as Auth API
    
    User->>UI: E-Mail & Passwort eingeben
    UI->>Form: Formulardaten aktualisieren
    Form->>Form: Validierung durchführen
    
    alt Validierung fehlgeschlagen
        Form->>UI: Fehler anzeigen
        UI->>User: Fehlermeldungen darstellen
    else Validierung erfolgreich
        Form->>Auth: login(email, password)
        Auth->>Auth: isLoading = true
        
        alt Demo-Modus
            Auth->>Session: createDemoSession()
            Session->>Auth: Session-Daten zurückgeben
        else Live-Modus
            Auth->>API: Anmeldeanfrage senden
            API->>Auth: Antwort (Erfolg/Fehler)
            
            alt Anmeldung erfolgreich
                Auth->>Session: saveSession(sessionData)
            else Anmeldung fehlgeschlagen
                Auth->>Form: error = Fehlermeldung
                Form->>UI: Fehler anzeigen
                UI->>User: Fehlermeldung darstellen
            end
        end
        
        Auth->>Auth: isLoading = false
        
        alt Anmeldung erfolgreich
            Auth->>UI: Navigation zum Dashboard
            UI->>User: Dashboard anzeigen
        end
    end
```

## App-Modus-Wechsel

```mermaid
stateDiagram-v2
    [*] --> DemoMode
    
    DemoMode --> CheckingLiveSession: Zu Live wechseln
    DemoMode --> DemoMode: Aktion im Demo-Modus
    
    CheckingLiveSession --> LiveMode: Gültige Live-Sitzung
    CheckingLiveSession --> LoginRequired: Keine gültige Sitzung
    
    LoginRequired --> LiveMode: Erfolgreiche Anmeldung
    LoginRequired --> DemoMode: Abbrechen / Zurück zu Demo
    
    LiveMode --> LiveMode: Aktion im Live-Modus
    LiveMode --> DemoMode: Zu Demo wechseln
    
    LiveMode --> SessionExpired: Sitzung abgelaufen
    SessionExpired --> LoginRequired: Erneut anmelden
    
    LiveMode --> [*]
    DemoMode --> [*]
```

## Auth-Hook Datenfluss

```mermaid
flowchart LR
    A[useAuth Hook] --> B[AuthState]
    B --> C{App-Modus}
    
    C -->|Demo| D[DemoSession]
    C -->|Live| E[LiveSession]
    
    D --> F[useAppModeManager]
    E --> F
    
    G[SessionService] --> A
    H[EventBus] --> A
    
    A --> I[useAuthNavigation]
    A --> J[useAuthForm]
    
    F --> A
    
    I --> K[Login-Bildschirm]
    I --> L[Register-Bildschirm]
    I --> M[Passwort-Reset]
    
    J --> K
    J --> L
```

## Auth-Komponenten-Hierarchie

```mermaid
classDiagram
    class AuthProvider {
        +state: AuthState
        +login()
        +logout()
        +register()
    }
    
    class SessionService {
        +saveSession()
        +loadSession()
        +clearSession()
        +hasValidLiveSession()
    }
    
    class useAuth {
        +isAuthenticated: boolean
        +user: User | null
        +login()
        +logout()
        +register()
        +isLoading: boolean
        +error: Error | null
    }
    
    class useAuthForm {
        +formData: FormFields
        +updateField()
        +handleSubmit()
        +isLoading: boolean
        +getFieldError()
        +resetForm()
    }
    
    class useAuthNavigation {
        +navigateToLogin()
        +navigateToRegister()
        +navigateToForgotPassword()
        +navigateToDashboard()
    }
    
    class useAppModeManager {
        +currentMode: AppMode
        +isDemoMode: boolean
        +isLiveMode: boolean
        +switchToDemoMode()
        +switchToLiveMode()
    }
    
    AuthProvider --> SessionService
    AuthProvider --> useAppModeManager
    useAuth --> AuthProvider
    useAuthForm --> useAuth
    useAuthNavigation --> useAuth
    
    useAppModeManager --> SessionService
```

## Fehlerbehandlung

```mermaid
flowchart TD
    A[Auth-Aktion] --> B{Fehlertyp?}
    
    B -->|Netzwerkfehler| C[Offline-Behandlung]
    B -->|Ungültige Anmeldedaten| D[Formulardaten prüfen]
    B -->|Abgelaufene Sitzung| E[Erneute Anmeldung anfordern]
    B -->|Serverfehler| F[Fallback & Fehlerbericht]
    
    C --> G[In Demo-Modus wechseln?]
    G -->|Ja| H[Zu Demo wechseln]
    G -->|Nein| I[Erneut versuchen-Option]
    
    D --> J[Fehlermeldung in Formular anzeigen]
    E --> K[Zum Login-Bildschirm navigieren]
    F --> L[Benutzerfreundliche Fehlermeldung anzeigen]
    
    H --> M[Demo-Session erstellen]
    I --> A
    J --> N[Benutzer korrigiert Eingabe]
    K --> O[Login-Bildschirm mit Hinweis]
    L --> I
    
    N --> A
    O --> P[Benutzer meldet sich an]
```

---

*Diagramme erstellt gemäß Gold Standard 5.2* 