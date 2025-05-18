#!/bin/bash
echo "Führe ESLint speziell für die Store- und Utility-Dateien aus..."
npx eslint stores/index.ts utils/logger.ts --config .eslintrc.js 