import {
  ItemCategory,
  ItemType,
  ArchetypeAttribute,
  Expansion,
  ExpansionSeries,
  Expansions_PTCGO,
  Attribute_Rarity,
  Rarity,
  PokemonType,
  CardDefinitionFlags,
  Attribute_ItemTags,
  CardKind,
  ItemIndex_BoosterPack,
  Attribute_TrainerType,
  Attribute_PokemonType,
  Attribute_AbilityType,
  Attribute_Ability,
  Attribute_ProductType,
  Attribute_PokemonStage,
  Attribute_CardType,
  Attribute_FoilMasks as Attribute_FoilMask,
  Attribute_Ability_Cost_Order,
  PokemonAbilityDefinition,
  PokemonAttackDefinition,
  AbilityType,
  Item,
  Attribute_FoilEffect,
  Attribute_Issue,
} from '../../src';
import { translate, stripHtml } from './translations';
import { fatal, inconsistency } from './util';
import { DuplicateDefinition } from './schema';

const INTERNAL_PRODUCTTYPES = [
  Attribute_ProductType.Currency,
  Attribute_ProductType.Proofset,
  Attribute_ProductType.Singles,
];

let expMap: any;
function getExpMap() {
  if (expMap) return expMap;
  expMap = require('../../data/ptcgo-set-map.json');
  return expMap;
}

export function isInternalItem(attributes: any) {
  const regionCode = attributes[ArchetypeAttribute.RegionCode];
  // Brazil boosters
  if (regionCode === 'BR') {
    return true;
  }

  if (
    ArchetypeAttribute.ProductType in attributes &&
    INTERNAL_PRODUCTTYPES.includes(
      (Attribute_ProductType[attributes[ArchetypeAttribute.ProductType]] as any) as number
    )
  ) {
    return true;
  }

  if (
    !attributes[ArchetypeAttribute.Name].startsWith('$$$') ||
    attributes[ArchetypeAttribute.Name] === '$$$$$$'
  ) {
    return true;
  }

  const assetClass = attributes[ArchetypeAttribute.AssetClass] || '';
  if (
    assetClass.startsWith('MonthlyNewsletter_') ||
    assetClass.endsWith('NewsletterBundle')
  ) {
    return true;
  }

  return false;
}

export function isUntradableItem(attributes: any) {
  if (attributes[ArchetypeAttribute.ValidForTrade] === false) {
    return true;
  }

  // 'Basic' deck
  if (attributes[ArchetypeAttribute.IsTCDeck] === true) {
    return true;
  }

  // Untradable McDonald's promo
  if (attributes[ArchetypeAttribute.IsMCDPromo] === true) {
    return true;
  }

  return false;
}

export function isUnsupportedItem(_: any) {
  // _: attributes
  return false;
}

function getCardCategory(attributes: any) {
  return ItemCategoryCard[Attribute_CardType[attributes[ArchetypeAttribute.CardType]]];
}

export function generateItemDefinition(attributes: any) {
  // Card or Product (if missing)
  const isCard = ArchetypeAttribute.CardType in attributes;

  let item: ItemDef;
  if (isCard) {
    const cardCategory = getCardCategory(attributes);
    if (cardCategory === ItemCategory.Pokemon) {
      item = new PokemonCardDef(attributes);
    } else if (cardCategory === ItemCategory.Trainer) {
      item = new TrainerCardDef(attributes);
    } else if (cardCategory === ItemCategory.Energy) {
      item = new EnergyCardDef(attributes);
    } else {
      throw fatal('unknown cardCategory', { attributes });
    }
  } else {
    item = new ProductDef(attributes);
  }

  const def = item.toJSON();
  // Sanity check definition
  for (const key in def) {
    const value = def[key];
    if (value === undefined) {
      throw fatal(`Item definition has "undefined"s`, { def, attributes });
    } else if (typeof value === 'string') {
      if (value.includes('<')) {
        throw fatal(`Item definition includes HTML`, { def, attributes });
      } else if (value.includes('$$$')) {
        throw fatal(`Item definition includes unresolved translation`, {
          def,
          attributes,
        });
      }
    }
  }

  // Make `id` the first field in the object. This looks cleaner and improves compression.
  const { id, ...defRest } = def;
  return { id, ...defRest };
}

