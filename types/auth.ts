/**
 * @file types/auth.ts
 * @description Re-Export aller Auth-Typen aus dem auth/-Verzeichnis nach Goldstandard
 */

// Re-Export aller detaillierten Typ-Definitionen
export * from './auth/index';

// Diese Datei dient nur als Kompatibilitätsschicht, um bestehenden Code nicht zu brechen.
// Neue Implementierungen sollten Typen direkt aus './auth/*' oder './auth/index' importieren. 