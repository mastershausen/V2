# Namenskonventionen in der Solvbox-App

Dieses Dokument beschreibt die Namenskonventionen, die in der Solvbox-App verwendet werden, um Konsistenz und Lesbarkeit im gesamten Codebase zu gewährleisten.

## Allgemeine Konventionen

### Dateien und Verzeichnisse

- **Verzeichnisse**: Kleinbuchstaben mit Bindestrichen (`feature-name/`)
- **Komponenten**: PascalCase mit entsprechender Endung (`ComponentName.tsx`)
- **Hooks**: camelCase mit `use`-Präfix (`useFeatureName.ts`)
- **Utilities**: camelCase (`utils.ts`, `helpers.ts`)
- **Konfiguration**: camelCase (`config.ts`, `tabs.ts`)
- **Typen**: camelCase (`types.ts`, `models.ts`)

### Imports

- Import-Reihenfolge:
  1. React und React Native
  2. Externe Bibliotheken
  3. Shared-Komponenten/Utilities mit absoluten Pfaden
  4. Feature-spezifische Imports mit relativen Pfaden

```typescript
// Beispiel für Import-Reihenfolge
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { spacing } from "@/config/theme/spacing";
import { BaseTabbar } from "@/shared-components/navigation/BaseTabbar";

import { useSolvboxAI } from "../hooks/useSolvboxAI";
import { SolvboxAITabId } from "../types";
```

## Komponenten

### Komponentenstruktur

- **Container-Komponenten**: Enthalten Geschäftslogik und werden im `container/`-Verzeichnis abgelegt
- **UI-Komponenten**: Reine Darstellungskomponenten im `ui/`-Verzeichnis
- **Screens**: Hauptbildschirme im `screens/`-Verzeichnis

### Komponenten-Namenskonventionen

- **Container**: `FeatureNameContainer.tsx`
- **Screens**: `FeatureNameScreen.tsx`
- **UI-Komponenten**: Beschreibender Name (`Button.tsx`, `Card.tsx`)
- **Feature-spezifische UI**: `FeatureNameComponentName.tsx` (z.B. `SolvboxAITabbar.tsx`)

## Hooks

### Hook-Struktur

- **Feature-Hooks**: `use[FeatureName].ts` - Haupthook für ein Feature
- **Tab-Hooks**: `use[TabName]Tab.ts` - Spezifischer Hook für einen Tab
- **Utility-Hooks**: `use[Funktion].ts` - Spezialisierte Hooks für bestimmte Funktionen

### Hook-Namenskonventionen

```typescript
// Feature-Hook
export function useSolvboxAI(): UseSolvboxAIResult {
  // Implementierung
}

// Tab-Hook
export function useGigsTab(): UseGigsTabResult {
  // Implementierung
}

// Utility-Hook
export function useTabDataLoader<T>(): void {
  // Implementierung
}
```

## Typen

### Typ-Konventionen

- **Interfaces**: PascalCase, beschreibender Name
- **Type Aliases**: PascalCase für komplexe Typen, camelCase für einfache Typen
- **Enum-ähnliche Objekte**: SCREAMING_SNAKE_CASE für Konstanten

```typescript
// Interface
export interface SolvboxAITileData {
  id: string | number;
  title: string;
  // ...weitere Eigenschaften
}

// Type Alias
export type SolvboxAITabId = "gigs" | "casestudies";

// Enum-ähnliches Objekt
export const TAB_IDS = {
  GIGS: "gigs" as const,
  CASESTUDIES: "casestudies" as const,
};
```

### Prop-Typen

- Prop-Interfaces werden nach dem Muster `[Komponente]Props` benannt:

```typescript
interface TileGridProps<T extends TileData> {
  tiles: T[];
  onTilePress: (id: number) => void;
  // ...weitere Props
}
```

## Services

### Service-Konventionen

- **Singleton Services**: Klassen mit `getInstance`-Methode
- **Service-Dateien**: PascalCase mit `Service`-Suffix (`FeatureNameService.ts`)

```typescript
export class SolvboxAIService {
  private static instance: SolvboxAIService;

  private constructor() {}

  public static getInstance(): SolvboxAIService {
    if (!SolvboxAIService.instance) {
      SolvboxAIService.instance = new SolvboxAIService();
    }
    return SolvboxAIService.instance;
  }

  // Service-Methoden
}
```

## Funktionen

### Funktions-Konventionen

- **Handler**: `handle[Aktion]` (z.B. `handleTilePress`, `handleTabChange`)
- **Aktionen**: Verben für Aktionen (`fetchData`, `updateUser`)
- **Getter**: `get[Ressource]` (z.B. `getTilesForTab`)
- **Validierung**: `is[Bedingung]` oder `validate[Ressource]` (z.B. `isValidTabId`)

```typescript
// Handler
const handleTilePress = (id: number) => {
  // Implementierung
};

// Aktionen
const fetchTileData = async () => {
  // Implementierung
};

// Getter
const getTilesForTab = (tabId: string) => {
  // Implementierung
};

// Validierung
const isValidTabId = (tabId: string): tabId is SolvboxAITabId => {
  // Implementierung
};
```

## JSDoc-Dokumentation

JSDoc-Kommentare sollten für alle öffentlichen Komponenten, Hooks und Funktionen verwendet werden:

```typescript
/**
 * Ruft die Kacheln für einen bestimmten Tab ab
 * @param tabId ID des Tabs
 * @param forceRefresh Erzwingt das Neuladen der Daten
 * @returns Promise mit einem Array von Kacheln für den angegebenen Tab
 */
public async getTilesForTab(
  tabId: string,
  forceRefresh = false
): Promise<SolvboxAITile[]> {
  // Implementierung
}
```

## Konsistenz zwischen Features

Die gleichen Namenskonventionen sollten in allen Features der App verwendet werden. MySolvbox und SolvboxAI folgen dem gleichen Muster, um eine kohärente Codebasis zu gewährleisten.
