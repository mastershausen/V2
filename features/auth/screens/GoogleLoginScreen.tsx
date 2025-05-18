// Da wir keine direkten Änderungen in der Datei vornehmen können, da wir sie nicht kennen,
// hier ein allgemeiner Codeteil, der angepasst werden sollte, wenn er ähnlich aufgebaut ist wie LoginScreen.tsx:

/*
Suche nach dem erfolgreichen Login-Teil (nach await login oder nach success-Prüfung) und füge hinzu:

// WICHTIG: Nach Login explizit den Demo-Modus setzen, um den ungewollten Live-Modus zu verhindern
try {
  const modeStore = useModeStore.getState();
  await modeStore.setAppMode('demo');
  logger.debug('App-Modus nach Google-Login explizit auf Demo gesetzt');
} catch (modeError) {
  logger.error('Fehler beim Setzen des Demo-Modus nach Google-Login:', modeError instanceof Error ? modeError.message : String(modeError));
}
*/ 