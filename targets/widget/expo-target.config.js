// La extensión del widget. La genera @bacons/apple-targets en cada prebuild; lo que hay en esta
// carpeta es lo único que se edita a mano.
//
// Los colores son los de src/theme/colores.ts (fondo, texto y avisos), con su contraste ya medido
// allí. Si cambian en la app, cambian aquí.

/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: 'widget',
  name: 'widget',
  displayName: 'El tiempo',
  bundleIdentifier: '.widget',
  // AppIntentConfiguration, que es lo que deja elegir lugar y datos en «Editar widget».
  deploymentTarget: '17.0',
  // El mismo App Group que la app (app.config.js). Se escribe aquí y no se deja en manos del
  // plugin: la 5.0.0 dice copiarlo solo, pero el widget salió sin permisos (2026-10-21).
  entitlements: {
    'com.apple.security.application-groups':
      config.ios.entitlements['com.apple.security.application-groups'],
  },
  colors: {
    $widgetBackground: { light: '#f2f5fa', dark: '#0d1a2b' },
    $accent: { light: '#0f1c2e', dark: '#f4f8ff' },
    texto: { light: '#0f1c2e', dark: '#f4f8ff' },
    avisoNaranjaFondo: { light: '#ffe8d4', dark: '#5a3512' },
    avisoNaranjaTexto: { light: '#4d2800', dark: '#fff1e2' },
    avisoRojoFondo: { light: '#fde3e3', dark: '#5c1f22' },
    avisoRojoTexto: { light: '#5c1114', dark: '#ffe9e9' },
  },
});
