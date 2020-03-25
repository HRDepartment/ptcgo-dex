export enum ExpansionSeries {
  Unknown = 0,
  // Includes Gym Series & Legendary Collection
  Base = 1,
  Neo = 2,
  ECard = 3,
  // Includes POP
  EX = 4,
  // Includes POP
  DP = 5,
  Pt = 6,
  HGSS = 7,
  BW = 8,
  XY = 9,
  SM = 10,
  SWSH = 11,
  PTCGO = 63,
}

export const PTCGOSeries = [
  ExpansionSeries.HGSS,
  ExpansionSeries.BW,
  ExpansionSeries.XY,
  ExpansionSeries.SM,
  ExpansionSeries.SWSH,
  ExpansionSeries.PTCGO,
] as const;

export enum ExpansionSeriesReadable {
  'HeartGold & SoulSilver' = ExpansionSeries.HGSS,
  'Black & White' = ExpansionSeries.BW,
  XY = ExpansionSeries.XY,
  'Sun & Moon' = ExpansionSeries.SM,
  'Sword & Shield' = ExpansionSeries.SWSH,
  'Gameplay' = ExpansionSeries.PTCGO,
}

// Flags
export enum Format {
  Banned = -1,
  Unlimited = 0,
  Standard = 1 << 0,
  Expanded = 1 << 1,
  Legacy = 1 << 2,
  ThemeDeck = 1 << 3,
}

export const PTCGOFormats = [Format.Standard, Format.Expanded, Format.Legacy];

export enum Expansions_Base {
  // Base 0, Expansion 0 is considered an invalid item
  NULL = 0,
}

export enum Expansions_HGSS {
  HS = 1,
  UL,
  UD,
  TM,
  CL = 5,
  HSEnergy = 54,
  /** Promo */
  'PR-HS' = 60,
}

export enum Expansions_BW {
  BLW = 1,
  EPO,
  NVI,
  NXD,
  DEX,
  DRX,
  DRV,
  BCR,
  PLS,
  PLF,
  PLB,
  LTR = 12,
  'TK-Zoroark' = 40, // Trainer Kit - Zoroark
  'TK-Excadrill' = 41, // Trainer Kit - Excadrill
  BLWEnergy = 54,
  MCD1 = 55,
  MCD2 = 56,
  MCD3 = 57,
  /** Promo */
  'PR-BLW' = 60,
}

export enum Expansions_XY {
  XY = 1,
  FLF,
  FFI,
  PHF,
  PRC,
  DCR,
  ROS,
  AOR,
  BKT,
  BKP,
  GEN,
  FCO,
  STS,
  EVO = 14,
  KSS = 30,
  'TK-Noibat' = 40,
  'TK-Sylveon' = 41,
  'TK-Bisharp' = 42,
  'TK-Wigglytuff' = 43,
  'TK-Latios' = 44,
  'TK-Latias' = 45,
  'TK-PikachuLibre' = 46,
  'TK-Suicune' = 47,
  XYEnergy = 54,
  MCD4 = 55,
  MCD5 = 56,
  MCD6 = 57,
  /** Promo */
  'PR-XY' = 60,
  /** PTCGO only */
  RSP = 61,
}

export enum Expansions_SM {
  SUM = 1,
  GRI,
  BUS,
  SLG,
  CIN,
  UPR,
  FLI,
  CES,
  DRM,
  LOT,
  TEU,
  DET,
  UNB,
  UNM,
  HIF,
  CEC = 16,
  'TK-Lycanroc' = 40,
  'TK-AlolanRaichu' = 41,
  SMEnergy = 54,
  MCD7 = 55,
  MCD8 = 56,
  /** Promo */
  'PR-SM' = 60,
}

export enum Expansions_SWSH {
  SSH = 1,
  RCL = 2,
  SWSHEnergy = 54,
  'PR-SW' = 60,
}

export enum Expansions_PTCGO {
  /** This item is a ProductDefinition from NoSet. ItemType is set to Gameplay and ItemIndex is set to 0. Read `cat` to get a better idea of what this item is */
  NoSet = 0,
  // In-game rewards
  TreasureChest = 1, // Uncommon, Rare Holo Chest
  AvatarCollectionBox = 2, // Pikachu, Charizard Boxes
}