class ItemDef {
  def: any = {};
  protected exp: Expansion;
  constructor(protected attributes: any) {
    const { def } = this;
    const nameTrKey = attributes[ArchetypeAttribute.Name];
    // Some strings (such as trainer kit bundles) include HTML
    let itemName = translate(nameTrKey, MissingTranslation);

    const asset = attributes[ArchetypeAttribute.AssetClass];
    const release = attributes[ArchetypeAttribute.ReleaseCode];
    if (itemName === MissingTranslation) {
      if (asset) {
        inconsistency(
          `Product ${asset} from release ${release} has a missing translation for its ’name’ (${nameTrKey})`
        );
        itemName = asset;
      } else {
        throw fatal(
          `Item ${def.id} from release ${release} has a missing translation for its ’name’ (${nameTrKey})`
        );
      }
    }

    if (
      attributes[ArchetypeAttribute.UnlockProductType] &&
      attributes[ArchetypeAttribute.UnlockProductType2] !==
        attributes[ArchetypeAttribute.UnlockProductType2]
    ) {
      inconsistency(
        `${
          asset ? `Product ${asset}` : `Item ${def.id}`
        } UnlockProductTypes do not match: 1=${
          attributes[ArchetypeAttribute.UnlockProductType]
        } 2=${attributes[ArchetypeAttribute.UnlockProductType2]}`
      );
    }

    def.name = stripHtml(itemName);

    const expCode = getExpMap()[attributes[ArchetypeAttribute.ReleaseCode]];
    this.exp = new Expansion(
      expCode
        ? { code: expCode }
        : { seriesId: ExpansionSeries.PTCGO, expansionId: Expansions_PTCGO.NoSet }
    );
  }

  toJSON() {
    return this.def;
  }
}

const CardIssue = Symbol('CardIssue');
class CardDef extends ItemDef {
  // Memoize so the inconsistency warning only appears once
  [CardIssue]!: string;
  constructor(protected attributes: any) {
    super(attributes);
    const { def, exp } = this;

    if (!exp.isValid()) {
      throw fatal(`Card with invalid expansion`, { attributes, exp, def });
    }

    const cardNo = this.getCardNo();
    const fancyNo = this.getFancyNo();
    const rarity = this.getRarity();
    const isYellowA = this.isYellowA();
    const cardKind = this.getCardKind();
    const cardFlags = this.getCardFlags();

    def.cat = getCardCategory(attributes);
    def.id = exp.item(cardNo, this.getItemType()).itemid();
    def.kind = cardKind;
    def.no = cardNo;

    if (fancyNo) {
      def.colNo = fancyNo;
      if (def.colNo.endsWith('a') && !isYellowA) {
        throw fatal('-a not parsed as YellowA', { def, attributes });
      }
    } else if (isYellowA) {
      throw fatal(`card lacking FancyCollectionNumber parsed as YellowA`, {
        def,
        attributes,
      });
    }

    def.rarity = rarity;
    if (cardFlags) {
      def.flags = cardFlags;
    }
  }

  private getCardNo() {
    const { attributes, exp } = this;
    let cardNo = attributes[ArchetypeAttribute.CollectionNumber];
    // For some reason Generation Radiant Collection cards start at num 101 instead of 84.
    // Unfortunately this needs to be hardcoded.
    if (exp.code() === 'GEN' && cardNo > 100) {
      cardNo -= 17;
    }

    return cardNo;
  }

  private getFancyNo() {
    const { attributes } = this;
    let fancyNo = attributes[ArchetypeAttribute.FancyCollectionNumber];

    if (fancyNo?.startsWith('$$$')) {
      fancyNo = translate(fancyNo).toUpperCase();
    }

    // Some cards (like TK-Zoroark #14 and #29) have a fancy no that's like '14/30', where the 30 refers to the amount of cards in the collection.
    // It's supposed to be the part before the /.
    if (fancyNo?.includes('/')) {
      fancyNo = fancyNo.split('/')[0];
      // Consider this card to have no fancy numbering in this case
      if (Number(fancyNo) === this.getCardNo()) {
        fancyNo = undefined;
      }
    }

    return fancyNo;
  }

  private getTags() {
    const { attributes } = this;
    return (attributes[ArchetypeAttribute.ItemTags] || []) as Attribute_ItemTags[];
  }

  private isYellowA() {
    return this.getTags().includes('YellowA') || this.getIssue() === 'yaa';
  }

  private getFoilMask() {
    const { attributes } = this;
    return (Attribute_FoilMask[attributes[ArchetypeAttribute.FoilMask]] as any) as number;
  }

  private getFoilEffect() {
    const { attributes } = this;
    return (Attribute_FoilEffect[
      attributes[ArchetypeAttribute.FoilEffect]
    ] as any) as number;
  }

