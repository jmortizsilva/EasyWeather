import Foundation

// Lo que la app deja en el App Group. Es el contrato con src/widget/datosWidget.ts: los textos
// llegan ya escritos y aquí no se decide ninguno. Si cambia el formato, cambian los dos.

let versionDatos = 2
let claveDatos = "datosWidget"

struct TextoDato: Codable {
  let visible: String
  let hablado: String
}

struct Aviso: Codable {
  let nivel: String
  /// «Aviso naranja», para el tamaño pequeño.
  let corto: String
  let visible: String
  let hablado: String
}

struct LugarWidget: Codable {
  let id: String
  let nombre: String
  /// Milisegundos, como Date.now() en JavaScript. Falta si la app aún no ha cargado el lugar.
  let actualizadoEn: Double?
  let aviso: Aviso?
  let datos: [String: TextoDato]

  var fecha: Date? { actualizadoEn.map { Date(timeIntervalSince1970: $0 / 1000) } }
}

struct DatosWidget: Codable {
  let version: Int
  let lugares: [LugarWidget]
}

/// Los datos que la app dejó, o nil si todavía no dejó nada o son de otra versión.
func leerDatos() -> DatosWidget? {
  // El grupo sale del identificador del widget, que es el de la app con «.widget» al final.
  guard
    let propio = Bundle.main.bundleIdentifier, propio.hasSuffix(".widget"),
    case let id = String(propio.dropLast(".widget".count)),
    let texto = UserDefaults(suiteName: "group.\(id)")?.string(forKey: claveDatos),
    let datos = try? JSONDecoder().decode(DatosWidget.self, from: Data(texto.utf8)),
    datos.version == versionDatos
  else { return nil }
  return datos
}
