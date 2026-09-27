import { Place } from '../../types';
import { buscarMunicipios, mezclarMunicipios, normalizar } from '../municipios';
import { distanciaKm, ordenarPorCercania } from '../ordenarResultados';
import { describirResultados } from '../resultadosBusqueda';
import reales from './respuestas-reales.json';

const DESDE_BADIA = { lat: 41.5076, lon: 2.1154, countryCode: 'ES', country: 'España' };

it('imprime la lista final', () => {
  const lineas: string[] = [];
  for (const [consulta, deLaRed] of Object.entries(reales as Record<string, Place[]>)) {
    const mezcla = mezclarMunicipios(consulta, deLaRed);
    const filas = describirResultados(ordenarPorCercania(mezcla, DESDE_BADIA));
    lineas.push(`\n### "${consulta}" (Open-Meteo devolvio ${deLaRed.length}, se enseñan ${filas.length})`);
    for (const { place, detalle } of filas) lineas.push(`   ${place.name} — ${detalle}  [${place.id}]`);
  }
  lineas.push('\n--- Errenteria al detalle ---');
  const nuestro = buscarMunicipios('errenteria')[0];
  const suyo = (reales as Record<string, Place[]>)['Errenteria'];
  lineas.push(`   nuestro: ${nuestro.nombre} ${nuestro.lat},${nuestro.lon} objetivos=${JSON.stringify(nuestro.objetivos)}`);
  for (const s of suyo) {
    lineas.push(`   de Open-Meteo: "${s.name}" (${normalizar(s.name)}) ${s.lat},${s.lon} -> ${distanciaKm(nuestro, s).toFixed(1)} km`);
  }
  console.log(lineas.join('\n'));
  expect(true).toBe(true);
});
