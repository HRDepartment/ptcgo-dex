import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import {
  ArchetypeAttribute,
  ExpansionDefinition,
  Item,
  ExpansionSeries,
  Expansions_PTCGO,
  ItemIndex_PTCGO_AvatarCollectionBox,
  ItemIndex_PTCGO_TreasureChest,
} from '../src';
import { Schema, GUIDMap, SchemaSet } from './lib/schema';
import ora from 'ora';
import { writeJSON, writeLog } from './lib/io';
import { fatal, inconsistency, InconsistencyLog } from './lib/util';

export default async function() {
  InconsistencyLog.length = 0;
  await fs.mkdir('./data/sets', { recursive: true });
  await fs.mkdir('./sources/items', { recursive: true });
  await fs.mkdir('./sources/logs', { recursive: true });
  await updateItemManifest();
  await generateItemData();
}

async function updateItemManifest() {
  let localManifest: any = {};
  try {
    localManifest = require('../sources/items/items.manifest.json');
  } catch (_) {}

  const itemManifestVersions = await (
    await fetch('https://malie.io/static/metamon/rotom.v4.json')
  ).json();
  const maxVersion = Object.keys(itemManifestVersions.versions)
    .map(Number)
    .reduce((previous, next) => (previous > next ? previous : next), -1);

  if (localManifest.version === maxVersion) {
    console.info(`Local item manifest version (${maxVersion}) is up-to-date`);
    return;
  }

  if (localManifest.version) {
    console.info(
      `New item manifest version available!\nPrevious: ${localManifest.version}\nLive: ${maxVersion}`
    );
  } else {
    console.info('Downloading item manifest from scratch');
  }

  localManifest.releases = localManifest.releases || {};
  localManifest.version = maxVersion;

  const itemManifestUrl = itemManifestVersions.versions[maxVersion];
  const liveManifest = (
    await (await fetch(`https://malie.io/static/metamon/${itemManifestUrl}`)).json()
  ).decks;

  const updatedReleases: any[] = [];

  for (const newRelease in liveManifest) {
    const release = liveManifest[newRelease];
    const localRelease = localManifest.releases[release];
    let isNew = false;
    if (!localRelease) {
      isNew = true;
    } else if (localRelease.checksum === release.checksum) {
      continue;
    } else {
      console.info(
        `Expansion ${newRelease} changed: checksum ${localRelease.checksum} ==> ${release.checksum}`
      );
    }

    localManifest.releases[newRelease] = release.checksum;
    updatedReleases.push({ key: newRelease, url: release.deck, isNew });
  }

  if (localManifest.releases) {
    for (const oldRelease in localManifest.releases) {
      if (!(oldRelease in liveManifest)) {
        console.warn(`Expansion removed: ${oldRelease}`);
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete localManifest.releases[oldRelease];
      }
    }
  }

  let currentIndex = 0;
  const releaseSpinner = ora('Downloading releases').start();
  for (const { key, url, isNew } of updatedReleases) {
    releaseSpinner.text = `[${currentIndex + 1}/${
      updatedReleases.length
    }] Release ${key} ${isNew ? `(NEW!)` : '(Updated)'}`;
    const data = await (
      await fetch(`https://malie.io/static/metamon/rotom/${url}`)
    ).json();
    const expData = data.data.map(
      // GUID can be discarded, but it's not set for products, so ensure the attribute is set.
      (archetypeWithVersion: any) => {
        const { guid, attributes } = archetypeWithVersion.arch;
        if (!guid) {
          console.error(`Item missing GUID`, archetypeWithVersion);
        }

        if (
          guid &&
          attributes[ArchetypeAttribute.GUID] &&
          guid !== attributes[ArchetypeAttribute.GUID]
        ) {
          console.error(`Item GUID does not match`, archetypeWithVersion);
        }

        return {
          ...attributes,
          [ArchetypeAttribute.GUID]: guid || attributes[ArchetypeAttribute.GUID],
          // Ensure ReleaseCode is always set
          [ArchetypeAttribute.ReleaseCode]: key,
        };
      }
    );
    await writeJSON(`sources/items/${key}.json`, expData);
    currentIndex += 1;
  }

  releaseSpinner.text = 'Saving updated manifest';
  await writeJSON('sources/items/items.manifest.json', localManifest);
  releaseSpinner.succeed(`Updated items`);
}

