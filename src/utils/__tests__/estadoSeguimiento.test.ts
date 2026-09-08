import { EstadoSeguimiento, textoSeguimiento } from '../estadoSeguimiento';

const TODO_BIEN: EstadoSeguimiento = {
  hayModulo: true,
  permisoSiempre: true,
  activo: true,
  algunAvisoActivo: true,
};

describe('textoSeguimiento', () => {
  it('se calla si no hay ningun aviso activo', () => {
    expect(textoSeguimiento({ ...TODO_BIEN, algunAvisoActivo: false })).toBeUndefined();
    // Aunque falte todo lo demas: sin avisos, la ubicacion no se usa para nada.
    expect(
      textoSeguimiento({
        hayModulo: false,
        permisoSiempre: false,
        activo: false,
        algunAvisoActivo: false,
      }),
    ).toBeUndefined();
  });

  it('confirma el seguimiento cuando todo esta en su sitio', () => {
    expect(textoSeguimiento(TODO_BIEN)).toContain('Siguiendo tu ubicación');
  });

  // El permiso manda sobre lo demas: es lo unico que el usuario puede arreglar por su cuenta, asi
  // que se dice eso y no "no esta activo", que no le diria que hacer.
  it('si falta el permiso Siempre, lo dice y explica donde se concede', () => {
    const texto = textoSeguimiento({ ...TODO_BIEN, permisoSiempre: false, activo: false });
    expect(texto).toContain('«Siempre»');
    expect(texto).toContain('Ajustes');
  });

  it('el permiso se avisa antes que la falta de modulo', () => {
    const texto = textoSeguimiento({ ...TODO_BIEN, permisoSiempre: false, hayModulo: false });
    expect(texto).toContain('«Siempre»');
  });

  it('sin el modulo compilado, avisa de que la ubicacion sera la del ultimo arranque', () => {
    expect(textoSeguimiento({ ...TODO_BIEN, hayModulo: false })).toContain('última vez que abras');
  });

  it('con el modulo pero sin arrancar, dice lo mismo: lo que importa es el efecto', () => {
    expect(textoSeguimiento({ ...TODO_BIEN, activo: false })).toContain('última vez que abras');
  });
});
