import {
  completarAjustes,
  DEFAULT_AVISOS_OFICIALES,
  DEFAULT_NOTIFICATION_SETTINGS,
  isValidSettings,
} from '../ajustesAvisos';
import { NotificationSettings } from '../../types';

describe('avisos oficiales en los ajustes', () => {
  // Nacen apagados: nadie recibe una notificación que no ha pedido. El anuncio de la pantalla del
  // lugar se ve igual sin activar nada; esto son solo las notificaciones.
  it('vienen apagados por defecto', () => {
    expect(DEFAULT_NOTIFICATION_SETTINGS.avisosOficiales.enabled).toBe(false);
  });

  // Al encenderlos arrancan en naranja: el amarillo es muy frecuente (45 avisos activos en España
  // un día cualquiera de agosto de 2026, frente a 5 naranjas) y llenar el teléfono acaba en que se
  // silencian todos, incluido el que importaba.
  it('el nivel mínimo por defecto es naranja', () => {
    expect(DEFAULT_AVISOS_OFICIALES.nivelMinimo).toBe('naranja');
  });
});

describe('completarAjustes', () => {
  // Quien ya tenía la app guardó sus ajustes antes de que existiera este campo. Sin esto la
  // pantalla leería `undefined.enabled` y reventaría al abrir Avisos.
  it('rellena los avisos oficiales que faltan en unos ajustes guardados antes', () => {
    const viejos = {
      summaries: [],
      threshold: { enabled: true, maxThreshold: 30, minThreshold: 3 },
    } as unknown as NotificationSettings;

    const completos = completarAjustes(viejos);

    expect(completos.avisosOficiales).toEqual(DEFAULT_AVISOS_OFICIALES);
    // Y no toca lo que ya había: el umbral configurado no se pierde por la migración.
    expect(completos.threshold.maxThreshold).toBe(30);
  });

  it('no pisa unos avisos oficiales ya configurados', () => {
    const guardados: NotificationSettings = {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      avisosOficiales: { enabled: true, nivelMinimo: 'amarillo', fenomenosSilenciados: ['PR'] },
    };
    expect(completarAjustes(guardados).avisosOficiales).toEqual({
      enabled: true,
      nivelMinimo: 'amarillo',
      fenomenosSilenciados: ['PR'],
    });
  });

  // Segunda migración, la misma historia que la anterior: los fenómenos silenciados llegaron
  // después, así que hay ajustes guardados con avisos oficiales pero sin ese campo. Sin esto la
  // pantalla leería `undefined.length` al pintar la lista.
  it('a unos avisos oficiales sin fenómenos silenciados les pone la lista vacía', () => {
    const guardados = {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      avisosOficiales: { enabled: true, nivelMinimo: 'rojo' },
    } as unknown as NotificationSettings;

    expect(completarAjustes(guardados).avisosOficiales).toEqual({
      enabled: true,
      nivelMinimo: 'rojo',
      fenomenosSilenciados: [],
    });
  });

  // isValidSettings decide si lo guardado se usa o se tira. Tiene que seguir aceptando lo viejo,
  // o la migración no llegaría a ejecutarse nunca y se perderían los avisos de quien ya los tenía.
  it('unos ajustes sin el campo nuevo siguen siendo válidos', () => {
    expect(isValidSettings({ summaries: [], threshold: { enabled: false } })).toBe(true);
  });
});
