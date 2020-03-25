// @ts-ignore
import _allExps from '../data/expansions.json';
import {
  ExpansionFlags,
  ItemType,
  Format,
  ExpansionSeries,
  Expansions_XY,
  ItemIndex_BoosterPack,
  SeriesExpansions,
  PTCGOFormats,
  ExpansionDefinition,
} from './defs';
import { Item } from './item';
import { Series } from './series';

const allExps = (_allExps as any) as ExpansionDefinition[];

const expsByCode: { [id: string]: ExpansionDefinition } = {};
for (const exp of allExps) {
  expsByCode[exp.code.toUpperCase()] = exp;
}

type ExpansionFields =
  | {
      seriesId: number;
      expansionId: number;
    }
  | { code: string };

export class Expansion {
  static definitions = allExps;
  public seriesId: number;
  public expansionId: number;
  public readonly definition: ExpansionDefinition;

  /**
   * Not guaranteed to be valid. Check #isValid() afterwards if this is important.
   */
  constructor(fields: ExpansionFields) {
    let expCode: string;

    if ('code' in fields) {
      expCode = fields.code;
    } else {
      expCode = (SeriesExpansions as any)[fields.seriesId]?.[fields.expansionId];
    }

    const definition = expsByCode[expCode.toUpperCase()];
    const seriesId = 'seriesId' in fields ? fields.seriesId : definition?.series || 0;
    const expId =
      'expansionId' in fields
        ? fields.expansionId
        : ((SeriesExpansions as any)[seriesId][expCode] as number) || 0;

    this.seriesId = seriesId;
    this.expansionId = expId;
    this.definition = definition;
  }

  static all() {
    return Expansion.definitions.map(def => new Expansion(def));
  }

  isValid() {
    return Boolean(this.definition) && this.expansionId !== 0;
  }

  code() {
    return this.definition?.code || '';
  }

  valueOf() {
    return this.code();
  }

  toString() {
    return this.code();
  }

  toJSON() {
    return this.code();
  }

  isPromo() {
    return this.hasFlag(ExpansionFlags.PromoExpansion);
  }

  isTrainerKit() {
    return this.hasFlag(ExpansionFlags.TrainerKit);
  }

  hasBoosters() {
    return (
      !this.isPromo() &&
      !(this.seriesId === ExpansionSeries.XY && this.expansionId === Expansions_XY.KSS) &&
      !this.isTrainerKit()
    );
  }

  /** Use Item#formats for a more precise listing */
  formats(): Format {
    return this.definition.formats;
  }

  hasFlag(flag: ExpansionFlags) {
    return (this.definition.flags & flag) !== 0;
  }

  item(itemIndex: number, itemType: ItemType = ItemType.Card, index = false) {
    return new Item({
      seriesId: this.seriesId,
      expansionId: this.expansionId,
      itemType,
      itemIndex,
      index,
    });
  }

  /** Normal booster pack for this expansion */
  booster() {
    return this.item(
      this.hasFlag(ExpansionFlags.MinorExpansion)
        ? ItemIndex_BoosterPack.MinorPack
        : ItemIndex_BoosterPack.MajorPack,
      ItemType.BoosterPack
    );
  }

  series() {
    return new Series(this.seriesId);
  }
}

export function getExpansionsByFormat() {
  const expsByFormat: Record<Format, Expansion[]> = {
    [Format.Standard]: [],
    [Format.Expanded]: [],
    [Format.Legacy]: [],
  };
  for (const def of Expansion.definitions) {
    for (const format of PTCGOFormats) {
      if (def.formats & format) {
        expsByFormat[def.formats].push(new Expansion(def));
      }
    }
  }

  return expsByFormat;
}
