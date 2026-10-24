import Foundation

// Pruebas de la lógica del widget en Swift, que Jest no alcanza. Las lanza
// herramientas/pruebas-widget.sh dentro del simulador, con el mismo código que el widget.

let ahora = Date(timeIntervalSince1970: 1_800_000_000)
func guardada(haceMin: Double) -> UbicacionGuardada {
  UbicacionGuardada(
    lat: 40.38, lon: -3.72, nombre: "Carabanchel, Madrid",
    en: (ahora.timeIntervalSince1970 - haceMin * 60) * 1000)
}
func deLaApp(haceMin: Double) -> Date { ahora.addingTimeInterval(-haceMin * 60) }

var fallos = 0
func comprobar(_ cumple: Bool, _ caso: String) {
  print((cumple ? "bien: " : "MAL: ") + caso)
  if !cumple { fallos += 1 }
}

// De dónde sale la posición de «Mi ubicación» (Ubicacion.swift).
comprobar(
  posicionSinPedir(guardada: guardada(haceMin: 5), deLaApp: deLaApp(haceMin: 60), ahora: ahora) != nil,
  "la del seguidor, reciente y posterior a la app, se usa sin pedir otra")
comprobar(
  posicionSinPedir(guardada: guardada(haceMin: 5), deLaApp: deLaApp(haceMin: 1), ahora: ahora) == nil,
  "si la app es más nueva, no se usa la del seguidor")
comprobar(
  posicionSinPedir(guardada: guardada(haceMin: 45), deLaApp: deLaApp(haceMin: 90), ahora: ahora) == nil,
  "una del seguidor de hace 45 minutos no vale: hay que pedir")
comprobar(
  posicionSinPedir(guardada: nil, deLaApp: deLaApp(haceMin: 90), ahora: ahora) == nil,
  "sin la del seguidor, hay que pedir")
comprobar(
  posicionSinPedir(guardada: guardada(haceMin: 5), deLaApp: nil, ahora: ahora) != nil,
  "si la app no dejó hora, vale la del seguidor")

exit(fallos == 0 ? 0 : 1)
