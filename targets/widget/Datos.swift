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

/// El identificador de la app: el del widget sin el «.widget» del final. De él salen el App Group
/// y el esquema del enlace, así que el widget de pruebas habla con la app de pruebas.
func identificadorApp() -> String? {
  guard let propio = Bundle.main.bundleIdentifier, propio.hasSuffix(".widget") else { return nil }
  return String(propio.dropLast(".widget".count))
}

/// Los datos que la app dejó, o nil si todavía no dejó nada o son de otra versión.
func leerDatos() -> DatosWidget? {
  guard
    let id = identificadorApp(),
    let texto = UserDefaults(suiteName: "group.\(id)")?.string(forKey: claveDatos),
    let datos = try? JSONDecoder().decode(DatosWidget.self, from: Data(texto.utf8)),
    datos.version == versionDatos
  else { return nil }
  return datos
}

/// Lo que abre la app en ese lugar al tocar el widget (src/widget/enlaceWidget.ts lo lee).
func enlace(lugar id: String) -> URL? {
  guard let app = identificadorApp(),
    let codificado = id.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed.subtracting(CharacterSet(charactersIn: "/")))
  else { return nil }
  return URL(string: "\(app)://lugar/\(codificado)")
}
