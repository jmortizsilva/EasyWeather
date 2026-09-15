import {
  alConfirmarNativo,
  alPedirDesdeJs,
  ESTADO_INICIAL,
  EstadoPestanas,
  PESTANAS,
} from '../pestanas';

// El estado de las pestañas ya no lo lleva react-navigation, lo llevamos nosotros. Lo que se prueba
// aqui es el desempate entre lo que pide la app y lo que confirma iOS, que es donde puede acabar
// mandando a alguien a la pestaña de la que acaba de salir.

describe('PESTANAS', () => {
  it('las claves son unicas: son lo que identifica cada pantalla en nativo', () => {
    const claves = PESTANAS.map((p) => p.clave);
    expect(new Set(claves).size).toBe(claves.length);
  });

  it('la app arranca en Hoy', () => {
    expect(ESTADO_INICIAL.clave).toBe('hoy');
    expect(PESTANAS[0].clave).toBe('hoy');
  });
});

describe('alConfirmarNativo', () => {
  const estado: EstadoPestanas = { clave: 'hoy', confirmado: 3 };

  it('acepta la pestaña nueva y se queda con su numero', () => {
    expect(alConfirmarNativo(estado, { selectedScreenKey: 'avisos', provenance: 4 })).toEqual({
      clave: 'avisos',
      confirmado: 4,
    });
  });

  it('acepta tambien con el mismo numero, que es reconfirmar lo que ya hay', () => {
    expect(alConfirmarNativo(estado, { selectedScreenKey: 'lugares', provenance: 3 })).toEqual({
      clave: 'lugares',
      confirmado: 3,
    });
  });

  // Los eventos cruzan de un hilo a otro y pueden llegar desordenados. Aplicar uno viejo devolveria
  // al usuario a la pestaña de la que acaba de salir, que es de las cosas que mas desorientan con
  // lector de pantalla.
  it('descarta lo que llega atrasado', () => {
    const tarde = { selectedScreenKey: 'lugares' as const, provenance: 2 };
    expect(alConfirmarNativo(estado, tarde)).toBe(estado);
  });

  // Mejor quedarse quieto que saltar a ninguna parte: el numero si se anota, para no quedarse
  // sordo a los eventos siguientes.
  it('con una clave desconocida no mueve la pestaña, pero se pone al dia', () => {
    expect(alConfirmarNativo(estado, { selectedScreenKey: 'inventada', provenance: 9 })).toEqual({
      clave: 'hoy',
      confirmado: 9,
    });
  });
});

describe('alPedirDesdeJs', () => {
  const estado: EstadoPestanas = { clave: 'lugares', confirmado: 7 };

  // Inventar un numero mayor es justo lo que rompe el desempate: se pide el cambio SOBRE el ultimo
  // estado que nativo reconocio.
  it('cambia de pestaña sin tocar el numero confirmado', () => {
    expect(alPedirDesdeJs(estado, 'hoy')).toEqual({ clave: 'hoy', confirmado: 7 });
  });

  it('pedir la pestaña en la que ya estas no crea un estado nuevo', () => {
    expect(alPedirDesdeJs(estado, 'lugares')).toBe(estado);
  });
});
