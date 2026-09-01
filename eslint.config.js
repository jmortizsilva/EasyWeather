// Configuración de ESLint en formato plano (el que usa ESLint 9).
// Se apoya en las reglas de Expo y deja el formato en manos de Prettier.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecomendado = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  prettierRecomendado,
  {
    // El plugin de configuración y su prueba corren en Node al compilar, no en el móvil: ahí valen
    // require, __dirname y los globales de Jest. Hacen falta declarados porque son los únicos .js
    // del proyecto; en TypeScript esto ya lo resuelve el compilador (tsconfig: types = ["jest"]).
    files: ['plugins/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        __dirname: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
  {
    // El fichero de arranque de jest vive en la raíz, fuera de los __tests__ que la configuración
    // de Expo ya reconoce, así que hay que declararle el global `jest` a mano.
    files: ['jest.setup.js'],
    languageOptions: { globals: { jest: 'readonly' } },
  },
]);
