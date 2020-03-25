// Functions useful when interacting with `ptcgo-assets`

import {
  Format,
  ItemType,
  ItemIndex_BoosterPack,
  CardDefinition,
  ItemTypeFoilAlternate,
  ItemTypeSuffix,
} from './defs';
import { Expansion } from './expansion';
import { PTCGOItem } from './item';

interface PTCGOAssetOptions {
  /**
   * Base URL, including protocol.
   * @example https://assets.example.com
   */
  base: string;
}

interface PTCGOAssetsSpecifier {
  src: string[];
}

type AssetSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export class PTCGOAssets {
  constructor(private readonly options: PTCGOAssetOptions) {}

  /** Must be a single format, not flags. */
  format(format: Format) {
    return this.url(`format/${Format[format]}`, ['png']);
  }

  logo(exp: Expansion) {
    return this.url(`expansion/logo/${exp.code()}`, ['webp', 'png']);
  }

  symbol(exp: Expansion) {
    return this.url(`expansion/symbol/${exp.code()}`, ['png']);
  }

  // TODO: srcset
  item(item: PTCGOItem<CardDefinition>, size: AssetSize) {
    const expCode = item.expansion().code();
    if (item.itemType === ItemType.BoosterPack) {
      // Boosters are only available in l size
      if (size === 'xl') size = 'l';
      const suffix = BoosterSuffixes[item.itemIndex] || '';
      return this.url(`expansion/pack/${size}/${expCode}${suffix}`, ['webp', 'png']);
    }

    return this.url(
      `card/${size}/${expCode}/${this.itemFile(item)}`,
      size === 'xl' ? ['webp'] : ['jpg', 'webp']
    );
  }

  itemFile(item: PTCGOItem<CardDefinition>) {
    if (!item.definition) return '';
    let file = item.definition.colNo ?? item.definition.no;
    let suffix = '';
    if (!item.isYellowA()) {
      let { itemType } = item;
      // AlternateArtReverse should have suffix AlternateArt rather than none
      if (itemType === ItemType.AlternateArtReverse) itemType = ItemType.AlternateArt;
      // Don't create a separate file for reverse and holo cards
      if (!ItemTypeFoilAlternate.includes(itemType)) {
        suffix = ItemTypeSuffix[itemType];
      }
    }

    if (suffix) file += suffix;
    return file;
  }

  private url(file: string, formats: string[]): PTCGOAssetsSpecifier {
    return {
      src: formats.map(ext => `${this.options.base}/${file}.${ext}`),
    };
  }
}

const BoosterSuffixes: Record<number, string> = {
  [ItemIndex_BoosterPack.MinorPack]: 'm',
  [ItemIndex_BoosterPack.Prerelease]: 'p',
};
