import {
  Item,
  ExpansionSeries,
  ItemType,
  ItemTypeSuffix,
  ItemCategory,
  CardKind,
  Rarity,
  ItemIndex_BoosterPack,
  PokemonType,
  PokemonTypeLetter,
  AbilityTypeReadable,
  Expansion,
} from '../src';
// @ts-ignore
import minimist from 'minimist';

// Usage: gulp decode --itemid 342911160
export default async function decodeItemid() {
  const argv = minimist(process.argv.slice(2));
  const item = new Item(Number(argv.itemid));
  const itemid = item.itemid();
  const exp = item.expansion();

  if (!exp.isValid()) {
    return console.error(`Invalid itemid ${itemid}`);
  }

  console.info(`# itemid ${itemid}`);
  console.info(`* Series: ${ExpansionSeries[exp.seriesId]} (seriesId: ${item.seriesId})`);
  console.info(`* Expansion: ${exp.code()} (expansionId: ${item.expansionId})`);
  const itemTypeSuffix = ItemTypeSuffix[item.itemType];
  console.info(
    `* ItemType: ${ItemType[item.itemType]} ${
      itemTypeSuffix ? `(suffix: ${itemTypeSuffix}) ` : ''
    }(itemType: ${item.itemType})`
  );
  const itemIdx = item.itemIndex;
  if (item.itemType === ItemType.BoosterPack) {
    const idxEnum = ItemIndex_BoosterPack;
    console.info(`* ItemIndex: ${idxEnum[itemIdx]} (itemIndex: ${itemIdx})`);
  } else {
    console.info(`* itemIndex: ${itemIdx}`);
  }

  let def: any;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const expData = require(`../data/expansion/${exp.code()}.json`);
    def = expData.items[itemid] || expData.packs[itemid];
  } catch (error) {
    console.warn(`Could not resolve definition`, { error });
    return;
  }

  printDefinition(def, exp);
}

function printDefinition(def: any, exp: Expansion) {
  console.log('');
  console.info(`# Definition`);
  if (def.name) {
    console.info(
      `* Name: ${exp.code()} ${def.name} #${def.colNo || def.no}${
        def.hp ? ` (${def.hp} HP)` : ``
      }`
    );
    if (def.family) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const familyMap = require('../data/families.json');
      console.info(`* Family: ${familyMap[def.family]}`);
    }
  }

  console.info(`* Category: ${ItemCategory[def.cat]} (cat: ${def.cat})`);
  if (def.kind) {
    console.info(`* Kind: ${CardKind[def.kind]} (kind: ${def.kind})`);
  }

  if (def.rarity) {
    console.info(`* Rarity: ${Rarity[def.rarity]} (rarity: ${def.rarity})`);
  }

  if (def.abilities) {
    console.log('');
    console.info('# Abilities');
    for (const abil of def.abilities) {
      console.info(`* ${abil.name} [${AbilityTypeReadable[abil.type]}]`);
      console.info(`> ${abil.text}`);
    }
  }

  if (def.attacks) {
    console.log('');
    console.info(`# Attacks`);
    for (const atk of def.attacks) {
      console.info(
        `* ${atk.cost.map((type: number) => `{${PokemonTypeLetter[type]}}`).join('')}${
          atk.cost.length > 0 ? ' ' : ''
        }${atk.name}${atk.damage ? `: ${atk.damage}${atk.op || ''}` : ''}`
      );
      if (atk.text) {
        console.info(`> ${atk.text}`);
      }
    }
  }

  console.log('');
  console.info('# Traits');
  if (def.weakness) {
    console.info(
      `* Weakness: ${PokemonType[def.weakness]} (${
        def.weaknessAmt ? `+${def.weaknessAmt}` : '2x'
      })`
    );
  }

  if (def.resistance) {
    console.info(`* Resistance: ${PokemonType[def.resistance]} (-${def.resist})`);
  }

  if (def.retreat) {
    console.info(`* Retreat Cost: ${def.retreat}`);
  }
}
