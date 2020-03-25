let database: any;
/** Automatically removes $$$ and lowercases your translation string */
export function translate(key: string, fallback?: string) {
  if (!database) {
    database = require('../../sources/strings/database.json');
  }

  if (key === '$$$$$$') {
    return '';
  }

  let realKey = key.replace(/\${3}/g, '');
  if (KEYDOCTOR[realKey]) {
    realKey = KEYDOCTOR[realKey];
  }

  realKey = realKey.toLowerCase();
  let tr = database[realKey] || fallback;

  if (!tr && fallback !== '') {
    console.warn(`Could not resolve translation ${JSON.stringify(key)}`);
  }

  if (typeof tr === 'string') {
    // Replace "\" + "n" (two literal characters) with '\n' (single character)
    tr = tr.replace(/\\n/g, '\n');
  }

  return tr;
}

/** Direwolf doesn't have an automated testing setup for broken translation strings, so we will have to hardcode the fixes instead */
const KEYDOCTOR: any = {
  'com.direwolfdigital.cake.rules.abilities.trainers.SM12.ProfessorOaksSetu.GameText':
    'com.direwolfdigital.cake.rules.abilities.trainers.SM12.ProfessorOaksSetup.GameText',
  'com.direwolfdigital.cake.rules.abilities.trainers.SM12.DragoniumZDragonClaw..GameText':
    'com.direwolfdigital.cake.rules.abilities.trainers.SM12.DragoniumZDragonClaw.GameText',
  'com.direwolfdigital.cake.rules.abilities.trainers.SWSH1.ProfessorsResearch.GameText':
    'com.direwolfdigital.cake.rules.abilities.trainers.SWSH1.ProfessorsResearchProfessorMagnolia.GameText',
  'com.direwolfdigital.cake.rules.abilities.pokeabilities.FieldRunner.Title':
    'com.direwolfdigital.cake.rules.abilities.pokeabilities.promo_swsh.abilityfieldrunner.title',
  // There is no translation string defined for 'Levitate' used by Weezing XY163
  // $$$com.direwolfdigital.cake.rules.abilities.pokeabilities.Promo_XY.AbilityLevitate.Title$$$
};

/** Note: not secure */
export function stripHtml(html = '') {
  return html.replace(/<[^>]*>?/gm, '');
}
