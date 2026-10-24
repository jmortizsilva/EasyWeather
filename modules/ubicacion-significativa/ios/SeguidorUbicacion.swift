import CoreLocation
import UIKit
import WidgetKit

/**
 Sigue la ubicacion del usuario con el SERVICIO DE CAMBIOS SIGNIFICATIVOS de iOS, para que los
 avisos y los resumenes hablen del sitio donde esta y no del ultimo que abrio la app.

 POR QUE ESTE SERVICIO Y NO GEOVALLAS. Apple rechazo la build 17 (directriz 2.5.4) por declarar
 `UIBackgroundModes = ["location"]` sin hacer seguimiento continuo. Un ingeniero de Apple lo confirma
 en el hilo 818370 de sus foros: esa clave es de `startUpdatingLocation()` y NO hace falta para las
 APIs de bajo consumo. Se intento seguir con geovallas por expo-location, pero su consumidor
 enciende `allowsBackgroundLocationUpdates`, que sin la clave lanza y mata la app al arrancar.

 Y ademas es mejor: una geovalla hay que VOLVER A ARMARLA cada vez que se sale de ella, y si ese
 paso falla una sola vez el seguimiento muere en silencio para siempre (pasado el 2026-09-01: el
 servidor situaba el telefono en Cadiz un dia despues de volver a Madrid). Esto no se re-arma: se
 enciende una vez y sigue vivo.

 EL REPORTE SE HACE AQUI, EN SWIFT, no en JavaScript. iOS da una ventana corta al despertar a la
 app, y esperar a que arranque el motor de JS para entonces enviar era justo lo que se agotaba.
 Por eso la URL, la clave y el token se guardan en `UserDefaults` cuando la app esta abierta.

 TAMBIEN AVISA AL WIDGET (desde el 2026-10-22). El widget de «Mi ubicacion» solo se enteraba de que
 te habias movido en su siguiente refresco, que decide iOS y puede tardar mucho; un probador lo vio
 dar Usera estando en Vallecas. Ahora, al moverte mas de 500 m, se deja la posicion y el nombre en
 el App Group y se le pide a iOS que lo redibuje. Por eso hay dos interruptores: `activo` (hay
 avisos: se reporta al servidor, como siempre) y `paraWidget` (permiso «Siempre»: solo el widget,
 la posicion no sale del telefono). El servicio esta encendido si lo esta cualquiera de los dos.
 */
final class SeguidorUbicacion: NSObject, CLLocationManagerDelegate {
  static let compartido = SeguidorUbicacion()

  private let gestor = CLLocationManager()
  private let ajustes = UserDefaults.standard
  // El geocodificador se guarda como propiedad a proposito: uno creado dentro de la funcion se
  // liberaria antes de que llegue la respuesta y no llamaria nunca a su bloque.
  private let geocodificador = CLGeocoder()

  private enum Clave {
    static let activo = "tiempo.seguimiento.activo"
    static let url = "tiempo.seguimiento.url"
    static let appKey = "tiempo.seguimiento.appKey"
    static let token = "tiempo.seguimiento.token"
    static let ultimaLat = "tiempo.seguimiento.ultimaLat"
    static let ultimaLon = "tiempo.seguimiento.ultimaLon"
    static let paraWidget = "tiempo.seguimiento.paraWidget"
    /// En el App Group, no en estos ajustes: es lo que lee el widget (targets/widget/Datos.swift).
    static let ubicacionWidget = "ubicacionWidget"
  }

  /// Menos que esto no cambia ni el tiempo ni el barrio que enseña el widget.
  private static let METROS_WIDGET: CLLocationDistance = 500

  /// El almacen que comparte la app con el widget: `group.` + el identificador de la app.
  private var compartidoConWidget: UserDefaults? {
    Bundle.main.bundleIdentifier.flatMap { UserDefaults(suiteName: "group.\($0)") }
  }

  /**
   Distancia minima para volver a molestar al servidor. El servicio avisa al cambiar de antena, que
   puede ser cada pocos cientos de metros en ciudad; por debajo de esto el tiempo es el mismo y el
   nombre del sitio tambien. Es el mismo umbral que usa la app para decidir si te has movido
   (`MISMO_SITIO_METROS` en utils/distancia.ts).
   */
  private static let METROS_MINIMOS: CLLocationDistance = 1500

  private override init() {
    super.init()
    gestor.delegate = self
    // NO se toca `allowsBackgroundLocationUpdates`: es lo que exige el modo de fondo, y este
    // servicio no lo necesita. Ponerlo a true seria repetir el fallo que dejaba la app sin abrir.
  }

  // MARK: - Lo que llama JavaScript

