import ExpoModulesCore

/**
 Vuelve a encender el seguimiento al arrancar la app, si el usuario lo tenia encendido.

 Esta es la pieza que hace que funcione con la app cerrada. Cuando iOS detecta un cambio de
 ubicacion relanza la app en segundo plano, y para recibir ese aviso hay que volver a pedirle el
 servicio a CoreLocation durante el arranque. Hacerlo aqui, y no desde JavaScript, es lo que lo
 hace fiable: en un relanzamiento en segundo plano el motor de JS puede tardar, o no llegar a
 ejecutarse antes de que iOS vuelva a suspender la app.

 Es barato: si el usuario no tenia el seguimiento encendido, no hace nada.
 */
public class UbicacionSignificativaAppDelegate: ExpoAppDelegateSubscriber {
  /**
   Se ejecuta en el `init` del AppDelegate, ANTES de `didFinishLaunchingWithOptions`, que es donde
   expo-task-manager restaura las tareas guardadas. Ese orden es justo lo que hace falta: la
   restauracion de una geovalla vieja mata la app, asi que hay que haberla borrado antes.
   */
  @MainActor
  public func appDelegateWillBeginInitialization() {
    LimpiezaDeGeovallas.ejecutar()
  }

  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    SeguidorUbicacion.compartido.rearmarSiTocaba()
    return true
  }
}
