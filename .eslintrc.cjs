module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsdoc/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.eslint.json'
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jsdoc',
    'import'
    // 'solvbox' - Plugin wird nicht verwendet, da es nicht installiert ist
    // 'solvbox-architecture', // Unser eigenes Plugin (wird später erstellt)
  ],
  ignorePatterns: [
    "node_modules/",
    "reports/",
    "build/",
    "dist/",
    ".expo/",
    "test-results/",
    "coverage/",
    "ios/",
    "android/",
    "*.d.ts",
    "generated/",
    "MyCleanExpoTest/"  // Testprojekt ausschließen
  ],
  settings: {
    react: {
      version: 'detect',
    },
    jsdoc: {
      mode: 'typescript',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
      // Der manuelle alias-Block wurde entfernt, da der TypeScript-Resolver
      // die Aliase direkt aus der tsconfig.json lesen kann
    }
  },
  rules: {
    // Kritische Regeln (Blocker) auf "error"
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    
    // Theme-Regeln - Auskommentiert, da Plugin nicht existiert
    // 'solvbox/no-hardcoded-styles': ['warn', {
    //   disallowColorLiterals: true,
    //   allowedNumericProps: ['opacity', 'flex', 'zIndex', 'fontWeight'],
    //   allowedNumbers: [0, 1, 2],
    //   ignorePatterns: ["**/__tests__/**", "**/config/theme/**"]
    // }],
    
    // 1. KLARE EXPORT-REGELN
    // Default Exports verbieten (mit Ausnahmen in Overrides)
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',
    
    // Code-Stil: Komponenten-Definition
    'react/function-component-definition': ['error', {
      namedComponents: 'function-declaration',
      unnamedComponents: 'arrow-function',
    }],
    
    // 2. JSDOC PRAGMATISCH HANDHABEN
    // JSDoc auf "warn" für die meisten Dateien
    'jsdoc/require-jsdoc': ['warn', {
      publicOnly: true,
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: false,
        FunctionExpression: false,
      }
    }],
    'jsdoc/require-param': 'warn',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-type': 'warn',
    'jsdoc/require-returns': 'warn',
    'jsdoc/require-returns-type': 'warn',
    'jsdoc/tag-lines': 'warn',
    
    // 5. KONSISTENTE IMPORT-PFAD-KONVENTION
    // Relative Parent-Imports verbieten (stattdessen Aliase nutzen)
    'import/no-relative-parent-imports': 'error',
    
    // Import-Pfad-Konventionen durchsetzen
    'import/no-unresolved': 'error',
    'import/extensions': ['error', 'never', { 
      json: 'always',
      svg: 'always',
      png: 'always',
      jpg: 'always',
      jpeg: 'always' 
    }],
    
    // Import-Reihenfolge
    'import/order': ['warn', {
      groups: [
        ['builtin', 'external'],
        'internal',
        ['parent', 'sibling', 'index'],
      ],
      pathGroups: [
        {
          pattern: 'react',
          group: 'external',
          position: 'before'
        },
        {
          pattern: '{react-*,react-*/**}',
          group: 'external',
          position: 'before'
        },
        {
          pattern: '@features/**',
          group: 'internal',
          position: 'after'
        },
        {
          pattern: '@shared-components/**',
          group: 'internal',
          position: 'after'
        },
        {
          pattern: '@services/**',
          group: 'internal',
          position: 'after'
        },
        {
          pattern: '@hooks/**',
          group: 'internal',
          position: 'after'
        },
        {
          pattern: '@contexts/**',
          group: 'internal',
          position: 'after'
        },
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],
    
    // Verbieten von console.log in Produktion, sonst warnen
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // Regeln für TypeScript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    
    // Weitere Style-Regeln
    'react/display-name': 'warn',
    'prefer-const': 'warn',
  },
  overrides: [
    // Override für UI-Layer: Blockiert direkte Funktionsaufrufe alter APIs
    // und beschränkt Imports für UI-Komponenten
    {
      files: ['app/**/*.tsx', 'features/**/*.tsx', 'shared-components/**/*.tsx'],
      rules: {
        /* blockiert direkte Funktionsaufrufe alter APIs */
        'no-restricted-syntax': [
          'error',
          {
            selector:
              "CallExpression[callee.property.name=/^(getAppMode|isDemoMode|clearProfileImageStore|updateProfileImageStoreGlobally|clearProfileImageCache)$/]",
            message:
              'Diese Funktion darf im UI-Layer nicht aufgerufen werden – verwende toggleDemoMode() oder Store-Hooks.'
          }
        ],
        /* verbietet alte Cache-APIs im UI-Layer */
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@/utils/profileImageStoreHelper',
                importNames: [
                  'updateProfileImageStoreGlobally',
                  'clearProfileImageStore',
                  'clearProfileImageCache'
                ],
                message:
                  'Diese Cache-Funktionen dürfen im UI-Layer nicht mehr direkt verwendet werden – nutze toggleDemoMode() oder den ProfileCacheManager.'
              },
              {
                name: '@/stores/profileImageStore',
                message:
                  'Direkter Zugriff auf den Store ist im UI-Layer untersagt – verwende Hooks oder den ProfileCacheManager.'
              },
              {
                name: '@/config/app/mode',
                importNames: ['AppMode'],
                message: 'Bitte importiere AppMode direkt aus "@/features/mode/types"'
              },
              {
                name: '@/config/app/env',
                importNames: ['AppMode'],
                message: 'Bitte importiere AppMode direkt aus "@/features/mode/types"'
              },
              {
                name: '@/stores/types/appModeTypes',
                importNames: ['AppMode'],
                message: 'Bitte importiere AppMode direkt aus "@/features/mode/types"'
              },
              {
                name: '@/stores/types/modeTypes',
                importNames: ['AppMode'],
                message: 'Bitte importiere AppMode direkt aus "@/features/mode/types"'
              },
              {
                name: '@/types/auth',
                importNames: ['AppMode'],
                message: 'Bitte importiere AppMode direkt aus "@/features/mode/types"'
              },
              {
                name: '@/types/auth/statusTypes',
                importNames: ['AppMode'],
                message: 'Bitte importiere AppMode direkt aus "@/features/mode/types"'
              }
            ]
          }
        ]
      }
    },
    // Override für App-Modus-Einsatz: Nur in zentralen Config- und Service-Dateien erlaubt
    {
      files: ['**/*.ts', '**/*.tsx'],
      excludedFiles: ['services/app-mode/**/*.ts', 'config/**/*.ts', 'utils/environment.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@/utils/environment',
                importNames: ['APP_ENV', 'appMode'],
                message: 'APP_ENV und appMode dürfen nur in den zentralen Konfigurationsdateien verwendet werden. Bitte verwende die Helfer-Funktionen isDevelopmentMode(), isDemoMode() oder isLiveMode() aus config/app/env.ts für alle Modus-bezogenen Abfragen.'
              }
            ]
          }
        ],
        'no-restricted-syntax': [
          'error',
          {
            selector: "BinaryExpression[operator='==='][left.name='appMode']",
            message: 'Direkter Vergleich mit appMode ist nicht erlaubt. Bitte verwende die Helfer-Funktionen isDevelopmentMode(), isDemoMode() oder isLiveMode() aus config/app/env.ts.'
          },
          {
            selector: "BinaryExpression[operator='==='][right.name='appMode']",
            message: 'Direkter Vergleich mit appMode ist nicht erlaubt. Bitte verwende die Helfer-Funktionen isDevelopmentMode(), isDemoMode() oder isLiveMode() aus config/app/env.ts.'
          },
          {
            selector: "BinaryExpression[operator='==='][left.object.name='process'][left.property.name='env'][left.object.property.name='APP_ENV']",
            message: 'Direkter Zugriff auf process.env.APP_ENV ist nicht erlaubt. Bitte verwende die Helfer-Funktionen isDevelopmentMode(), isDemoMode() oder isLiveMode() aus config/app/env.ts.'
          }
        ]
      }
    },
    // Override für Utils, Stores und Services: Import-Beschränkungen deaktivieren
    {
      files: ['utils/**/*.ts', 'stores/**/*.ts', 'services/**/*.ts'],
      rules: {
        'no-restricted-imports': 'off',
        'no-restricted-syntax': 'off'
      }
    },
    // 2. JSDOC PRAGMATISCH HANDHABEN
    // JSDoc für Hilfsprogramme, Tests und Legacy-Code lockern
    {
      files: [
        'utils/**/*.ts',
        '**/__tests__/**/*.ts?(x)',
        '**/*.test.ts?(x)',
        'features/editprofile/**/*.ts?(x)'
      ],
      rules: {
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-returns': 'off',
        'jsdoc/require-param': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-returns-type': 'off',
        '@typescript-eslint/no-explicit-any': 'warn'
      }
    },
    // Public-APIs: Strengere JSDoc-Regeln und any = error
    {
      files: [
        "services/**/*.ts",
        "features/*/hooks/**/*.ts",
        "shared-components/**/*.tsx"
      ],
      rules: {
        "@typescript-eslint/no-explicit-any": "error",
        'jsdoc/require-jsdoc': 'error',
        'jsdoc/require-returns': 'error',
        'jsdoc/require-param': 'error',
        'jsdoc/require-param-description': 'error'
      }
    },
    // 1. KLARE EXPORT-REGELN - MIT AUSNAHMEN
    // Screen-Komponenten dürfen Default-Export verwenden
    {
      files: ['**/features/*/screens/*.tsx', 'app/**/*.tsx'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'warn',
      }
    },
    // Andere Komponenten müssen Named Exports verwenden
    {
      files: ['**/features/*/components/*.tsx', '**/shared-components/**/*.tsx'],
      rules: {
        'import/no-default-export': 'error',
        'import/prefer-default-export': 'off',
      }
    },
    // Node-Umgebung und require/imports in Scripts und Configs akzeptieren
    {
      files: [
        ".eslintrc.js",
        ".eslintrc.cjs",
        "scripts/**/*.js",
        "scripts/**/*.ts",
        "backups/**/*.js",
        "backups/**/*.ts",
        "babel.config.js",
        "babel.config.cjs",
        "metro.config.js"
      ],
      env: { node: true },
      rules: {
        "no-undef": "off",
        "@typescript-eslint/no-require-imports": "off"
      }
    },
    // 5. KONSISTENTE IMPORT-PFAD-KONVENTION
    // Neue Override-Regel für Feature-Module
    {
      files: ['features/*/!(screens)/**/*.ts?(x)', 'features/*/!(screens)/**/*.js?(x)'],
      rules: {
        // Feature-interne Importe müssen relativ sein (./), keine Alias-Pfade innerhalb des gleichen Features
        'no-restricted-imports': ['error', {
          patterns: [{
            group: [`@features/${path => {
              // Extrahiert den Feature-Namen aus dem Dateipfad
              const match = /features\/([^/]+)\//.exec(path);
              return match ? match[1] : '';
            }}/*`],
            message: 'Verwende relative Importe (./) für Dateien innerhalb des gleichen Features.'
          }]
        }]
      }
    }
  ]
}; 