async function generateItemData() {
  // AllSets is mutated, need to invalidate cache
  const allExps = require('../sources/expansions/expansions.json') as Array<
    ExpansionDefinition & { key: string }
  >;
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete require.cache[require.resolve('../sources/expansions/expansions.json')];
  const itemsManifest = require('../sources/items/items.manifest.json') as {
    releases: Record<string, string>;
  };
  const allItems: any = {};
  for (const release in itemsManifest.releases) {
    allItems[release] = require(`../sources/items/${release}.json`);
  }

  const currencyItems = ['AvatarItems', 'RewardItems'];
  // ['NoSet']
  const ptcgoProductReleases = Object.keys(allItems).filter(
    release =>
      // Ignore AvatarItems and RewardItems, these items are available as itemids
      !currencyItems.includes(release) &&
      !release.endsWith('_Energy') &&
      !allExps.some(s => s.key === release)
  );

  const guidMap = new GUIDMap();

  const schemaSet = new SchemaSet();
  let currentIndex = 0;
  const expSpinner = ora('Generating expansion item schema').start();
  for (const expansion of allExps) {
    const expItems = allItems[expansion.key];
    if (!expItems) {
      console.warn(
        `Expansion ${expansion.code} does not have item data available yet. This is an error if this is not an upcoming expansion.`
      );
      currentIndex += 1;
      continue;
    }

    expSpinner.text = `[${currentIndex + 1}/${allExps.length}] Expansion ${
      expansion.code
    }`;

    const expSchema = new Schema(expansion.code, guidMap);
    expSchema.define(expItems);
    schemaSet.define(expSchema);

    const cardCount = expSchema.expCards();
    const secretCount = expSchema.expSecret();
    const totalCollectionCount = expSchema.expMaxCollectionNo();
    if (expansion.cards !== cardCount) {
      inconsistency(
        `Expansion ${expansion.code}: Collection count ${expansion.cards} => ${cardCount}`
      );
      expansion.cards = cardCount;
    }

    if (expansion.secret !== secretCount) {
      inconsistency(
        `Expansion ${expansion.code}: Secret count ${expansion.secret} => ${secretCount}`
      );
      expansion.secret = secretCount;
    }

    if (expansion.cards + expansion.secret !== totalCollectionCount) {
      throw fatal(
        `Expansion ${expansion.code} total card count is ${expansion.cards} cards + ${
          expansion.secret
        } = ${expansion.cards +
          expansion.secret}, but in the schema the max collection number is ${totalCollectionCount}`
      );
    }

    expansion.flags |= expSchema.expFlags();

    // Remove internal 'key' from data/expansions.json
    delete expansion.key;

    await writeJSON(`data/expansion/${expSchema.expansion}.json`, expSchema.toJSON());
    currentIndex += 1;
  }

  noteUnknownAttributes();
  expSpinner.succeed(
    `Expansions: ${allExps
      .map(s => s.code)
      .reverse()
      .join(', ')}`
  );

  const productSpinner = ora('Generating product item schema').start();
  const ptcgoSchema = new Schema('PTCGO', guidMap);
  for (const productSet of ptcgoProductReleases) {
    productSpinner.text = `Release ${productSet}`;
    ptcgoSchema.define(allItems[productSet]);
  }

  noteUnknownAttributes();
  await writeJSON(`data/expansion/${ptcgoSchema.expansion}.json`, ptcgoSchema.toJSON());
  productSpinner.succeed(`Product releases: ${ptcgoProductReleases.join(', ')}`);

  const allSpinner = ora('Saving item database');
  await writeJSON(`data/items.json`, schemaSet.toJSON());
  allSpinner.succeed();

  const itemMapSpinner = ora('Generating GUID maps').start();
  for (const currencySet of currencyItems) {
    for (const attributes of allItems[currencySet]) {
      const assetClass = attributes[ArchetypeAttribute.AssetClass] as
        | 'AvatarCharizardPack'
        | 'AvatarPikachuPack'
        | 'TreasureBoxPack'
        | 'TreasureBoxPack_Shiny';
      const itemid = new Item({
        seriesId: ExpansionSeries.PTCGO,
        expansionId: {
          AvatarCharizardPack: Expansions_PTCGO.AvatarCollectionBox,
          AvatarPikachuPack: Expansions_PTCGO.AvatarCollectionBox,
          TreasureBoxPack: Expansions_PTCGO.TreasureChest,
          TreasureBoxPack_Shiny: Expansions_PTCGO.TreasureChest,
        }[assetClass],
        itemIndex: {
          AvatarCharizardPack: ItemIndex_PTCGO_AvatarCollectionBox.CharizardBox,
          AvatarPikachuPack: ItemIndex_PTCGO_AvatarCollectionBox.PikachuBox,
          TreasureBoxPack: ItemIndex_PTCGO_TreasureChest.UncommonChest,
          TreasureBoxPack_Shiny: ItemIndex_PTCGO_TreasureChest.HoloChest,
        }[assetClass],
      }).toJSON();
      guidMap.define(attributes[ArchetypeAttribute.GUID], { id: itemid });
    }
  }

  itemMapSpinner.text = 'Generating data/item-map.json';
  await writeJSON('data/item-map.json', guidMap.toJSON());

  itemMapSpinner.text = 'Generating data/itemlist.json';
  await writeJSON('data/itemlist.json', guidMap.itemlist());

  itemMapSpinner.text = 'Generating data/productlist.json';
  await writeJSON('data/productlist.json', guidMap.productlist());

  itemMapSpinner.text = 'Generating data/expansions.json';
  await writeJSON('data/expansions.json', allExps);
  itemMapSpinner.succeed('Generated GUID maps');
  await writeLog('sources/logs/items.inconsistencies.txt', InconsistencyLog);
}

function noteUnknownAttributes() {
  if (Object.keys(SchemaSet.UnknownAttributes).length > 0) {
    throw fatal(
      `Unknown attributes: ${Object.keys(SchemaSet.UnknownAttributes).join(', ')}`
    );
  }
}
