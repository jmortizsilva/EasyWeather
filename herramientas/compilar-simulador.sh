#!/usr/bin/env bash
#
# Compila la app de PRUEBAS para el simulador y la instala. Pensado para usarse por SSH, sin abrir
# Xcode y sin AppleScript: `npx expo run:ios` hace esto mismo pero termina llamando a System Events
# para traer la ventana del Simulador al frente, y sin sesion grafica eso mata el proceso y se lleva
# Metro consigo.
#
# Uso:  herramientas/compilar-simulador.sh ["iPhone 16 Pro"]
#
# Despues:  npx expo start --dev-client          (en un terminal, y se deja)
#           xcrun simctl openurl booted "exp+tiempo://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"
#
# Cada orden de aqui se ejecuto a mano y funciono el 2026-10-09, pero el guion completo todavia no
# se ha ejecutado de una pasada. El detalle y el porque de cada paso: docs/COMPILAR-EN-EL-MAC.md
set -eu

ID_PRUEBAS=com.jmortizsilva.tiempo.dev
SIMULADOR="${1:-iPhone 16 Pro}"
SALIDA=.build-simulador

cd "$(dirname "$0")/.."

# 1. El nativo tiene que llevar el identificador de pruebas, y hay que mirarlo en vez de confiar en
# la variable: `prebuild` NO rehace un ios/ que ya existe, asi que un ios/ generado alguna vez sin
# APP_VARIANT se queda con el identificador de produccion para siempre. En iOS, mismo identificador
# = misma app, y eso sustituye en el iPhone la de la App Store.
if ! grep -qs "PRODUCT_BUNDLE_IDENTIFIER = $ID_PRUEBAS;" ios/*.xcodeproj/project.pbxproj; then
  echo "== El ios/ que hay no es el de pruebas: regenerando de cero"
  APP_VARIANT=development npx expo prebuild -p ios --clean
fi

# 2. Con APP_VARIANT la app se llama «EasyWeather Dev», y prebuild bautiza el proyecto con el nombre
# de la app: el workspace y el scheme son EasyWeatherDev. Se pregunta, no se escribe.
W=$(ls -d ios/*.xcworkspace)
S=$(basename "$W" .xcworkspace)
echo "== Compilando $S para simulador"

xcodebuild -workspace "$W" -scheme "$S" -configuration Debug \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath "$SALIDA" \
  build

APP="$SALIDA/Build/Products/Debug-iphonesimulator/$S.app"

# 3. La comprobacion que protege la app publicada: se mira en la app YA COMPILADA, que es lo unico
# que de verdad se va a instalar.
IDENTIFICADOR=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$APP/Info.plist")
if [ "$IDENTIFICADOR" != "$ID_PRUEBAS" ]; then
  echo "ABORTADO: la app compilada dice $IDENTIFICADOR y no $ID_PRUEBAS" >&2
  exit 1
fi
echo "== Identificador correcto: $IDENTIFICADOR"

if ! xcrun simctl list devices booted | grep -q '([0-9A-F-]*) (Booted)'; then
  echo "== Arrancando $SIMULADOR"
  xcrun simctl boot "$SIMULADOR"
  xcrun simctl bootstatus "$SIMULADOR" -b
fi

xcrun simctl install booted "$APP"
echo "== Instalada. Ahora: npx expo start --dev-client, y abrir con simctl openurl (ver cabecera)"
