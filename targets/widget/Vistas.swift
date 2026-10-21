import SwiftUI
import WidgetKit

// Lo que se ve y lo que se oye. Va aparte del @main (Widget.swift) para poder dibujarlo fuera del
// widget: herramientas/captura-widget lo pinta en una imagen, que es como se revisa sin pantalla.

/// Qué hay que enseñar, según lo que dejó la app y el lugar elegido en «Editar widget».
enum Contenido {
  /// La app no ha dejado nada todavía: no se ha abierto desde que tiene widget.
  case sinDatos
  /// El lugar elegido ya no está: se borró de Mis lugares.
  case borrado
  /// Está en la lista pero la app aún no lo ha cargado.
  case sinCargar(LugarWidget)
  case lugar(LugarWidget, fecha: Date)
}

/// Sin lugar elegido, el primero: la ubicación actual si la hay.
func resolver(_ datos: DatosWidget?, id: String?) -> Contenido {
  guard let datos, let primero = datos.lugares.first else { return .sinDatos }
  let lugar = id.map { id in datos.lugares.first { $0.id == id } } ?? primero
  guard let lugar else { return .borrado }
  guard let fecha = lugar.fecha else { return .sinCargar(lugar) }
  return .lugar(lugar, fecha: fecha)
}

struct Entrada: TimelineEntry {
  let date: Date
  let contenido: Contenido
  /// Los datos elegidos, en el orden en que se pintan.
  let claves: [String]
}

/// Los datos que salen activados la primera vez, en el orden en que se pintan.
let datosDeFabrica = ["temperatura", "cielo", "maxMin", "lluvia"]

/// Hasta aquí el dato se da por reciente.
let margenFresco: TimeInterval = 2 * 60 * 60

/// «A las 17:40», «Datos de las 11:10», «Datos de ayer, 17:40» o «Datos del 19 de octubre».
func textoHora(_ fecha: Date, ahora: Date) -> String {
  let calendario = Calendar.current
  let formato = DateFormatter()
  formato.locale = Locale(identifier: "es_ES")
  formato.dateFormat = "HH:mm"
  let hora = formato.string(from: fecha)
  if calendario.isDate(fecha, inSameDayAs: ahora) {
    return ahora.timeIntervalSince(fecha) <= margenFresco ? "A las \(hora)" : "Datos de las \(hora)"
  }
  if calendario.isDateInYesterday(fecha) { return "Datos de ayer, \(hora)" }
  formato.dateFormat = "d 'de' MMMM"
  return "Datos del \(formato.string(from: fecha))"
}

/// Lo que lee VoiceOver: el lugar, el aviso, TODOS los datos elegidos aunque no quepan en
/// pantalla, y la hora al final.
func etiquetaAccesible(_ lugar: LugarWidget, datos: [TextoDato], hora: String) -> String {
  let partes = [lugar.nombre, lugar.aviso?.hablado].compactMap { $0 } + datos.map(\.hablado) + [hora]
  return partes.joined(separator: ". ")
}

struct VistaWidget: View {
  let entrada: Entrada
  let familia: WidgetFamily

  var body: some View {
    Group {
      switch entrada.contenido {
      case .sinDatos:
        VistaMensaje(nombre: nil, mensaje: "Abre EasyWeather para cargar tus lugares.")
      case .borrado:
        VistaMensaje(nombre: nil, mensaje: "Este lugar ya no está en Mis lugares.")
      case .sinCargar(let lugar):
        VistaMensaje(nombre: lugar.nombre, mensaje: "Abre EasyWeather para cargar este lugar.")
      case .lugar(let lugar, let fecha):
        VistaLugar(
          lugar: lugar, fecha: fecha, claves: entrada.claves, ahora: entrada.date, familia: familia)
      }
    }
    .foregroundStyle(Color("texto"))
    // Tope a la letra, como TOPE_TITULO en la app: un widget tiene el tamaño que tiene, y al
    // máximo de accesibilidad el pequeño se quedaba en «A…» y perdía el nombre y la hora
    // (captura del 2026-10-21). VoiceOver lee igualmente todo, sin cortes.
    .dynamicTypeSize(...DynamicTypeSize.xxxLarge)
  }
}

struct VistaMensaje: View {
  let nombre: String?
  let mensaje: String

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      if let nombre { Text(nombre).font(.caption.bold()).lineLimit(1) }
      // El mensaje entero antes que el nombre: es lo que dice qué hacer.
      Text(mensaje).font(.footnote).minimumScaleFactor(0.7).layoutPriority(1)
      Spacer(minLength: 0)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .accessibilityElement(children: .combine)
  }
}

struct VistaLugar: View {
  let lugar: LugarWidget
  let fecha: Date
  let claves: [String]
  let ahora: Date
  let familia: WidgetFamily

  var body: some View {
    let datos = claves.compactMap { lugar.datos[$0] }
    let hora = textoHora(fecha, ahora: ahora)
    let pequeño = familia == .systemSmall
    // En el pequeño, el aviso ocupa el sitio de un dato.
    let cuantos = (pequeño ? 3 : 5) - (pequeño && lugar.aviso != nil ? 1 : 0)
    VStack(alignment: .leading, spacing: 2) {
      Text(lugar.nombre).font(.caption.bold()).lineLimit(2).minimumScaleFactor(0.8)
      if let aviso = lugar.aviso {
        // Antes que el nombre: si no cabe todo, que se recorte el nombre y no el aviso.
        VistaAviso(aviso: aviso, corto: pequeño).layoutPriority(1)
      }
      ForEach(Array(datos.prefix(cuantos).enumerated()), id: \.offset) { indice, dato in
        Text(dato.visible)
          .font(indice == 0 ? .largeTitle.weight(.semibold) : .caption)
          .lineLimit(1)
          .minimumScaleFactor(0.6)
      }
      Spacer(minLength: 0)
      // La hora no se cae nunca: un dato sin su hora podría pasar por actual.
      Text(hora).font(.caption2).lineLimit(1).minimumScaleFactor(0.8).layoutPriority(1)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(etiquetaAccesible(lugar, datos: datos, hora: hora))
  }
}

struct VistaAviso: View {
  let aviso: Aviso
  let corto: Bool

  var body: some View {
    let rojo = aviso.nivel == "rojo"
    Label(corto ? aviso.corto : aviso.visible, systemImage: "exclamationmark.triangle.fill")
      .font(.caption2.bold())
      .lineLimit(2)
      .minimumScaleFactor(0.8)
      .padding(.horizontal, 4)
      .padding(.vertical, 2)
      .foregroundStyle(Color(rojo ? "avisoRojoTexto" : "avisoNaranjaTexto"))
      .background(Color(rojo ? "avisoRojoFondo" : "avisoNaranjaFondo"), in: .rect(cornerRadius: 4))
  }
}