  private getIssue() {
    if (this[CardIssue]) return this[CardIssue];
    const { attributes, exp, def } = this;
    const guid = attributes[ArchetypeAttribute.GUID];
    const primaryPrint = attributes[ArchetypeAttribute.OriginalPrintID];
    const attrRarity = this.getPTCGORarity();
    const foilMask = this.getFoilMask();

    let issue = attributes[ArchetypeAttribute.AssetClass] as Attribute_Issue;
    // Charmander BUS#18 and Charmeleon BUS#19 have two 'std' prints, one version being holo
    // Fortunately they have their primary print pointing towards the real one
    if (
      issue === 'std' &&
      primaryPrint !== guid &&
      foilMask === Attribute_FoilMask.Holo &&
      (attrRarity === Attribute_Rarity.Common ||
        attrRarity === Attribute_Rarity.Uncommon) &&
      // Ignore Generations Radiant Collection, which have a primary print pointing to a non-existent card
      !this.getFancyNo()
    ) {
      inconsistency(
        `issue=std card ${
          def.name
        } (#${this.getCardNo()}) from expansion ${exp.code()} is a Holo (Un)common but its primary print does not refer to itself (should be ’alt’)`
      );
      issue = 'alt';
    }

    this[CardIssue] = issue;
    return issue;
  }

  private getPTCGORarity() {
    const { attributes } = this;
    return (Attribute_Rarity[attributes[ArchetypeAttribute.Rarity]] as any) as number;
  }

  private isFullArt() {
    const { attributes } = this;
    return Boolean(attributes[ArchetypeAttribute.IsFullArt]);
  }

  private getRarity() {
    const attrRarity = this.getPTCGORarity();

    let rarity = CardRarity[attrRarity];

    // If an 'alt' is a RareHolo, but lacks a foil effect, it's actually a regular rare
    if (
      attrRarity === Attribute_Rarity.RareHolo &&
      !this.getFoilEffect() &&
      this.getIssue() === 'alt'
    ) {
      rarity = Rarity.Rare;
    }

    return rarity;
  }

  private getItemType() {
    const { attributes, exp, def } = this;
    const regionCode = attributes[ArchetypeAttribute.RegionCode];
    const tags = this.getTags();
    const issue = this.getIssue();
    const assetPath = attributes[ArchetypeAttribute.AssetPath];
    const isLeague = tags.includes('League') || issue === 'op';
    const fancyNo = this.getFancyNo();
    const attrRarity = this.getPTCGORarity();
    const cardKind = this.getCardKind();

    // Determine the ItemType of this card
    let itemType = ItemType.Card;
    if (regionCode) {
      itemType = (ItemType as any)[`Language_${regionCode}`] as number;
      if (itemType === undefined) {
        throw fatal(`Unknown region code`, { regionCode, attributes });
      }
    } else if (this.isYellowA()) {
      return this.getItemTypeYellowA();
    } else if (isLeague) {
      return this.getItemTypeLeague();
    } else if (issue === 'pcd') {
      itemType = ItemType.ThemeDeckCard;
    } else if (issue === 'alt' && fancyNo !== 'BW25') {
      // BW25 only has one issue and it's 'alt', a 'std' does not exist
      return this.getItemTypeAlt();
    } else if (assetPath?.endsWith('a') && (issue === 'std' || issue === 'ph')) {
      // XY #17 Vivillon has an alternate art for its wings
      itemType = issue === 'std' ? ItemType.AlternateArt : ItemType.AlternateArtReverse;
    } else if (
      this.getFoilMask() === Attribute_FoilMask.Reverse &&
      // Ignore ACESPEC trainers (they are always marked as Reverse although it's not very apparent on the card)
      attrRarity !== Attribute_Rarity.Ace &&
      // Ignore promos
      attrRarity !== Attribute_Rarity.RarePromo
    ) {
      if (issue !== 'ph') {
        inconsistency(
          `Card ${
            def.name
          } (#${this.getCardNo()}) from expansion ${exp.code()} has FoilMask=Reverse but its issue is ’${issue}’ instead of ’ph’`
        );
      }

      itemType = ItemType.ReverseCard;
    } else if (
      attrRarity === Attribute_Rarity.RareHolo ||
      (cardKind === CardKind.BasicEnergy &&
        this.getFoilMask() === Attribute_FoilMask.Holo)
    ) {
      // Attribute_Rarity.RareHolo is set on normal Rare cards that are Holo
      // foilMask === Holo is also set on cards such as GXes, but we want those to be ItemType.Card
      // Basic Energies can also have a Holo variant
      itemType = ItemType.HoloCard;
    }

    return itemType;
  }

  private getItemTypeLeague() {
    const { def, exp } = this;
    if (this.isLeagueAlternate()) {
      console.info(
        `Marking card ${
          def.name
        } (#${this.getCardNo()}) from expansion ${exp.code()} as LeagueAlternate`
      );
      return ItemType.LeagueAlternate;
    }

    return ItemType.League;
  }

