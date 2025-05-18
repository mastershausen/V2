# Import-Konventionen

Dieses Dokument definiert die verbindlichen Konventionen für Import-Pfade im Solvbox-Projekt.

## Grundlegende Prinzipien

1. **Präferenz für Alias-Pfade**: Nutze Alias-Pfade statt tiefer relativer Pfade (`../../../`).
2. **Relative Pfade innerhalb von Features**: Innerhalb desselben Features sollten Komponenten und Module mit relativen Pfaden importiert werden.
3. **Konsistenz**: Halte dich an die definierten Muster für bessere Lesbarkeit und Wartbarkeit.

## Import-Pfad-Typen

### 1. Externe Bibliotheken

Importe von externen Bibliotheken kommen zuerst:

```typescript
import React from "react";
import { View, Text } from "react-native";
import { useQuery } from "react-query";
```

### 2. Alias-Pfade für modulübergreifende Importe

Verwende Alias-Pfade für Importe zwischen verschiedenen Modulen:

```typescript
// GUT - Alias-Pfade für modulübergreifende Importe
import { UserCard } from "@shared-components/user/UserCard";
import { useAuth } from "@hooks/useAuth";
import { ApiService } from "@services/api/ApiService";
```

### 3. Relative Pfade für Importe innerhalb des gleichen Moduls

Verwende relative Pfade für Importe innerhalb desselben Moduls:

```typescript
// GUT - Relative Imports innerhalb des gleichen Features
import { ProfileHeader } from "./components/ProfileHeader";
import { profileStyles } from "./styles";
import { ProfileProps } from "./types";
```

### Falsche Verwendungen

```typescript
// SCHLECHT - Keine tiefen relativen Imports
import { Button } from "../../../shared-components/Button";

// SCHLECHT - Kein Alias-Import für Dateien im selben Feature
import { ProfileHeader } from "@features/profile/components/ProfileHeader";
```

## Konfigurierte Aliase

Folgende Alias-Pfade sind im Projekt konfiguriert:

| Alias                  | Pfad                    | Verwendung                       |
| ---------------------- | ----------------------- | -------------------------------- |
| `@features/*`          | `./features/*`          | Feature-Module importieren       |
| `@shared-components/*` | `./shared-components/*` | Wiederverwendbare UI-Komponenten |
| `@services/*`          | `./services/*`          | Services und API-Integrationen   |
| `@hooks/*`             | `./hooks/*`             | Globale React Hooks              |
| `@contexts/*`          | `./contexts/*`          | React Context-Provider           |

## Automatische Korrektur

Zur automatischen Korrektur von Import-Pfaden nach diesen Konventionen steht ein Skript zur Verfügung:

```bash
node scripts/fix-imports.js
```

Dieses Skript:

- Konvertiert tiefe relative Imports (`../../../`) zu Alias-Imports
- Konvertiert Alias-Imports innerhalb desselben Features zu relativen Imports
- Führt ESLint-Fixes auf den aktualisierten Dateien aus

## ESLint-Regeln

Die folgenden ESLint-Regeln setzen diese Konventionen durch:

- `import/no-relative-parent-imports`: Verbietet relative Parent-Imports (`../`)
- Relative Imports werden innerhalb desselben Features erzwungen
- `import/extensions`: Verbietet Dateiendungen in Imports (außer bei Assets)
- `import/order`: Sortiert Imports in einer definierten Reihenfolge

## Neue Dateien erstellen

Bei der Erstellung neuer Dateien beachte:

1. Feature-übergreifende Dienste gehören in `/services/`
2. Wiederverwendbare Komponenten gehören in `/shared-components/`
3. Feature-spezifische Komponenten gehören ins entsprechende Feature-Verzeichnis
4. Hook-Komponenten gehören in `/hooks/` oder in ein Feature als Feature-Hook

## CI-Integration

Die Import-Konventionen werden im CI-Pipeline durchgesetzt. Pull Requests mit Verstößen gegen diese Regeln werden automatisch markiert.
