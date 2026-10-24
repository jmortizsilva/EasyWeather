import Foundation

// Lo que la app deja en el App Group. Es el contrato con src/widget/datosWidget.ts: los textos
// llegan ya escritos y aquí no se decide ninguno. Si cambia el formato, cambian los dos.

let versionDatos = 3
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
  let lat: Double
  let lon: Double
  /// La estación de AEMET elegida a mano, si la hay.
  let estacion: String?
  /// Milisegundos, como Date.now() en JavaScript. Falta si la app aún no ha cargado el lugar.
  let actualizadoEn: Double?
  let aviso: Aviso?
  let datos: [String: TextoDato]

  var fecha: Date? { actualizadoEn.map { Date(timeIntervalSince1970: $0 / 1000) } }
}

struct DatosWidget: Codable {
  let version: Int
  let lugares: [LugarWidget]
  /// Dónde pedir el lugar al día: la ruta /widget del servidor propio, con la clave de la app.
  let servidor: Servidor?
}

struct Servidor: Codable {
  let url: String
  let clave: String
}

/// El lugar al día desde el servidor, o nil si no contesta a tiempo o contesta otra cosa. Nunca
/// lanza: sin servidor, el widget se queda con lo que dejó la app.
func pedirAlServidor(_ lugar: LugarWidget, servidor: Servidor) async -> LugarWidget? {
  guard var partes = URLComponents(string: servidor.url) else { return nil }
  partes.queryItems = [
    URLQueryItem(name: "lat", value: String(lugar.lat)),
    URLQueryItem(name: "lon", value: String(lugar.lon)),
    URLQueryItem(name: "id", value: lugar.id),
    URLQueryItem(name: "nombre", value: lugar.nombre),
  ] + (lugar.estacion.map { [URLQueryItem(name: "estacion", value: $0)] } ?? [])
  guard let url = partes.url else { return nil }
  // Corto: iOS da poco tiempo a cada refresco del widget, y si lo corta no cambia nada.
  var peticion = URLRequest(url: url, timeoutInterval: 8)
  peticion.setValue(servidor.clave, forHTTPHeaderField: "x-app-key")
  guard
    let (cuerpo, respuesta) = try? await URLSession.shared.data(for: peticion),
    (respuesta as? HTTPURLResponse)?.statusCode == 200,
    let fresco = try? JSONDecoder().decode(LugarWidget.self, from: cuerpo),
    fresco.actualizadoEn != nil
  else { return nil }
  return fresco
}

/// La última posición que dejó el seguidor de ubicación de la app (SeguidorUbicacion.swift, en
/// modules/ubicacion-significativa) al moverte, con la app cerrada. Mismo formato que allí.
struct UbicacionGuardada: Codable {
  let lat: Double
  let lon: Double
  let nombre: String?
  /// Milisegundos.
  let en: Double

  var fecha: Date { Date(timeIntervalSince1970: en / 1000) }
}

func leerUbicacionGuardada() -> UbicacionGuardada? {
  guard
    let id = identificadorApp(),
    let texto = UserDefaults(suiteName: "group.\(id)")?.string(forKey: "ubicacionWidget")
  else { return nil }
  return try? JSONDecoder().decode(UbicacionGuardada.self, from: Data(texto.utf8))
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
