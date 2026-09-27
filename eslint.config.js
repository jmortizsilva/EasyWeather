// Configuración de ESLint en formato plano (el que usa ESLint 9).
// Se apoya en las reglas de Expo y deja el formato en manos de Prettier.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecomendado = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  prettierRecomendado,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
  {
    // Las herramientas de la carpeta `herramientas/` las ejecuta Node a mano (no Metro, no el
    // teléfono), así que usan APIs de Node que la configuración de Expo no da por conocidas.
    files: ['herramientas/**/*.mjs'],
    languageOptions: { globals: { Buffer: 'readonly' } },
  },
  {
    // El fichero de arranque de jest vive en la raíz, fuera de los __tests__ que la configuración
    // de Expo ya reconoce, así que hay que declararle el global `jest` a mano.
    files: ['jest.setup.js'],
    languageOptions: { globals: { jest: 'readonly' } },
  },
]);
