import { CurrentObservation } from '../../types';
import { describirObservacion, horaMedicion, parsearMomento } from '../observacionTexto';

const observacion = (extra: Partial<CurrentObservation> = {}): CurrentObservation => ({
  temperature: 28.5,
  observedAt: '2026-08-16T11:00:00+0000',
  source: 'aemet',
  station: {
    id: '3195',
    name: 'MADRID RETIRO',
    latitude: 40.4119,
    longitude: -3.6783,
    altitude: 667,
    distanceKm: 2.3,
  },
  ...extra,
});

describe('parsearMomento', () => {
  it('entiende el desfase pegado que manda AEMET', () => {
    // "+0000" sin dos puntos es ISO 8601 valido, pero no es la forma que el estandar de JavaScript
    // obliga a interpretar: Hermes puede ser mas estricto que Node. Por eso se normaliza.
    const fecha = parsearMomento('2026-08-16T11:00:00+0000');
    expect(fecha?.toISOString()).toBe('2026-08-16T11:00:00.000Z');
  });

  it('entiende tambien el desfase con dos puntos', () => {
    expect(parsearMomento('2026-08-16T11:00:00+02:00')?.toISOString()).toBe(
      '2026-08-16T09:00:00.000Z',
    );
  });

  it('con una fecha ilegible devuelve undefined en vez de una fecha invalida', () => {
    expect(parsearMomento('vete a saber')).toBeUndefined();
    expect(parsearMomento('')).toBeUndefined();
  });
});

describe('horaMedicion', () => {
  it('da la hora en el huso del telefono, no en UTC', () => {
    // Las pruebas corren en un huso fijo (ver jest.config); lo que importa es que convierta.
    const hora = horaMedicion('2026-08-16T11:00:00+0000');
    expect(hora).toMatch(/^\d{2}:\d{2}$/);
  });

  it('sin fecha legible no inventa una hora', () => {
    expect(horaMedicion('no es una fecha')).toBeUndefined();
  });
});

describe('describirObservacion', () => {
  it('dice cuanto, quien, donde y cuando', () => {
    // Las cuatro preguntas que una medicion tiene que poder contestar sola.
    const t = describirObservacion(observacion())!;
    expect(t.principal).toMatch(/^Medido: 28,5º a las \d{2}:\d{2}$/);
    expect(t.estacion).toBe('Estación MADRID RETIRO, a 2,3 km · AEMET');
  });

  it('usa coma decimal, que es como se escribe en español', () => {
    expect(describirObservacion(observacion({ temperature: 31.7 }))?.principal).toContain('31,7');
  });

  it('un valor redondo no arrastra decimales de mas', () => {
    expect(describirObservacion(observacion({ temperature: 28 }))?.principal).toContain('28º');
  });

  it('VoiceOver dice grados y kilometros con letras, y de donde viene el dato', () => {
    // El simbolo º se leeria como ordinal, y "km" no siempre se expande. La procedencia va dentro
    // para no obligar a deducirla mirando la pantalla.
    const t = describirObservacion(observacion())!;
    expect(t.spoken).toContain('28,5 grados');
    expect(t.spoken).toContain('Observación de AEMET');
    expect(t.spoken).toContain('a 2,3 kilómetros');
    expect(t.spoken).not.toContain('º');
    expect(t.spoken).not.toContain(' km');
  });

  it('sin temperatura no se enseña nada: una ficha de estacion sin medida no dice nada', () => {
    expect(describirObservacion(observacion({ temperature: undefined }))).toBeUndefined();
  });

  it('sin observacion devuelve undefined', () => {
    expect(describirObservacion(undefined)).toBeUndefined();
  });

  it('con la fecha rota se omite la hora pero se conserva el resto', () => {
    // Mejor una medicion sin fechar (raro) que una fechada mal.
    const t = describirObservacion(observacion({ observedAt: 'roto' }))!;
    expect(t.principal).toBe('Medido: 28,5º');
    expect(t.spoken).toContain('28,5 grados');
    expect(t.spoken).not.toContain('Medida a las');
  });

  it('redondea la distancia a un decimal con coma', () => {
    const t = describirObservacion(
      observacion({
        station: { ...observacion().station, distanceKm: 13.5 },
      }),
    )!;
    expect(t.estacion).toContain('a 13,5 km');
  });
});
