/**
 * Regel zur Vermeidung von hardcodierten Style-Werten
 * 
 * Erkennt, wenn Style-Eigenschaften mit hardcodierten Werten versehen werden,
 * anstatt die Theme-Konstanten zu verwenden.
 */

// Reguläre Ausdrücke für Style-Eigenschaften
const styleRegex = /style\s*=\s*{.*?}/s;
const inlineStyleRegex = /style\s*=\s*".*?"/s;

// Farb-Regex: Hex, RGB(A), HSL(A), benannte Farben
const colorRegex = /(#[0-9A-Fa-f]{3,8}|\b(rgb|rgba|hsl|hsla)\s*\([^)]*\)|'#[^']*'|"#[^"]*")/;

// Liste von CSS-Eigenschaften, die Farben verwenden
const colorProperties = [
  // Textfarben
  'color',
  'textDecoration',
  'textShadow',
  
  // Hintergrundfarben
  'backgroundColor',
  'background',
  'backgroundImage',
  
  // Rahmen und Umrisse
  'border',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'outlineColor',
  
  // Schatten
  'boxShadow',
  'shadowColor',
  
  // Farbübergänge
  'gradientColorStop',
  'gradientColorStops',
  
  // Spezielle UI-Elemente
  'tintColor',
  'overlayColor',
];

// Liste von CSS-Eigenschaften für Dimensionen und Abstände
const sizeProperties = [
  // Größe
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  
  // Innenabstand
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingHorizontal',
  'paddingVertical',
  
  // Rand
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginHorizontal',
  'marginVertical',
  
  // Positionierung
  'top',
  'right',
  'bottom',
  'left',
  
  // Umriss und Rahmen
  'borderWidth',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  
  // Radiuseffekte
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  
  // Schatten
  'shadowOffset',
  'shadowRadius',
  'shadowOpacity',
  'elevation',
  
  // Text und Schrift
  'fontSize',
  'lineHeight',
  'letterSpacing',
];

/**
 * Prüft, ob eine CSS-Eigenschaft zu den überwachten Eigenschaften gehört
 * @param {string} property - Die zu prüfende CSS-Eigenschaft
 * @returns {boolean} true, wenn die Eigenschaft überwacht werden soll
 */
function isWatchedProperty(property) {
  // Wenn es sich um eine Farb- oder Größeneigenschaft handelt
  return colorProperties.includes(property) || 
         sizeProperties.includes(property);
}

/**
 * ESLint-Regel zur Vermeidung von hardcodierten Stilwerten
 */
export const noHardcodedStyles = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Verhindert hardcodierte Stilwerte in React/React Native',
      category: 'Stylistic Issues',
      recommended: true,
    },
    fixable: null,
    schema: [], // keine Optionen
  },
  
  create(context) {
    return {
      // JSX-Attribute wie style={{ ... }} finden
      JSXAttribute(node) {
        if (node.name.name === 'style' && node.value && node.value.expression && node.value.expression.type === 'ObjectExpression') {
          const styleObject = node.value.expression;
          
          // Prüfe jede Style-Eigenschaft
          styleObject.properties.forEach(prop => {
            if (prop.type === 'Property' && prop.key && prop.key.name) {
              const propertyName = prop.key.name;
              
              // Überprüfe nur überwachte Eigenschaften
              if (!isWatchedProperty(propertyName)) {
                return;
              }
              
              // Prüfe auf Literalwerte (Zahlen und Strings)
              if (prop.value.type === 'Literal') {
                // String- oder Zahlenwerte
                if (
                  (typeof prop.value.value === 'string' && colorProperties.includes(propertyName)) ||
                  (typeof prop.value.value === 'number' && sizeProperties.includes(propertyName) && 
                   Math.abs(prop.value.value) > 1 && prop.value.value !== 0 && prop.value.value !== 1)
                ) {
                  context.report({
                    node: prop,
                    message: `Hardcodierter Wert für '${propertyName}' gefunden. Verwende stattdessen Theme-Konstanten.`,
                  });
                }
              }
              
              // Prüfe auf hardcodierte Farben in TemplateLiterals
              if (prop.value.type === 'TemplateLiteral' && colorProperties.includes(propertyName)) {
                const templateValue = context.getSourceCode().getText(prop.value);
                if (colorRegex.test(templateValue)) {
                  context.report({
                    node: prop.value,
                    message: `Hardcodierte Farbe in Template-Literal für '${propertyName}' gefunden. Verwende stattdessen Theme-Farben.`,
                  });
                }
              }
            }
          });
        }
      },
    };
  },
}; 