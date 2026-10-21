import SwiftUI
import WidgetKit

// Dibuja el widget en imágenes PNG sin ponerlo en la pantalla de inicio, que desde aquí no se
// puede: simctl no sabe añadir widgets y sin sesión gráfica no hay forma de tocar el simulador.
// Usa las mismas vistas que el widget (targets/widget/Vistas.swift) y sus colores (el Assets.car
// de widget.appex). Lo lanza herramientas/captura-widget.sh, que explica el uso.
//
// Argumentos: <json de datosWidget> <carpeta de salida>

let argumentos = CommandLine.arguments
guard argumentos.count == 3,
  let datos = try? JSONDecoder().decode(
    DatosWidget.self, from: Data(contentsOf: URL(fileURLWithPath: argumentos[1])))
else {
  print("Uso: captura <json de datosWidget> <carpeta de salida>")
  exit(1)
}
let salida = URL(fileURLWithPath: argumentos[2])

// Lo mismo con un aviso naranja, para ver cómo queda con aviso.
var lugares = datos.lugares.prefix(1).map { ($0, "") }
if let primero = datos.lugares.first {
  let conAviso = LugarWidget(
    id: primero.id, nombre: primero.nombre, actualizadoEn: primero.actualizadoEn,
    aviso: Aviso(
      nivel: "naranja", corto: "Aviso naranja", visible: "Aviso naranja por lluvias", hablado: "Aviso naranja por lluvias"),
    datos: primero.datos)
  lugares.append((conAviso, "-aviso"))
}

let tamaños: [(WidgetFamily, CGSize, String)] = [
  (.systemSmall, CGSize(width: 170, height: 170), "pequeño"),
  (.systemMedium, CGSize(width: 364, height: 170), "mediano"),
]
let letras: [(DynamicTypeSize, String)] = [(.large, "normal"), (.accessibility5, "maxima")]
let modos: [(ColorScheme, String)] = [(.light, "claro"), (.dark, "oscuro")]

MainActor.assumeIsolated {
  for (lugar, sufijo) in lugares {
    let entrada = Entrada(date: Date(timeIntervalSince1970: lugar.actualizadoEn / 1000), lugar: lugar)
    for (familia, tamaño, nombreTamaño) in tamaños {
      for (letra, nombreLetra) in letras {
        for (modo, nombreModo) in modos {
          let vista = VistaWidget(entrada: entrada, familia: familia)
            .padding(16)
            .frame(width: tamaño.width, height: tamaño.height)
            .background(Color("$widgetBackground"), in: .rect(cornerRadius: 22))
            .environment(\.colorScheme, modo)
            .environment(\.dynamicTypeSize, letra)
          let renderizador = ImageRenderer(content: vista)
          renderizador.scale = 3
          let nombre = "\(nombreTamaño)-\(nombreLetra)-\(nombreModo)\(sufijo).png"
          if let png = renderizador.uiImage?.pngData() {
            try? png.write(to: salida.appendingPathComponent(nombre))
            print("escrito \(nombre)")
          } else {
            print("NO se pudo dibujar \(nombre)")
          }
        }
      }
    }
    let datosElegidos = datosDeFabrica.compactMap { lugar.datos[$0] }
    let hora = textoHora(lugar.fecha, ahora: entrada.date)
    print("VoiceOver\(sufijo): \(etiquetaAccesible(lugar, datos: datosElegidos, hora: hora))")
  }
}
