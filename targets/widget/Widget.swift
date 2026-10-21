import SwiftUI
import WidgetKit

// Fase 1 del widget (docs/PROPUESTA-WIDGET.md): enseña el primer lugar que dejó la app (la
// ubicación actual si la hay) con los datos de fábrica. Elegir lugar y datos llega en la fase 2.

struct Proveedor: TimelineProvider {
  func placeholder(in context: Context) -> Entrada { Entrada(date: .now, lugar: nil) }

  func getSnapshot(in context: Context, completion: @escaping (Entrada) -> Void) {
    completion(Entrada(date: .now, lugar: leerDatos()?.lugares.first))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<Entrada>) -> Void) {
    let lugar = leerDatos()?.lugares.first
    // Una entrada más cuando el texto de la hora tiene que cambiar («A las» pasa a «Datos de las»,
    // y a medianoche, a «ayer»). Los datos nuevos los trae la app al recargar el widget.
    var fechas: [Date] = [.now]
    if let lugar {
      let mañana = Calendar.current.startOfDay(for: .now.addingTimeInterval(24 * 60 * 60))
      fechas += [lugar.fecha.addingTimeInterval(margenFresco), mañana].filter { $0 > .now }
    }
    let entradas = fechas.sorted().map { Entrada(date: $0, lugar: lugar) }
    completion(Timeline(entries: entradas, policy: .never))
  }
}

struct VistaEnWidget: View {
  @Environment(\.widgetFamily) private var familia
  let entrada: Entrada

  var body: some View {
    VistaWidget(entrada: entrada, familia: familia)
      .containerBackground(for: .widget) { Color("$widgetBackground") }
  }
}

@main
struct WidgetTiempo: Widget {
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: "tiempo", provider: Proveedor()) { entrada in
      VistaEnWidget(entrada: entrada)
    }
    .configurationDisplayName("El tiempo")
    .description("La temperatura y los datos que elijas de un lugar.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
