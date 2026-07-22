const { withEntitlementsPlist } = require('expo/config-plugins');

/**
 * EasyWeather solo usa notificaciones LOCALES (se programan dentro del propio teléfono), pero el
 * plugin de expo-notifications añade siempre el permiso "aps-environment", que es el de las
 * notificaciones push remotas. Ese permiso obliga a que el perfil de aprovisionamiento de Apple
 * tenga activada la capacidad Push Notifications y, sin ella, la build falla al firmar con:
 *
 *   error: Provisioning profile ... doesn't support the Push Notifications capability.
 *
 * Como no se envía ninguna notificación desde un servidor, se elimina el permiso: así no hace
 * falta tocar nada en la cuenta de Apple ni pedir una capacidad que la app no usa.
 */
module.exports = function withLocalNotificationsOnly(config) {
  return withEntitlementsPlist(config, (innerConfig) => {
    delete innerConfig.modResults['aps-environment'];
    return innerConfig;
  });
};
