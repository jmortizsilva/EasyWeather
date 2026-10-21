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
    DatosWidget.self, from: Data(contentsOf: URL(fileURLWithPath: argumentos[1]))),
  let primero = datos.lugares.first, let fecha = primero.fecha
else {
  print("Uso: captura <json de datosWidget> <carpeta de salida> (con el primer lugar ya cargado)")
  exit(1)
}
let salida = URL(fileURLWithPath: argumentos[2])

let todos = [
  "temperatura", "cielo", "maxMin", "sensacion", "lluvia", "viento", "humedad", "uv", "estacion",
  "sol",
]
let conAviso = LugarWidget(
  id: primero.id, nombre: primero.nombre, lat: primero.lat, lon: primero.lon,
  estacion: primero.estacion, actualizadoEn: primero.actualizadoEn,
  aviso: Aviso(
    nivel: "naranja", corto: "Aviso naranja", visible: "Aviso naranja por lluvias",
    hablado: "Aviso naranja por lluvias"),
  datos: primero.datos)

// Cada caso: nombre, lo que se enseña y los datos elegidos.
let casos: [(String, Contenido, [String])] = [
  ("fabrica", .lugar(primero, fecha: fecha), datosDeFabrica),
  ("aviso", .lugar(conAviso, fecha: fecha), datosDeFabrica),
  ("todos", .lugar(primero, fecha: fecha), todos),
  ("sin-cargar", .sinCargar(primero), datosDeFabrica),
  ("borrado", .borrado, datosDeFabrica),
  ("sin-datos", .sinDatos, datosDeFabrica),
]
let tamaños: [(WidgetFamily, CGSize, String)] = [
  (.systemSmall, CGSize(width: 170, height: 170), "pequeño"),
  (.systemMedium, CGSize(width: 364, height: 170), "mediano"),
]
let letras: [(DynamicTypeSize, String)] = [(.large, "normal"), (.accessibility5, "maxima")]
let modos: [(ColorScheme, String)] = [(.light, "claro"), (.dark, "oscuro")]

MainActor.assumeIsolated {
  for (nombreCaso, contenido, claves) in casos {
    let entrada = Entrada(date: fecha, contenido: contenido, claves: claves)
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
          let nombre = "\(nombreCaso)-\(nombreTamaño)-\(nombreLetra)-\(nombreModo).png"
          if let png = renderizador.uiImage?.pngData() {
            try? png.write(to: salida.appendingPathComponent(nombre))
          } else {
            print("NO se pudo dibujar \(nombre)")
          }
        }
      }
    }
    if case .lugar(let lugar, let fecha) = contenido {
      let elegidos = claves.compactMap { lugar.datos[$0] }
      let hora = textoHora(fecha, ahora: fecha)
      print("VoiceOver, \(nombreCaso): \(etiquetaAccesible(lugar, datos: elegidos, hora: hora))")
    }
  }
  print("Dibujados \(casos.count * tamaños.count * letras.count * modos.count) en \(salida.path)")
}

// El camino de red del widget, con su mismo código (pedirAlServidor), desde dentro del simulador.
if let servidor = datos.servidor {
  let espera = DispatchSemaphore(value: 0)
  Task {
    if let fresco = await pedirAlServidor(primero, servidor: servidor), let fecha = fresco.fecha {
      print("Servidor: \(fresco.nombre), \(fresco.datos.count) datos, de \(fecha)")
      print("  \(fresco.datos["temperatura"]?.hablado ?? "sin temperatura")")
    } else {
      print("Servidor: no contestó con un lugar válido")
    }
    espera.signal()
  }
  espera.wait()
} else {
  print("Servidor: los datos no lo traen (¿app sin EXPO_PUBLIC_APP_KEY?)")
}
