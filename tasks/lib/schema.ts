import {
  ArchetypeAttribute,
  ItemCategory,
  ItemDefinition,
  ProductDefinition,
  Rarity,
  Item,
  CardDefinitionFlags,
  ExpansionFlags,
  CardKind,
} from '../../src';
import {
  generateItemDefinition,
  isUntradableItem,
  isInternalItem,
  isUnsupportedItem,
} from './itemdef';
import { fatal, sortObjectForSerialize, inconsistency } from './util';

export const DuplicateDefinition = Symbol('DuplicateDefinition');

export class SchemaSet {
  static UnknownAttributes: any = {};
  items = {} as any;
  static checkUnknownAttributes(attributes: any) {
    // Check for unknown attributes
    for (const key in attributes) {
      if (!(key in ArchetypeAttribute) && !SchemaSet.UnknownAttributes[key]) {
        SchemaSet.UnknownAttributes[key] = true;
      }
    }
  }

  define(schema: Schema) {
    let added = 0;
    for (const id in schema.cards) {
      this.defineItem(schema.cards[id]);
      added += 1;
    }

    for (const id in schema.packs) {
      this.defineItem(schema.packs[id]);
      added += 1;
    }

    for (const id in schema.products) {
      this.defineItem(schema.products[id]);
      added += 1;
    }

    if (added === 0) {
      throw fatal(`Expansion ${schema.expansion} has no items defined`);
    }
  }

  defineItem(item: ItemDefinition) {
    const key = (item as ProductDefinition).asset ?? item.id;
    if (key in this.items) {
      throw fatal(`Redefining item`, { new: item, old: this.items[key] });
    }

    this.items[key] = item;
  }

  toJSON() {
    return sortObjectForSerialize(this.items, this.sort);
  }

  private sort(valueA: any, valueB: any) {
    // Sort items before products

    // valueB first
    if (valueA.asset && !valueB.asset) return 1;
    // ValueA first
    if (!valueA.asset && valueB.asset) return -1;

    // Sort products lexographically
    if (valueA.asset && valueB.asset) return valueA.asset.localeCompare(valueB.asset);
    // Sort ids descending
    return valueB.id - valueA.id;
  }
}

const RARITY_SECRET = [Rarity.SecretRare, Rarity.RainbowRare];
export class Schema {
  cards = {} as any;
  packs = {} as any;
  products = {} as any;
  constructor(public expansion: string, private readonly guidMap: GUIDMap) {}
  define(items: any[]) {
    for (const attributes of items) {
      this.defineItem(attributes);
      SchemaSet.checkUnknownAttributes(attributes);
    }
  }

  expCards() {
    let max = 0;
    for (const itemid in this.cards) {
      const card = this.cards[itemid];
      const item = new Item(Number(itemid));
      if (item.isYellowA()) continue;
      // Radiant Collection cards are essentially secret
      if (card.colNo?.startsWith('RC')) continue;
      if (!RARITY_SECRET.includes(card.rarity) && card.no > max) {
        max = card.no;
      }
    }

    return max;
  }

  expSecret() {
    const secret = new Set();
    for (const itemid in this.cards) {
      const card = this.cards[itemid];
      const item = new Item(Number(itemid));
      if (item.isYellowA()) continue;
      if (card.flags & CardDefinitionFlags.Shining) continue;
      // Radiant Collection cards should be classified as secret too
      if (RARITY_SECRET.includes(card.rarity) || card.colNo?.startsWith('RC')) {
        // Alternate arts etc.
        secret.add(card.no);
      }
    }

    return secret.size;
  }

  expMaxCollectionNo() {
    let max = 0;
    for (const itemid in this.cards) {
      const card = this.cards[itemid];
      if (card.no > max) {
        max = card.no;
      }
    }

    return max;
  }