  private getItemTypeYellowA() {
    const { exp, def } = this;
    let itemType: number;
    const tags = this.getTags();

    // YellowA has priority over League. A number of cards are both (see SM2, SM6)
    if (tags.includes('ShinyPokemon')) {
      itemType = ItemType.YellowAlternateShiny;
    } else if (this.getFancyNo()?.endsWith('b')) {
      itemType = ItemType.YellowAlternateB;
    } else if (
      !this.isFullArt() &&
      def.cat === ItemCategory.Trainer &&
      this.getFoilMask() === Attribute_FoilMask.Holo
    ) {
      itemType = ItemType.YellowAlternateHolo;
    } else {
      itemType = ItemType.YellowAlternate;
    }

    if (!tags.includes('YellowA')) {
      inconsistency(
        `issue=yaa card ${
          def.name
        } (#${this.getCardNo()}) from expansion ${exp.code()} lacks tags:YellowA`
      );
    }

    return itemType;
  }

  private isLeagueAlternate() {
    const { attributes, exp } = this;
    // BW1 league energies & Skyla #134 have a Thatched and a Reverse Rainbow league variant
    // This check is super messy but it prevents having to hardcode a specific card, set, or uuid into the generator.
    // However because it's fragile we should log this change
    const isBWLeagueAlternate =
      this.getFoilMask() === Attribute_FoilMask.Thatch &&
      this.getFoilEffect() === Attribute_FoilEffect.Rainbow &&
      exp.seriesId === ExpansionSeries.BW &&
      ((this.getCardKind() === CardKind.Supporter &&
        attributes[ArchetypeAttribute.ContainedInDecks]?.length > 0 &&
        // Don't affect N #92
        !attributes[ArchetypeAttribute.HasAlternatePrint]) ||
        getCardCategory(attributes) === ItemCategory.Energy);
    if (isBWLeagueAlternate) return true;
    // XYEnergy has a Fairy energy that has two league versions, one being a Rainbow Reverse variant
    // (all energies with a League version in that set have a Rainbow Thatch)
    const isXYEnergyLeagueAlternate =
      exp.code() === 'XYEnergy' &&
      this.getFoilMask() === Attribute_FoilMask.Reverse &&
      this.getFoilEffect() === Attribute_FoilEffect.Rainbow &&
      // Don't affect the Darkness Energy
      attributes[ArchetypeAttribute.CardCode] === 'FairyEnergy';
    if (isXYEnergyLeagueAlternate) return true;
    return false;
  }

  private getItemTypeAlt() {
    const { attributes, def } = this;
    const attrRarity = this.getPTCGORarity();
    const foilEffect = this.getFoilEffect();

    if (foilEffect) {
      const itype = AltIssueFoilEffectItemType[foilEffect];
      if (!itype) {
        throw fatal(`issue=alt with a missing item type mapping for its foil effect`, {
          attributes,
        });
      }

      return itype;
    }

    if (attrRarity === Attribute_Rarity.RareHolo) {
      // If an 'alt' is a RareHolo, but lacks a foil effect, it's actually a regular rare
      return ItemType.Card;
    }

    if (attrRarity === Attribute_Rarity.RarePromo) {
      // If the 'alt' of a RarePromo lacks a foil effect, the rarity is still promo
      return ItemType.AltRegular;
    }

    throw fatal(`issue=alt with no foil mask but rarity is not RareHolo`, {
      def,
      attributes,
    });
  }

  private getCardKind() {
    const { attributes } = this;

    // Pokemon kinds
    const stage = (Attribute_PokemonStage[
      attributes[ArchetypeAttribute.PokemonStage]
    ] as any) as number;
    // Trainer kinds
    const trainerType = (Attribute_TrainerType[
      attributes[ArchetypeAttribute.TrainerType]
    ] as any) as number;
    // Energy kinds
    const isEnergy = ArchetypeAttribute.EnergyProvided in attributes;

    if (stage !== undefined) {
      return this.getCardKindPokemon();
    }

    if (trainerType !== undefined) {
      if (trainerType === Attribute_TrainerType.Item) {
        return CardKind.Item;
      }

      if (trainerType === Attribute_TrainerType.Stadium) {
        return CardKind.Stadium;
      }

      if (trainerType === Attribute_TrainerType.Supporter) {
        return CardKind.Supporter;
      }

      if (
        trainerType === Attribute_TrainerType.PokemonTool ||
        trainerType === Attribute_TrainerType.PokemonToolF
      ) {
        return CardKind.PokemonTool;
      }

      throw fatal(`Unknown trainerType`, { trainerType });
    }

    if (isEnergy) {
      if (attributes[ArchetypeAttribute.IsSpecialEnergy] === true) {
        return CardKind.SpecialEnergy;
      }

      return CardKind.BasicEnergy;
    }

    throw fatal(`Could not determine card type`, { attributes });
  }

