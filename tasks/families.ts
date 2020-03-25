import fetch from 'node-fetch';
import { LocalizableText } from '../src';
import { translate } from './lib/translations';
import ora from 'ora';
import { writeJSON } from './lib/io';

export default async function downloadFamilyMap() {
  const pokemonFamilyMapSpinner = ora('PokemonFamilyMap').start();
  const familyMap: Record<string, LocalizableText> = await (
    await fetch('https://malie.io/static/metamon/PokemonFamilyMap.json')
  ).json();

  const families: any = {};
  for (const family in familyMap) {
    families[family] = translate(familyMap[family]);
  }

  await writeJSON('data/families.json', families);
  pokemonFamilyMapSpinner.succeed();
}
