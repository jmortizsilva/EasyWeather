import ExpoModulesCore

public class AdjustableButtonModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AdjustableButton")

    View(AdjustableButtonView.self) {
      Events("onAccessibilityIncrement", "onAccessibilityDecrement", "onAccessibilityActivate")

      Prop("label") { (view: AdjustableButtonView, label: String) in
        view.accessibilityLabel = label
      }

      Prop("value") { (view: AdjustableButtonView, value: String) in
        view.accessibilityValue = value
      }

      Prop("hint") { (view: AdjustableButtonView, hint: String) in
        view.accessibilityHint = hint
      }
    }
  }
}
