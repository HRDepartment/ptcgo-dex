import fetch from 'node-fetch';
import {
  Format,
  ExpansionFlags,
  ExpansionSeries,
  SeriesExpansions,
  PTCGOSeries,
  ExpansionDefinition,
} from '../src';
import { translate, stripHtml } from './lib/translations';
import ora from 'ora';
import { writeJSON } from './lib/io';

const formats: any = {
  '6b33d420-73cc-40d4-ada5-88a7d68063a9': Format.Legacy,
  '98c83df9-ec82-4193-84a8-104115ce4e25': Format.Expanded,
  '6402e830-7fed-4cd1-b172-2a320047c2bb': Format.Standard,
};

// Energy Holes due to reused assets
const holes = {
  'TK-Lycanroc': [2, 3, 6, 7, 8, 9, 10, 17, 20, 24, 26, 28],
  'TK-AlolanRaichu': [1, 3, 5, 7, 8, 9, 10, 12, 24, 27, 28],
};

interface SetData {
  name: string;
  number: number;
  count: number;
  filter: boolean;
  block: string;
  legalFormats: string[];
  standardLegal: boolean;
  promo: boolean;
  postReleaseRestricted: number;
  featuredArchetypes: string[];
  externalId: string;
  rewardFormats: string[];
  secretCount: number;
  parallelCount: number;
  versusLegality: number;
  visibleUnfilterable: false;
}

const anniversaryExps = ['GEN', 'HIF'];
export default async function downloadExpansions() {
  const expDataMapSpinner = ora('SetDataMap').start();
  const expData: { [name: string]: SetData } = await (
    await fetch('https://malie.io/static/metamon/SetDataMap.json')
  ).json();
  expDataMapSpinner.succeed();

  // Internal code -> external id
  const expMap: any = {};
  const ptcgoExpansions = [];
  for (const key in expData) {
    const exp = expData[key];
    if (exp.block === 'NONE') {
      console.info(`Skipping expansion ${key}`);
      continue;
    }

    const block = (exp.block === 'RSP'
      ? 'XY'
      : exp.block) as keyof typeof ExpansionSeries;
    const seriesId = ExpansionSeries[block] as typeof PTCGOSeries[number];
    if (!seriesId) {
      throw new TypeError(
        `Expansion ${key}: Block ${exp.block} does not exist in ExpansionSeries`
      );
    }

    // Verify expansion is defined in the code
    const expId = SeriesExpansions[seriesId]![exp.externalId as any];
    if (!expId) {
      throw new TypeError(
        `Expansion ${key}: Expansion "${exp.externalId}" does not exist in Expansions_${exp.block}`
      );
    }

    const isEnergyExp = exp.externalId.endsWith('Energy');

    const expName = isEnergyExp
      ? stripHtml(translate(`set.name.${key.replace('_Energy', '1')}`)) + ' Series Energy'
      : stripHtml(translate(`set.name.${key}`));
    if (!expName) {
      throw new Error(`Missing translation for expansion ${key}`);
    }

    const ptcgoExp: ExpansionDefinition & { key: string } = {
      name: expName,
      code: exp.externalId,
      key,
      series: seriesId,
      formats: exp.legalFormats.reduce((previous, guid) => previous | formats[guid], 0),
      cards: exp.count,
      secret: exp.secretCount,
      // Ms -> unix date
      legal: Math.floor(exp.postReleaseRestricted / 1000),
      flags: 0,
    };

    if (ptcgoExp.code in holes) ptcgoExp.holes = (holes as any)[ptcgoExp.code];

    // Red Star Promos
    const isPromoExp = ptcgoExp.code.startsWith('PR-') || ptcgoExp.code === 'RSP';
    if (isPromoExp) {
      ptcgoExp.flags |= ExpansionFlags.PromoExpansion;
    } else if (isEnergyExp) {
      ptcgoExp.flags |= ExpansionFlags.EnergyExpansion;
    } else if (anniversaryExps.includes(ptcgoExp.code)) {
      // Add a flag?
    } else if (ptcgoExp.code.startsWith('TK-')) {
      ptcgoExp.flags |= ExpansionFlags.TrainerKit;
    } else if (exp.promo) {
      // .promo is set on Minor, Trainer Kit, Anniversary, Promo, and Energy expansions
      ptcgoExp.flags |= ExpansionFlags.MinorExpansion;
    }

    ptcgoExpansions.push(ptcgoExp);
    console.info(`Saving expansion ${ptcgoExp.code} (${ptcgoExp.key})`);
    expMap[ptcgoExp.key] = ptcgoExp.code;
  }

  // Newest first
  ptcgoExpansions.reverse();

  const savingDataSpinner = ora('Saving expansion data').start();
  await writeJSON('sources/expansions/expansions.json', ptcgoExpansions);
  await writeJSON('data/ptcgo-set-map.json', expMap);
  savingDataSpinner.succeed();
}
