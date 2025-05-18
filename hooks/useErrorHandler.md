# useErrorHandler - Zentrales Error-Handling für die Anwendung

Der `useErrorHandler`-Hook bietet eine einheitliche und robuste Fehlerbehandlungsstrategie für die gesamte Anwendung. Er reduziert Duplizierung von Code, verbessert die Konsistenz des Error-Handlings und vereinfacht die Integration von Fehlerbehandlung in Komponenten und Hooks.

## Vorteile des zentralen Error-Handlers

- **Konsistente Fehlerbehandlung** in der gesamten Anwendung
- **Einheitliches Logging-Format** mit bereichsspezifischen Loggern
- **Typsicherheit** durch vollständige TypeScript-Integration
- **Flexibilität** bei der Fehleranzeige (Inline, Toast, Alert)
- **Reduzierung von Boilerplate-Code** in Komponenten und Hooks

## Grundlegende Verwendung

```tsx
import { useErrorHandler } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { error, handleError } = useErrorHandler();

  const fetchData = async () => {
    // Verwende handleError, um die Funktion mit Error-Handling zu umschließen
    const data = await handleError(
      async () => {
        const response = await api.getData();
        return response.data;
      },
      { errorMessage: 'Fehler beim Laden der Daten' }
    )();

    if (data) {
      // Verarbeite die Daten
    }
  };

  // Zeige Fehler an, wenn vorhanden
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    // Normaler Komponenten-Render
  );
}
```

## Erweiterte Konfiguration

Der Hook kann mit verschiedenen Optionen konfiguriert werden:

```tsx
const { error, handleError, notificationType } = useErrorHandler({
  // Bereichsspezifischer Logger-Präfix
  loggerPrefix: "📊 DataComponent",

  // Standard-Typ für Fehlerbenachrichtigungen
  defaultNotificationType: ErrorNotificationType.TOAST,

  // Callback, der bei Fehlern ausgeführt wird
  onError: (error) => {
    analytics.trackError(error);
  },
});
```

## Integration mit bestehenden Komponenten

Der `useErrorHandler` kann leicht in bestehende Komponenten integriert werden:

### Mit Error Boundaries

```tsx
<ErrorBoundary
  fallback={<ErrorFallbackComponent />}
  onError={(error) => {
    // Behandle den Fehler mit dem zentralen Handler
    handleError(() => {
      throw error;
    })();
  }}
>
  <MyComponent />
</ErrorBoundary>
```

### Mit asynchronen Funktionen

```tsx
// Direkte Verwendung
const handleSubmit = async () => {
  await handleError(
    async () => {
      await submitForm(data);
    },
    {
      errorMessage: "Fehler beim Absenden des Formulars",
      notificationType: ErrorNotificationType.TOAST,
    }
  )();
};

// Alternative: Vorbereiten einer Funktion zur späteren Verwendung
const handleSubmitWithErrorHandling = handleError(submitForm, {
  errorMessage: "Fehler beim Absenden des Formulars",
});

// Spätere Verwendung
await handleSubmitWithErrorHandling(data);
```

## Fehlertypen und UI-Integration

Der Hook unterstützt verschiedene Arten der Fehleranzeige:

- `ErrorNotificationType.NONE`: Keine UI-Anzeige, nur Logging
- `ErrorNotificationType.INLINE`: Fehleranzeige direkt in der Komponente
- `ErrorNotificationType.TOAST`: Fehleranzeige als Toast-Nachricht
- `ErrorNotificationType.ALERT`: Fehleranzeige als modaler Alert

## Best Practices

1. **Einen bereichsspezifischen Logger verwenden**:

   ```tsx
   const { error } = useErrorHandler({ loggerPrefix: "🔍 SearchScreen" });
   ```

2. **Fehlertyp je nach Kontext anpassen**:

   ```tsx
   handleError(submitForm, {
     notificationType: isModal
       ? ErrorNotificationType.ALERT
       : ErrorNotificationType.TOAST,
   });
   ```

3. **Fehler sammeln und aggregieren**:

   ```tsx
   const appErrorHandler = useErrorHandler({
     onError: (error) => errorReportingService.send(error),
   });
   ```

4. **Wiederverwendbare Error-Handler in Custom Hooks**:
   ```tsx
   function useDataFetching(url) {
     const { handleError, error } = useErrorHandler();
     const [data, setData] = useState(null);

     const fetchData = useCallback(async () => {
       const result = await handleError(
         () => fetch(url).then((res) => res.json()),
         { errorMessage: `Fehler beim Laden von ${url}` }
       )();

       if (result) {
         setData(result);
       }
     }, [url, handleError]);

     return { data, error, fetchData };
   }
   ```

Durch konsistente Verwendung des `useErrorHandler`-Hooks wird die Fehlerbehandlung in der gesamten Anwendung vereinheitlicht und robuster. Dies verbessert sowohl die Entwicklererfahrung als auch die Endnutzererfahrung.
