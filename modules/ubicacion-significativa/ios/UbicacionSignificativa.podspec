Pod::Spec.new do |s|
  s.name           = 'UbicacionSignificativa'
  s.version        = '1.0.0'
  s.summary        = 'Seguimiento de ubicacion por cambios significativos, sin modo de fondo'
  s.description    = 'Servicio de cambios significativos de iOS: avisa al servidor de avisos ' \
                     'cuando el usuario cambia de sitio, sin GPS y sin UIBackgroundModes location'
  s.license        = 'MIT'
  s.author         = 'Jose Maria Ortiz Silva'
  s.homepage       = 'https://github.com/jmortizsilva/EasyWeather'
  s.platforms      = {
    :ios => '15.1'
  }
  s.source         = { git: 'https://github.com/jmortizsilva/EasyWeather.git' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,swift}"
end
