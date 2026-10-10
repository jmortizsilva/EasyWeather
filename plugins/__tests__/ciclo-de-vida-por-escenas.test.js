const fs = require('fs');
const path = require('path');

const {
  cambiarAppDelegate,
  DECLARACION_DE_ESCENA,
  DELEGADO_DE_ESCENA,
} = require('../ciclo-de-vida-por-escenas');

// AppDelegate.sdk57.swift es el que generó `expo prebuild` el 2026-10-10 con expo 57.0.27, idéntico
// al de la plantilla expo-template-bare-minimum 57.0.29. La plantilla no está en node_modules
// (prebuild la descarga), así que esta copia es lo más cerca del original que se puede probar sin
// red. Lo que de verdad dice si funciona es abrir la app en un iPhone con iOS 27.
const PLANTILLA = fs.readFileSync(path.join(__dirname, 'AppDelegate.sdk57.swift'), 'utf8');

describe('el paso al ciclo de vida por escenas', () => {
  it('declara el protocolo que pide el delegado de escena de Expo', () => {
    expect(cambiarAppDelegate(PLANTILLA)).toContain(
      'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {',
    );
  });

  it('el AppDelegate ya no crea la ventana ni arranca React Native', () => {
    const resultado = cambiarAppDelegate(PLANTILLA);
    expect(resultado).not.toContain('UIWindow(frame:');
    expect(resultado).not.toContain('startReactNative');
  });

  it('sigue creando la factoría, que es lo que la escena le pide', () => {
    expect(cambiarAppDelegate(PLANTILLA)).toContain('reactNativeFactory = factory');
  });

  it('no cambia nada si ya está aplicado', () => {
    const una = cambiarAppDelegate(PLANTILLA);
    expect(cambiarAppDelegate(una)).toBe(una);
  });

  it('lanza si el AppDelegate no es el esperado, en vez de dejarlo a medias', () => {
    const otro = PLANTILLA.replace('factory.startReactNative(', 'factory.arrancar(');
    expect(() => cambiarAppDelegate(otro)).toThrow(/no es el que espero/);
  });

  it('el delegado declarado en el Info.plist es la clase que trae expo', () => {
    const fuente = fs.readFileSync(
      require.resolve('expo/ios/AppDelegates/ExpoAppSceneDelegate.swift'),
      'utf8',
    );
    expect(fuente).toContain(`@objc(${DELEGADO_DE_ESCENA})`);
    expect(
      DECLARACION_DE_ESCENA.UISceneConfigurations.UIWindowSceneSessionRoleApplication[0]
        .UISceneDelegateClassName,
    ).toBe(DELEGADO_DE_ESCENA);
  });
});
