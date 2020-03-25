// Functions that generate slugs for PTCGOItems

import { PTCGOItem, Item } from './item';
import { priceIndexToString } from './economy';
import {
  ItemType,
  ItemIndex_BoosterPack,
  ItemTypeSuffix,
  CardDefinition,
  ItemDefinition,
  ItemIndex_PriceIndex_Card,
} from './defs';
import { Expansion } from './expansion';

const BoosterPackSlugs: any = {
  [ItemIndex_BoosterPack.MajorPack]: 'Booster-Pack',
  [ItemIndex_BoosterPack.MinorPack]: 'Booster-Pack-Minor',
  [ItemIndex_BoosterPack.Prerelease]: 'Prerelease-Pack',
};
const BoosterPackIndexes: any = {};
for (const key in BoosterPackSlugs) {
  BoosterPackIndexes[BoosterPackSlugs[key].toLowerCase()] = key;
}

export function slugifyPTCGOItem(item: PTCGOItem) {
  if (!item || !item.isValid()) return;
  if (item.itemType === ItemType.BoosterPack) {
    return BoosterPackSlugs[item.itemIndex];
  }

  if (item.index) {
    return slugifyPriceIndex(item);
  }

  // TODO: replace more characters
  const slug = item.definition!.name.replace(/ /g, '-');
  const itemNo: string[] = [`${item.itemIndex}${ItemTypeSuffix[item.itemType] || ''}`];
  const cardDef = (item as PTCGOItem<CardDefinition>).definition!;

  if (cardDef.colNo) {
    itemNo.unshift(cardDef.colNo);
  }

  return `${slug ? slug + '-' : ''}${itemNo.join('-')}`;
}

/**
 * @example XYEnergy/Water-Energy-9
 * @example UNB/Booster-Pack
 */
export function itemFromSlug(url: string): Item | undefined {
  const [expCode, itemName] = url.split('/');
  if (!expCode || !itemName) return;

  const exp = new Expansion({ code: expCode });
  if (!exp.isValid()) return;

  const itemNameLower = itemName.toLowerCase();
  if ({}.hasOwnProperty.call(BoosterPackIndexes, itemNameLower)) {
    if (!exp.hasBoosters()) return;
    return exp.item(BoosterPackIndexes[itemNameLower], ItemType.BoosterPack);
  }

  const itemNameParts = itemName.split('-');
  if (
    itemNameParts[0].toLowerCase() === 'typical' &&
    // 'Typical-Reverse-Common-Trainer'
    // 'Typical-Common-Pokemon'
    (itemNameParts.length === 3 || itemNameParts.length === 4)
  ) {
    let itemType = ItemType.Card;
    const variant = itemNameParts[1].toLowerCase();
    let type = itemNameParts.slice(1);
    if (variant === 'holo' || variant === 'reverse') {
      if (variant === 'holo') {
        itemType = ItemType.HoloCard;
      } else if (variant === 'reverse') {
        itemType = ItemType.ReverseCard;
      }

      // Remove variant
      type = type.slice(1);
    }

    // ['common', 'trainer'] => CommonTrainer
    const priceIndexEnumValue = type
      .map(part => part[0].toUpperCase() + part.slice(1).toLowerCase())
      .join('');
    if (!{}.hasOwnProperty.call(ItemIndex_PriceIndex_Card, priceIndexEnumValue)) return;
    const itemIndex = (ItemIndex_PriceIndex_Card as any)[priceIndexEnumValue];
    if (!itemIndex) return;
    return exp.item(itemIndex, itemType, true);
  }

  // `9`, `72a`, etc.
  const itemSpecifier = itemNameParts[itemNameParts.length - 1];
  const itemIndex = parseInt(itemSpecifier, 10);

  // If isNaN(itemIndex) && itemNameParts.length === 1, try parse as product
  if (Number.isNaN(itemIndex) || itemIndex < 0) return;

  let itemType = ItemType.Card;
  const itemTypeSuffix = itemSpecifier.slice(String(itemIndex).length).toLowerCase();
  if ({}.hasOwnProperty.call(ItemTypeSuffix, itemTypeSuffix)) {
    itemType = (ItemTypeSuffix as any)[itemTypeSuffix];
  }

  return exp.item(itemIndex, itemType);
}

export function ptcgoItemFromSlug<Def extends ItemDefinition = ItemDefinition>(
  url: string,
  itemDatabase: Record<string, Def>
) {
  const item = itemFromSlug(url);
  if (!item) return;
  const def = itemDatabase[item.itemid()];
  if (!def) return;
  return new PTCGOItem(item, def);
}

export function slugifyPriceIndex(item: Item) {
  return [
    'Typical',
    ...priceIndexToString(item)
      .replace('é', 'e')
      .split(' '),
  ].join('-');
}
