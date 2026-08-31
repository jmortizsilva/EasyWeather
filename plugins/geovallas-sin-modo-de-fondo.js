const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Le quita a expo-location la exigencia de declarar el modo de fondo "location" para poder vigilar
// zonas (geovallas).
//
// POR QUE. Apple rechazo la build 17 por la directriz 2.5.4: el Info.plist declaraba
// UIBackgroundModes = ["location"] y la app no hace seguimiento continuo, solo region monitoring
// (una zona de 3 km, y solo al salir). iOS NO necesita ese modo para despertar a la app al salir de
// una zona vigilada; es la propia Apple quien propone region monitoring como alternativa a
// declararlo. Quien lo exige es expo-location, y por un motivo que no nos afecta: su consumidor de
// geovallas enciende allowsBackgroundLocationUpdates, que sin el modo lanza excepcion. Las
// geovallas no piden actualizaciones continuas, asi que esa linea sobra.
//
// Se aplica al compilar (prebuild), sobre el fuente del pod que hay en node_modules.
//
// Si expo-location cambia esos ficheros, este plugin LANZA y la build se cae. Es a proposito: mas
// vale una build rota que una app publicada en la que las geovallas ya no arrancan y nadie se
// entera hasta que un aviso llega con la ciudad equivocada.
//
// Comprobado contra expo-location 57.0.12 (la instalada) y 57.0.14 (la ultima publicada): mismas
// lineas en las dos.

// Marca que se deja en el fuente parcheado. Sirve para dos cosas: que quien abra ese fichero sepa
// por que le falta un trozo, y para no volver a parchear si el plugin corre dos veces.
const MARCA = '[EasyWeather]';

const PARCHES = [
  {
    fichero: 'ios/LocationModule.swift',
    // El guard de las geovallas. Se ancla en el guard de arriba porque el texto del que sobra
    // aparece dos veces en el fichero: la otra es startLocationUpdatesAsync, que SI necesita el
    // modo de fondo y que la app no usa.
    busca: `      guard CLLocationManager.isMonitoringAvailable(for: CLCircularRegion.self) else {
        throw Exceptions.GeofencingUnavailable()
      }
      guard try taskManager.hasBackgroundModeEnabled("location") else {
        throw Exceptions.LocationUpdatesUnavailable()
      }
`,
    sustituye: `      guard CLLocationManager.isMonitoringAvailable(for: CLCircularRegion.self) else {
        throw Exceptions.GeofencingUnavailable()
      }
      // ${MARCA} Sin exigir UIBackgroundModes "location": las geovallas no lo necesitan.
`,
  },
  {
    fichero: 'ios/TaskConsumers/EXGeofencingTaskConsumer.m',
    // La linea que obliga a lo anterior: con el modo quitado, esta asignacion lanzaria.
    busca: `    locationManager.allowsBackgroundLocationUpdates = YES;
`,
    sustituye: `    // ${MARCA} Sin allowsBackgroundLocationUpdates: lanzaria sin UIBackgroundModes "location",
    // y vigilar zonas no lo necesita.
`,
  },
];

function raizDeExpoLocation(raizProyecto) {
  return path.dirname(require.resolve('expo-location/package.json', { paths: [raizProyecto] }));
}

// Recibe la raiz de la libreria, y no la del proyecto, para poder probarlo sobre una copia de los
// ficheros de verdad sin tocar node_modules.
function aplicarParches(raizLibreria) {
  for (const parche of PARCHES) {
    const ruta = path.join(raizLibreria, parche.fichero);
    const contenido = fs.readFileSync(ruta, 'utf8');

    if (contenido.includes(MARCA)) {
      continue;
    }
    if (!contenido.includes(parche.busca)) {
      throw new Error(
        `geovallas-sin-modo-de-fondo: no encuentro lo que esperaba en ${parche.fichero}. ` +
          'expo-location ha cambiado: revisa a mano si las geovallas siguen exigiendo ' +
          'UIBackgroundModes "location" antes de tocar nada.',
      );
    }
    fs.writeFileSync(ruta, contenido.replace(parche.busca, parche.sustituye));
  }
}

module.exports = (config) =>
  withDangerousMod(config, [
    'ios',
    (config) => {
      aplicarParches(raizDeExpoLocation(config.modRequest.projectRoot));
      return config;
    },
  ]);

// Para la prueba, que es la que avisa de que expo-location ha cambiado antes de que lo haga EAS.
module.exports.aplicarParches = aplicarParches;
module.exports.raizDeExpoLocation = raizDeExpoLocation;
module.exports.PARCHES = PARCHES;
