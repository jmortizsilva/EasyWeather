// Configuración de ESLint en formato plano (el que usa ESLint 9).
// Se apoya en las reglas de Expo y deja el formato en manos de Prettier.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecomendado = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  prettierRecomendado,
  {
    // server/ es el worker de Cloudflare (otro runtime, su propio package.json): no es la app.
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'server/*'],
  },
]);
