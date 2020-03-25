// Import { Expansion } from './expansion';
import { Item } from './item';
import {
  ExpansionSeries,
  Expansions_PTCGO,
  ItemIndex_PTCGO_TreasureChest,
  ItemIndex_PTCGO_AvatarCollectionBox,
  ExpansionFlags,
  ItemType,
  ItemIndex_PriceIndex_Card,
} from './defs';
import { Expansion } from './expansion';

// Functions useful for interacting with PTCGO's economy.

export function getUncommonChestItem() {
  return new Item({
    seriesId: ExpansionSeries.PTCGO,
    expansionId: Expansions_PTCGO.TreasureChest,
    itemIndex: ItemIndex_PTCGO_TreasureChest.UncommonChest,
  });
}

export function getPikachuBoxItem() {
  return new Item({
    seriesId: ExpansionSeries.PTCGO,
    expansionId: Expansions_PTCGO.AvatarCollectionBox,
    itemIndex: ItemIndex_PTCGO_AvatarCollectionBox.PikachuBox,
  });
}

export function getCurrencyItems() {
  const items: Item[] = [];
  const expansions = Expansion.all();
  for (const xpack of expansions) {
    if (!xpack.hasBoosters()) continue;
    items.push(xpack.booster());
  }

  items.push(getUncommonChestItem());
  items.push(getPikachuBoxItem());
  return items;
}

/** List of price indexes this expansion has. */
export function getExpansionPriceIndexes(expansion: Expansion) {
  const indexes: Item[] = [];

  function addIndex(itemIndex: ItemIndex_PriceIndex_Card) {
    indexes.push(expansion.item(itemIndex, ItemType.Card, true));
    indexes.push(expansion.item(itemIndex, ItemType.ReverseCard, true));
  }

  if (expansion.hasFlag(ExpansionFlags.Index_CommonPokemon))
    addIndex(ItemIndex_PriceIndex_Card.CommonPokemon);
  if (expansion.hasFlag(ExpansionFlags.Index_CommonTrainer))
    addIndex(ItemIndex_PriceIndex_Card.CommonTrainer);
  if (expansion.hasFlag(ExpansionFlags.Index_UncommonPokemon))
    addIndex(ItemIndex_PriceIndex_Card.UncommonPokemon);
  if (expansion.hasFlag(ExpansionFlags.Index_UncommonTrainer))
    addIndex(ItemIndex_PriceIndex_Card.UncommonTrainer);
  if (expansion.hasFlag(ExpansionFlags.Index_Rare)) {
    addIndex(ItemIndex_PriceIndex_Card.Rare);
    indexes.push(expansion.item(ItemIndex_PriceIndex_Card.Rare, ItemType.HoloCard, true));
  }

  if (expansion.hasFlag(ExpansionFlags.Index_Energy))
    addIndex(ItemIndex_PriceIndex_Card.Energy);

  return indexes;
}

export function priceIndexToString(item: Item) {
  if (!item.index) return '';
  const { itemIndex, itemType } = item;

  // Note: it's called the suffix is because in URLs Foil/Holo are represented as a suffix
  const suffix =
    itemType === ItemType.HoloCard
      ? 'Holo '
      : itemType === ItemType.ReverseCard
      ? 'Reverse '
      : '';
  if (
    itemIndex === ItemIndex_PriceIndex_Card.CommonPokemon ||
    itemIndex === ItemIndex_PriceIndex_Card.UncommonPokemon
  ) {
    return `${suffix}${
      ItemIndex_PriceIndex_Card.CommonPokemon ? 'Common' : 'Uncommon'
    } Pokémon`;
  }

  if (
    itemIndex === ItemIndex_PriceIndex_Card.CommonTrainer ||
    itemIndex === ItemIndex_PriceIndex_Card.UncommonTrainer
  ) {
    return `${suffix}${
      ItemIndex_PriceIndex_Card.CommonTrainer ? 'Common' : 'Uncommon'
    } Trainer`;
  }

  if (itemIndex === ItemIndex_PriceIndex_Card.Rare) {
    return `${suffix}Rare`;
  }

  if (itemIndex === ItemIndex_PriceIndex_Card.Energy) {
    return `${suffix}Energy`;
  }

  return '';
}

export function millipacksToDecimal(millipacks: any, includePacks = false) {
  if (typeof millipacks !== 'number' || isNaN(millipacks)) return '—';
  return `~${millipacks / 1000}${
    includePacks ? (millipacks === 1000 ? ' pack' : ' packs') : ''
  }`;
}

export function millipacksToRatio(millipacks: any) {
  if (typeof millipacks !== 'number' || isNaN(millipacks)) return '—';
  return decimalToRatio(millipacks / 1000);
}

function decimalToRatio(decimal: number) {
  let denominator = 1;
  for (; (decimal * denominator) % 1 !== 0 && denominator < 1000; denominator += 1);
  return `${decimal * denominator}:${denominator}`;
}
