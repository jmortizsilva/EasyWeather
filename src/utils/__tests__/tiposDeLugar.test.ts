import { esLugarBuscable } from '../tiposDeLugar';

// Los codigos son los que devolvio de verdad Open-Meteo al buscar "Bilbao", "Espana" y "Bronchales"
// el 2026-09-01. No estan inventados: el caso que destapo esto (el barrio de Bilbao de Madrid)
// nunca habria salido de una lista escrita de memoria.

describe('esLugarBuscable', () => {
  it('deja pasar las poblaciones, sea cual sea su rango', () => {
    expect(esLugarBuscable('PPL')).toBe(true); // Bilbao, Filipinas
    expect(esLugarBuscable('PPLA2')).toBe(true); // Bilbao, Pais Vasco
    expect(esLugarBuscable('PPLA3')).toBe(true); // Bronchales, un pueblo de 400 habitantes
    expect(esLugarBuscable('PPLC')).toBe(true); // una capital de pais
  });

  it('deja pasar los paises', () => {
    expect(esLugarBuscable('PCLI')).toBe(true); // Espana
    expect(esLugarBuscable('PCLD')).toBe(true); // un territorio dependiente
  });

  // El caso que motiva todo esto.
  it('descarta el barrio, que es una seccion de una poblacion', () => {
    expect(esLugarBuscable('PPLX')).toBe(false); // Bilbao, Madrid
  });

  it('descarta lo que no es ni poblacion ni pais', () => {
    expect(esLugarBuscable('AIRP')).toBe(false); // Aeropuerto de Bilbao
    expect(esLugarBuscable('MT')).toBe(false); // una montana
    expect(esLugarBuscable('STM')).toBe(false); // un rio
  });

  it('no distingue mayusculas ni espacios sobrantes', () => {
    expect(esLugarBuscable(' pplx ')).toBe(false);
    expect(esLugarBuscable('ppla2')).toBe(true);
  });

  // Sin codigo se enseña, que es como funcionaba antes: mejor de mas que un buscador vacio.
  it('sin codigo, se deja pasar', () => {
    expect(esLugarBuscable(undefined)).toBe(true);
    expect(esLugarBuscable('')).toBe(true);
  });
});
