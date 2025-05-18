# Shared Components

Dieses Verzeichnis enthält wiederverwendbare Komponenten, die in der gesamten Anwendung verwendet werden können.

## Struktur

```
shared-components/
  ├── theme/                # Theme-bezogene Komponenten
  │   ├── Theme.ts          # Theme-Typen und -Hilfsfunktionen
  │   ├── ThemedText.tsx    # Text-Komponente mit Theme-Unterstützung
  │   ├── ThemedView.tsx    # View-Komponente mit Theme-Unterstützung
  │   ├── ThemedButton.tsx  # Button-Komponente mit Theme-Unterstützung
  │   └── index.ts          # Re-Export aller Theme-Komponenten
  ├── container/            # Container-Komponenten
  ├── navigation/           # Navigations-Komponenten
  ├── gesture/              # Gesten-Komponenten
  ├── media/                # Medien-Komponenten
  ├── cards/                # Karten-Komponenten
  ├── searchinput/          # Sucheingabe-Komponenten
  └── README.md             # Diese Datei
```

## Komponenten-Kategorien

### Theme-Komponenten

Komponenten, die das aktuelle Farbschema der Anwendung berücksichtigen:

- `ThemedText`: Text-Komponente mit automatischer Farbunterstützung
- `ThemedView`: View-Komponente mit automatischer Farbunterstützung
- `ThemedButton`: Button-Komponente mit automatischer Farbunterstützung

### Container-Komponenten

Layout-Komponenten für verschiedene Bereiche der Anwendung:

- `TabScreensContainer`: Container für Tab-basierte Screens

### Navigations-Komponenten

Komponenten für die Navigation innerhalb der Anwendung:

- `BaseTabbar`: Basis-Komponente für Tab-Leisten
- `HeaderNavigation`: Komponente für die obere Navigationsleiste

## Verwendung

```typescript
import { ThemedText, ThemedView, ThemedButton } from '@/shared-components/theme';

function MyComponent() {
  return (
    <ThemedView>
      <ThemedText variant="title">Willkommen</ThemedText>
      <ThemedText secondary>Ein Beispieltext mit sekundärer Farbe</ThemedText>
      
      <ThemedButton 
        title="Weiter" 
        onPress={handlePress} 
      />
    </ThemedView>
  );
}
```

## Richtlinien für neue Komponenten

1. **Allgemein und wiederverwendbar**: Komponenten sollten so allgemein wie möglich sein
2. **Theming unterstützen**: Komponenten sollten das aktuelle Theme berücksichtigen
3. **Inklusion und Zugänglichkeit**: Komponenten sollten barrierefrei sein (accessibility props)
4. **TypeScript**: Alle Komponenten und Props sollten typisiert sein
5. **Dokumentation**: Jede Komponente sollte mit JSDoc-Kommentaren dokumentiert sein
6. **Testbarkeit**: Komponenten sollten einfach zu testen sein 