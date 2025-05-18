/**
 * @file automated_fixes/isFunction_boolean_fix.ts
 * @description Automatisierte Lösung für das Problem, dass Funktionen manchmal als Boolean verwendet werden
 * 
 * Dies ist ein ESLint-Plugin, das häufige Fehler in Bezug auf die Verwendung von
 * Funktionen wie isDemoMode automatisch erkennt und behebt.
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure boolean functions are called properly',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    /**
     * Liste von Funktionsnamen, die bekanntermaßen diesen Fehler verursachen
     */
    const knownBooleanFunctions = [
      'isDemoMode',
      'isLiveMode',
      'isDevelopmentMode',
      'isAuthenticated',
      'isGuestMode',
      'isDemoUser',
      'isGuestUser',
    ];

    /**
     * Prüft, ob ein Bezeichner ein bekannter boolean-Funktionsname ist
     * @param name
     */
    const isBooleanFunction = (name) => knownBooleanFunctions.includes(name);

    return {
      // Erkennt Verwendung eines booleschen Funktionsnamens ohne Aufruf
      'MemberExpression[property.type="Identifier"]'(node) {
        if (
          isBooleanFunction(node.property.name) &&
          node.parent &&
          node.parent.type !== 'CallExpression' && 
          node.parent.callee !== node
        ) {
          context.report({
            node,
            message: `'${node.property.name}' sollte als Funktion aufgerufen werden ()`,
            fix(fixer) {
              return fixer.insertTextAfter(node, '()');
            },
          });
        }
      },

      // Erkennt Definitionen von booleschen Funktionen, die einen Wert statt einer Funktion zurückgeben
      'Property[key.name]'(node) {
        if (
          isBooleanFunction(node.key.name) &&
          node.value.type !== 'FunctionExpression' &&
          node.value.type !== 'ArrowFunctionExpression' &&
          node.value.type !== 'Identifier'
        ) {
          context.report({
            node,
            message: `'${node.key.name}' sollte als Funktion definiert werden, nicht als boolescher Wert`,
            fix(fixer) {
              // Ersetze den Wert durch eine Funktion, die den Wert zurückgibt
              const sourceCode = context.getSourceCode();
              const valueText = sourceCode.getText(node.value);
              return fixer.replaceText(node.value, `function() { return ${valueText}; }`);
            },
          });
        }
      },

      // Erkennt Verwendung ohne Funktionsaufruf in Konditionen
      Identifier(node) {
        if (isBooleanFunction(node.name)) {
          const parent = node.parent;
          
          // Überprüfe verschiedene Kontexte, in denen die Funktion direkt verwendet wird
          if (
            // In einer if-Bedingung: if (isDemoMode) { ... }
            (parent.type === 'IfStatement' && parent.test === node) ||
            // In einer bedingten (ternären) Operation: isDemoMode ? a : b
            (parent.type === 'ConditionalExpression' && parent.test === node) ||
            // In einer logischen Ausdruck: isDemoMode && doSomething()
            (parent.type === 'LogicalExpression' && 
             (parent.left === node || parent.right === node)) ||
            // In einer Zuweisung: const isDemoActive = isDemoMode
            (parent.type === 'AssignmentExpression' && parent.right === node) ||
            // In einem Vergleich: if (someVar === isDemoMode)
            (parent.type === 'BinaryExpression' && 
             (parent.left === node || parent.right === node))
          ) {
            context.report({
              node,
              message: `'${node.name}' ist eine Funktion und muss mit '()' aufgerufen werden`,
              fix(fixer) {
                return fixer.insertTextAfter(node, '()');
              }
            });
          }
        }
      },
      
      // Erkennt falsche Typendefinitionen in Interfaces
      TSPropertySignature(node) {
        if (
          node.key.type === 'Identifier' &&
          isBooleanFunction(node.key.name) &&
          node.typeAnnotation &&
          node.typeAnnotation.typeAnnotation.type === 'TSBooleanKeyword'
        ) {
          context.report({
            node,
            message: `'${node.key.name}' sollte als Funktion und nicht als Boolean deklariert werden`,
            fix(fixer) {
              // Ändere 'isDemoMode: boolean;' zu 'isDemoMode: () => boolean;'
              const start = node.typeAnnotation.range[0];
              const end = node.typeAnnotation.range[1];
              return fixer.replaceTextRange([start, end], ': () => boolean');
            }
          });
        }
      },
      
      // Überprüft mögliche Fehler bei destructuring
      VariableDeclarator(node) {
        if (
          node.id.type === 'ObjectPattern' && 
          node.init && 
          node.init.type === 'CallExpression'
        ) {
          // Suche nach Destrukturierung von Hooks: const { isDemoMode } = useMode();
          node.id.properties.forEach(prop => {
            if (
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              isBooleanFunction(prop.key.name)
            ) {
              context.report({
                node: prop,
                message: `Vorsicht: '${prop.key.name}' könnte eine Funktion sein, die mit '()' aufgerufen werden muss`,
              });
            }
          });
        }
      }
    };
  },
};

/**
 * Installationsanleitung:
 * 
 * 1. Dieses Modul in einer ESLint-Konfiguration einrichten:
 * 
 * // .eslintrc.js
 * module.exports = {
 *   plugins: ['custom-rules'],
 *   rules: {
 *     'custom-rules/boolean-function-consistency': 'error',
 *   },
 * };
 * 
 * 2. Die ESLint-Konfiguration muss dieses Modul laden können, z.B. durch:
 * 
 * // eslint.config.js oder eslint-local-rules.js
 * module.exports = {
 *   'boolean-function-consistency': require('./automated_fixes/isFunction_boolean_fix.ts'),
 * };
 */

/**
 * Typprüfung für TypeScript-Codebasis:
 * 
 * Neben dem ESLint-Plugin sollten auch TypeScript-Typen aktualisiert werden:
 * 
 * // Beispiel: features/mode/hooks/types.ts
 * export interface UseAppModeResult {
 *   // Anstatt:
 *   // isDemoMode: boolean;
 *   
 *   // Richtig:
 *   isDemoMode: () => boolean;
 * }
 */

/**
 * Weitere Tools zur Konsistenzprüfung:
 * 
 * 1. TypeScript-Compiler kann helfen, diese Fehler zu erkennen
 * 2. Unit-Tests, die die korrekte Verwendung dieser Funktionen überprüfen
 * 3. Ein Pre-Commit-Hook könnte dieses ESLint-Plugin ausführen
 * 4. Automatische Codeformatierung mit Prettier könnte erweitert werden, um diese Probleme zu erkennen
 */ 