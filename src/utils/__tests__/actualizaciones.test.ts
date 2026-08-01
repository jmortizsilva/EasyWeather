import { decidirAvisoNovedades } from '../actualizaciones-logica';

describe('decidirAvisoNovedades', () => {
  it('primera vez (nada guardado): memoriza sin avisar', () => {
    expect(decidirAvisoNovedades(null, 'abc')).toEqual({ avisar: false, idParaGuardar: 'abc' });
    expect(decidirAvisoNovedades(null, 'incrustado')).toEqual({
      avisar: false,
      idParaGuardar: 'incrustado',
    });
  });

  it('id cambia a uno real: avisa y memoriza el nuevo', () => {
    expect(decidirAvisoNovedades('abc', 'def')).toEqual({ avisar: true, idParaGuardar: 'def' });
    expect(decidirAvisoNovedades('incrustado', 'def')).toEqual({
      avisar: true,
      idParaGuardar: 'def',
    });
  });

  it('mismo id: no avisa y mantiene lo guardado', () => {
    expect(decidirAvisoNovedades('abc', 'abc')).toEqual({ avisar: false, idParaGuardar: 'abc' });
  });

  it('vuelta al bundle incrustado: no avisa y no pierde el id guardado', () => {
    expect(decidirAvisoNovedades('abc', 'incrustado')).toEqual({
      avisar: false,
      idParaGuardar: 'abc',
    });
  });
});
