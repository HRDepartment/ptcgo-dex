import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { sortObjectForSerialize } from './lib/util';
import ora from 'ora';
import { writeJSON } from './lib/io';

export default async function downloadTranslationStrings() {
  await fs.mkdir('./sources/strings', { recursive: true });

  let localManifest: any = {};
  try {
    localManifest = require('../sources/strings/strings.manifest.json');
  } catch (_) {}

  const fullManifest = await (
    await fetch('https://malie.io/static/metamon/unown.json')
  ).json();
  const liveManifest = fullManifest.en_US;

  if (localManifest.version === liveManifest.version) {
    console.info(`Local version matches live version: ${localManifest.version}`);
    return;
  }

  if (localManifest.version) {
    console.info(
      `New live manifest version available!\nPrevious: ${localManifest.version}\nLive: ${liveManifest.version}`
    );
  } else {
    console.info('Downloading live manifest from scratch');
  }

  localManifest.releases = localManifest.releases || {};
  localManifest.version = liveManifest.version;

  const updatedReleases: any[] = [];

  for (const newRelease in liveManifest.releases) {
    const release = liveManifest.releases[newRelease];
    const localRelease = localManifest.releases[release];
    let isNew = false;
    if (!localRelease) {
      isNew = true;
    } else if (localRelease.checksum === release.checksum) {
      continue;
    } else {
      console.info(
        `Release ${newRelease} changed: checksum ${localRelease.checksum} ==> ${release.checksum}`
      );
    }

    localManifest.releases[newRelease] = release.checksum;
    updatedReleases.push({ key: newRelease, database: release.database, isNew });
  }

  if (localManifest.releases) {
    for (const oldRelease in localManifest.releases) {
      if (!(oldRelease in liveManifest.releases)) {
        console.warn(`Release removed: ${oldRelease}`);
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete localManifest.releases[oldRelease];
      }
    }
  }

  let currentIndex = 0;
  const releaseSpinner = ora(`Downloading releases`).start();
  for (const { key, database, isNew } of updatedReleases) {
    releaseSpinner.text = `[${currentIndex + 1}/${
      updatedReleases.length
    }] Release ${key} ${isNew ? `(NEW!)` : '(Updated)'}`;
    const data = await (
      await fetch(`https://malie.io/static/metamon/${database}`)
    ).json();
    const strings = sortObjectForSerialize(data.database);
    await writeJSON(`sources/strings/${key}.json`, strings);
    currentIndex += 1;
  }

  releaseSpinner.succeed('Downloaded releases');

  const dbSpinner = ora('Compiling database').start();
  let allStrings: any = {};
  for (const release in localManifest.releases) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const releaseStrings = require(`../sources/strings/${release}.json`);

    for (const key in releaseStrings) {
      if (key in allStrings) {
        console.warn(
          `Release ${release} overrides string ${key}\n${allStrings[key]}\n=>\n${releaseStrings[key]}`
        );
      }

      allStrings[key] = releaseStrings[key];
    }
  }

  allStrings = sortObjectForSerialize(allStrings);
  dbSpinner.text = 'Saving database';
  await writeJSON('sources/strings/database.json', allStrings);

  dbSpinner.text = 'Saving updated manifest';
  await writeJSON('sources/strings/strings.manifest.json', localManifest);
  dbSpinner.succeed('Updated manifest');
}