export const SeriesExpansions = {
  [ExpansionSeries.HGSS]: Expansions_HGSS,
  [ExpansionSeries.BW]: Expansions_BW,
  [ExpansionSeries.XY]: Expansions_XY,
  [ExpansionSeries.SM]: Expansions_SM,
  [ExpansionSeries.SWSH]: Expansions_SWSH,
  [ExpansionSeries.PTCGO]: Expansions_PTCGO,
};

// _MAX needs to be appear before the last entry so the value gets overriden in the enum, that way doing ItemType[num] returns the proper string rather than the MAX you defined.
export enum ItemType {
  CARD_MIN = 0,
  Card = 0,
  // Holofoil: Common, Uncommon, and Rare cards
  HoloCard = 1,
  // Reverse Holo: Common, Uncommon, and Rare cards
  ReverseCard = 2,
  // Theme Deck alternate
  ThemeDeckCard = 3,
  CARD_LEAGUE_MIN = 4,
  // League Art Cards
  League = 4,
  // For where there are two League cards for same card, with the only difference being foil mask.
  // BW1 League energies, Skyla #134
  CARD_LEAGUE_MAX = 5,
  LeagueAlternate = 5,

  CARD_YELLOWA_MIN = 10,
  // YellowA Alternate Art Cards (Regular Art & Reverse Holo)
  YellowAlternate = 10,
  // YellowA Non-FA trainer holos (e.g. Delinquent #98a, Trainers Mail #92a)
  YellowAlternateHolo = 11,
  // YellowA card with a 'b' suffix (Delinquent #94b)
  YellowAlternateB = 12,
  // ShinyPokemon&YellowA cards
  CARD_YELLOWA_MAX = 13,
  YellowAlternateShiny = 13,
  // XY Base Vivillon
  AlternateArt = 16,
  AlternateArtReverse = 17,

  // Alt versions Foil Effects
  /** 'alt' but has no foil effect */
  CARD_ALT_MIN = 25,
  AltRegular = 25,
  AltCosmos,
  AltRainbow,
  AltCrackedIce,
  AltTinsel,
  AltAngledPillars,
  AltSunLava,
  AltSunBeam,
  CARD_ALT_MAX = 33,
  AltSwHolo = 33,

  // Languages for Worlds cards
  CARD_LANGUAGE_MIN = 40,
  Language_DE = 40,
  Language_EN = 41,
  Language_ES = 42,
  Language_FR = 43,
  Language_IT = 44,
  CARD_LANGUAGE_MAX = 45,
  CARD_MAX = 45,
  Language_PTBR = 45,
  // PTCGO
  BoosterPack = 55,
  /** ItemIndex should always be 0 for ItemType_Gameplay */
  Gameplay = 56,
  /** ItemIndex should always be 0 for ItemType_Avatar */
  Avatar = 57,
  // MAX = 63,
}

export const ItemTypePriceIndex = [
  // Uses ItemIndex_PriceIndex_Card
  ItemType.Card,
  ItemType.HoloCard,
  ItemType.ReverseCard,
  // Can only be priced per series (expansion is always 0)
  // Uses ItemIndex_BoosterPack
  ItemType.BoosterPack,
  // Uses ItemIndex_PriceIndex_Gameplay
  ItemType.Gameplay,
  // TODO: ItemType.Avatar
];

/**
 * Only 'Rare' is available for ItemType.HoloCard
 */
export enum ItemIndex_PriceIndex_Card {
  CommonPokemon = 1,
  CommonTrainer = 2,
  Energy = 3,
  UncommonPokemon = 4,
  UncommonTrainer = 5,
  Rare = 6,
}

export enum ItemIndex_PriceIndex_Gameplay {
  DeckBox = 1,
  CardSleeve = 2,
  Coin = 3,
}

