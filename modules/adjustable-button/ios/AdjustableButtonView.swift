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

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    // La fila entera es un único elemento para VoiceOver; sus hijos quedan ocultos.
    isAccessibilityElement = true
    accessibilityTraits = [.adjustable, .button]
  }

  // Flick vertical de un dedo con VoiceOver.
  override func accessibilityIncrement() {
    onAccessibilityIncrement()
  }

  override func accessibilityDecrement() {
    onAccessibilityDecrement()
  }

  // Doble toque con VoiceOver.
  override func accessibilityActivate() -> Bool {
    onAccessibilityActivate()
    return true
  }
}
