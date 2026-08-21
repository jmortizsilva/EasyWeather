import { CurrentObservation, Forecast } from '../../types';
import { textoParaCompartir } from '../compartir';

const FORECAST: Forecast = {
  current: { temperature: 30, apparent: 28.9, weatherCode: 0 },
  days: [{ date: '2026-08-21', tMin: 18, tMax: 34, rainProbability: 10 }],
};

// Con decimales por todas partes: el texto compartido mezclaba coma en unas lineas y punto en otras.
const FORECAST_CON_DECIMALES: Forecast = {
  current: { temperature: 30.5, apparent: 31.6, weatherCode: 0 },
  days: [{ date: '2026-08-21', tMin: 24.6, tMax: 31.4, rainProbability: 0 }],
};

const OBSERVACION: CurrentObservation = {
  temperature: 28.5,
  observedAt: '2026-08-21T11:00:00+0000',
  source: 'aemet',
  station: {
    id: '3195',
    name: 'Madrid-Retiro',
    latitude: 40.41,
    longitude: -3.68,
    distanceKm: 2.3,
  },
};

describe('textoParaCompartir', () => {
  it('sin previsión no hay nada que compartir', () => {
    expect(
      textoParaCompartir({ nombre: 'Madrid', forecast: undefined, observacion: undefined }),
    ).toBe('');
  });

  it('dice qué es previsto y qué es medido, que fuera de la app nadie lo deduce', () => {
    const texto = textoParaCompartir({
      nombre: 'Madrid',
      forecast: FORECAST,
      observacion: OBSERVACION,
    });
    expect(texto).toContain('Previsto para esta hora: 30º, cielo despejado.');
    expect(texto).toContain('Medido: 28,5º');
    expect(texto).toContain('Estación Madrid-Retiro, a 2,3 km · AEMET');
  });

  it('lleva la sensación térmica junto a lo previsto, no junto a lo medido', () => {
    const texto = textoParaCompartir({
      nombre: 'Madrid',
      forecast: FORECAST,
      observacion: OBSERVACION,
    });
    const lineaPrevista = texto.split('\n').find((l) => l.startsWith('Previsto'));
    expect(lineaPrevista).toContain('Sensación térmica: 28,9º.');
    const lineaMedida = texto.split('\n').find((l) => l.startsWith('Medido'));
    expect(lineaMedida).not.toContain('Sensación');
  });

  it('atribuye siempre a Open-Meteo, y a AEMET solo cuando de verdad hay medición', () => {
    const conMedicion = textoParaCompartir({
      nombre: 'Madrid',
      forecast: FORECAST,
      observacion: OBSERVACION,
    });
    expect(conMedicion).toContain('Previsión de Open-Meteo.com. Observación de AEMET.');

    const sinMedicion = textoParaCompartir({
      nombre: 'Berlín',
      forecast: FORECAST,
      observacion: undefined,
    });
    expect(sinMedicion).toContain('Previsión de Open-Meteo.com.');
    expect(sinMedicion).not.toContain('AEMET');
  });

  it('todos los decimales llevan coma, tambien los de la linea de hoy', () => {
    const texto = textoParaCompartir({
      nombre: 'Miramar',
      forecast: FORECAST_CON_DECIMALES,
      observacion: OBSERVACION,
    });
    expect(texto).toContain('Previsto para esta hora: 30,5º');
    expect(texto).toContain('Sensación térmica: 31,6º.');
    expect(texto).toContain('Hoy: mínima 24,6º, máxima 31,4º');
    // Ni un solo punto decimal en todo el texto; el de "Open-Meteo.com" no cuenta.
    expect(texto).not.toMatch(/\d\.\d/);
  });

  it('una observación sin temperatura no se comparte: no es una medición', () => {
    const texto = textoParaCompartir({
      nombre: 'Madrid',
      forecast: FORECAST,
      observacion: { ...OBSERVACION, temperature: undefined },
    });
    expect(texto).not.toContain('Medido');
    expect(texto).not.toContain('AEMET');
  });

  it('con huecos en la previsión no se inventa nada ni se rompe', () => {
    const texto = textoParaCompartir({
      nombre: 'Madrid',
      forecast: { days: [{ date: '2026-08-21' }] },
      observacion: undefined,
    });
    expect(texto).toContain('El tiempo en Madrid');
    expect(texto).not.toContain('Previsto para esta hora');
    expect(texto).not.toContain('Hoy:');
  });
});
