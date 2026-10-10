const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

// Pasa la app al ciclo de vida por escenas (UIScene), que iOS 27 exige.
//
// POR QUÉ. Compilada con el SDK de iOS 27, una app que no declara escenas se aborta al arrancar en
// un teléfono con iOS 27: `signal 5`, y en el informe de fallo
// `_UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`. Encontrado el 2026-10-10; el
// detalle está en docs/COMPILAR-EN-EL-MAC.md §6. Las builds de EAS del SDK 57 todavía compilan con
// el SDK de iOS 26 y no se caen, pero dejarán de hacerlo cuando EAS o Apple cambien de Xcode.
//
// Expo trae la pieza desde `expo` 57.0.27 (`ExpoAppSceneDelegate`), pero ni su plantilla ni sus
// plugins la conectan. Aquí se hacen las dos cosas que faltan:
//
// 1. Declarar la escena en el Info.plist, con el delegado de Expo.
// 2. Que el AppDelegate deje de crear la ventana y de arrancar React Native: eso lo hace ahora la
//    escena, que se lo pide al AppDelegate por el protocolo ExpoReactNativeFactoryProvider.
//
// Las dos van juntas o ninguna. Con solo la 1, el delegado de Expo hace `fatalError` al no
// encontrar el protocolo; con solo la 2, no se crea ninguna ventana. Por eso, si el AppDelegate
// no es el que se espera, el plugin LANZA y la compilación se para: lo de agosto fue un parche que
// no se aplicó sin avisar y dejó la app sin abrir.

const MARCA = '[EasyWeather] escenas';

// Nombre Objective-C de la clase: `@objc(EXExpoAppSceneDelegate)` en ExpoAppSceneDelegate.swift.
const DELEGADO_DE_ESCENA = 'EXExpoAppSceneDelegate';

const DECLARACION_DE_ESCENA = {
  UIApplicationSupportsMultipleScenes: false,
  UISceneConfigurations: {
    UIWindowSceneSessionRoleApplication: [
      {
        UISceneConfigurationName: 'Default Configuration',
        UISceneDelegateClassName: DELEGADO_DE_ESCENA,
      },
    ],
  },
};

const CAMBIOS = [
  {
    busca: 'class AppDelegate: ExpoAppDelegate {',
    sustituye: 'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {',
  },
  {
    busca: `#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif
`,
    sustituye: `    // ${MARCA}: la ventana y el arranque de React Native los hace ExpoAppSceneDelegate.
    // iOS 27 no abre una app sin escenas. Ver plugins/ciclo-de-vida-por-escenas.js.
`,
  },
];

function cambiarAppDelegate(contenido) {
  if (contenido.includes(MARCA)) {
    return contenido;
  }
  for (const { busca } of CAMBIOS) {
    if (!contenido.includes(busca)) {
      throw new Error(
        'ciclo-de-vida-por-escenas: el AppDelegate generado no es el que espero. ' +
          `No encuentro:\n${busca}\n` +
          'Expo ha cambiado la plantilla: mira si ya conecta ExpoAppSceneDelegate por su cuenta ' +
          'antes de tocar nada.',
      );
    }
  }
  return CAMBIOS.reduce(
    (texto, { busca, sustituye }) => texto.replace(busca, sustituye),
    contenido,
  );
}

module.exports = (config) => {
  config = withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = DECLARACION_DE_ESCENA;
    return config;
  });
  return withAppDelegate(config, (config) => {
    if (config.modResults.language !== 'swift') {
      throw new Error('ciclo-de-vida-por-escenas: esperaba un AppDelegate en Swift.');
    }
    config.modResults.contents = cambiarAppDelegate(config.modResults.contents);
    return config;
  });
};

module.exports.cambiarAppDelegate = cambiarAppDelegate;
module.exports.DECLARACION_DE_ESCENA = DECLARACION_DE_ESCENA;
module.exports.DELEGADO_DE_ESCENA = DELEGADO_DE_ESCENA;
