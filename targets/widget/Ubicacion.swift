import CoreLocation

// Dónde está el teléfono, para el widget de «Mi ubicación». Sin esto el widget usaba el sitio que
// dejó la app la última vez que se abrió: un probador lo vio dar Usera estando en Vallecas, y
// Vallecas estando ya en Carabanchel (2026-10-22).
//
// De dónde sale, por orden:
//   1. La posición que deja el seguidor de la app al moverte (modules/ubicacion-significativa), que
//      además le pide a iOS que redibuje el widget en ese momento. Es lo que hace que cambie al
//      moverte y no en el siguiente refresco, que decide iOS y puede tardar mucho.
//   2. Si no hay una reciente, la que pide el propio widget (NSWidgetWantsLocation, con el permiso
//      de la app), y solo si iOS se lo permite al widget (`isAuthorizedForWidgetUpdates`). Sin
//      esa comprobación, la petición fallaba en silencio y se quedaba el sitio viejo.
//   3. Si nada de eso, lo que dejó la app, con su nombre y su hora.

/// Más cerca que esto del sitio que dejó la app, se da por el mismo y se quedan su nombre y sus datos.
let mismoSitioMetros: CLLocationDistance = 500

/// La estación elegida a mano deja de valer a esta distancia, como en la app
/// (LEJOS_DE_DONDE_ELEGISTE_KM, src/utils/estaciones.ts).
let lejosDeLaEstacionMetros: CLLocationDistance = 25_000

/// Una posición guardada así de reciente vale sin pedir otra.
let posicionReciente: TimeInterval = 30 * 60

/// Lo que se espera a la posición y al nombre. iOS da poco tiempo a cada refresco del widget, y si
/// lo corta a medias no cambia nada: mejor rendirse pronto y quedarse con lo que hay.
let esperaPosicion: Duration = .seconds(5)
let esperaNombre: Duration = .seconds(4)

/// Qué posición usar, sin tocar el sistema, para poder probarlo. `guardada` es la del seguidor y
/// `deLaApp` la fecha de lo que dejó la app. Nil si hay que pedirla.
func posicionSinPedir(guardada: UbicacionGuardada?, deLaApp: Date?, ahora: Date) -> UbicacionGuardada? {
  guard let guardada else { return nil }
  let reciente = ahora.timeIntervalSince(guardada.fecha) < posicionReciente
  let posteriorALaApp = guardada.fecha > (deLaApp ?? .distantPast)
  return reciente && posteriorALaApp ? guardada : nil
}

/// Lo que devuelva `operacion`, o nil si tarda más de `limite`.
func conLimite<T: Sendable>(_ limite: Duration, _ operacion: @escaping @Sendable () async -> T?) async -> T? {
  await withTaskGroup(of: T?.self) { grupo in
    grupo.addTask { await operacion() }
    grupo.addTask {
      try? await Task.sleep(for: limite)
      return nil
    }
    let primero = await grupo.next() ?? nil
    grupo.cancelAll()
    return primero
  }
}

@MainActor
final class Localizador: NSObject, CLLocationManagerDelegate {
  private let gestor = CLLocationManager()
  private var espera: CheckedContinuation<CLLocation?, Never>?

  /// La posición, o nil si iOS no se la da al widget o no llega a tiempo.
  func posicion() async -> CLLocation? {
    guard gestor.isAuthorizedForWidgetUpdates else { return nil }
    if let ultima = gestor.location, ultima.timestamp.timeIntervalSinceNow > -posicionReciente {
      return ultima
    }
    gestor.delegate = self
    gestor.desiredAccuracy = kCLLocationAccuracyKilometer
    return await withCheckedContinuation { continuacion in
      espera = continuacion
      gestor.requestLocation()
      Task {
        try? await Task.sleep(for: esperaPosicion)
        self.terminar(nil)
      }
    }
  }

  private func terminar(_ posicion: CLLocation?) {
    espera?.resume(returning: posicion)
    espera = nil
  }

  nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    let ultima = locations.last
    Task { @MainActor in self.terminar(ultima) }
  }

  nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    Task { @MainActor in self.terminar(nil) }
  }
}

/// El nombre con la regla de la app (nombreUbicacion en src/utils/geocode.ts): «barrio, ciudad», o
/// la ciudad, o el barrio, o la comarca. Del mismo servicio de Apple que usa la app.
func nombreDe(_ posicion: CLLocation) async -> String? {
  await conLimite(esperaNombre) {
    guard
      let sitio = try? await CLGeocoder().reverseGeocodeLocation(
        posicion, preferredLocale: Locale(identifier: "es_ES")
      ).first
    else { return nil }
    let limpio = { (texto: String?) -> String? in
      let t = texto?.trimmingCharacters(in: .whitespaces)
      return t?.isEmpty == false ? t : nil
    }
    let barrio = limpio(sitio.subLocality)
    let ciudad = limpio(sitio.locality)
    if let barrio, let ciudad, barrio != ciudad { return "\(barrio), \(ciudad)" }
    return ciudad ?? barrio ?? limpio(sitio.subAdministrativeArea)
  }
}

/// La ubicación actual movida a donde está ahora el teléfono, para pedírsela al servidor. Nil si
/// sigue en el mismo sitio (se queda lo de la app) o si no se sabe dónde está.
func ubicacionAlDia(_ lugar: LugarWidget, ahora: Date = .now) async -> LugarWidget? {
  guard lugar.id == idUbicacionActual else { return nil }
  let guardada = leerUbicacionGuardada()

  let posicion: CLLocation
  var nombre: String?
  if let usar = posicionSinPedir(guardada: guardada, deLaApp: lugar.fecha, ahora: ahora) {
    posicion = CLLocation(latitude: usar.lat, longitude: usar.lon)
    nombre = usar.nombre
  } else if let deLaApp = lugar.fecha, ahora.timeIntervalSince(deLaApp) < posicionReciente {
    // La app se abrió hace poco y su posición es buena: no hace falta pedir otra.
    return nil
  } else if let pedida = await Localizador().posicion() {
    posicion = pedida
  } else if let guardada, guardada.fecha > (lugar.fecha ?? .distantPast) {
    // Vieja, pero más nueva que lo de la app: es lo último que se sabe.
    posicion = CLLocation(latitude: guardada.lat, longitude: guardada.lon)
    nombre = guardada.nombre
  } else {
    return nil
  }

  let distancia = posicion.distance(from: CLLocation(latitude: lugar.lat, longitude: lugar.lon))
  guard distancia > mismoSitioMetros else { return nil }
  if nombre == nil {
    nombre = await nombreDe(posicion)
  }
  return LugarWidget(
    id: lugar.id,
    nombre: nombre ?? "Mi ubicación",
    lat: posicion.coordinate.latitude,
    lon: posicion.coordinate.longitude,
    estacion: distancia < lejosDeLaEstacionMetros ? lugar.estacion : nil,
    actualizadoEn: nil,
    aviso: nil,
    datos: [:])
}
