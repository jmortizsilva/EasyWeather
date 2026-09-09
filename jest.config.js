// Preset de Expo: transforma react-native y los módulos de Expo para poder importarlos en test.
// La lógica pura (parsers, cálculos, textos) se prueba sin dispositivo ni mocks nativos.
module.exports = {
  preset: 'jest-expo',
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