  private getCardKindPokemon() {
    const { attributes } = this;
    const stage = (Attribute_PokemonStage[
      attributes[ArchetypeAttribute.PokemonStage]
    ] as any) as number;
    const tags = (attributes[ArchetypeAttribute.ItemTags] || []) as Attribute_ItemTags[];

    if (attributes[ArchetypeAttribute.IsLEGEND] === true) {
      return CardKind.LEGEND;
    }

    if (attributes[ArchetypeAttribute.IsPokemonEX]) {
      if (stage === Attribute_PokemonStage.Stage1) {
        return CardKind.MEGA;
      }

      return CardKind.EX;
    }

    if (stage === Attribute_PokemonStage.VMAX) {
      return CardKind.VMAX;
    }

    if (tags.includes('V')) {
      return CardKind.V;
    }

    if (ArchetypeAttribute.GXAbilities in attributes) {
      if (tags.includes('TAG')) {
        return CardKind.TAGTEAM;
      }

      if (stage === Attribute_PokemonStage.Stage2) {
        return CardKind.Stage2GX;
      }

      if (stage === Attribute_PokemonStage.Stage1) {
        return CardKind.Stage1GX;
      }

      if (stage === Attribute_PokemonStage.Restored) {
        return CardKind.RestoredGX;
      }

      if (stage === Attribute_PokemonStage.Basic) {
        return CardKind.BasicGX;
      }

      throw fatal(`GXAbilities specified but could not determine CardKind`, {
        attributes,
      });
    } else if (stage === Attribute_PokemonStage.Basic) {
      return CardKind.Basic;
    } else if (stage === Attribute_PokemonStage.Stage1) {
      return CardKind.Stage1;
    } else if (stage === Attribute_PokemonStage.Stage2) {
      return CardKind.Stage2;
    } else if (stage === Attribute_PokemonStage.Restored) {
      return CardKind.Restored;
    } else if (stage === Attribute_PokemonStage.Break) {
      return CardKind.BREAK;
    }

    throw fatal(`Unknown Pokemon CardKind`, { attributes });
  }

  private getCardFlags() {
    const rarity = (Attribute_Rarity[
      this.attributes[ArchetypeAttribute.Rarity]
    ] as any) as number;
    const tags = (this.attributes[ArchetypeAttribute.ItemTags] ||
      []) as Attribute_ItemTags[];
    const cardAsset = this.attributes[ArchetypeAttribute.AssetPath];
    const issue = this.attributes[ArchetypeAttribute.AssetClass];
    let flags: CardDefinitionFlags = 0;

    if (this.attributes[ArchetypeAttribute.IsFullArt] === true) {
      flags |= CardDefinitionFlags.FullArt;
    }

    if (rarity === Attribute_Rarity.RarePrime) {
      flags |= CardDefinitionFlags.Prime;
    }

    if (rarity === Attribute_Rarity.Ace) {
      flags |= CardDefinitionFlags.ACESPEC;
    }

    if (tags.includes('League') || issue === 'op') {
      flags |= CardDefinitionFlags.League;
      if (!tags.includes('League')) {
        inconsistency(
          `Card ${this.def.name} is issue="op" but does not have tags:League`
        );
      } else if (issue !== 'op') {
        inconsistency(`Card ${this.def.name} has tags:League but is not issue="op"`);
      }
    }

    if (tags.includes('UltraBeast')) {
      flags |= CardDefinitionFlags.UltraBeast;
    }

    if (tags.includes('PrismStar')) {
      flags |= CardDefinitionFlags.PrismStar;
    }

    if (rarity === Attribute_Rarity.Shining) {
      flags |= CardDefinitionFlags.Shining;
    }

    if (tags.includes('TAG')) {
      flags |= CardDefinitionFlags.TagTeam;
    }

    if (tags.includes('ShinyPokemon')) {
      flags |= CardDefinitionFlags.ShinyPokemon;
    }

    if (cardAsset) {
      flags |= this.getCardAssetFlags(cardAsset);
    }

    return flags;
  }

  private getCardAssetFlags(cardAsset: string) {
    if (cardAsset.endsWith('ya')) {
      return CardDefinitionFlags.YellowAArt;
    }

    if (cardAsset.endsWith('a')) {
      return CardDefinitionFlags.AltArt;
    }

    if (cardAsset.endsWith('op')) {
      return CardDefinitionFlags.OPArt;
    }

    if (cardAsset.endsWith('xy')) {
      return CardDefinitionFlags.XYArt;
    }

    if (cardAsset.endsWith('_silver')) {
      return CardDefinitionFlags.SilverArt;
    }

    if (cardAsset.endsWith('_gold')) {
      return CardDefinitionFlags.GoldArt;
    }

    return 0;
  }
}

