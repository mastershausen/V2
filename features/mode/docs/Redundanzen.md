# Analyse der Redundanzen im Mode-System

Dieses Dokument identifiziert und analysiert alle redundanten Zustände und Konzepte im aktuellen Mode-System.

## 1. Redundante Zustandswerte im Store

| Redundantes Wertepaar                            | Beschreibung                                                                              | Empfehlung                                                                                     |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `currentAppMode` vs. `isDemoMode()/isLiveMode()` | `isDemoMode()` ist lediglich ein Selektor, der `currentAppMode === 'demo'` überprüft      | Entfernen der redundanten Selektoren und nur `appMode` verwenden                               |
| `currentUserMode` vs. `isDemoAccount`            | In vielen Kontexten bedeutet `currentUserMode === 'demo'` das Gleiche wie `isDemoAccount` | `userStatus` als einzige Quelle der Wahrheit verwenden (Typ: 'authenticated', 'demo', 'guest') |
| Mehrere 'development'-Überprüfungen              | Es gibt `isDevelopmentMode()` und `__DEV__`-Checks                                        | `__DEV__` direkt nutzen oder in eine Config-Datei auslagern                                    |

## 2. Redundante Hook-Konzepte

| Redundantes Konzept               | Beschreibung                                                                          | Empfehlung                                         |
| --------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `useMode` vs. `useModeManager`    | Überlappende Funktionalität mit unterschiedlichen Schnittstellen                      | Zu einem einzigen Hook `useAppMode` zusammenfassen |
| Verschiedene Switching-Funktionen | `setAppMode`, `toggleAppMode`, `switchToMode`, `switchToDemoMode`, `switchToLiveMode` | Auf eine Basisfunktion `setMode` reduzieren        |

## 3. Redundante Status-Überprüfungen

| Redundante Überprüfung                                           | Beschreibung                                       | Empfehlung                                                              |
| ---------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| `canSwitchModes` vs. `canSwitchToDemoMode`/`canSwitchToLiveMode` | Spezielle Varianten der gleichen Basislogik        | In eine parametrisierte Funktion `canSwitchToMode(mode)` zusammenfassen |
| `isSessionValid` + `isAuthenticated` + `needsReauthentication`   | Überlappende Konzepte für Authentifizierungsstatus | Durch ein einziges Konzept `authStatus` ersetzen                        |

## 4. Redundante Modellierung der Modes

| Redundanz                 | Beschreibung                                                                                           | Empfehlung                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `AppMode` vs. `UserMode`  | Unterschiedliche aber eng verwandte Konzepte mit ähnlichen Werten ('demo'/'live' vs. 'demo'/'regular') | Zu `AppMode` und `UserStatus` umgestalten mit eindeutigen Werten |
| `ModeEvents` Namensgebung | Viele ähnliche Typen wie `APP_MODE_CHANGED`, `USER_MODE_CHANGED`                                       | Vereinheitlichung und Reduktion der Event-Typen                  |

## 5. Redundante Feature-Flag-Logik

| Redundanz                                        | Beschreibung                                          | Empfehlung                                                  |
| ------------------------------------------------ | ----------------------------------------------------- | ----------------------------------------------------------- |
| `usesMockData` vs. `isDemoMode`                  | `usesMockData` ist direkt aus `isDemoMode` abgeleitet | Berechnen bei Bedarf, nicht als separaten Zustand speichern |
| `showsDebugButtons` vs. `__DEV__` & `isDemoMode` | Häufig direkt aus diesen Werten abgeleitet            | Als abgeleiteten Wert im Hook berechnen                     |

## 6. Verstreute Typdeklarationen

| Problem                        | Beschreibung                                                                       | Empfehlung                                       |
| ------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------ |
| Typen in verschiedenen Dateien | `AppMode` wird in `ModeService`, `modeTypes.ts` und einzelnen Hooks neu deklariert | Zentrale Typdeklaration in einer Datei           |
| Import/Re-Export-Ketten        | Viele Re-exports von Typen durch verschiedene Schichten                            | Flachere Import-Hierarchie mit direkten Importen |

## 7. Überflüssige API-Funktionen

| Redundanz                          | Beschreibung                                                 | Empfehlung                                     |
| ---------------------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| `setDemoAccount` vs. `setUserMode` | Überlappende Funktionalität, die den gleichen Zustand ändert | Auf `setUserStatus` vereinheitlichen           |
| `initializeStore` Logik            | Dupliziert die Logik, die bereits im Service existiert       | Initialzustand direkt aus dem Service ableiten |

## 8. Fazit und Handlungsempfehlungen

Die Hauptprobleme im aktuellen Mode-System sind:

1. **Zu viele Abstraktionsebenen** (Service -> Store -> Hooks -> Manager)
2. **Unklare Begriffsabgrenzung** zwischen App-Modus und Nutzer-Status
3. **Redundante Zustände** statt abgeleiteter Werte
4. **Überlappende Funktionen** mit unterschiedlicher Benennung

**Empfohlene Vorgehensweise:**

1. Reduziere auf zwei klare Kernzustände: `appMode` und `userStatus`
2. Entferne alle redundanten Selektoren und berechne diese Werte bei Bedarf
3. Vereinheitliche die Hook-Schnittstelle auf einen klaren, parametrisierten Ansatz
4. Strukturiere die Typdeklarationen so, dass sie zentral definiert und konsistent importiert werden