/** ItemTypes that only differ in their foil mask */
export const ItemTypeFoilAlternate = [
  ItemType.HoloCard,
  ItemType.ReverseCard,
  ItemType.ThemeDeckCard,
  ItemType.LeagueAlternate,
  ItemType.YellowAlternateHolo,
  ItemType.AlternateArtReverse,
  // Alt arts can have a different asset, such as the set logo overlayed (in Dragon Vault), except for AltRegular
  ItemType.AltRegular,
];

export enum ItemTypeSuffix {
  h = ItemType.HoloCard,
  p = ItemType.ReverseCard,
  td = ItemType.ThemeDeckCard,
  a = ItemType.YellowAlternate,
  ah = ItemType.YellowAlternateHolo,
  b = ItemType.YellowAlternateB,
  as = ItemType.YellowAlternateShiny,
  aa = ItemType.AlternateArt,
  aap = ItemType.AlternateArtReverse,
  l = ItemType.League,
  la = ItemType.LeagueAlternate,
  alt = ItemType.AltRegular,
  ec = ItemType.AltCosmos,
  er = ItemType.AltRainbow,
  eci = ItemType.AltCrackedIce,
  et = ItemType.AltTinsel,
  eap = ItemType.AltAngledPillars,
  esl = ItemType.AltSunLava,
  esb = ItemType.AltSunBeam,
  esw = ItemType.AltSwHolo,
  de = ItemType.Language_DE,
  en = ItemType.Language_EN,
  es = ItemType.Language_ES,
  fr = ItemType.Language_FR,
  it = ItemType.Language_IT,
  ptbr = ItemType.Language_PTBR,
}

export enum ExpansionFlags {
  None = 0,
  MinorExpansion = 1 << 0,
  PromoExpansion = 1 << 1,
  EnergyExpansion = 1 << 2,
  TrainerKit = 1 << 3,
  // Whether the expansion has cards of the following types (and therefore makes use of the associated price index):
  Index_CommonPokemon = 1 << 6,
  Index_CommonTrainer = 1 << 7,
  Index_UncommonPokemon = 1 << 8,
  Index_UncommonTrainer = 1 << 9,
  Index_Rare = 1 << 10,
  Index_Energy = 1 << 11,
}

export enum ItemIndex_PTCGO_TreasureChest {
  UncommonChest = 1,
  HoloChest = 2,
}

export enum ItemIndex_PTCGO_AvatarCollectionBox {
  PikachuBox = 1,
  CharizardBox = 2,
}

export enum ItemIndex_BoosterPack {
  MajorPack = 1,
  MinorPack = 2,
  Prerelease = 3,
}

export enum Rarity {
  None = 0,
  // General rarities
  Common = 1,
  Uncommon = 2,
  Rare = 3,
  // Includes normal EXes, GXes, V, and VMAX cards, ACE SPEC, Prime, LEGEND, BREAK, and Prism Star
  HoloRare = 4,
  // Full Art cards
  UltraRare = 5,
  // Pokemon, Trainer, and Energy; Shining
  SecretRare = 6,
  // SM onward
  RainbowRare = 7,
  Promo = 8,
}

export enum RarityReadable {
  Common = Rarity.Common,
  Uncommon = Rarity.Uncommon,
  Rare = Rarity.Rare,
  'Holo Rare' = Rarity.HoloRare,
  'Ultra Rare' = Rarity.UltraRare,
  'Secret Rare' = Rarity.SecretRare,
  'Rainbow Rare' = Rarity.RainbowRare,
  Promo = Rarity.Promo,
}

export enum ItemCategory {
  CARD_MIN = 1,
  Pokemon = 1,
  Trainer = 2,
  CARD_MAX = 3,
  Energy = 3,

  // Gameplay items
  GAMEPLAY_MIN = 10,
  Booster = 10,
  Bundle = 11,
  Coin = 12,
  DeckBox = 13,
  CardSleeve = 14,
  ThemeDeck = 15,
  Tin = 16,
  GAMEPLAY_MAX = 17,
  PrereleasePack = 17,
}

export enum PokemonTeam {
  None = 0,
  TeamRocket = 1,
  TeamAqua,
  TeamMagma,
  TeamGalactic,
  TeamPlasma,
  TeamFlare,
  TeamSkull,
  TeamYell,
}

