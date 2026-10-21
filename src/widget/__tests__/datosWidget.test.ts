import { CURRENT_LOCATION_ID, Forecast, Place } from '../../types';
import { FuenteLugar, VERSION_DATOS_WIDGET, datosWidget, lugarWidget } from '../datosWidget';

const MADRID: Place = { id: 'madrid', name: 'Madrid', lat: 40.4, lon: -3.7 };
const AHORA = 1_792_000_000_000;

const PREVISION: Forecast = {
  current: { temperature: 17.6, weatherCode: 2, apparent: 15.8 },
  days: [
    {
      date: '2026-10-21',
      tMin: 11.7,
      tMax: 22.2,
      rainProbability: 40,
      windMax: 25.4,
      windDirection: 270,
      humidity: 70,
      uvMax: 6,
      sunrise: '2026-10-21T08:21',
      sunset: '2026-10-21T19:02',
    },
  ],
};

const fuente = (extra: Partial<FuenteLugar> = {}): FuenteLugar => ({
  place: MADRID,
  forecast: PREVISION,
  updatedAt: AHORA,
  ...extra,
});

describe('lugarWidget', () => {
  it('escribe cada dato para la pantalla y para VoiceOver', () => {
    const { datos } = lugarWidget(fuente());
    expect(datos.temperatura).toEqual({ visible: '18º', hablado: '18 grados' });
    expect(datos.maxMin).toEqual({
      visible: 'Mín. 12º · Máx. 22º',
      hablado: 'Mínima 12 grados, máxima 22 grados',
    });
    expect(datos.sensacion?.hablado).toBe('Sensación térmica 16 grados');
    expect(datos.lluvia).toEqual({
      visible: 'Lluvia 40%',
      hablado: 'Probabilidad de lluvia 40 por ciento',
    });
    expect(datos.viento).toEqual({
      visible: 'Viento 25,4 km/h del oeste',
      hablado: 'Viento hasta 25,4 kilómetros por hora del oeste',
    });
    expect(datos.humedad?.hablado).toBe('Humedad media 70 por ciento');
    expect(datos.uv).toEqual({ visible: 'UV 6, alto', hablado: 'Índice UV máximo 6, alto' });
    // Sin cero delante, como en la pantalla del iPhone, y lo mismo en Node: lo escriben la app y
    // el servidor, y antes salía «8:21» en uno y «08:21» en el otro.
    expect(datos.sol).toEqual({
      visible: 'Sol 8:21 – 19:02',
      hablado: 'Amanece a las 8:21, anochece a las 19:02',
    });
  });

  it('lo que se oye nunca lleva símbolos que VoiceOver lea mal', () => {
    for (const dato of Object.values(lugarWidget(fuente()).datos)) {
      expect(dato.hablado).not.toMatch(/[º%]|km\/h/);
    }
  });

  it('lo que no tiene dato no sale', () => {
    const { datos } = lugarWidget(fuente({ forecast: { days: [] } }));
    expect(datos).toEqual({});
  });

  it('la medición solo sale si hay estación con temperatura', () => {
    expect(lugarWidget(fuente()).datos.estacion).toBeUndefined();
    const { datos } = lugarWidget(
      fuente({
        observacion: {
          temperature: 17.4,
          observedAt: '2026-10-21T15:00:00Z',
          source: 'aemet',
          station: { id: '3195', name: 'Retiro', latitude: 40.41, longitude: -3.68, distanceKm: 2 },
        },
      }),
    );
    expect(datos.estacion).toEqual({
      visible: 'Medido 17,4º · Retiro',
      hablado: 'Temperatura medida 17,4 grados, estación Retiro',
    });
  });

  it('el aviso naranja o rojo sale; el amarillo no', () => {
    const conAviso = (nivel: 'amarillo' | 'naranja' | 'rojo') =>
      lugarWidget(
        fuente({
          avisos: {
            avisos: [],
            resumen: { titulo: `Aviso ${nivel} por lluvias`, detalle: '', spoken: '', nivel },
          },
        }),
      ).aviso;
    expect(conAviso('amarillo')).toBeUndefined();
    expect(conAviso('naranja')).toEqual({
      nivel: 'naranja',
      corto: 'Aviso naranja',
      visible: 'Aviso naranja por lluvias',
      hablado: 'Aviso naranja por lluvias',
    });
    expect(conAviso('rojo')?.nivel).toBe('rojo');
  });
});

describe('un lugar sin cargar', () => {
  it('va en la lista con su nombre, sin hora ni datos', () => {
    const lugar = lugarWidget({ place: MADRID });
    expect(lugar).toEqual({ id: 'madrid', nombre: 'Madrid', lat: 40.4, lon: -3.7, datos: {} });
  });
});

describe('datosWidget', () => {
  it('pone la ubicación actual la primera y lleva la versión', () => {
    const actual: Place = { ...MADRID, id: CURRENT_LOCATION_ID, name: 'Puente de Vallecas' };
    const datos = datosWidget([fuente(), fuente({ place: actual })]);
    expect(datos.version).toBe(VERSION_DATOS_WIDGET);
    expect(datos.lugares.map((l) => l.nombre)).toEqual(['Puente de Vallecas', 'Madrid']);
    expect(datos.lugares[0].actualizadoEn).toBe(AHORA);
    expect(datos.servidor).toBeUndefined();
  });

  it('lleva el servidor y la estación elegida cuando los hay', () => {
    const servidor = { url: 'https://api.jmortiz.es/apps/easyweather/widget', clave: 'x' };
    const datos = datosWidget([fuente({ estacion: '3195' })], servidor);
    expect(datos.servidor).toEqual(servidor);
    expect(datos.lugares[0].estacion).toBe('3195');
    expect(lugarWidget(fuente()).estacion).toBeUndefined();
  });
});
