import ExpoModulesCore

// En iOS, accessibilityTraits es un conjunto de bits, así que un mismo elemento puede ser
// "ajustable" y "botón" a la vez: VoiceOver anuncia que se puede pulsar y, además, permite
// recorrer los datos con flick vertical. React Native no deja expresar esa combinación desde
// JavaScript (pasar un array a accessibilityRole revienta en tiempo de ejecución), así que
// esta vista nativa existe solo para eso.
class AdjustableButtonView: ExpoView {
  let onAccessibilityIncrement = EventDispatcher()
  let onAccessibilityDecrement = EventDispatcher()
  let onAccessibilityActivate = EventDispatcher()
  // Gesto de tres dedos (izquierda / derecha), el mismo que pasa de pagina en la app Tiempo de
  // iOS. Lo sirve accessibilityScroll, que VoiceOver envia al elemento enfocado; sin esto el
  // gesto solo funcionaria con el foco DENTRO del scroll paginado, no sobre el control de puntos.
  let onAccessibilityScrollNext = EventDispatcher()
  let onAccessibilityScrollPrevious = EventDispatcher()

  // Valor que tendra la fila tras el proximo flick, calculado en JS y enviado por adelantado.
  // Permite fijar accessibilityValue de forma sincrona dentro del gesto (ver mas abajo).
  var valueOnIncrement = ""
  var valueOnDecrement = ""

  // Hay dos usos con necesidades distintas: las filas de dia SI se abren (rasgo de boton), y el
  // control de paginas NO tiene nada que activar, asi que anunciarlo como boton solo confunde.
  var esBoton = true {
    didSet { actualizarRasgos() }
  }

  // Cualquier valor que cambie obliga a VoiceOver a re-escanear la pantalla.
  //
  // Hace falta porque VoiceOver CACHEA los elementos: al cambiar de pagina con el flick, el
  // contenido nuevo ya estaba puesto, pero el foco seguia recorriendo el arbol viejo y un flick a
  // la derecha caia en la primera pagina. Con el gesto de tres dedos no pasaba (un scroll nativo
  // invalida la cache el solo) ni con un doble toque (que tambien la fuerza), lo que confirmo que
  // el estado en JS era correcto y lo caducado era la cache.
  //
  // React Native no expone esto: AccessibilityInfo.sendAccessibilityEvent solo admite 'focus' en
  // iOS (comprobado en el fuente de la version instalada), y setAccessibilityFocus esta obsoleta.
  var refrescoAccesibilidad = 0 {
    didSet {
      guard refrescoAccesibilidad != oldValue else { return }
      // Se aplaza un ciclo: la notificacion tiene que salir cuando la pagina nueva YA esta
      // colocada, o VoiceOver volveria a escanear el arbol anterior.
      DispatchQueue.main.async {
        // Sin argumento: se invalida el arbol pero el foco se queda donde esta (en el control de
        // paginas), que es justo lo que se quiere para no dar saltos.
        UIAccessibility.post(notification: .layoutChanged, argument: nil)
      }
    }
  }

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    // La fila entera es un único elemento para VoiceOver; sus hijos quedan ocultos.
    isAccessibilityElement = true
    actualizarRasgos()
  }

  private func actualizarRasgos() {
    accessibilityTraits = esBoton ? [.adjustable, .button] : [.adjustable]
  }

  // Flick vertical de un dedo con VoiceOver. Fijamos accessibilityValue AQUI, antes de devolver:
  // iOS lo lee al volver del gesto para refrescar la voz y —lo que nos costo dar— la linea
  // braille. Si el valor solo llega despues por el rebote asincrono a JS, la braille se queda con
  // el valor viejo (la voz no, porque iOS la anuncia un instante mas tarde, ya actualizada). Asi
  // imitamos a un ajustable nativo de UIKit, como el slider de brillo. El evento a JS sigue
  // disparandose para que React actualice el contenido visible y recalcule los valores vecinos.
  override func accessibilityIncrement() {
    if !valueOnIncrement.isEmpty {
      accessibilityValue = valueOnIncrement
    }
    onAccessibilityIncrement()
  }

  override func accessibilityDecrement() {
    if !valueOnDecrement.isEmpty {
      accessibilityValue = valueOnDecrement
    }
    onAccessibilityDecrement()
  }

  // Doble toque con VoiceOver.
  override func accessibilityActivate() -> Bool {
    onAccessibilityActivate()
    return true
  }

  // Tres dedos a izquierda/derecha. Devolver true le dice a VoiceOver que el gesto se ha
  // atendido; si devolvieramos false, buscaria un scroll en los ancestros y no encontraria
  // ninguno cuando el foco esta en el control de puntos. El valor se fija de forma sincrona, por
  // el mismo motivo que en los flicks verticales (linea braille).
  override func accessibilityScroll(_ direction: UIAccessibilityScrollDirection) -> Bool {
    switch direction {
    case .left:
      // Arrastrar el contenido hacia la izquierda muestra la pagina siguiente.
      if !valueOnDecrement.isEmpty {
        accessibilityValue = valueOnDecrement
      }
      onAccessibilityScrollNext()
      return true
    case .right:
      if !valueOnIncrement.isEmpty {
        accessibilityValue = valueOnIncrement
      }
      onAccessibilityScrollPrevious()
      return true
    default:
      return false
    }
  }
}
