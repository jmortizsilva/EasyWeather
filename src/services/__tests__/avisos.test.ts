import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAvisos, getFenomenos } from '../avisos';

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

// El catálogo se guarda en el teléfono porque cambia una vez cada muchos meses y la pantalla de
// ajustes tiene que funcionar sin red. Lo que se prueba aquí es que la copia guardada se use
// cuando toca y NO se estropee con una respuesta rara.
describe('getFenomenos', () => {
  const fetchOriginal = globalThis.fetch;

  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  afterEach(() => {
    globalThis.fetch = fetchOriginal;
  });

  const lista = [
    { codigo: 'PR', nombre: 'Lluvias' },
    { codigo: 'RI', nombre: 'Rissagas' },
  ];

  it('devuelve lo que manda el servidor', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(respuesta({ fenomenos: lista }));

    expect(await getFenomenos()).toEqual(lista);
  });

  it('si luego no hay red, sirve la copia guardada', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(respuesta({ fenomenos: lista }));
    await getFenomenos();

    globalThis.fetch = jest.fn().mockRejectedValue(new Error('sin red'));
    expect(await getFenomenos()).toEqual(lista);
  });

  // Sin lista y sin copia, la pantalla tiene que poder DECIRLO. Una lista vacía sin explicación
  // aparentaría que AEMET no avisa de nada.
  it('sin respuesta y sin copia devuelve undefined', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('sin red'));

    expect(await getFenomenos()).toBeUndefined();
  });

  it('una lista vacía del servidor no pisa la copia buena', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(respuesta({ fenomenos: lista }));
    await getFenomenos();

    globalThis.fetch = jest.fn().mockResolvedValue(respuesta({ fenomenos: [] }));
    expect(await getFenomenos()).toEqual(lista);
  });

  it('descarta las entradas que no traen código y nombre', async () => {
    globalThis.fetch = jest
      .fn()
      .mockResolvedValue(respuesta({ fenomenos: [...lista, { codigo: 'X' }, null] }));

    expect(await getFenomenos()).toEqual(lista);
  });

  it('un 404 (servidor sin desplegar) no borra lo que ya se sabía', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(respuesta({ fenomenos: lista }));
    await getFenomenos();

    globalThis.fetch = jest.fn().mockResolvedValue(respuesta({ error: 'no existe' }, false));
    expect(await getFenomenos()).toEqual(lista);
  });
});
