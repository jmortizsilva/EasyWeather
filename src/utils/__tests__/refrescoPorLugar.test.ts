import { ConsultaHecha, veredictoRefresco } from '../refrescoPorLugar';

const VENTANA = 10 * 60 * 1000;
const AHORA = 1_757_400_000_000;
const VALENCIA = { lat: 39.4699, lon: -0.3763 };
const CARABANCHEL = { lat: 40.3833, lon: -3.7333 };

const hecha = (punto: { lat: number; lon: number }, cuando: number): ConsultaHecha => ({
  cuando,
  ...punto,
});

describe('veredictoRefresco', () => {
  it('la primera vez se consulta, que no hay nada guardado', () => {
    expect(veredictoRefresco(undefined, VALENCIA, AHORA, VENTANA)).toBe('consultar');
  });

  it('mismo punto y recien preguntado: se espera', () => {
    const ultima = hecha(VALENCIA, AHORA - 60_000);
    expect(veredictoRefresco(ultima, VALENCIA, AHORA, VENTANA)).toBe('esperar');
  });

  it('mismo punto pero pasada la ventana: se vuelve a preguntar', () => {
    const ultima = hecha(VALENCIA, AHORA - VENTANA - 1);
    expect(veredictoRefresco(ultima, VALENCIA, AHORA, VENTANA)).toBe('consultar');
  });

  // El fallo que destapo este modulo: volver de Valencia a Madrid dentro de la ventana. Con el
  // throttle anterior, que solo miraba la hora, esto devolvia "esperar" y la pantalla se quedaba
  // enseñando la temperatura medida en el aeropuerto de Valencia bajo el rotulo "Carabanchel".
  it('otro punto dentro de la ventana: se pregunta IGUAL, y se tira lo anterior', () => {
    const ultima = hecha(VALENCIA, AHORA - 60_000);
    expect(veredictoRefresco(ultima, CARABANCHEL, AHORA, VENTANA)).toBe('olvidar-y-consultar');
  });

  it('otro punto y ademas vencida: sigue habiendo que tirar lo anterior', () => {
    const ultima = hecha(VALENCIA, AHORA - VENTANA - 1);
    expect(veredictoRefresco(ultima, CARABANCHEL, AHORA, VENTANA)).toBe('olvidar-y-consultar');
  });

  it('basta con que cambie una de las dos coordenadas', () => {
    const ultima = hecha(VALENCIA, AHORA - 60_000);
    expect(veredictoRefresco(ultima, { ...VALENCIA, lon: -0.4 }, AHORA, VENTANA)).toBe(
      'olvidar-y-consultar',
    );
    expect(veredictoRefresco(ultima, { ...VALENCIA, lat: 39.5 }, AHORA, VENTANA)).toBe(
      'olvidar-y-consultar',
    );
  });

  // Asi se marca un fallo de red: se apunta el punto para no perderlo, pero con cuando=0 para poder
  // reintentar en cuanto se vuelva a pasar por aqui.
  it('marcada como reintentable (cuando=0): se consulta sin esperar la ventana', () => {
    expect(veredictoRefresco(hecha(VALENCIA, 0), VALENCIA, AHORA, VENTANA)).toBe('consultar');
  });
});
