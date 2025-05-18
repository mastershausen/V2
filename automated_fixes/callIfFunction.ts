/**
 * Hilfsfunktion, die prüft, ob ein Wert eine Funktion ist und sie entsprechend aufruft
 *
 * Diese Funktion ist nützlich, um mit Inkonsistenzen in der API umzugehen,
 * wo z.B. isDemoMode manchmal eine Funktion und manchmal ein boolescher Wert ist.
 * @param value Ein Wert, der eine Funktion oder ein direkter Wert sein kann
 * @returns {boolean} Das Ergebnis der Funktion oder der direkte Wert
 * @example
 * // Bei einer Funktion:
 * const result = callIfFunction(isDemoMode); // isDemoMode() wird aufgerufen
 * 
 * // Bei einem direkten Wert:
 * const result = callIfFunction(true); // true wird direkt zurückgegeben
 */
export function callIfFunction<T>(value: T | (() => T)): T {
  return typeof value === 'function' ? (value as () => T)() : value;
}

/**
 * Spezialisierte Version für boolesche Werte
 * @param value
 */
export function callIfBooleanFunction(value: boolean | (() => boolean)): boolean {
  return typeof value === 'function' ? (value as () => boolean)() : Boolean(value);
}

/**
 * Listen mehrerer Werte, von denen einige Funktionen sein könnten
 * @param conditions Mehrere Werte oder Funktionen, die boolesche Werte zurückgeben
 * @returns {boolean} true, wenn alle Bedingungen erfüllt sind
 */
export function allTrue(...conditions: (boolean | (() => boolean))[]): boolean {
  return conditions.every(condition => callIfBooleanFunction(condition));
}

/**
 * Prüft, ob mindestens ein Wert true ist
 * @param conditions Mehrere Werte oder Funktionen, die boolesche Werte zurückgeben
 * @returns {boolean} true, wenn mindestens eine Bedingung erfüllt ist
 */
export function anyTrue(...conditions: (boolean | (() => boolean))[]): boolean {
  return conditions.some(condition => callIfBooleanFunction(condition));
} 