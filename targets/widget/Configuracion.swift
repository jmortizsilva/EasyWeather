import AppIntents
import WidgetKit

// Lo que sale en «Editar widget» (mantener pulsado el widget): el lugar y un interruptor por dato.
// La hoja es de iOS, no nuestra, y cada widget guarda la suya. Los nombres de los datos son los de
// la tabla de docs/PROPUESTA-WIDGET.md.

/// Un lugar de los que la app dejó en el App Group: la ubicación actual y Mis lugares.
struct LugarEntidad: AppEntity {
  let id: String
  let nombre: String

  static let typeDisplayRepresentation: TypeDisplayRepresentation = "Lugar"
  static let defaultQuery = ConsultaLugares()

  var displayRepresentation: DisplayRepresentation {
    id == idUbicacionActual
      ? DisplayRepresentation(title: "Mi ubicación", subtitle: "\(nombre)")
      : DisplayRepresentation(title: "\(nombre)")
  }
}

/// El mismo que CURRENT_LOCATION_ID en src/types.ts.
let idUbicacionActual = "current"

struct ConsultaLugares: EntityQuery {
  func entities(for identifiers: [String]) async throws -> [LugarEntidad] {
    lugaresElegibles().filter { identifiers.contains($0.id) }
  }

  func suggestedEntities() async throws -> [LugarEntidad] { lugaresElegibles() }

  func defaultResult() async -> LugarEntidad? { lugaresElegibles().first }
}

private func lugaresElegibles() -> [LugarEntidad] {
  (leerDatos()?.lugares ?? []).map { LugarEntidad(id: $0.id, nombre: $0.nombre) }
}

struct ConfiguracionWidget: WidgetConfigurationIntent {
  static let title: LocalizedStringResource = "Tiempo"
  static let description = IntentDescription("Elige el lugar y los datos que se ven.")

  @Parameter(title: "Lugar")
  var lugar: LugarEntidad?

  // Los cuatro primeros salen activados: son los datos de fábrica de la propuesta.
  @Parameter(title: "Temperatura ahora", default: true) var temperatura: Bool
  @Parameter(title: "Estado del cielo", default: true) var cielo: Bool
  @Parameter(title: "Mínima y máxima de hoy", default: true) var maxMin: Bool
  @Parameter(title: "Probabilidad de lluvia", default: true) var lluvia: Bool
  @Parameter(title: "Sensación térmica", default: false) var sensacion: Bool
  @Parameter(title: "Viento", default: false) var viento: Bool
  @Parameter(title: "Humedad", default: false) var humedad: Bool
  @Parameter(title: "Índice UV", default: false) var uv: Bool
  @Parameter(title: "Medición de la estación AEMET", default: false) var estacion: Bool
  @Parameter(title: "Salida y puesta de sol", default: false) var sol: Bool

  /// Las claves elegidas, en el orden en que se pintan (el de CLAVES_DATO en datosWidget.ts).
  var claves: [String] {
    [
      ("temperatura", temperatura), ("cielo", cielo), ("maxMin", maxMin), ("sensacion", sensacion),
      ("lluvia", lluvia), ("viento", viento), ("humedad", humedad), ("uv", uv),
      ("estacion", estacion), ("sol", sol),
    ].filter(\.1).map(\.0)
  }
}
