# Authentifizierungs-System

Solvbox verwendet ein robustes, typsicheres Authentifizierungssystem, das sowohl Online- als auch Offline-Authentifizierung unterstützt. 

## Hauptmerkmale

- ✅ **Typsicherheit mit TypeScript**: Umfassende Typen und Schnittstellen für alle Auth-Funktionen
- ✅ **Session-Management**: Persistente Sitzungen für angemeldete Benutzer
- ✅ **App-Modus-Integration**: Nahtlose Integration mit Demo- und Live-Modus
- ✅ **Offline-Authentifizierung**: Im Demo-Modus benötigt keine Serververbindung
- ✅ **Validierung**: Umfangreiche Validierungslogik für Formulareingaben
- ✅ **Trennung von UI und Logik**: Saubere Trennung durch React Hooks
- ✅ **Testabdeckung**: Umfassende Unit-Tests für kritische Komponenten

## Architektur

Das Authentifizierungssystem basiert auf diesen Hauptkomponenten:

1. **useAuth Hook**: Zentraler Hook für die Verwaltung des Authentifizierungsstatus
2. **useAuthNavigation**: Navigations-Hook für Auth-Flows
3. **useAuthForm**: Hook für Formularlogik in Login- und Registrierungsbildschirmen
4. **useAppModeManager**: Hook für die Verwaltung des App-Modus (Demo/Live)
5. **SessionService**: Dienst zur Verwaltung von Benutzersitzungen
6. **Typdefinitionen**: Umfassende Typen für alle Auth-bezogenen Daten

## Verwendung

### Authentifizierung

Verwende den zentralen `useAuth`-Hook, um auf Authentifizierungsfunktionen zuzugreifen:

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { 
    isAuthenticated, 
    user, 
    login, 
    logout, 
    register, 
    isLoading, 
    error 
  } = useAuth();

  // Prüfen, ob der Benutzer authentifiziert ist
  if (isAuthenticated) {
    return <AuthenticatedView user={user} />;
  }

  // Login-Funktion aufrufen
  const handleLogin = async () => {
    const success = await login('user@example.com', 'password');
    if (success) {
      // Erfolgreiche Anmeldung
    }
  };

  return (
    <LoginForm 
      onSubmit={handleLogin} 
      isLoading={isLoading} 
      error={error} 
    />
  );
}
```

### Formularlogik

Nutze die spezialisierten Form-Hooks für Login- und Registrierungsformulare:

```tsx
import { useLoginForm } from '@/features/auth/hooks/useAuthForm';

function LoginScreen() {
  const { 
    formData, 
    updateField, 
    handleSubmit, 
    isLoading, 
    getFieldError, 
    authError 
  } = useLoginForm({
    onSuccess: () => {
      // Navigation nach erfolgreicher Anmeldung
    }
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        value={formData.email}
        onChangeText={updateField('email')}
        error={getFieldError('email')}
      />
      <Input
        value={formData.password}
        onChangeText={updateField('password')}
        secureTextEntry
        error={getFieldError('password')}
      />
      {authError && <ErrorMessage message={authError} />}
      <Button 
        title="Anmelden" 
        onPress={handleSubmit} 
        loading={isLoading} 
      />
    </Form>
  );
}
```

### Navigation

Verwalte die Navigation in Authentifizierungsflows mit dem `useAuthNavigation`-Hook:

```tsx
import { useAuthNavigation } from '@/features/auth/hooks/useAuthNavigation';

function AuthFlow() {
  const { 
    navigateToLogin, 
    navigateToRegister, 
    navigateToForgotPassword, 
    navigateToDashboard 
  } = useAuthNavigation();

  // Navigiere zum Registrierungsbildschirm
  const handleRegisterClick = () => {
    navigateToRegister();
  };

  return (
    <View>
      <Button title="Anmelden" onPress={navigateToLogin} />
      <Button title="Registrieren" onPress={handleRegisterClick} />
      <Button title="Passwort vergessen" onPress={navigateToForgotPassword} />
    </View>
  );
}
```

### App-Modus-Verwaltung

Verwalte den App-Modus (Demo/Live) mit dem `useAppModeManager`-Hook:

```tsx
import { useAppModeManager } from '@/features/auth/hooks/useAppModeManager';

function AppModeToggle() {
  const { 
    currentMode, 
    isDemoMode, 
    isLiveMode, 
    switchToDemoMode, 
    switchToLiveMode,
    canSwitchToLiveMode,
    isCheckingLiveSession
  } = useAppModeManager();

  return (
    <View>
      <Text>Aktueller Modus: {currentMode}</Text>
      
      <Button 
        title="Demo-Modus aktivieren" 
        onPress={switchToDemoMode}
        disabled={isDemoMode} 
      />
      
      <Button 
        title="Live-Modus aktivieren" 
        onPress={switchToLiveMode}
        disabled={isLiveMode || !canSwitchToLiveMode}
        loading={isCheckingLiveSession} 
      />
    </View>
  );
}
```

### Session-Management

Verwende den `SessionService` für erweitertes Session-Management:

```tsx
import { sessionService } from '@/features/auth/services';

// Prüfen, ob eine gültige Live-Sitzung existiert
const checkSession = async () => {
  const hasSession = await sessionService.hasValidLiveSession();
  if (hasSession) {
    // Gültige Sitzung vorhanden
  } else {
    // Keine gültige Sitzung
  }
};

// Sitzung manuell aktualisieren
const refreshSession = async () => {
  await sessionService.updateValidLiveSessionStatus();
};
```

## Testen

Das Authentifizierungssystem verfügt über eine umfassende Teststrategie, die in `features/auth/docs/AuthTestStrategy.md` dokumentiert ist. Die Tests umfassen:

- Unit-Tests für Validierungsfunktionen
- Tests für Auth-Hooks
- Tests für Session-Management
- Tests für App-Modus-Integration

Führe die Tests aus mit:

```bash
# Alle Auth-Tests ausführen
npm run test -- features/auth

# Spezifische Tests ausführen
npm run test -- features/auth/utils/__tests__/formValidation.test.ts
```

## Best Practices

1. **Verwende immer die bereitgestellten Hooks**: Anstatt direkt mit dem Session-Service zu interagieren, verwende die Hooks, die eine konsistente API bieten.

2. **Trenne UI von Logik**: Verwende die Form-Hooks, um die Formularlogik von den UI-Komponenten zu trennen.

3. **Achte auf den App-Modus**: Der aktuelle App-Modus (Demo/Live) beeinflusst das Verhalten der Authentifizierung. Berücksichtige dies beim Implementieren von Features.

4. **Fehlerbehandlung**: Nutze die bereitgestellten Fehlermeldungen und Validierungsfunktionen, um Benutzern klares Feedback zu geben.

5. **Typsicherheit**: Nutze die definierten Typen und Interfaces für maximale Typsicherheit.

## Roadmap

- **Biometrische Authentifizierung**: Integration von Fingerabdruck und Face ID
- **Passkey-Support**: Implementierung von WebAuthn/Passkey für passwortloses Anmelden
- **Erweiterte Berechtigungen**: Differenzierte Benutzerberechtigungen basierend auf Rollen
- **Zwei-Faktor-Authentifizierung**: Erhöhte Sicherheit durch 2FA

---

*Dokumentation aktualisiert gemäß Gold Standard 5.2*
