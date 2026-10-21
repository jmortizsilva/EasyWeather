// Config dinámica sobre app.json. Permite que las builds de PRUEBAS tengan un
// identificador y nombre distintos, para que convivan en el iPhone con la de
// producción/TestFlight (en iOS, mismo identificador = misma app, se sustituyen).
// La variante se activa con APP_VARIANT, que eas.json define en los perfiles
// "development" y "preview".
//
// Vale CUALQUIER valor, y es a propósito: si alguien se equivoca al escribirlo, el
// fallo cae del lado bueno (sale una app de pruebas de más) y nunca del malo (una
// build de producción con nombre e identificador de pruebas). El perfil
// "production" no define la variable, así que la app publicada no puede acabar aquí.
//
// Ojo, el perfil "preview" no la definía hasta el 2026-09-28: sus builds llevaban el
// identificador de producción, así que instalarlas te dejaba SIN la app de la Store.
const ES_PRUEBAS = Boolean(process.env.APP_VARIANT);

export default ({ config }) => {
  const bundleIdentifier = ES_PRUEBAS ? 'com.jmortizsilva.tiempo.dev' : config.ios.bundleIdentifier;
  return {
    ...config,
    name: ES_PRUEBAS ? 'EasyWeather Dev' : config.name,
    // Para que el widget abra SU app: con el mismo esquema en las dos, el widget de pruebas podría
    // abrir la publicada. Expo ya lo ponía solo; se declara para no depender de eso.
    scheme: bundleIdentifier,
    ios: {
      ...config.ios,
      bundleIdentifier,
      entitlements: {
        ...config.ios.entitlements,
        // Donde la app deja los datos para el widget. Sale del identificador para que la app de
        // pruebas y la publicada no se lean la una a la otra. El widget lo hereda (targets/widget).
        'com.apple.security.application-groups': [`group.${bundleIdentifier}`],
      },
    },
  };
};
