# Build-Anleitung

Diese Anleitung erklärt, wie du die verschiedenen Build-Typen der App verwenden kannst.

## Verfügbare Build-Typen

Die App unterstützt drei verschiedene Build-Typen:

1. **DevBuild (Development)** - Für Entwicklung und Testing
2. **DemoBuild (Demo)** - Für Vorführungen ohne echtes Backend
3. **LiveBuild (Production)** - Für produktiven Einsatz mit Backend-Integration

## Starten der App in verschiedenen Build-Typen

Je nach Build-Typ kannst du die folgenden Befehle verwenden:

### DevBuild (Standard)

```bash
npm start
# oder
npm run start:dev
```

### DemoBuild

```bash
npm run start:demo
```

### LiveBuild

```bash
npm run start:live
```

## Starten auf spezifischen Plattformen

Du kannst die verschiedenen Build-Typen auch direkt für spezifische Plattformen starten:

### iOS

```bash
npm run ios          # DevBuild
npm run ios:demo     # DemoBuild
npm run ios:live     # LiveBuild
```

### Android

```bash
npm run android          # DevBuild
npm run android:demo     # DemoBuild
npm run android:live     # LiveBuild
```

## Build-Typ-Eigenschaften

Die verschiedenen Build-Typen haben unterschiedliche Eigenschaften:

### DevBuild

- Unterstützt sowohl Demo- als auch Live-Modus
- Zeigt Debug-Informationen und zusätzliche Entwicklungstools
- Verwendet lokale API oder Mock-Daten

### DemoBuild

- Ausschließlich im Demo-Modus (kann nicht zum Live-Modus wechseln)
- Verwendet Mock-Daten statt echter Backend-Verbindung
- Versteckt Debug-Informationen und Entwicklungstools

### LiveBuild

- Ausschließlich im Live-Modus (kann nicht zum Demo-Modus wechseln)
- Verbindet sich mit dem echten Backend
- Keine Debug-Informationen oder Entwicklungstools sichtbar

## Umgebungsvariablen

Die Build-Typen werden durch Umgebungsvariablen in den folgenden Dateien definiert:

- `.env.development` - Für DevBuild
- `.env.demo` - Für DemoBuild
- `.env.production` - Für LiveBuild

Die wichtigste Variable ist `BUILD_TYPE`, die den aktuellen Build-Typ definiert.