export enum CardKind {
  None = 0,
  // Pokemon
  Basic = 1,
  Stage1,
  Stage2,
  Restored,
  LEGEND,
  EX,
  BREAK,
  MEGA,
  BasicGX,
  Stage1GX,
  Stage2GX,
  RestoredGX,
  TAGTEAM,
  V,
  VMAX,

  // Trainer
  Item = 40,
  Supporter = 41,
  Stadium = 42,
  PokemonTool = 43,

  // Energy
  BasicEnergy = 50,
  SpecialEnergy = 51,
}

export enum CardKindReadable {
  'Basic Pokémon' = CardKind.Basic,
  'Stage 1 Pokémon' = CardKind.Stage1,
  'Stage 2 Pokémon' = CardKind.Stage2,
  'Restored Pokémon' = CardKind.Restored,
  'LEGEND Half' = CardKind.LEGEND,
  'Pokémon-EX' = CardKind.EX,
  BREAK = CardKind.BREAK,
  'M Pokémon-EX' = CardKind.MEGA,
  'Pokémon-GX' = CardKind.BasicGX,
  'Stage 1 Pokémon-GX' = CardKind.Stage1GX,
  'Stage 2 Pokémon-GX' = CardKind.Stage2GX,
  'Restored Pokémon-GX' = CardKind.RestoredGX,
  'Pokémon-TAG TEAM' = CardKind.TAGTEAM,
  'Pokémon-V' = CardKind.V,
  'Pokémon-VMAX' = CardKind.VMAX,
  'Item' = CardKind.Item,
  'Supporter' = CardKind.Supporter,
  'Stadium' = CardKind.Stadium,
  'Pokémon Tool' = CardKind.PokemonTool,
  'Energy' = CardKind.BasicEnergy,
  'Special Energy' = CardKind.SpecialEnergy,
}

export enum AbilityType {
  PokePower = 1,
  PokeBody = 2,
  Ability = 3,
  AncientTrait = 4,
}

export enum AbilityTypeReadable {
  'Poké-POWER' = AbilityType.PokePower,
  'Poké-BODY' = AbilityType.PokeBody,
  'Ability' = AbilityType.Ability,
  'Ancient Trait' = AbilityType.AncientTrait,
}

export enum PokemonType {
  Colorless = 1,
  Grass,
  Fire,
  Water,
  Lightning,
  Psychic,
  Fighting,
  Darkness,
  Metal,
  Fairy,
  Dragon,
}

export enum PokemonTypeLetter {
  'C' = PokemonType.Colorless,
  'G' = PokemonType.Grass,
  'R' = PokemonType.Fire,
  'W' = PokemonType.Water,
  'L' = PokemonType.Lightning,
  'P' = PokemonType.Psychic,
  'F' = PokemonType.Fighting,
  'D' = PokemonType.Darkness,
  'M' = PokemonType.Metal,
  'Y' = PokemonType.Fairy,
  'N' = PokemonType.Dragon,
}

export interface PokemonAbilityDefinition {
  type: AbilityType;
  name: string;
  text: string;
}

export interface PokemonAttackDefinition {
  cost?: PokemonType[];
  name: string;
  text?: string;
  damage?: number;
  op?: '+' | 'x';
}

export interface ItemDefinition {
  name: string;
  cat: ItemCategory;
  /**
   * Itemid.
   *
   * Gives only limited information (series and set) if field `asset` (ProductDefinition) is set
   */
  id: number;
}

export enum CardDefinitionFlags {
  None = 0,
  /** @attribute 201000 */
  FullArt = 1 << 0,
  /** Attribute_Rarity.RarePrime */
  Prime = 1 << 1,
  /** Attribute_Rarity.RareAce */
  ACESPEC = 1 << 2,
  /** Some cards are both YellowAlternate and League, so having a duplicate for League is required */
  League = 1 << 3,
  /** @attribute 202200.contains('UltraBeast') */
  UltraBeast = 1 << 4,
  /** Attribute_Rarity.Prism */
  PrismStar = 1 << 5,
  /** Attribute_Rarity.Shining */
  Shining = 1 << 6,
  /** @attribute 202200.contains('TAG') */
  TagTeam = 1 << 7,
  /** @attribute 202200.contains('ShinyPokemon') */
  ShinyPokemon = 1 << 8,

