import { Place } from '../../types';
import { buscarMunicipios, mezclarMunicipios, normalizar, todosLosMunicipios } from '../municipios';
import { distanciaKm } from '../ordenarResultados';
import reales from './respuestas-reales.json';

it('depura', () => {
  const l: string[] = [];
  const zarra = todosLosMunicipios().find((m) => m.ine === '46263');
  l.push(`Zarra: objetivos=${JSON.stringify(zarra?.objetivos)}`);
  const errenteria = todosLosMunicipios().find((m) => m.ine === '20067')!;
  const suyos = (reales as Record<string, Place[]>)['Errenteria'];
  l.push(`\nErrenteria nuestra: ${JSON.stringify(errenteria)}`);
  for (const s of suyos) {
    l.push(`  suya "${s.name}" norm="${normalizar(s.name)}" incluido=${errenteria.objetivos.includes(normalizar(s.name))} km=${distanciaKm(errenteria, s).toFixed(2)}`);
  }
  l.push(`\npropios para "Errenteria": ${JSON.stringify(buscarMunicipios('Errenteria').map((m) => m.ine))}`);
  l.push(`mezcla: ${JSON.stringify(mezclarMunicipios('Errenteria', suyos).map((p) => `${p.name}|${p.id}`))}`);
  console.log(l.join('\n'));
  expect(true).toBe(true);
});
