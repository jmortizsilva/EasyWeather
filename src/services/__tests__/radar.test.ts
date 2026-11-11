import { getRadar } from '../radar';

function responder(estado: number, cuerpo: unknown) {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: estado >= 200 && estado < 300,
    status: estado,
    json: async () => cuerpo,
  }) as unknown as typeof fetch;
}

const fetchOriginal = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

describe('getRadar', () => {
  it('devuelve los textos que manda el servidor', async () => {
    responder(200, {
      radar: {
        visible: 'Radar 11:20: llueve aquí, débil',
        hablado: 'Radar de AEMET…',
        codigo: 'ma',
      },
    });
    expect(await getRadar(40.4, -3.7)).toEqual({
      visible: 'Radar 11:20: llueve aquí, débil',
      hablado: 'Radar de AEMET…',
      sinImagen: false,
    });
  });

  it('null: ningún radar cubre el sitio, y no se enseña nada', async () => {
    responder(200, { radar: null });
    expect(await getRadar(48.85, 2.35)).toBeNull();
  });

  it('undefined: no se ha podido preguntar, que no es lo mismo', async () => {
    responder(503, { error: 'radar no disponible' });
    expect(await getRadar(40.4, -3.7)).toBeUndefined();
    responder(200, { radar: { visible: 'sin el hablado' } });
    expect(await getRadar(40.4, -3.7)).toBeUndefined();
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('sin red')) as unknown as typeof fetch;
    expect(await getRadar(40.4, -3.7)).toBeUndefined();
  });
});
