/**
 * Codemod, das fehlende React-Importe zu JSX-Dateien hinzufügt
 * @param fileInfo
 * @param api
 */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  
  // Prüfen, ob JSX in der Datei verwendet wird
  const hasJSX = root.find(j.JSXElement).size() > 0 || 
                 root.find(j.JSXFragment).size() > 0 ||
                 root.find(j.JSXExpressionContainer).size() > 0;
  
  // Wenn keine JSX vorhanden ist, keine Änderungen vornehmen
  if (!hasJSX) {
    return fileInfo.source;
  }
  
  // Prüfen, ob bereits ein React-Import existiert
  const hasReactImport = root
    .find(j.ImportDeclaration)
    .filter(path => path.node.source.value === 'react')
    .size() > 0;
  
  // Wenn JSX verwendet wird aber kein React-Import existiert, füge ihn hinzu
  if (hasJSX && !hasReactImport) {
    const reactImport = j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier('React'))],
      j.literal('react')
    );
    
    // Füge den React-Import an den Anfang der Datei ein
    root.get().node.program.body.unshift(reactImport);
    
    return root.toSource();
  }
  
  // Keine Änderungen notwendig
  return fileInfo.source;
}; 