import ExpoModulesCore

/// Lo que JavaScript puede pedirle al seguidor. La logica esta en `SeguidorUbicacion`.
public class UbicacionSignificativaModule: Module {
  public func definition() -> ModuleDefinition {
    Name("UbicacionSignificativa")

    // Donde reportar. Se llama con la app abierta, para que el seguidor pueda avisar al servidor
    // sin necesidad de JavaScript cuando iOS lo despierte.
    AsyncFunction("configurar") { (url: String, appKey: String, token: String) in
      SeguidorUbicacion.compartido.configurar(url: url, appKey: appKey, token: token)
    }.runOnQueue(.main)

    AsyncFunction("empezar") {
      SeguidorUbicacion.compartido.empezar()
    }.runOnQueue(.main)

    AsyncFunction("parar") {
      SeguidorUbicacion.compartido.parar()
    }.runOnQueue(.main)

    // Para poder comprobar desde la app si el seguimiento esta encendido de verdad, en vez de
    // suponerlo: lo que no se puede ver, no se puede arreglar.
    AsyncFunction("estaActivo") { () -> Bool in
      SeguidorUbicacion.compartido.estaActivo
    }.runOnQueue(.main)
  }
}
