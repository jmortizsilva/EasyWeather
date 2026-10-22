const { withXcodeProject } = require('expo/config-plugins');

// Pone el español como región de desarrollo del proyecto de Xcode.
//
// POR QUÉ. La app declara el español en su Info.plist (app.json), pero el proyecto que genera Expo
// dice `developmentRegion = en`, y el widget (targets/widget) tiene GENERATE_INFOPLIST_FILE, así
// que Xcode le escribía CFBundleDevelopmentRegion = en por encima de su propio Info.plist. Un
// probador lo notó el 2026-10-22: VoiceOver leía el widget con voz inglesa.

function conRegionEspanol(proyecto) {
  const raiz = proyecto.getFirstProject().firstProject;
  raiz.developmentRegion = 'es';
  const conocidas = raiz.knownRegions ?? [];
  if (!conocidas.includes('es')) conocidas.unshift('es');
  raiz.knownRegions = conocidas;
  return proyecto;
}

module.exports = (config) =>
  withXcodeProject(config, (c) => {
    c.modResults = conRegionEspanol(c.modResults);
    return c;
  });
module.exports.conRegionEspanol = conRegionEspanol;