class PokemonCardDef extends CardDef {
  constructor(protected attributes: any) {
    super(attributes);

    const { def } = this;

    def.family = attributes[ArchetypeAttribute.FamilyID];
    if (ArchetypeAttribute.PreviousEvolution in attributes) {
      def.preevo = translate(attributes[ArchetypeAttribute.PreviousEvolution]);
    }

    def.hp = attributes[ArchetypeAttribute.HP];
    if (ArchetypeAttribute.Weaknesses in attributes) {
      const weaknesses = attributes[ArchetypeAttribute.Weaknesses]
        .filter(removeNoColor)
        .map(convertPTCGOPokemonType);
      if (weaknesses.length === 1) {
        def.weakness = weaknesses[0];
      } else if (weaknesses.length > 1) {
        def.weaknesses = weaknesses;
      }

      if (weaknesses.length > 0) {
        const weaknessAmt = attributes[ArchetypeAttribute.WeaknessAmount];
        if (weaknessAmt !== 2) {
          def.weaknessAmt = weaknessAmt;
        }
      }
    }

    if (ArchetypeAttribute.Resistence in attributes) {
      const resist = (Attribute_PokemonType[
        attributes[ArchetypeAttribute.Resistence]
      ] as any) as number;
      if (resist !== Attribute_PokemonType.NoColor) {
        def.resistance = PokemonType[attributes[ArchetypeAttribute.Resistence]];
        def.resist = -attributes[ArchetypeAttribute.ResistanceAmount];
      }
    }

    const retreat = attributes[ArchetypeAttribute.RetreatCost];
    if (retreat) {
      def.retreat = retreat;
    }

    const cardAbilities = attributes[ArchetypeAttribute.Abilities] as Attribute_Ability[];
    if (cardAbilities) {
      const { attacks, abilities } = getCardAttacksAbilities(cardAbilities);
      if (abilities.length > 0) def.abilities = abilities;
      if (attacks.length > 0) {
        // Attacks with a lower cost should come first
        def.attacks = attacks.sort(
          (a, b) => (a.cost?.length ?? 0) - (b.cost?.length ?? 0)
        );
      }
    }
  }
}

/** Must be extended */
class CardDefWithText extends CardDef {
  constructor(protected attributes: any) {
    super(attributes);
    const { def, exp } = this;

    if (ArchetypeAttribute.GameText in attributes) {
      const text = translate(attributes[ArchetypeAttribute.GameText], MissingTranslation);
      if (text === MissingTranslation) {
        inconsistency(
          `Card ${def.name} (#${
            def.no
          }) from expansion ${exp.code()} has missing rules text`
        );
      } else {
        // Some cards such as Spirit Links put <i> around 'EX'
        def.text = stripHtml(text);
      }
    }
  }
}

class TrainerCardDef extends CardDefWithText {
  constructor(protected attributes: any) {
    super(attributes);
    const { def } = this;

    if (ArchetypeAttribute.Abilities in attributes) {
      const cardAbilities = attributes[
        ArchetypeAttribute.Abilities
      ] as Attribute_Ability[];
      const { attacks, abilities } = getCardAttacksAbilities(cardAbilities);
      if (attacks.length > 0) {
        def.attacks = attacks;
      }

      if (abilities.length > 0) {
        throw fatal(`Trainer card defined with an ability`, { attributes, def });
      }
    }
  }
}

class EnergyCardDef extends CardDefWithText {
  constructor(protected attributes: any) {
    super(attributes);
    const { def, exp } = this;

    def.energy = attributes[ArchetypeAttribute.EnergyProvided].options.map(
      convertPTCGOPokemonType
    );

    // XYEnergy's Holo energies are duplicate, their only difference is the GUID. In-game they are different items but visually completely equivalent.
    if (exp.code() === 'XYEnergy' && attributes[ArchetypeAttribute.AssetClass] === 'ph') {
      def[DuplicateDefinition] = true;
    }
  }
}

