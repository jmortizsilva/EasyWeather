import SwiftUI
import WidgetKit

// El widget (docs/PROPUESTA-WIDGET.md). Cada uno enseña el lugar y los datos elegidos en «Editar
// widget» (Configuracion.swift) con lo que la app dejó en el App Group o, si es más reciente, con
// lo que contesta el servidor (Datos.swift).

struct Proveedor: AppIntentTimelineProvider {
  func placeholder(in context: Context) -> Entrada {
    Entrada(date: .now, contenido: .sinDatos, claves: datosDeFabrica)
  }

  func snapshot(for configuracion: ConfiguracionWidget, in context: Context) async -> Entrada {
    entrada(configuracion, en: .now)
  }

  func timeline(for configuracion: ConfiguracionWidget, in context: Context) async -> Timeline<Entrada> {
    let ahora = Date.now
    var actual = entrada(configuracion, en: ahora)
    // Lo que dejó la app puede ser de ayer si no se ha abierto: se pide el lugar al servidor y se
    // usa si es más reciente. Si es la ubicación actual y el teléfono se ha movido, se pide el sitio
    // nuevo, y se usa aunque lo de la app sea más reciente, porque es de otro sitio. Si el servidor
    // no contesta, se queda lo de la app, con su nombre y su hora: viejo, pero dicho.
    if let datos = leerDatos(), let servidor = datos.servidor, let lugar = actual.contenido.lugar {
      let movido = await ubicacionAlDia(lugar)
      if let fresco = await pedirAlServidor(movido ?? lugar, servidor: servidor),
        let fechaFresca = fresco.fecha,
        movido != nil || fechaFresca > (lugar.fecha ?? .distantPast)
      {
        actual = Entrada(
          date: ahora, contenido: .lugar(fresco, fecha: fechaFresca), claves: configuracion.claves)
      }
    }
    var fechas = [ahora]
    // Una entrada más cuando el texto de la hora tiene que cambiar («A las» pasa a «Datos de las»,
    // y a medianoche, a «ayer»).
    if case .lugar(_, let fecha) = actual.contenido {
      let mañana = Calendar.current.startOfDay(for: ahora.addingTimeInterval(24 * 60 * 60))
      fechas += [fecha.addingTimeInterval(margenFresco), mañana].filter { $0 > ahora }
    }
    let entradas = fechas.sorted().map {
      Entrada(date: $0, contenido: actual.contenido, claves: actual.claves)
    }
    // Pedir otra vez en media hora. iOS decide cuándo de verdad, según su presupuesto del día.
    return Timeline(entries: entradas, policy: .after(ahora.addingTimeInterval(30 * 60)))
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
    // Lo que ocupa cada tamaño, para quien no ve la vista previa de la galería (pedido por Jose el
    // 2026-10-22). Es una sola descripción para todos los tamaños: así lo hace WidgetKit.
    .description(
      "La temperatura y los datos que elijas de un lugar. El pequeño ocupa el sitio de cuatro iconos, y el mediano, el de ocho."
    )
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
