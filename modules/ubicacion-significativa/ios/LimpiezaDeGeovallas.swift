import Foundation

/**
 Borra del telefono la tarea de geovallas que registraron las versiones anteriores de la app.

 POR QUE HACE FALTA. La tarea la guarda expo-task-manager en `UserDefaults` y **sobrevive a
 actualizar la app**. iOS la restaura al arrancar, y esa restauracion enciende
 `allowsBackgroundLocationUpdates`, que sin el modo de fondo "location" lanza y mata la app. Como
 esta app ya no declara ese modo (Apple lo rechazo, 2.5.4), cualquiera que actualice desde una
 version con geovallas se encontraria la app sin abrir. Paso el 2026-09-01 con los dos telefonos de
 pruebas.

 La limpieza tambien viaja por aire (`limpiarGeovallaAntigua` en `utils/ubicacionFondo.ts`), pero
 esa solo llega a quien abra la app **y** este en la version de codigo mas nueva. Quedan fuera los
 que sigan en un runtime anterior, y no hay forma de saber cuantos son. Esto los cubre a todos.

 POR QUE ESTO NO ES EL PARCHE DE AYER, que salio tan mal: aquello modificaba el codigo de una
 libreria ajena al compilar, y si no se aplicaba —que es lo que paso— la app quedaba sin abrir. Esto
 es codigo nuestro leyendo un dato guardado, y **si algo no cuadra no hace nada**: ni la clave, ni la
 forma del diccionario, ni la ausencia de tareas provocan nada peor que quedarse como estaba.
 */
enum LimpiezaDeGeovallas {
  /// Donde guarda expo-task-manager sus tareas: `NSStringFromClass([EXTaskService class])`.
  private static let CLAVE = "EXTaskService"
  /// Consumidor de las tareas de geovalla. Se borran TODAS las suyas, no solo la nuestra por
  /// nombre: cualquiera que quede registrada tiene el mismo efecto de matar la app.
  private static let CONSUMIDOR = "EXGeofencingTaskConsumer"

  static func ejecutar() {
    let ajustes = UserDefaults.standard
    guard var apps = ajustes.dictionary(forKey: CLAVE) else {
      return
    }

    var cambiado = false
    for (idApp, valor) in apps {
      guard
        var configuracion = valor as? [String: Any],
        var tareas = configuracion["tasks"] as? [String: Any]
      else {
        continue
      }
      let geovallas = tareas.filter { _, tarea in
        (tarea as? [String: Any])?["consumerClass"] as? String == CONSUMIDOR
      }
      guard !geovallas.isEmpty else {
        continue
      }
      for nombre in geovallas.keys {
        tareas.removeValue(forKey: nombre)
      }
      configuracion["tasks"] = tareas
      apps[idApp] = configuracion
      cambiado = true
    }

    if cambiado {
      ajustes.set(apps, forKey: CLAVE)
    }
  }
}
