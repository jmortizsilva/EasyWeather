import {
  avisoLluviaParaServidor,
  estadoAvisoLluvia,
  horaDeMinutos,
  OPCIONES_INTENSIDAD,
  valoresAjustable,
} from '../avisoLluvia';
import { completarAjustes, DEFAULT_AVISO_LLUVIA } from '../ajustesAvisos';
import { NotificationSettings } from '../../types';

describe('el aviso de lluvia en la app', () => {
  it('nace como se aprobó: apagado, cualquier lluvia y sin franja de noche', () => {
    expect(DEFAULT_AVISO_LLUVIA).toEqual({
      enabled: false,
      intensidad: 'cualquiera',
      noche: { activada: false, desde: 23 * 60, hasta: 8 * 60 },
    });
  });

  it('los ajustes guardados antes de existir lo reciben apagado', () => {
    const viejos = {
      summaries: [],
      threshold: { enabled: false, maxThreshold: 30, minThreshold: 3 },
    };
    expect(completarAjustes(viejos as unknown as NotificationSettings).avisoLluvia).toEqual(
      DEFAULT_AVISO_LLUVIA,
    );
  });

  it('la intensidad, con lo que dice VoiceOver antes y después de cada deslizamiento', () => {
    expect(valoresAjustable(OPCIONES_INTENSIDAD, 'moderada')).toMatchObject({
      value: 'Desde moderada',
      valueOnIncrement: 'Solo fuerte',
      valueOnDecrement: 'Cualquier lluvia',
      siguiente: 'fuerte',
      anterior: 'cualquiera',
    });
  });

  it('en los extremos el ajustable se queda donde está', () => {
    expect(valoresAjustable(OPCIONES_INTENSIDAD, 'fuerte')).toMatchObject({
      siguiente: 'fuerte',
      valueOnIncrement: 'Solo fuerte',
    });
    expect(valoresAjustable(OPCIONES_INTENSIDAD, 'cualquiera')).toMatchObject({
      anterior: 'cualquiera',
      siguiente: 'moderada',
      valueOnIncrement: 'Desde moderada',
    });
  });

  it('el estado de la fila en la lista de Avisos', () => {
    expect(estadoAvisoLluvia(DEFAULT_AVISO_LLUVIA)).toBe('Desactivado');
    expect(estadoAvisoLluvia({ ...DEFAULT_AVISO_LLUVIA, enabled: true })).toBe(
      'Activado · cualquier lluvia',
    );
    expect(
      estadoAvisoLluvia({ ...DEFAULT_AVISO_LLUVIA, enabled: true, intensidad: 'fuerte' }),
    ).toBe('Activado · solo fuerte');
  });

  it('las horas de la franja', () => {
    expect(horaDeMinutos(23 * 60)).toBe('23:00');
    expect(horaDeMinutos(8 * 60 + 5)).toBe('08:05');
  });

  it('al servidor solo va si está activado, y la franja solo si está activada', () => {
    // Los ajustes guardados antes del 2026-11-20 traen la distancia y el segundo aviso: no se mandan.
    const antiguos = { ...DEFAULT_AVISO_LLUVIA, enabled: true, radioKm: 20, segundoAviso: true };
    expect(avisoLluviaParaServidor(antiguos)).toEqual({ intensidad: 'cualquiera', noche: null });
    expect(avisoLluviaParaServidor(DEFAULT_AVISO_LLUVIA)).toBeNull();
    expect(avisoLluviaParaServidor({ ...DEFAULT_AVISO_LLUVIA, enabled: true })).toEqual({
      intensidad: 'cualquiera',
      noche: null,
    });
    const conNoche = {
      ...DEFAULT_AVISO_LLUVIA,
      enabled: true,
      noche: { activada: true, desde: 1380, hasta: 480 },
    };
    expect(avisoLluviaParaServidor(conNoche)?.noche).toEqual({ desde: 1380, hasta: 480 });
  });
});