  /// Guarda a donde hay que reportar. Se llama con la app abierta, cada vez que se sincronizan los
  /// avisos, para que el token y la clave esten al dia cuando despierte sin JavaScript.
  func configurar(url: String, appKey: String, token: String) {
    ajustes.set(url, forKey: Clave.url)
    ajustes.set(appKey, forKey: Clave.appKey)
    ajustes.set(token, forKey: Clave.token)
  }

  func empezar() {
    ajustes.set(true, forKey: Clave.activo)
    gestor.startMonitoringSignificantLocationChanges()
  }

  /// Deja de reportar al servidor. El servicio sigue si el widget lo necesita.
  func parar() {
    ajustes.set(false, forKey: Clave.activo)
    ajustes.removeObject(forKey: Clave.ultimaLat)
    ajustes.removeObject(forKey: Clave.ultimaLon)
    apagarSiNadieLoUsa()
  }

  /// Para el widget, con o sin avisos. Lo enciende la app si hay permiso «Siempre».
  func paraElWidget(_ encendido: Bool) {
    ajustes.set(encendido, forKey: Clave.paraWidget)
    if encendido {
      gestor.startMonitoringSignificantLocationChanges()
    } else {
      compartidoConWidget?.removeObject(forKey: Clave.ubicacionWidget)
      apagarSiNadieLoUsa()
    }
  }

  private func apagarSiNadieLoUsa() {
    if !estaActivo && !ajustes.bool(forKey: Clave.paraWidget) {
      gestor.stopMonitoringSignificantLocationChanges()
    }
  }

  /// Si se reporta al servidor (hay avisos). Es lo que enseña la app en «Estado de la ubicación».
  var estaActivo: Bool {
    ajustes.bool(forKey: Clave.activo)
  }

  /**
   Vuelve a encender el servicio al arrancar la app, si estaba encendido.

   Hace falta: cuando iOS relanza la app por un cambio de ubicacion, hay que volver a pedir el
   servicio para recibir el aviso pendiente. Y no puede depender de que JavaScript llegue a
   ejecutarse, porque el relanzamiento en segundo plano es precisamente cuando puede no llegar.
   */
  func rearmarSiTocaba() {
    guard estaActivo || ajustes.bool(forKey: Clave.paraWidget) else {
      return
    }
    gestor.startMonitoringSignificantLocationChanges()
  }

