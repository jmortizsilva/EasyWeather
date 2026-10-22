const { conRegionEspanol } = require('../region-espanol');

// Un proyecto mínimo con la forma que lee el plugin (getFirstProject().firstProject).
function proyecto(raiz) {
  return { getFirstProject: () => ({ firstProject: raiz }) };
}

describe('region-espanol', () => {
  it('pone el español como región y lo añade a las conocidas', () => {
    const raiz = { developmentRegion: 'en', knownRegions: ['en', 'Base'] };
    conRegionEspanol(proyecto(raiz));
    expect(raiz.developmentRegion).toBe('es');
    expect(raiz.knownRegions).toEqual(['es', 'en', 'Base']);
  });

  it('no repite el español si ya estaba', () => {
    const raiz = { developmentRegion: 'es', knownRegions: ['es', 'Base'] };
    conRegionEspanol(proyecto(raiz));
    expect(raiz.knownRegions).toEqual(['es', 'Base']);
  });
});