/** Encapsulates PackDefinition, ProductDefinition, GameplayItemDefinition */
class ProductDef extends ItemDef {
  constructor(protected attributes: any) {
    super(attributes);
    const { def, exp } = this;

    const assetName = attributes[ArchetypeAttribute.AssetClass];
    const cards = attributes[ArchetypeAttribute.NumberOfCardsInBooster];

    const isExpansionItem = exp.seriesId !== ExpansionSeries.PTCGO;
    let productCategory =
      ItemCategoryProduct[
        Attribute_ProductType[attributes[ArchetypeAttribute.ProductType]]
      ];
    if (ArchetypeAttribute.UnlockProductType in attributes) {
      const unlockType = attributes[ArchetypeAttribute.UnlockProductType];
      if (unlockType === 'ThemeDeck') {
        productCategory = ItemCategory.ThemeDeck;
      } else if (unlockType === 'Tin') {
        productCategory = ItemCategory.Tin;
      }
    }

    let item: Item;
    // Use the itemid system for boosters and prerelease packs
    let isBooster = false;
    const isPrereleaseBooster = this.isPrereleaseBooster();
    if (
      isPrereleaseBooster ||
      (isExpansionItem &&
        productCategory !== ItemCategory.ThemeDeck &&
        productCategory !== ItemCategory.Tin &&
        productCategory !== ItemCategory.Bundle)
    ) {
      if (cards) {
        item = exp.item(
          cards >= 10 ? ItemIndex_BoosterPack.MajorPack : ItemIndex_BoosterPack.MinorPack,
          ItemType.BoosterPack
        );
      } else if (isPrereleaseBooster) {
        productCategory = ItemCategory.PrereleasePack;
        item = exp.item(ItemIndex_BoosterPack.Prerelease, ItemType.BoosterPack);
      } else {
        throw fatal(`Expansion item that isn’t a booster`, { attributes });
      }

      isBooster = true;
    } else {
      if (cards) {
        throw fatal(`NumberOfCardsInBooster defined for non-expansion item`, {
          attributes,
        });
      }

      // Identify this as a gameplay item
      item = exp.item(0, ItemType.Gameplay);
    }

    if (isPrereleaseBooster && !isBooster) {
      throw fatal(`IsPrereleaseBooster but not marked as a booster`, { attributes });
    }

    def.cat = productCategory;
    if (cards) {
      def.cards = cards;
    } else if (productCategory === ItemCategory.Booster) {
      throw fatal(`NumberOfCardsInBooster not defined for ItemCategory.Booster`, {
        attributes,
      });
    }

    if (!isBooster) def.asset = assetName;
    def.id = item.itemid();

    const description = this.getProductDescription();
    if (description) {
      def.description = description;
    }
  }

  private getProductDescription() {
    const { attributes, exp, def } = this;
    const descriptionTrKey = attributes[ArchetypeAttribute.ProductDescription];
    if (descriptionTrKey) {
      const description = translate(descriptionTrKey, MissingTranslation);
      if (description === MissingTranslation) {
        inconsistency(
          `Product ${def.name} (#${def.asset}) from expansion ${
            exp.isValid() ? exp.code() : 'NoSet'
          } has missing description text`,
          { key: descriptionTrKey }
        );
      } else {
        return stripHtml(description);
      }
    }
  }

  private isPrereleaseBooster() {
    const assetName = this.attributes[ArchetypeAttribute.AssetClass];
    return (
      // SM7+
      assetName.endsWith('EvolutionPack') ||
      // SM6
      assetName.endsWith('EvolutionPackBundle') ||
      // Pre-SM6
      assetName.endsWith('PrereleasePack')
    );
  }
}

// TODO
// class AvatarItemDefinition extends ProductDef {}

// Used for Pokemon & Trainers
function getCardAttacksAbilities(cardAbilities: Attribute_Ability[]) {
  const attacks: PokemonAttackDefinition[] = [];
  const abilities: PokemonAbilityDefinition[] = [];
  for (const ability of cardAbilities) {
    if (ability.ignoreInFiltering) continue;

    const abilityTitle = translate(ability.title);
    // Optional or potentially always resolves to a non-existent translation - the game falls back to '' in this case for this field and this is not a bug
    const abilityText = ability.gameText && translate(ability.gameText, '');
    const def: any = {
      name: abilityTitle,
    };
    if (abilityText) def.text = abilityText;
    const abilityType = Attribute_AbilityType[ability.abilityType];

    switch (abilityType) {
      case Attribute_AbilityType.Attack:
        attacks.push(getAttackDefinition(def, ability));
        break;
      // Ability
      case Attribute_AbilityType.PokeAbility:
      case Attribute_AbilityType.PokePower:
      case Attribute_AbilityType.PokeBody:
      case Attribute_AbilityType.AncientTrait:
        if (abilityType === Attribute_AbilityType.PokeAbility) {
          def.type = AbilityType.Ability;
        } else if (abilityType === Attribute_AbilityType.PokePower) {
          def.type = AbilityType.PokePower;
        } else if (abilityType === Attribute_AbilityType.PokeBody) {
          def.type = AbilityType.PokeBody;
        } else if (abilityType === Attribute_AbilityType.AncientTrait) {
          def.type = AbilityType.AncientTrait;
        }

        abilities.push(def);
        break;
      // Ignore
      case Attribute_AbilityType.StadiumAbility:
      case Attribute_AbilityType.EnergyAbility:
        break;
      default:
        throw fatal(`Unhandled AbilityType: ${ability.abilityType}`, { cardAbilities });
    }
  }

  return { attacks, abilities };
}

