// Preset de Expo: transforma react-native y los módulos de Expo para poder importarlos en test.
// La lógica pura (parsers, cálculos, textos) se prueba sin dispositivo ni mocks nativos.
module.exports = {
  preset: 'jest-expo',
  // Solo se lintan/prueban ficheros de la app; el worker de Cloudflare (server/) va aparte.
  testPathIgnorePatterns: ['/node_modules/', '/server/'],
};
