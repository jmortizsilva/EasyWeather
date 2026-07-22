Pod::Spec.new do |s|
  s.name           = 'AdjustableButton'
  s.version        = '1.0.0'
  s.summary        = 'Vista accesible que combina los rasgos ajustable y boton en iOS'
  s.description    = 'Vista accesible que combina los rasgos ajustable y boton en iOS'
  s.license        = 'MIT'
  s.author         = 'Jose Maria Ortiz Silva'
  s.homepage       = 'https://github.com/jmortizsilva/EasyWeather'
  s.platforms      = {
    :ios => '15.1'
  }
  s.source         = { git: 'https://github.com/jmortizsilva/EasyWeather.git' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,swift}"
end
