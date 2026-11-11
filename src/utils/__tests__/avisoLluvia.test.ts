import {
  avisoLluviaParaServidor,
  estadoAvisoLluvia,
  horaDeMinutos,
  OPCIONES_INTENSIDAD,
  OPCIONES_RADIO,
  valoresAjustable,
} from '../avisoLluvia';
import { completarAjustes, DEFAULT_AVISO_LLUVIA } from '../ajustesAvisos';
import { NotificationSettings } from '../../types';

describe('el aviso de lluvia en la app', () => {
  it('nace como se aprobó: apagado, 35 km, cualquier lluvia y sin franja de noche', () => {
    expect(DEFAULT_AVISO_LLUVIA).toEqual({
      enabled: false,
      radioKm: 35,
      intensidad: 'cualquiera',
      segundoAviso: false,
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

  it('la distancia se dice entera y se ve abreviada', () => {
    const v = valoresAjustable(OPCIONES_RADIO, 35);
    expect(v).toMatchObject({
      value: '35 kilómetros',
      valueOnIncrement: '50 kilómetros',
      valueOnDecrement: '20 kilómetros',
      siguiente: 50,
      anterior: 20,
    });
    expect(OPCIONES_RADIO.map((o) => o.visible)).toEqual(['10 km', '20 km', '35 km', '50 km']);
  });

  it('en los extremos el ajustable se queda donde está', () => {
    expect(valoresAjustable(OPCIONES_RADIO, 50)).toMatchObject({
      siguiente: 50,
      valueOnIncrement: '50 kilómetros',
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
      'Activado · 35 km, cualquier lluvia',
    );
    expect(
      estadoAvisoLluvia({
        ...DEFAULT_AVISO_LLUVIA,
        enabled: true,
        radioKm: 10,
        intensidad: 'fuerte',
      }),
    ).toBe('Activado · 10 km, solo fuerte');
  });

  it('las horas de la franja', () => {
    expect(horaDeMinutos(23 * 60)).toBe('23:00');
    expect(horaDeMinutos(8 * 60 + 5)).toBe('08:05');
  });

  it('al servidor solo va si está activado, y la franja solo si está activada', () => {
    expect(avisoLluviaParaServidor(DEFAULT_AVISO_LLUVIA)).toBeNull();
    expect(avisoLluviaParaServidor({ ...DEFAULT_AVISO_LLUVIA, enabled: true })).toEqual({
      radioKm: 35,
      intensidad: 'cualquiera',
      segundoAviso: false,
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
