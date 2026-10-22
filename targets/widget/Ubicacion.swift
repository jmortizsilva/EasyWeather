import CoreLocation

// Dónde está el teléfono, para el widget de «Ubicación actual». Sin esto el widget usaba el sitio
// que dejó la app la última vez que se abrió: un probador lo vio dar Usera estando en Vallecas, y
// Vallecas estando ya en Carabanchel (2026-10-22). Usa el permiso de la app (NSWidgetWantsLocation
// en Info.plist): no pide nada nuevo.

/// Más cerca que esto del sitio que dejó la app, se da por el mismo y se quedan su nombre y sus datos.
let mismoSitioMetros: CLLocationDistance = 500

/// La estación elegida a mano deja de valer a esta distancia, como en la app
/// (LEJOS_DE_DONDE_ELEGISTE_KM, src/utils/estaciones.ts).
let lejosDeLaEstacionMetros: CLLocationDistance = 25_000

@MainActor
final class Localizador: NSObject, CLLocationManagerDelegate {
  private let gestor = CLLocationManager()
  private var espera: CheckedContinuation<CLLocation?, Never>?

  /// La posición, o nil si no hay permiso o no llega en diez segundos.
  func posicion() async -> CLLocation? {
    let estado = gestor.authorizationStatus
    guard estado == .authorizedAlways || estado == .authorizedWhenInUse else { return nil }
    // Una posición reciente vale: el widget no necesita más precisión que el barrio.
    if let ultima = gestor.location, ultima.timestamp.timeIntervalSinceNow > -15 * 60 {
      return ultima
    }
    gestor.delegate = self
    gestor.desiredAccuracy = kCLLocationAccuracyKilometer
    return await withCheckedContinuation { continuacion in
      espera = continuacion
      gestor.requestLocation()
      Task {
        try? await Task.sleep(for: .seconds(10))
        self.terminar(self.gestor.location)
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
  guard
    let sitio = try? await CLGeocoder().reverseGeocodeLocation(
      posicion, preferredLocale: Locale(identifier: "es_ES")
    ).first
  else { return nil }
  let limpio = { (texto: String?) in texto?.trimmingCharacters(in: .whitespaces).nilSiVacio }
  let barrio = limpio(sitio.subLocality)
  let ciudad = limpio(sitio.locality)
  if let barrio, let ciudad, barrio != ciudad { return "\(barrio), \(ciudad)" }
  return ciudad ?? barrio ?? limpio(sitio.subAdministrativeArea)
}

extension String {
  fileprivate var nilSiVacio: String? { isEmpty ? nil : self }
}

/// La ubicación actual movida a donde está ahora el teléfono, para pedírsela al servidor. Nil si
/// sigue en el mismo sitio (se queda lo de la app) o si no se sabe dónde está.
func ubicacionAlDia(_ lugar: LugarWidget) async -> LugarWidget? {
  guard lugar.id == idUbicacionActual, let posicion = await Localizador().posicion() else {
    return nil
  }
  let distancia = posicion.distance(from: CLLocation(latitude: lugar.lat, longitude: lugar.lon))
  guard distancia > mismoSitioMetros else { return nil }
  return LugarWidget(
    id: lugar.id,
    nombre: await nombreDe(posicion) ?? "Mi ubicación",
    lat: posicion.coordinate.latitude,
    lon: posicion.coordinate.longitude,
    estacion: distancia < lejosDeLaEstacionMetros ? lugar.estacion : nil,
    actualizadoEn: nil,
    aviso: nil,
    datos: [:])
}