  // MARK: - CLLocationManagerDelegate

  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    guard let sitio = locations.last else {
      return
    }
    let alServidor = estaActivo && teHasMovido(sitio)
    let alWidget = ajustes.bool(forKey: Clave.paraWidget) && seHaMovidoParaElWidget(sitio)
    guard alServidor || alWidget else {
      return
    }
    reportar(sitio, alServidor: alServidor, alWidget: alWidget)
  }

  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    // No hay nada que hacer: el servicio sigue vigilando y volvera a avisar al proximo cambio.
  }

  // MARK: - Interior

  private func teHasMovido(_ sitio: CLLocation) -> Bool {
    guard
      let lat = ajustes.object(forKey: Clave.ultimaLat) as? Double,
      let lon = ajustes.object(forKey: Clave.ultimaLon) as? Double
    else {
      return true // Nunca se reporto: hay que hacerlo.
    }
    return sitio.distance(from: CLLocation(latitude: lat, longitude: lon)) >= Self.METROS_MINIMOS
  }

  private func seHaMovidoParaElWidget(_ sitio: CLLocation) -> Bool {
    guard
      let texto = compartidoConWidget?.string(forKey: Clave.ubicacionWidget),
      let anterior = try? JSONDecoder().decode(UbicacionWidget.self, from: Data(texto.utf8))
    else {
      return true
    }
    return sitio.distance(from: CLLocation(latitude: anterior.lat, longitude: anterior.lon))
      >= Self.METROS_WIDGET
  }

  /// Lo que lee el widget. El mismo formato que `UbicacionGuardada` en targets/widget/Datos.swift.
  private struct UbicacionWidget: Codable {
    let lat: Double
    let lon: Double
    let nombre: String?
    /// Milisegundos, como el resto de fechas del App Group.
    let en: Double
  }

  private func dejarParaElWidget(_ sitio: CLLocation, nombre: String?) {
    let ubicacion = UbicacionWidget(
      lat: sitio.coordinate.latitude, lon: sitio.coordinate.longitude, nombre: nombre,
      en: sitio.timestamp.timeIntervalSince1970 * 1000)
    guard let datos = try? JSONEncoder().encode(ubicacion) else {
      return
    }
    compartidoConWidget?.set(String(decoding: datos, as: UTF8.self), forKey: Clave.ubicacionWidget)
    WidgetCenter.shared.reloadAllTimelines()
  }

  private func anotarReportado(_ sitio: CLLocation) {
    ajustes.set(sitio.coordinate.latitude, forKey: Clave.ultimaLat)
    ajustes.set(sitio.coordinate.longitude, forKey: Clave.ultimaLon)
  }

  /**
   Nombre del sitio, con el MISMO criterio que `utils/geocode.ts`: "barrio, ciudad" cuando iOS sabe
   el barrio y no repite la ciudad; si no, la ciudad; y como ultimo recurso la comarca.

   Esta duplicado a proposito y hay que mantenerlo a la par: si aqui saliera un formato distinto, el
   titulo del resumen cambiaria de forma segun lo hubiera reportado la app o este seguidor.
   */
  private static func nombreDe(_ sitio: CLPlacemark?) -> String? {
    let limpio: (String?) -> String? = { texto in
      let t = texto?.trimmingCharacters(in: .whitespacesAndNewlines)
      return (t?.isEmpty == false) ? t : nil
    }
    let barrio = limpio(sitio?.subLocality)
    let ciudad = limpio(sitio?.locality)
    let comarca = limpio(sitio?.subAdministrativeArea)
    if let barrio, let ciudad, barrio != ciudad {
      return "\(barrio), \(ciudad)"
    }
    return ciudad ?? barrio ?? comarca
  }

  /**
   Avisa al servidor. Pide tiempo extra a iOS mientras dura, porque despertar por ubicacion da unos
   pocos segundos y una peticion de red puede no caber. Si algo falla no se anota nada, asi que el
   proximo cambio volvera a intentarlo con la ubicacion de entonces, que es la que importa.
   */
  private func reportar(_ sitio: CLLocation, alServidor: Bool, alWidget: Bool) {
    // Al servidor solo con lo necesario guardado; sin ello, sigue el widget si le toca.
    let destino: (URL, String, String)? = {
      guard
        alServidor,
        let texto = ajustes.string(forKey: Clave.url), let url = URL(string: texto),
        let appKey = ajustes.string(forKey: Clave.appKey),
        let token = ajustes.string(forKey: Clave.token)
      else {
        return nil // Todavia no se ha abierto la app para configurarlo.
      }
      return (url, appKey, token)
    }()
    guard destino != nil || alWidget else {
      return
    }

    var tarea = UIBackgroundTaskIdentifier.invalid
    tarea = UIApplication.shared.beginBackgroundTask(withName: "reportar-ubicacion") {
      // Si iOS reclama el tiempo antes de terminar, hay que cerrar la tarea o mata la app.
      if tarea != .invalid {
        UIApplication.shared.endBackgroundTask(tarea)
        tarea = .invalid
      }
    }
    let terminar = {
      DispatchQueue.main.async {
        if tarea != .invalid {
          UIApplication.shared.endBackgroundTask(tarea)
          tarea = .invalid
        }
      }
    }

    geocodificador.reverseGeocodeLocation(sitio) { [weak self] sitios, _ in
      guard let self else {
        terminar()
        return
      }
      // Sin nombre se envia igual: el servidor titula entonces "en tu ubicacion", que es impreciso
      // pero cierto. Peor seria arrastrar el nombre de la ciudad anterior. Y el widget dice
      // entonces «Mi ubicacion».
      let nombre = Self.nombreDe(sitios?.first)
      if alWidget {
        self.dejarParaElWidget(sitio, nombre: nombre)
      }
      guard let (url, appKey, token) = destino else {
        terminar()
        return
      }
      self.enviar(sitio, nombre: nombre, url: url, appKey: appKey, token: token,
                  alTerminar: terminar)
    }
  }

  private func enviar(
    _ sitio: CLLocation,
    nombre: String?,
    url: URL,
    appKey: String,
    token: String,
    alTerminar: @escaping () -> Void
  ) {
    var peticion = URLRequest(url: url)
    peticion.httpMethod = "POST"
    peticion.timeoutInterval = 15
    peticion.setValue("application/json", forHTTPHeaderField: "content-type")
    peticion.setValue(appKey, forHTTPHeaderField: "x-app-key")

    var cuerpo: [String: Any] = [
      "token": token,
      "lat": sitio.coordinate.latitude,
      "lon": sitio.coordinate.longitude,
      "zonaHoraria": TimeZone.current.identifier,
    ]
    if let nombre {
      cuerpo["nombre"] = nombre
    }
    peticion.httpBody = try? JSONSerialization.data(withJSONObject: cuerpo)

    URLSession.shared.dataTask(with: peticion) { [weak self] _, respuesta, _ in
      if let http = respuesta as? HTTPURLResponse, (200..<300).contains(http.statusCode) {
        self?.anotarReportado(sitio)
      }
      alTerminar()
    }.resume()
  }
}
