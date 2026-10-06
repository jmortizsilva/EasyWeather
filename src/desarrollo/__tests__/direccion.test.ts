import { direccionDelPuente, PUERTO_PUENTE } from '../direccion';

describe('direccionDelPuente', () => {
  it('saca la máquina del hostUri de Metro y le pone el puerto del puente', () => {
    expect(direccionDelPuente('192.168.1.224:8081')).toBe(
      `ws://192.168.1.224:${PUERTO_PUENTE}/app`,
    );
  });

  it.each([
    ['con esquema', 'http://192.168.1.224:8081'],
    ['con ruta detrás', '192.168.1.224:8081/_expo/loading'],
    ['con parámetros', '192.168.1.224:8081?platform=ios'],
    ['sin puerto', '192.168.1.224'],
  ])('aguanta un hostUri %s', (_nombre, hostUri) => {
    expect(direccionDelPuente(hostUri)).toBe(`ws://192.168.1.224:${PUERTO_PUENTE}/app`);
  });

  // Partir por ':' a secas se come una dirección IPv6 entera y deja "ws://[".
  it('no destroza una dirección IPv6', () => {
    expect(direccionDelPuente('[fe80::1]:8081')).toBe(`ws://[fe80::1]:${PUERTO_PUENTE}/app`);
  });

  // Sin hostUri no hay desarrollo, y sin desarrollo no hay puente. Es la red de
  // seguridad que impide que una build publicada intente conectarse a nada.
  it.each([undefined, null, ''])('devuelve null sin hostUri (%p)', (hostUri) => {
    expect(direccionDelPuente(hostUri)).toBeNull();
  });
});
