#!/usr/bin/env bash
#
# Pruebas de la lógica del widget escrita en Swift (targets/widget), que Jest no alcanza.
# Se compilan para el simulador y se ejecutan dentro de él.
#
# Uso:  herramientas/pruebas-widget.sh <UDID del simulador>
set -eu

UDID="$1"
cd "$(dirname "$0")/.."
SALIDA=.build-simulador/pruebas-widget
mkdir -p "$SALIDA"
xcrun --sdk iphonesimulator swiftc -target arm64-apple-ios17.0-simulator -o "$SALIDA/pruebas" \
  targets/widget/Datos.swift targets/widget/Configuracion.swift targets/widget/Ubicacion.swift \
  herramientas/pruebas-widget/main.swift
xcrun simctl spawn "$UDID" "$PWD/$SALIDA/pruebas"
