import SwiftUI
import WidgetKit

// El widget (docs/PROPUESTA-WIDGET.md). Cada uno enseña el lugar y los datos elegidos en «Editar
// widget» (Configuracion.swift) con lo que la app dejó en el App Group (Datos.swift).

struct Proveedor: AppIntentTimelineProvider {
  func placeholder(in context: Context) -> Entrada {
    Entrada(date: .now, contenido: .sinDatos, claves: datosDeFabrica)
  }

  func snapshot(for configuracion: ConfiguracionWidget, in context: Context) async -> Entrada {
    entrada(configuracion, en: .now)
  }

  func timeline(for configuracion: ConfiguracionWidget, in context: Context) async -> Timeline<Entrada> {
    let ahora = Date.now
    var fechas = [ahora]
    // Una entrada más cuando el texto de la hora tiene que cambiar («A las» pasa a «Datos de las»,
    // y a medianoche, a «ayer»). Los datos nuevos los trae la app al recargar el widget.
    if case .lugar(_, let fecha) = entrada(configuracion, en: ahora).contenido {
      let mañana = Calendar.current.startOfDay(for: ahora.addingTimeInterval(24 * 60 * 60))
      fechas += [fecha.addingTimeInterval(margenFresco), mañana].filter { $0 > ahora }
    }
    return Timeline(entries: fechas.sorted().map { entrada(configuracion, en: $0) }, policy: .never)
  }

  private func entrada(_ configuracion: ConfiguracionWidget, en fecha: Date) -> Entrada {
    Entrada(
      date: fecha,
      contenido: resolver(leerDatos(), id: configuracion.lugar?.id),
      claves: configuracion.claves)
  }
}

struct VistaEnWidget: View {
  @Environment(\.widgetFamily) private var familia
  let entrada: Entrada

  var body: some View {
    VistaWidget(entrada: entrada, familia: familia)
      .containerBackground(for: .widget) { Color("$widgetBackground") }
      // Tocarlo abre ese lugar en la app. Sin lugar (sin datos o borrado), abre la app sin más.
      .widgetURL(entrada.contenido.lugar.flatMap { enlace(lugar: $0.id) })
  }
}

@main
struct WidgetTiempo: Widget {
  var body: some WidgetConfiguration {
    AppIntentConfiguration(kind: "tiempo", intent: ConfiguracionWidget.self, provider: Proveedor()) {
      entrada in
      VistaEnWidget(entrada: entrada)
    }
    .configurationDisplayName("El tiempo")
    .description("La temperatura y los datos que elijas de un lugar.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