function getAttackDefinition(def: any, ability: any) {
  if (ability.damage) {
    def.damage = ability.damage;
  }

  if (ability.amountOperator) {
    def.op = ability.amountOperator;
  }

  if (ability.cost) {
    const cost: PokemonType[] = [];

    for (const type in ability.cost) {
      const costCount = ability.cost[type];
      for (let i = 0; i < costCount; i += 1) {
        cost.push(type as any);
      }
    }

    if (cost.length > 0) {
      // Use the same sorting as on the cards
      def.cost = cost
        .sort(
          (a: any, b: any) =>
            Attribute_Ability_Cost_Order.indexOf(a) -
            Attribute_Ability_Cost_Order.indexOf(b)
        )
        .map(type => PokemonType[type as any] as any);
    }
  }

  return def;
}

// Tables and map/filter functions
const MissingTranslation = (Symbol('MissingTranslation') as any) as string;
// PTCGO enum -> proper enum
const CardRarity: any = {
  [Attribute_Rarity.Common]: Rarity.Common,
  [Attribute_Rarity.Uncommon]: Rarity.Uncommon,
  [Attribute_Rarity.Rare]: Rarity.Rare,
  [Attribute_Rarity.RareHolo]: Rarity.HoloRare,
  [Attribute_Rarity.RareHoloEX]: Rarity.HoloRare,
  [Attribute_Rarity.RareHoloGX]: Rarity.HoloRare,
  [Attribute_Rarity.RareHoloV]: Rarity.HoloRare,
  [Attribute_Rarity.RareHoloVMAX]: Rarity.HoloRare,
  [Attribute_Rarity.RarePrime]: Rarity.HoloRare,
  [Attribute_Rarity.Legendary]: Rarity.HoloRare,
  [Attribute_Rarity.RareUltra]: Rarity.UltraRare,
  [Attribute_Rarity.Ace]: Rarity.HoloRare,
  [Attribute_Rarity.BreakRare]: Rarity.HoloRare,
  [Attribute_Rarity.RareSecret]: Rarity.SecretRare,
  [Attribute_Rarity.Prism]: Rarity.HoloRare,
  [Attribute_Rarity.Shining]: Rarity.SecretRare,
  [Attribute_Rarity.RareRainbow]: Rarity.RainbowRare,
  [Attribute_Rarity.RarePromo]: Rarity.Promo,
};

const ItemCategoryCard: any = {
  [Attribute_CardType.Pokemon]: ItemCategory.Pokemon,
  [Attribute_CardType.LegendHalf]: ItemCategory.Pokemon,
  [Attribute_CardType.TrainerCard]: ItemCategory.Trainer,
  [Attribute_CardType.Energy]: ItemCategory.Energy,
};

const ItemCategoryProduct: any = {
  [Attribute_ProductType.Bundles]: ItemCategory.Bundle,
  [Attribute_ProductType.Miscellaneous]: ItemCategory.Bundle,
  [Attribute_ProductType.Coins]: ItemCategory.Coin,
  [Attribute_ProductType.DeckBox]: ItemCategory.DeckBox,
  [Attribute_ProductType.Sleeve]: ItemCategory.CardSleeve,
  [Attribute_ProductType.Packs]: ItemCategory.Booster,
  [Attribute_ProductType.Decks]: ItemCategory.ThemeDeck,
};

const AltIssueFoilEffectItemType: any = {
  [Attribute_FoilEffect.Cosmos]: ItemType.AltCosmos,
  [Attribute_FoilEffect.Rainbow]: ItemType.AltRainbow,
  [Attribute_FoilEffect.Cracked_Ice]: ItemType.AltCrackedIce,
  [Attribute_FoilEffect.Tinsel]: ItemType.AltTinsel,
  [Attribute_FoilEffect.AngledPillars]: ItemType.AltAngledPillars,
  [Attribute_FoilEffect.SunLava]: ItemType.AltSunLava,
  [Attribute_FoilEffect.SunBeam]: ItemType.AltSunBeam,
  [Attribute_FoilEffect.SwHolo]: ItemType.AltSwHolo,
};

function convertPTCGOPokemonType(type: any) {
  return PokemonType[type];
}

function removeNoColor(type: any) {
  return (
    ((Attribute_PokemonType[type] as any) as number) !== Attribute_PokemonType.NoColor
  );
}
