# Code-Style-Guide für das Solvbox-Projekt

Dieser Style-Guide definiert Standards für die Codestruktur und -formatierung im Solvbox-Projekt, um Konsistenz und Wartbarkeit zu gewährleisten.

## Exportstile

### 1. Hauptscreen-Komponenten

Hauptkomponenten (Screens) sollten per Default-Export exportiert werden:

```typescript
// Gut
export default function HomeScreen() {
  return <View>...</View>;
}

// Vermeiden
export const HomeScreen = () => {
  return <View>...</View>;
};
```

### 2. Wiederverwendbare Komponenten

Kleinere, wiederverwendbare Komponenten sollten als benannte Funktionen exportiert werden:

```typescript
// Gut
export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return <View>...</View>;
}

// Vermeiden
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return <View>...</View>;
};
```

### 3. Hooks

Hooks sollten als benannte Funktionen exportiert werden und eine detaillierte JSDoc-Dokumentation enthalten:

```typescript
/**
 * Hook für die Verwaltung der Suchfunktion
 * 
 * @returns Funktionalität für die Suchkomponente
 */
export function useSearch() {
  // Hook-Implementierung
}
```

### 4. Typen und Interfaces

Typen und Interfaces sollten als Named Exports definiert werden:

```typescript
export interface UserProfile {
  id: string;
  name: string;
}
```

## Import-Reihenfolge

Importe sollten nach folgender Reihenfolge sortiert werden:

1. React und React Native zuerst
2. Externe Bibliotheken
3. Absolute Projektimporte (@/...)
4. Relative Importe (../...)

```typescript
// 1. React-Importe
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Externe Bibliotheken
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

// 3. Absolute Projektimporte
import { useThemeColor } from '@/hooks';
import { TileCard } from '@/shared-components/cards';

// 4. Relative Importe
import { ProfileData } from '../types';
import { useMockData } from '../hooks/useMockData';
```

## Benennungskonventionen

### 1. Komponenten

- PascalCase für Komponentennamen: `ProfileHeader`, `SaveTab`
- Suffixe für spezifische Komponententypen:
  - `*Screen` für Hauptseiten: `HomeScreen`, `ProfileScreen`
  - `*Tab` für Tab-Komponenten: `SaveTab`, `GigsTab`

### 2. Hooks

- camelCase mit `use`-Präfix: `useThemeColor`, `useProfile`

### 3. Funktionen und Variablen

- camelCase für alle Funktionen und Variablen: `handlePress`, `userData`
- Eventhandler sollten mit `handle` beginnen: `handleSubmit`, `handlePress`

### 4. Konstanten

- UPPER_SNAKE_CASE für globale Konstanten: `DEFAULT_TIMEOUT`, `API_ENDPOINTS`
- camelCase für lokale Konstanten: `maxHeight`, `defaultPadding`

## Komponentenstruktur

Jede Komponentendatei sollte folgende Struktur haben:

1. Importe (nach der oben definierten Reihenfolge)
2. Interface-/Type-Definitionen
3. Lokale Konstanten
4. Komponentendefinition (mit JSDoc-Kommentar)
5. Hilfsfunktionen (bei Bedarf)
6. Styles

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks';

interface ComponentProps {
  title: string;
}

const ITEM_HEIGHT = 60;

/**
 * Beschreibung der Komponente und ihrer Verantwortlichkeiten
 */
export function MyComponent({ title }: ComponentProps) {
  const colors = useThemeColor();
  
  // Komponenten-Logik
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

// Hilfsfunktionen bei Bedarf
function helperFunction() {
  // ...
}

const styles = StyleSheet.create({
  container: {
    // Styles
  },
  title: {
    // Styles
  },
});
```

## JSDoc-Standards

Alle Komponenten, Hooks und wichtige Funktionen sollten mit JSDoc-Kommentaren dokumentiert werden:

```typescript
/**
 * Kurzbeschreibung der Komponente/Funktion
 * 
 * Detailliertere Beschreibung bei Bedarf
 * 
 * @param prop1 - Beschreibung von prop1
 * @param prop2 - Beschreibung von prop2
 * @returns Beschreibung des Rückgabewerts
 */
```

## Weitere Best Practices

1. **Erreichbarkeit**: Komponenten sollten accessible sein und entsprechende Props nutzen
2. **Fehlerbehandlung**: Fehler sollten immer ordnungsgemäß behandelt werden
3. **Imports optimieren**: Keine ungenutzten Imports
4. **Typsicherheit**: Keine `any`-Typen ohne guten Grund verwenden
5. **Code-Formatierung**: Automatische Formatierung mit Prettier vor dem Commit

---

Diese Richtlinien helfen, den Code konsistent und wartbar zu halten. Bei Fragen oder Vorschlägen für Anpassungen bitte das Entwicklungsteam kontaktieren. 