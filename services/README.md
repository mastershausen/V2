# Services-Verzeichnis

Dieses Verzeichnis enthält alle Service-Module der Anwendung, die für die Kommunikation mit externen Diensten oder Systemen zuständig sind.

## Struktur

```
services/
  ├── api/                  # API-Kommunikation
  │   ├── apiService.ts     # Basis-API-Service für HTTP-Anfragen
  │   └── ...               # Weitere API-spezifische Services
  ├── auth/                 # Authentifizierungs-Services
  │   ├── authService.ts    # Auth-Service für Login, Registrierung etc.
  │   ├── mockData.ts       # Mock-Daten für die Entwicklung
  │   ├── types.ts          # TypeScript-Definitionen
  │   └── ...               # Weitere auth-spezifische Services
  ├── storage/              # Speicher-Services
  │   ├── asyncStorageService.ts # AsyncStorage-Wrapper
  │   └── ...               # Weitere storage-spezifische Services
  ├── index.ts              # Re-Export aller Services
  └── README.md             # Diese Datei
```

## Service-Kategorien

### API-Services

Services für die Kommunikation mit externen APIs, einschließlich:
- `ApiService`: Zentrale Klasse für HTTP-Anfragen mit Methoden für GET, POST, PUT, DELETE, PATCH

### Auth-Services

Services für die Authentifizierung und Benutzerverwaltung:
- `AuthService`: Methoden für Login, Registrierung, Passwort-Reset und Profilmanagement

### Storage-Services

Services für die lokale Datenspeicherung:
- `AsyncStorageService`: Wrapper für AsyncStorage mit standardisierten Methoden

## Verwendung

```typescript
import { AuthService, ApiService, AsyncStorageService } from '@/services';

// Auth-Service verwenden
await AuthService.loginWithEmail('user@example.com', 'password');

// API-Service verwenden
const response = await ApiService.get<UserData>('users/me');

// Storage-Service verwenden
await AsyncStorageService.storeObject('user_preferences', { theme: 'dark' });
```

## Mock-Modus

Viele Services unterstützen einen Mock-Modus für die Entwicklung:

- Im Development-Modus werden Mock-Daten verwendet
- In Staging- und Production-Modi werden echte API-Aufrufe ausgeführt

Die Modi werden durch die Umgebungskonfiguration in `config/app/env.ts` gesteuert. 