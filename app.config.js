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

export default ({ config }) => ({
  ...config,
  name: ES_PRUEBAS ? 'EasyWeather Dev' : config.name,
  ios: {
    ...config.ios,
    bundleIdentifier: ES_PRUEBAS ? 'com.jmortizsilva.tiempo.dev' : config.ios.bundleIdentifier,
  },
});
