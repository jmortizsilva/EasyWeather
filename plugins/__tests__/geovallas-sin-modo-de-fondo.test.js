const fs = require('fs');
const os = require('os');
const path = require('path');

const { aplicarParches, raizDeExpoLocation, PARCHES } = require('../geovallas-sin-modo-de-fondo');

// Esta prueba corre sobre el fuente REAL de expo-location, copiado a un temporal. Ese es todo su
// valor: si una actualizacion de la libreria cambia esas lineas, falla aqui, en `npm run verificar`,
// y no cinco minutos despues en EAS o —mucho peor— en un iPhone que se ha quedado sin geovallas.

const RAIZ_LIBRERIA = raizDeExpoLocation(path.join(__dirname, '..', '..'));

function copiarFuenteAUnTemporal() {
  const destino = fs.mkdtempSync(path.join(os.tmpdir(), 'geovallas-'));
  for (const { fichero } of PARCHES) {
    const ruta = path.join(destino, fichero);
    fs.mkdirSync(path.dirname(ruta), { recursive: true });
    fs.copyFileSync(path.join(RAIZ_LIBRERIA, fichero), ruta);
  }
  return destino;
}

const leer = (raiz, fichero) => fs.readFileSync(path.join(raiz, fichero), 'utf8');
const veces = (texto, aguja) => texto.split(aguja).length - 1;

describe('el parche que permite geovallas sin el modo de fondo', () => {
  let copia;

  beforeEach(() => {
    copia = copiarFuenteAUnTemporal();
  });

  afterEach(() => {
    fs.rmSync(copia, { recursive: true, force: true });
  });

  it('encuentra en expo-location lo que espera encontrar', () => {
    for (const { fichero, busca } of PARCHES) {
      expect(leer(RAIZ_LIBRERIA, fichero)).toContain(busca);
    }
  });

  it('quita la exigencia del modo de fondo solo de las geovallas', () => {
    aplicarParches(copia);
    const swift = leer(copia, 'ios/LocationModule.swift');

    expect(swift).toContain('startGeofencingAsync');
    // startLocationUpdatesAsync SI necesita el modo de fondo, y la app no lo usa: su guard se queda.
    expect(veces(swift, 'hasBackgroundModeEnabled("location")')).toBe(1);
  });

  it('quita la linea que lanzaria al vigilar una zona', () => {
    aplicarParches(copia);
    const objc = leer(copia, 'ios/TaskConsumers/EXGeofencingTaskConsumer.m');

    // La asignacion, no la palabra: el comentario que deja el parche la nombra para explicarse.
    expect(objc).not.toContain('allowsBackgroundLocationUpdates = YES');
    // Lo demas del consumidor sigue en pie: solo sobraba esa linea.
    expect(objc).toContain('startMonitoringForRegion');
  });

  it('no vuelve a parchear lo ya parcheado', () => {
    aplicarParches(copia);
    const trasElPrimero = PARCHES.map(({ fichero }) => leer(copia, fichero));

    aplicarParches(copia);

    expect(PARCHES.map(({ fichero }) => leer(copia, fichero))).toEqual(trasElPrimero);
  });

  it('lanza si expo-location ya no dice lo que decia', () => {
    const { fichero } = PARCHES[0];
    fs.writeFileSync(path.join(copia, fichero), 'otra cosa');

    expect(() => aplicarParches(copia)).toThrow(/ha cambiado/);
  });
});
