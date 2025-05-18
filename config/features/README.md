# Feature-Flag-System

Dieses Modul bietet eine zentrale Verwaltung für Feature-Flags in der Solvbox-App. Es erlaubt flexible Steuerung von Features basierend auf verschiedenen Kriterien.

## Überblick

Feature-Flags sind ein mächtiges Werkzeug in der Softwareentwicklung, um:
- Features schrittweise auszurollen
- A/B-Tests durchzuführen
- Features für bestimmte Benutzergruppen freizuschalten
- Schnelles Deaktivieren problematischer Features ohne Deployment

## Verfügbare Feature-Flags

| Flag-Name | Beschreibung | Default-Zustand | Ablaufdatum | Owner |
|-----------|--------------|-----------------|-------------|-------|
| `DEBUG_MENU` | Debug-Menü in den Einstellungen | Aktiviert in Dev/Staging/Demo-Modus oder wenn userMode=demo | 2025-01-01 | DevTeam |
| `ROLE_SWITCHER` | Rollenumschalter im Debug-Menü | Aktiviert in Dev/Staging/Demo-Modus oder wenn userMode=demo | 2025-01-01 | DevTeam |
| `DEMO_MODE_BUTTON` | Demo-Modus-Button in der UI | Aktiviert in Dev/Staging/Demo-Modus | 2025-01-01 | DevTeam |
| `PREMIUM_FEATURES` | Premium-Features | Aktiviert für Premium/Admin-Benutzer | (keins) | ProductTeam |

## Verwendung

### Feature-Flag prüfen

```typescript
import { FeatureFlags } from '@/config/features';

// In einer Komponente - Grundlegende Verwendung
const showDebugMenu = FeatureFlags.isEnabled('DEBUG_MENU');

// Mit Kontext-Informationen für Analytics
const showPremiumFeatures = FeatureFlags.isEnabled('PREMIUM_FEATURES', { 
  screenName: 'ProfileScreen' 
});

// Dann in JSX
{showDebugMenu && <DebugMenuComponent />}
```

### Feature-Flag für Tests überschreiben

```typescript
// In Test-Umgebung oder Debug-Code
FeatureFlags.overrideFeature('DEBUG_MENU', true); // Erzwinge Aktivierung
FeatureFlags.overrideFeature('PREMIUM_FEATURES', false); // Erzwinge Deaktivierung

// Zurücksetzen
FeatureFlags.resetOverrides(); // Alle zurücksetzen
FeatureFlags.resetOverrides('DEBUG_MENU'); // Nur ein bestimmtes Flag zurücksetzen
```

### Lebenszyklus-Management

```typescript
// Ablaufdatum aktualisieren
FeatureFlags.updateExpiryDate('DEBUG_MENU', '2026-01-01');

// Status aktualisieren
FeatureFlags.updateLifecycleStage('PREMIUM_FEATURES', 'stable');

// Als ersetzt markieren
FeatureFlags.markAsReplaced('OLD_FEATURE', 'NEW_FEATURE');

// Abgelaufene Flags prüfen
const expiredFlags = FeatureFlags.getExpiredFlags();
```

### Debug-Informationen anzeigen

```typescript
// Für Development/Debugging
console.table(FeatureFlags.getFeatureStatus());

// Nutzungsstatistiken abrufen
const usageStats = FeatureFlags.getUsageStatistics();
```

## Feature-Flag Maintenance-Tools

### Flag-Audit

Das Projekt enthält ein Audit-Tool für Feature-Flags, das in der CI/CD-Pipeline eingesetzt werden kann:

```bash
# Basisaudit - zeigt Status aller Flags
npm run flag-audit

# Strict-Modus - schlägt fehl, wenn abgelaufene Flags gefunden werden
npm run flag-audit:strict

# Mit Nutzungsprüfung - zeigt auch ungenutzte Flags an
npm run flag-audit:usage
```

### Flag-Cleanup

Für die automatisierte Entfernung abgelaufener Flags gibt es ein spezielles Tool:

```bash
# Dry-Run - zeigt, welche Änderungen gemacht würden, ohne sie wirklich durchzuführen
npm run flag-cleanup

# Erstellt tatsächlich PRs für abgelaufene Flags
npm run flag-cleanup:pr

# Nur ein bestimmtes Flag bearbeiten
node scripts/flag-cleanup.js --flag=DEBUG_MENU
```

Das Cleanup-Tool:
1. Identifiziert abgelaufene Feature-Flags
2. Sucht alle Verwendungen im Code
3. Ersetzt `isEnabled('FLAG')` durch:
   - `true/false` (basierend auf der Produktionskonfiguration)
   - Oder durch ein Ersatz-Flag (falls `replacedBy` gesetzt ist)
4. Entfernt das Flag aus der Konfiguration
5. Erstellt einen Branch, commitet die Änderungen und eröffnet einen PR

## CI/CD-Integration

Die Features zur Lebenszyklus-Verwaltung sind in die CI/CD-Pipeline integriert:

- Bei jedem PR wird ein Flag-Audit durchgeführt
- Wöchentlich kann ein automatisierter Job abgelaufene Flags identifizieren und PRs erstellen
- Der Flag-Status wird dokumentiert und in Artifacts gespeichert

## Entscheidungslogik

Die Entscheidung, ob ein Feature aktiviert ist, basiert auf folgenden Kriterien:

1. **Überschreibungen**: Temporäre Überschreibungen für Tests haben höchste Priorität
2. **App-Modus**: Jedes Feature kann pro App-Modus (production, staging, development, demo) konfiguriert werden
3. **Benutzer-Modus**: Features können für bestimmte Benutzer-Modi (real, demo, offline) freigegeben werden
4. **Benutzer-Rolle**: Features können rollenbasiert freigegeben werden (free, pro, premium, admin)

## Feature-Flag-Lebenszyklus

Jedes Feature-Flag hat einen definierten Lebenszyklus:

1. **Development**: In Entwicklung, noch nicht vollständig implementiert
2. **Rollout**: Wird gerade ausgerollt/getestet
3. **Stable**: Stabil und vollständig implementiert
4. **Deprecated**: Veraltet, sollte entfernt werden

## Feature-Flag hinzufügen

Um ein neues Feature-Flag hinzuzufügen:

1. Erweitere den `FeatureFlag`-Typ in `config/features/index.ts`
2. Füge die Konfiguration zu `featureConfigs` hinzu, mit folgenden Pflichtfeldern:
   - Aktivierung pro App-Modus
   - `description`: Beschreibung des Features
   - `createdAt`: Erstellungsdatum (ISO-Format)
   - `owner`: Verantwortliches Team/Person 
   - `lifecycleStage`: Aktuelle Phase im Lebenszyklus
3. Verwende es in deinem Code mit `FeatureFlags.isEnabled('DEIN_FEATURE')`

## Vorbereitung für Dashboard-Integration

Die aktuelle Implementierung sammelt bereits Nutzungsdaten und Status-Informationen, die später in ein Supabase-basiertes Dashboard integriert werden können. Der `getFeatureStatus()`-Endpunkt liefert alle erforderlichen Daten für eine Visualisierung.

## Best Practices

- Verwende sprechende Namen für Feature-Flags
- Setze immer ein Ablaufdatum (`expiresAt`), wenn das Flag temporär ist
- Aktualisiere den Status (`lifecycleStage`) regelmäßig
- Verwende das Audit-Tool vor jedem Release, um veraltete Flags zu identifizieren
- Entferne veraltete Feature-Flags nach ihrem Ablaufdatum
- Nutze `markAsReplaced()`, wenn ein Flag durch ein neues ersetzt wird 