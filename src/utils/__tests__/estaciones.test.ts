import {
  avisoSinDato,
  eleccionAplicable,
  EstacionCandidata,
  filaAutomatica,
  filaEstacion,
} from '../estaciones';

// Los textos de elegir estacion. La hora sale de `horaMedicion`, que usa la zona del telefono: se
// comprueba que la hora APARECE, no cual es, para que la prueba no dependa de donde se ejecute.

const estacion = (extra: Partial<EstacionCandidata> = {}): EstacionCandidata => ({
  id: '3195',
  nombre: 'Madrid Retiro',
  latitude: 40.4119,
  longitude: -3.6783,
  altitude: 667,
  distanceKm: 3.4,
  desnivelM: 17,
  observedAt: '2026-08-16T11:00:00+0000',
  temperature: 31.7,
  motivoDescarte: null,
  ...extra,
});

describe('filaEstacion', () => {
  it('dice cuánto, a qué altura y de cuándo', () => {
    const fila = filaEstacion(estacion());
    expect(fila.titulo).toBe('Madrid Retiro');
    expect(fila.detalle).toContain('a 3,4 km');
    expect(fila.detalle).toContain('17 m más alta que tu sitio');
    expect(fila.detalle).toContain('dato de las');
  });

  it('con coma decimal, como el resto de la app', () => {
    expect(filaEstacion(estacion({ distanceKm: 12.5 })).detalle).toContain('12,5 km');
  });

  it('dice "más baja" cuando la estación está por debajo', () => {
    expect(filaEstacion(estacion({ desnivelM: -240 })).detalle).toContain('240 m más baja');
  });

  it('un desnivel de cuatro metros no se menciona: es ruido en una línea que se oye', () => {
    expect(filaEstacion(estacion({ desnivelM: 4 })).detalle).not.toContain('más alta');
    expect(filaEstacion(estacion({ desnivelM: undefined })).detalle).not.toContain('más');
  });

  it('dice POR QUÉ la app no la cogería sola, para que la elección no sea a ciegas', () => {
    expect(filaEstacion(estacion({ motivoDescarte: 'lejos' })).detalle).toContain(
      'más lejos de lo que la app coge sola',
    );
    expect(filaEstacion(estacion({ motivoDescarte: 'desnivel' })).detalle).toContain(
      'a otra altitud que tu sitio',
    );
    expect(filaEstacion(estacion({ motivoDescarte: 'vieja' })).detalle).toContain(
      'su último dato es viejo',
    );
  });

  it('lo hablado dice las unidades con todas sus letras', () => {
    // "km" no siempre se expande y el punto medio se lee como signo.
    const fila = filaEstacion(estacion());
    expect(fila.spoken).toContain('3,4 kilómetros');
    expect(fila.spoken).toContain('17 metros más alta');
    expect(fila.spoken).not.toContain('·');
    expect(fila.spoken.endsWith('.')).toBe(true);
  });
});

describe('filaAutomatica', () => {
  it('adelanta cuál saldría elegida si no tocas nada', () => {
    const fila = filaAutomatica(estacion());
    expect(fila.titulo).toBe('Automática');
    expect(fila.detalle).toContain('Madrid Retiro');
    expect(fila.spoken).toContain('kilómetros');
  });

  it('y dice la verdad cuando no hay ninguna que represente el sitio', () => {
    const fila = filaAutomatica(undefined);
    expect(fila.detalle).toContain('no hay ninguna');
  });
});

describe('avisoSinDato', () => {
  // Lo que se enseña en vez de la medición cuando la estación elegida calla. Nunca se cae en la
  // automática: poner "Estación X" encima de un número de Y sería mentir sobre quién midió.

  it('la estación vieja dice DESDE CUÁNDO no publica', () => {
    const aviso = avisoSinDato('vieja', 'Madrid Retiro', '2026-08-16T06:00:00+0000');
    expect(aviso.visible).toContain('Madrid Retiro');
    expect(aviso.visible).toMatch(/no publica desde las \d{2}:\d{2}/);
    expect(aviso.spoken).toContain('Tu estación elegida');
  });

  it('sin hora legible no se inventa ninguna', () => {
    const aviso = avisoSinDato('vieja', 'Madrid Retiro', 'esto no es una fecha');
    expect(aviso.visible).toBe('Madrid Retiro no publica ahora mismo');
  });

  it('la que emite sin termómetro se distingue de la que calla', () => {
    expect(avisoSinDato('sin-dato', 'Getafe').visible).toContain('sin temperatura');
  });

  it('y la retirada dice que ya no está en la red', () => {
    expect(avisoSinDato('desconocida', 'Getafe').visible).toContain('ya no está en la red');
  });

  it('el nombre sale siempre, que es lo que hace falta para poder cambiarla', () => {
    for (const motivo of ['vieja', 'sin-dato', 'desconocida'] as const) {
      expect(avisoSinDato(motivo, 'Navacerrada').visible).toContain('Navacerrada');
      expect(avisoSinDato(motivo, 'Navacerrada').spoken).toContain('Navacerrada');
    }
  });
});

describe('eleccionAplicable', () => {
  // Poder elegir estación también en "Mi ubicación", que TE SIGUE, sin que acabe enseñando la
  // estación de tu pueblo estando a 350 km. La elección no se borra: se queda dormida.
  const enCasa = { id: '3195', nombre: 'Madrid Retiro', lat: 40.4168, lon: -3.7038 };

  it('manda estando donde la elegiste', () => {
    expect(eleccionAplicable(enCasa, { lat: 40.4168, lon: -3.7038 })).toBe(true);
  });

  it('sigue mandando por el barrio y por los pueblos de al lado', () => {
    expect(eleccionAplicable(enCasa, { lat: 40.45, lon: -3.69 })).toBe(true);
    // Alcalá de Henares, a unos 30 km... eso ya no.
    expect(eleccionAplicable(enCasa, { lat: 40.4818, lon: -3.3643 })).toBe(false);
  });

  it('se queda dormida en un viaje, y eso es lo que evita el fallo de Valencia', () => {
    expect(eleccionAplicable(enCasa, { lat: 39.47, lon: -0.376 })).toBe(false);
  });

  it('una elección guardada sin punto se aplica igual', () => {
    // Son las de antes de que esto existiera, y las de los lugares guardados, que no se mueven:
    // ante la duda no se le quita al usuario algo que sí eligió.
    expect(
      eleccionAplicable({ id: '3195', nombre: 'Madrid Retiro' }, { lat: 39.47, lon: -0.376 }),
    ).toBe(true);
  });

  it('sin elección no hay nada que aplicar', () => {
    expect(eleccionAplicable(undefined, { lat: 40.4168, lon: -3.7038 })).toBe(false);
  });
});