  expFlags() {
    let flags = 0;

    for (const itemid in this.cards) {
      const card = this.cards[itemid];
      if (card.rarity === Rarity.Rare) {
        flags |= ExpansionFlags.Index_Rare;
      } else if (card.kind === CardKind.BasicEnergy) {
        flags |= ExpansionFlags.Index_Energy;
      } else {
        const isPokemon = card.cat === ItemCategory.Pokemon;
        const isTrainer = card.cat === ItemCategory.Trainer;
        if (card.rarity === Rarity.Common) {
          if (isPokemon) flags |= ExpansionFlags.Index_CommonPokemon;
          else if (isTrainer) flags |= ExpansionFlags.Index_CommonTrainer;
        } else if (card.rarity === Rarity.Uncommon) {
          if (isPokemon) flags |= ExpansionFlags.Index_UncommonPokemon;
          else if (isTrainer) flags |= ExpansionFlags.Index_UncommonTrainer;
        }
      }
    }

    return flags;
  }

  defineItem(attributes: any) {
    if (
      isInternalItem(attributes) ||
      isUntradableItem(attributes) ||
      isUnsupportedItem(attributes)
    ) {
      return;
    }

    const guid = attributes[ArchetypeAttribute.GUID];
    const definition = generateItemDefinition(attributes);

    let map: any;
    let key: any;
    if (
      definition.cat === ItemCategory.Booster ||
      definition.cat === ItemCategory.PrereleasePack
    ) {
      map = this.packs;
      key = definition.id;
    } else if (definition.asset) {
      map = this.products;
      key = definition.asset;
    } else if (definition.id) {
      map = this.cards;
      key = definition.id;
    } else {
      throw fatal(`Unknown definition`, { attributes, definition });
    }

    if (key === undefined) {
      throw fatal(`Undefined key`, { attributes, definition });
    }

    if (DuplicateDefinition in definition) {
      inconsistency(
        `Encountered true duplicate item ${key} (GUID: ${guid}) [this message should appear twice for this itemid]`
      );
    } else if (key in map) {
      const oldJson = JSON.stringify(map[key]);
      const newJson = JSON.stringify(definition);
      if (oldJson === newJson) {
        throw fatal(
          `Overriding ${key} (with new GUID: ${guid}) but the generated definition is equivalent`,
          { definition, attributes }
        );
      } else {
        throw fatal(
          `Overriding ${key} (New GUID: ${guid})\n${oldJson}\n===>\n${newJson}`,
          { attributes }
        );
      }
    }

    map[key] = definition;

    this.guidMap.define(guid, definition);
  }

  toJSON() {
    return {
      expansion: this.expansion,
      items: sortObjectForSerialize(this.cards, this.sortItemid),
      packs: sortObjectForSerialize(this.packs, this.sortItemid),
      // Sort products ascending (its key is its .asset)
      products: sortObjectForSerialize(this.products),
    };
  }

  private sortItemid(a: any, b: any) {
    // Sort items ascending
    const sortOrder = (a.no || 0) - (b.no || 0);
    if (sortOrder === 0) return a.id - b.id;
    return sortOrder;
  }
}

export class GUIDMap {
  items = {} as any;
  define(guid: string, definition: any) {
    const id = definition.asset || definition.id;
    if (guid in this.items) {
      console.warn(`Redefining GUID`, { guid, definition });
    }

    this.items[guid] = id;
  }

  itemlist() {
    return Object.values<number>(this.items)
      .filter(item => typeof item === 'number')
      .sort((a, b) => b - a);
  }

  productlist() {
    return Object.values(this.items)
      .filter(item => typeof item === 'string')
      .sort(undefined);
  }

  toJSON() {
    return sortObjectForSerialize(this.items, this.sort);
  }

  sort(valueA: any, valueB: any) {
    // Sort items before products

    // valueB first
    if (valueA.asset && !valueB.asset) return 1;
    // ValueA first
    if (!valueA.asset && valueB.asset) return -1;

    // Sort products lexographically
    if (valueA.asset && valueB.asset) return valueA.asset.localeCompare(valueB.asset);
    // Sort ids descending
    return valueB.id - valueA.id;
  }
}
