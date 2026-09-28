const appJson = require('../app.json');

// La identidad de la app publicada. Estos dos valores los tiene registrados Apple: si cambiaran,
// dejaria de ser la misma app (otra ficha, otros usuarios, otras compras). Se fijan aqui para que
// ningun cambio en la variante de pruebas pueda arrastrarlos sin que salte una prueba.
const IDENTIFICADOR_PUBLICADO = 'com.jmortizsilva.tiempo';
const NOMBRE_PUBLICADO = 'EasyWeather';

// El config de Expo se lee una vez por proceso y depende de una variable de entorno, asi que hay
// que volver a cargarlo en cada caso.
function configConVariante(variante) {
  let resultado;
  jest.isolateModules(() => {
    const anterior = process.env.APP_VARIANT;
    if (variante === undefined) {
      delete process.env.APP_VARIANT;
    } else {
      process.env.APP_VARIANT = variante;
    }
    const definir = require('../app.config').default;
    resultado = definir({ config: appJson.expo });
    if (anterior === undefined) {
      delete process.env.APP_VARIANT;
    } else {
      process.env.APP_VARIANT = anterior;
    }
  });
  return resultado;
}

describe('la identidad de la app', () => {
  it('sin variante es EXACTAMENTE la app publicada', () => {
    const config = configConVariante(undefined);
    expect(config.ios.bundleIdentifier).toBe(IDENTIFICADOR_PUBLICADO);
    expect(config.name).toBe(NOMBRE_PUBLICADO);
  });

  it('la cadena vacía tampoco es una variante', () => {
    expect(configConVariante('').ios.bundleIdentifier).toBe(IDENTIFICADOR_PUBLICADO);
  });

  it.each(['development', 'preview', 'lo-que-sea'])(
    'con APP_VARIANT=%s sale la app de pruebas, que es otra app para iOS',
    (variante) => {
      const config = configConVariante(variante);
      expect(config.ios.bundleIdentifier).toBe('com.jmortizsilva.tiempo.dev');
      expect(config.ios.bundleIdentifier).not.toBe(IDENTIFICADOR_PUBLICADO);
      // Y con otro nombre: dos apps llamadas igual son indistinguibles de oído en la pantalla de
      // inicio, que es la forma más fácil de acabar probando en la que no era.
      expect(config.name).not.toBe(NOMBRE_PUBLICADO);
    },
  );

  it('la app de pruebas conserva el runtime, o no le llegarían las actualizaciones por aire', () => {
    // Es lo que empareja una build con los `eas update`: si la variante lo cambiara, la app de
    // pruebas se quedaria congelada en el JavaScript del dia que se compilo.
    expect(configConVariante('preview').runtimeVersion).toBe(appJson.expo.runtimeVersion);
  });

  it('y conserva el proyecto de EAS y la URL de updates', () => {
    const config = configConVariante('preview');
    expect(config.extra.eas.projectId).toBe(appJson.expo.extra.eas.projectId);
    expect(config.updates.url).toBe(appJson.expo.updates.url);
  });
});
