/**
 * Solvbox ESLint Plugin
 * 
 * Benutzerdefinierte Linting-Regeln für das Solvbox-Projekt
 */

// ESM Imports anstelle von require
import { noHardcodedStyles } from './rules/no-hardcoded-styles.js';

// ESM Export anstelle von module.exports
export default {
  rules: {
    'no-hardcoded-styles': noHardcodedStyles
  }
}; 