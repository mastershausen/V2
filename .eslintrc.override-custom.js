module.exports = {
  extends: './.eslintrc.cjs',
  rules: {
    // Deaktiviere Regeln für Warnungen, aber behalte kritische Fehler bei
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-jsdoc': 'off',
    'import/no-unresolved': 'off',
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'off',
    
    // Behalte kritische Fehler bei
    'no-case-declarations': 'error'
  }
}; 