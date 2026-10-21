#!/usr/bin/env bash
#
# Dibuja el widget en PNG con los datos que la app ha dejado en el simulador, en los dos tamaños,
# con letra normal y al máximo, en claro y en oscuro, y con un aviso naranja de ejemplo. Imprime
# además lo que leería VoiceOver.
#
# Uso:  herramientas/captura-widget.sh <UDID del simulador> [carpeta de salida]
#
# Antes: compilar con herramientas/compilar-simulador.sh y abrir la app una vez, para que deje los
# datos. El porqué de hacerlo así, y no en la pantalla de inicio, en captura-widget/main.swift.
set -eu

UDID="$1"
SALIDA="${2:-.build-simulador/captura-widget}"
ID=com.jmortizsilva.tiempo.dev

cd "$(dirname "$0")/.."
APPEX=.build-simulador/Build/Products/Debug-iphonesimulator/EasyWeatherDev.app/PlugIns/widget.appex
TRABAJO=.build-simulador/captura-widget-bin
mkdir -p "$SALIDA" "$TRABAJO"

# El programa va DENTRO de una copia de la extensión: así Bundle.main es la extensión y Color("…")
# encuentra los colores de su Assets.car.
rm -rf "$TRABAJO/widget.appex"
cp -R "$APPEX" "$TRABAJO/widget.appex"
xcrun --sdk iphonesimulator swiftc -O \
  -target arm64-apple-ios17.0-simulator \
  -o "$TRABAJO/widget.appex/captura" \
  targets/widget/Datos.swift targets/widget/Vistas.swift herramientas/captura-widget/main.swift

GRUPO=$(xcrun simctl get_app_container "$UDID" "$ID" groups | awk -v g="group.$ID" '$1 == g {print $2}')
PLIST="$GRUPO/Library/Preferences/group.$ID.plist"
plutil -extract datosWidget raw "$PLIST" > "$TRABAJO/datos.json"

xcrun simctl spawn "$UDID" "$PWD/$TRABAJO/widget.appex/captura" "$PWD/$TRABAJO/datos.json" "$PWD/$SALIDA"
