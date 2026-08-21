import { getAvisos } from '../avisos';

// Lo único que hay que probar aquí es la distinción entre "no hay avisos" y "no se ha podido
// preguntar". No es una sutileza: si se confundieran, un servidor caído borraría de la pantalla un
// aviso naranja, que es tanto como decirle a alguien que ya puede salir.

const respuesta = (cuerpo: unknown, ok = true) =>
  ({ ok, json: async () => cuerpo }) as unknown as Response;

describe('getAvisos', () => {
  const fetchOriginal = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = fetchOriginal;
  });

  it('devuelve los avisos que manda el servidor', async () => {
    const cuerpo = {
      avisos: [{ id: 'a', level: 'naranja' }],
      resumen: { titulo: 'Aviso naranja por lluvias', nivel: 'naranja' },
    };
    globalThis.fetch = jest.fn().mockResolvedValue(respuesta(cuerpo));

    const resultado = await getAvisos(41.11, 1.24);
    expect(resultado?.avisos).toHaveLength(1);
    expect(resultado?.resumen?.nivel).toBe('naranja');
  });

  it('lista vacía significa que AEMET no tiene nada, y se devuelve como tal', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(respuesta({ avisos: [], resumen: null }));

    const resultado = await getAvisos(40.41, -3.7);
    expect(resultado).toEqual({ avisos: [], resumen: null });
  });

  it('un servidor que responde mal NO es lo mismo que no haber avisos', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(respuesta({ error: 'roto' }, false));
    expect(await getAvisos(40.41, -3.7)).toBeUndefined();
  });

  it('un fallo de red tampoco lanza: devuelve undefined', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('sin red'));
    expect(await getAvisos(40.41, -3.7)).toBeUndefined();
  });

  it('un 200 con un cuerpo raro se toma como que no hay avisos, no como caída', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(respuesta({ vaya: 'esto no es' }));
    expect(await getAvisos(40.41, -3.7)).toEqual({ avisos: [], resumen: null });
  });

  it('manda las coordenadas en la consulta', async () => {
    const espia = jest.fn().mockResolvedValue(respuesta({ avisos: [], resumen: null }));
    globalThis.fetch = espia;

    await getAvisos(41.1189, 1.2445);
    expect(String(espia.mock.calls[0][0])).toContain('lat=41.1189&lon=1.2445');
  });
});