  /** @attribute 10020.endsWith('op') */
  OPArt = 1 << 11,
  /** @attribute 10020.endsWith('xy') */
  XYArt = 1 << 12,
  /** @attribute 10020.endsWith('ya') */
  YellowAArt = 1 << 13,
  /** @attribute !10020.endsWith('ya') && 10020.endsWith('a') */
  AltArt = 1 << 14,
  /** @attribute 10020.endsWith('_silver') */
  SilverArt = 1 << 15,
  /** @attribute 10020.endsWith('_gold') */
  GoldArt = 1 << 16,
}

export interface CardDefinition extends ItemDefinition {
  kind: CardKind;
  /**
   * @attribute 200550
   */
  rarity: Rarity;
  /**
   * Number in expansion
   * @attribute 200780
   */
  no: number;
  /**
   * Special collection number (string), used for Promos, alternate arts, and the series' special shiny expansion (such as Shiny Vault)
   * @attribute 200790
   */
  colNo?: string;
  /** Omitted if 0 */
  flags?: CardDefinitionFlags;
}

export interface PokemonCardDefinition extends CardDefinition {
  /**
   * Pokemon family (includes multiple evolution stages/formes), see data/families.json. Used for displaying similar Pokemon.
   * @attribute 200260
   */
  family: number;
  /**
   * Name of this pokemon's pre-evolution
   * @attribute 200280
   */
  preevo?: string;
  /**
   * @attribute 200490
   */
  hp: number;
  /**
   * If this is set, this Pokemon only has 1 weakness (most common). Otherwise weaknesses is set. If not set, this pokemon has no weakness.
   * @attribute 200590
   */
  weakness?: PokemonType;
  /**
   * Set instead of `weakness` if this pokemon has multiple weaknesses.
   * @attribute 200590
   */
  weaknesses?: PokemonType[];
  /**
   * 2 or 10
   * +10 exists in PTCGO for just one card: https://bulbapedia.bulbagarden.net/wiki/Pikachu_(HGSS_Promo_3)
   * @default 2
   * @attribute 200820
   */
  weaknessAmt?: number;
  /**
   * @attribute 200600
   */
  resistance?: PokemonType;
  /**
   * -20 or -30
   */
  resist?: number;
  /**
   * @default 0
   * @attribute 200800
   */
  retreat?: number;

  /** @attribute 200740 */
  abilities?: PokemonAbilityDefinition[];
  attacks?: PokemonAttackDefinition[];
}

export interface TrainerCardDefinition extends CardDefinition {
  /** @attribute 200300 */
  text?: string;
  /**
   * Z Crystal item cards offer new attacks when attached.
   * @attribute 200740
   */
  attacks?: PokemonAttackDefinition[];
}

export interface EnergyCardDefinition extends CardDefinition {
  /** @attribute 200300 */
  text?: string;
  /**
   * Energy this card provides
   * @attribute 200970
   */
  energy?: PokemonType[];
}

/**
 * Gameplay and avatar items
 */
export interface ProductDefinition extends ItemDefinition {
  /**
   * Unique assetid. Not set for boosters or prerelease packs
   */
  asset?: string;
}

export interface GameplayItemDefinition extends ProductDefinition {
  description?: string;
}

export interface PackDefinition extends GameplayItemDefinition {
  cards?: number;
}

export interface AvatarItemDefinition extends ProductDefinition {}

export interface ExpansionDefinition {
  code: string;
  series: typeof PTCGOSeries[number];
  name: string;
  cards: number;
  secret: number;
  formats: Format;
  /** Unix timestamp */
  legal: number;
  /** @see ExpansionFlags */
  flags: number;
  /** New Trainer Kits (TK10A and TK10B - Lycanroc & Alolan-Raichu) have holes in their collection numbers that are meant to be energy. They decided to reuse the energy. */
  holes?: number[];
}
