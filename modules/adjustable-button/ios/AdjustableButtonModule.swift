import ExpoModulesCore

public class AdjustableButtonModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AdjustableButton")

    View(AdjustableButtonView.self) {
      Events(
        "onAccessibilityIncrement",
        "onAccessibilityDecrement",
        "onAccessibilityActivate",
        "onAccessibilityScrollNext",
        "onAccessibilityScrollPrevious"
      )

      Prop("label") { (view: AdjustableButtonView, label: String) in
        view.accessibilityLabel = label
      }

      // Por defecto true: las filas de dia contaban con el rasgo de boton desde el principio.
      Prop("esBoton") { (view: AdjustableButtonView, esBoton: Bool?) in
        view.esBoton = esBoton ?? true
      }

      Prop("value") { (view: AdjustableButtonView, value: String) in
        view.accessibilityValue = value
      }

      Prop("valueOnIncrement") { (view: AdjustableButtonView, value: String) in
        view.valueOnIncrement = value
      }

      Prop("valueOnDecrement") { (view: AdjustableButtonView, value: String) in
        view.valueOnDecrement = value
      }

      Prop("hint") { (view: AdjustableButtonView, hint: String) in
        view.accessibilityHint = hint
      }
    }
  }
}
