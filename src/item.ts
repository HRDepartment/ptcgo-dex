import {
  Format,
  ExpansionSeries,
  Expansions_SM,
  ItemType,
  ItemDefinition,
  ProductDefinition,
  CardDefinition,
  PackDefinition,
  ItemCategory,
} from './defs';
import { Expansion } from './expansion';

/*

| 0 (Sign bit) | 000000 (6 bits) | 000000 (6 bits) | 000 (3 bits)  | 000000 (6 bits)  | 000000000000 (10 bits)   |
| ------------ | --------------- | --------------- | ------------- | ---------------- | ------------------------ |
| Unused       | Series          | Expansion       | Reserved      | Item Type        | Item Index               |

*/
// unused: bit 1
const SERIES_SHIFT = 25; // (sizeof itemIdx + sizeof reserved + sizeof itemType + sizeof expansionId) bit 25-31
const EXP_MASK = 0x3f; // 6 bits (2**6 - 1)
const EXP_SHIFT = 19; // (sizeof itemIdx + sizeof reserved + sizeof itemType) bit 20-24
// reserved: bit 17-19 3 bits
const ITEMTYPE_SHIFT = 10; // (sizeof itemIdx) bit 11-16
const ITEMTYPE_MASK = 0x3f; // 6 bits (2**6 - 1)
// itemidx: bit 1-10
const ITEMINDEX_MASK = 0x3ff; // 10 bits (2**10 - 1)

// Either 0 or a number depending on the current Standard rotation.
const STANDARD_FORMAT_PROMO_MINIMUM = 94;

interface ItemFields {
  seriesId: number;
  expansionId: number;
  itemType: number;
  itemIndex: number;
  /** @default false */
  index?: boolean;
  /** Reserved */
  asset?: string;
}

/**
 * PTCGO item base
 */
export class Item implements ItemFields {
  readonly seriesId!: number;
  readonly expansionId!: number;
  readonly itemType!: number;
  readonly itemIndex!: number;
  readonly index!: boolean;

  /**
   * @param item An itemid, another `Item`, or a partial `Item`'s public fields.
   */
  constructor(item: number | Item | Partial<ItemFields>) {
    if ((typeof item !== 'number' && typeof item !== 'object') || item === null) {
      item = 0;
    }

    if (typeof item === 'number') {
      if (Number.isNaN(item)) {
        item = 0;
      }

      if (item < 0) {
        this.index = true;
        item = Math.abs(item);
      } else {
        this.index = false;
      }

      this.seriesId = item >> SERIES_SHIFT;
      this.expansionId = (item >> EXP_SHIFT) & EXP_MASK;
      this.itemType = (item >> ITEMTYPE_SHIFT) & ITEMTYPE_MASK;
      this.itemIndex = item & ITEMINDEX_MASK;
    } else if (typeof item === 'object') {
      for (const attr of ['seriesId', 'expansionId', 'itemType', 'itemIndex']) {
        const value = Math.max((item as any)[attr] || 0, 0) || 0;
        (this as any)[attr] = value;
      }

      this.index = Boolean(item.index);
    }
  }

  /** Prefer PTCGOItem's isValid whenever possible. This is not complete by any means. */
  isValid() {
    return !this.expansion().isValid();
  }

  itemid() {
    const itemid =
      (this.seriesId << SERIES_SHIFT) |
      (this.expansionId << EXP_SHIFT) |
      (this.itemType << ITEMTYPE_SHIFT) |
      this.itemIndex;
    return this.index ? -itemid : itemid;
  }

  toString() {
    return String(this.itemid());
  }

  valueOf() {
    return this.itemid();
  }

  toJSON() {
    return this.itemid();
  }

  expansion() {
    return new Expansion({ seriesId: this.seriesId, expansionId: this.expansionId });
  }

  formats(): Format {
    if (
      this.seriesId === ExpansionSeries.SM &&
      this.expansionId === Expansions_SM['PR-SM'] &&
      this.itemIndex < STANDARD_FORMAT_PROMO_MINIMUM
    ) {
      return Format.Expanded;
    }

    return this.expansion().formats();
  }

  isCard() {
    return this.itemType >= ItemType.CARD_MIN && this.itemType <= ItemType.CARD_MAX;
  }

  isLeague() {
    return (
      this.itemType >= ItemType.CARD_LEAGUE_MIN &&
      this.itemType <= ItemType.CARD_LEAGUE_MAX
    );
  }

  isAlt() {
    return (
      this.itemType >= ItemType.CARD_ALT_MIN && this.itemType <= ItemType.CARD_ALT_MAX
    );
  }

  isYellowA() {
    return (
      this.itemType >= ItemType.CARD_YELLOWA_MIN &&
      this.itemType <= ItemType.CARD_YELLOWA_MAX
    );
  }

  hasLanguage() {
    return (
      this.itemType >= ItemType.CARD_LANGUAGE_MIN &&
      this.itemType <= ItemType.CARD_LANGUAGE_MAX
    );
  }
}

/**
 * This is the item class you should be using most of the time.
 */
export class PTCGOItem<
  DefinitionType extends ItemDefinition = ItemDefinition
> extends Item {
  constructor(
    item: number | Item | Partial<ItemFields>,
    public readonly definition?: DefinitionType
  ) {
    super(item);
    if (!this.index) {
      if (typeof definition !== 'object' || !definition) {
        throw new TypeError(`PTCGOItem definition is not an object`);
      }

      if (typeof definition.id !== 'number') {
        throw new TypeError(`Invalid PTCGO item definition passed`);
      }
    }
  }

  isCard(): this is PTCGOItem<CardDefinition> {
    if (!this.definition) return false;
    return Boolean(((this.definition as unknown) as CardDefinition)?.kind);
  }

  isPack(): this is PTCGOItem<PackDefinition> {
    if (!this.definition) return false;
    const { cat } = (this.definition as unknown) as PackDefinition;
    return cat === ItemCategory.Booster || cat === ItemCategory.PrereleasePack;
  }

  isGameplay(): this is PTCGOItem<ProductDefinition> {
    return Boolean(((this.definition as unknown) as ProductDefinition)?.asset);
  }

  // TODO
  isValid() {
    return (
      super.isValid() &&
      (this.index || (Boolean(this.definition) && this.definition!.id === this.itemid()))
    );
  }

  /** Generates the text for the Import/Export line functionality available in-game */
  export(): string {
    if (!this.isCard()) return '';
    const def = (this.definition as unknown) as CardDefinition;
    if (!def) return '';
    return `${def.name} ${this.expansion().code()} ${def.colNo ?? def.no}`;
  }
}
