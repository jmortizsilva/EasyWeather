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

  // Valor que tendra la fila tras el proximo flick, calculado en JS y enviado por adelantado.
  // Permite fijar accessibilityValue de forma sincrona dentro del gesto (ver mas abajo).
  var valueOnIncrement = ""
  var valueOnDecrement = ""

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    // La fila entera es un único elemento para VoiceOver; sus hijos quedan ocultos.
    isAccessibilityElement = true
    accessibilityTraits = [.adjustable, .button]
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
}
