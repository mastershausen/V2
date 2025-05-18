# Migrations-Update: Mode-Struktur

## Fortschritt der Migration

Die Migration der Mode-Struktur ist in vollem Gange. Folgende Komponenten wurden bereits auf den neuen `useAppMode`-Hook umgestellt:

### Migrierte Komponenten

1. **AppModeToggle** - `features/mode/components/AppModeToggle.tsx`

   - Vollständig auf `useAppMode` migriert
   - Verwendet nun `isDemoMode()`, `switchToDemoMode()`, `switchToLiveMode()` und andere moderne APIs
   - Verbesserte visuelle Darstellung mit höherem Kontrast

2. **ProfileTabIcon** - `shared-components/navigation/icons/ProfileTabIcon.tsx`

   - Von `useMode` auf `useAppMode` umgestellt
   - Bereinigt von Render-Schleifen-Problemen

3. **Tabs-Layout** - `app/(tabs)/_layout.tsx`

   - Von `useModeManager` auf `useAppMode` umgestellt
   - Vereinfachte Implementierung ohne redundante Synchronisierungslogik

4. **appModeHelpers** - `utils/appModeHelpers.ts`

   - Legacy-Helfer mit neuer Implementierung
   - `useDemoContext` und `useIsInDemoMode` verwenden nun `useAppMode`

5. **useDebugSettings** - `features/settings/hooks/useDebugSettings.ts`

   - Debug-Einstellungs-Hook vollständig auf `useAppMode` umgestellt
   - Verbesserte Schnittstellen-Namen (z.B. `userStatus` statt `userMode`)

6. **ProfileScreen** - `features/profile/screens/ProfileScreen.tsx`

   - UI-Komponente auf neuen `useAppMode`-Hook umgestellt
   - Realistische Demo-Daten für Alexander Becker im Demo-Modus
   - Zusätzliche Profildetails werden nur im Demo-Modus angezeigt
   - Nutzt den UserStore im Live-Modus für echte Benutzerdaten

7. **PlusButton** - `shared-components/button/PlusButton.tsx`

   - Aktualisiert, um nur im Live-Mode sichtbar zu sein
   - Integration des `useAppMode`-Hooks für Mode-basierte Anzeige

8. **SettingsIcon** - `shared-components/button/SettingsIcon.tsx`

   - Aktualisiert, um nur im Live-Mode sichtbar zu sein
   - Ausblendung im Demo-Modus mit Early-Return-Muster

9. **HeaderMedia** - `shared-components/media/HeaderMedia.tsx`
   - Modus-spezifische Farben für klare visuelle Unterscheidung (Demo vs. Live)
   - Verwendet `useAppMode` zur automatischen Erkennung des aktuellen Modus
   - Vereinfachte Implementation ohne redundante DOM-Elemente

## Aktuelle Statistik

- **27 Dateien** verwenden bereits den neuen `useAppMode`-Hook
- **37 Dateien** müssen noch migriert werden

## Nächste Schritte

1. **createNuggetScreen.tsx** migrieren
2. **config/features/index.ts** migrieren
3. Test-Dateien aktualisieren
4. Weitere UI-Komponenten identifizieren und migrieren

## Implementierungsmuster

Bei der Migration wurden folgende Muster angewandt:

1. **API-Upgrade**: Umstellung von `useMode` auf `useAppMode`
2. **Funktionsaufrufe**: Sicherstellung, dass `isDemoMode()` mit Klammern aufgerufen wird
3. **Konditionales Rendering**: Komponenten mit `if (isDemoMode()) return null;` im Demo-Modus ausblenden
4. **Render-Optimierung**: Alte `useState`+`useEffect`-Muster durch `useMemo` ersetzen
5. **Visuelle Unterscheidung**: Verschiedene Farben oder Stile je nach Modus verwenden
6. **Kontextabhängiger Inhalt**: Verschiedene Daten je nach Modus anzeigen (z.B. Demo-Profildaten vs. echte Benutzerdaten)

## Manuelle Tests

Die migrierten Komponenten sollten manuell getestet werden, besonders diese Funktionen:

- Moduswechsel über AppModeToggle
- Korrekte Anzeige/Ausblendung von PlusButton und SettingsIcon im Demo-Modus
- Korrekte Anzeige des Profilbilds in verschiedenen Modi
- Korrekte Farbdarstellung der HeaderMedia im Demo- vs Live-Modus
- Korrekte Anzeige der zusätzlichen Profilinformationen von Alexander Becker nur im Demo-Modus
- Korrektes Verhalten bei Netzwerk-Unterbrechungen

## Anhang

Die umfassende Migrations-Dokumentation befindet sich in [MIGRATION.md](./MIGRATION.md) und die Feature-Dokumentation in [features/mode/README.md](./features/mode/README.md).
