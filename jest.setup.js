// AsyncStorage es un módulo NATIVO: al importarlo en un test sin dispositivo revienta con
// "NativeModule: AsyncStorage is null" antes de ejecutar nada. La librería trae su propio doble
// para jest, que guarda en memoria; se registra aquí y no en cada fichero de prueba para que
// añadir una caché a cualquier servicio no obligue a tocar sus tests.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
