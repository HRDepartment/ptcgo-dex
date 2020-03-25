import { Rarity } from './defs';

// Attributes from the PTCGO client
// These enums, consts, and interfaces are only useful to you if you are interacting with the PTCGO protobuf schema.
// pie-src.dll > Cake.enums

export enum ArchetypeAttribute {
  GUID = 10000, // GUID
  /** If this does not start with `$$$` or equals `$$$$$$`, this is an internal item (skip it) */
  Name = 10140, // LocalizableText
  RegionCode = 10300, // String: One of ('BR', 'DE', 'ES', 'EN', 'PTBR', 'FR', 'IT'), used for localized Champion's Festivals as well as special 10 card packs for Brazil between BW1-XY5
  /**
   * Release key, e.g. 'BW1', 'Promo_HGSS', 'NoSet'
   * @type string
   */
  ReleaseCode = 200580,
  RulesText = 200310, // LocalizableText
  SetNumber = 10190, // Int?
  /**
   * JSON list of the preconstructed theme decks this card is part of.
   * The use of this field was apparently discontinued prior to the Sun & Moon set. It’s set on cards from HGSS1 through Promo_SM, excluding SM1 and beyond.
   * @type string[]
   * @obsolete
   */
  ContainedInDecks = 201730,
  /**
   * Unix time (in milliseconds) when this promotional card becomes tournament legal.
   * It is not used by the PTCGO game client, but very likely is by the server.
   *
   * Not always consistently set for non-expansion cards.
   * @type number
   * @unused
   */
  LegalityDate = 202110,
  /**
   * Unix ms timestamp when this item was added. Randomly set for some pre-SM4 cards and products. From SM4 onward, this number is accurate.
   * @type number
   * @unused
   */
  DateAdded = 202220,
  /**
   * @type Attribute_BoosterDistribution[]
   */
  BoosterDistribution = 202250,
  RegulationMark = 200872, // String, set on SWSH1 onward. One of ('D') - same as the code printed on the physical card
  CollectionNumber = 200780, // Int?
  FancyCollectionNumber = 200790, // String; this is an override called 'Fancy Collection Number' used for Red Star Promos AND YellowA's
  /**
   * For cards:
   * std | ph | op | yaa | pcd | alt | ref
   *
   * For products (gameplay & avatar):
   * asset name
   * If this starts with `MonthlyNewsletter_`, ends with `NewsletterBundle`, skip this item
   *
   * @type string
   * @unused
   */
  AssetClass = 200871,
  OriginalPrintID = 201710, // Uuid
  PokemonTeams = 200360, // PokemonTeams[]
  FoilMask = 200620, // FoilMask
  FoilEffect = 200610, // FoilEffect
  AdditionalFoilEffects = 200611, // FoilEffect[]
  /**
   * All Attribute_Rarity.RareUltra cards are Full Art. This bool is also set to true for FA promos, Secret Rares, and all GXs/V(max) cards (but not Legends).
   * @type bool
   */
  IsFullArt = 201000, // Bool
  Rarity = 200550,
  IsLeague = 200400, // Bool
  CardCode = 200630, // String
  CardType = 200300,
  PokemonStage = 200540,
  IsLEGEND = 201030, // Bool;
  ProductType = 10540, // ProductType
  /**
   * Used by Bundles. One of: ThemeDeck, Tin, Promo (if IsMCDPromo - 201414 is true)
   * If this is set to 'ThemeDeck', the client sees the ProductType as `Decks` instead
   * @type string
   */
  UnlockProductType = 201507,
  NumberOfCardsInBooster = 10200, // Int
  ImageName1 = 10510, // String
  AssetPath = 10020, // String
  /**
   * For bundles, the theme deck or deckbox this item unlocks
   * @type string
   */
  UnlockedItem = 201270,
  Hidden = 10090, // Bool
  ValidForTrade = 10640,
  /**
   * If set, this Pokemon is a GX
   * @type AbilityID[]
   */
  GXAbilities = 202120,
  ItemTags = 202200, // String[] see below
  // IsSecretRareOverride = 201020, // boolean
  CurrencyType_RealCurrency = 2012906479, // Set to 1 (int) if this item is CurrencyType.RealCurrency (Gems)
  CurrencyType_EventTickets = -605044899, // Set to 1 (int) if this item is CurrencyType.EventTickets (Tournament Tickets)
  IsPokemonEX = 201010, // Boolean
  Abilities = 200740, // Array<{title: string, gameText: string, abilityID: uuid, abilityType: AbilityType, sortOrder: int, buttonOverride: string, bonusInfo: {originalOwnerTypes: PokemonType[]}}>
  RetreatCost = 200800, // Int
  TrainerType = 200270,
  IsSpecialEnergy = 200970,
  /**
   * @type LocalizableText
   */
  PreviousEvolution = 200280,
  FoilIntensity = 202080, // Int: 1 | 3 | 5 | 8 | 15 | 200 | 201
  FamilyID = 200260, // Int, PokemonFamily
  PokemonBurnAmount = 200430, // Int, 20
  HP = 200490, // Int
  Types = 200570, // PokemonType[] up to 2 entries
  Weaknesses = 200590, // PokemonType[],
  Resistence = 200600, // PokemonType[],
  EvolvesFromCardCode = 200640,
  ResistanceOp = 200650, // '-'
  WeaknessOp = 200660, // 'x' | '+'
  WeaknessAmount = 200820, // 0 | 2 | 10 (null, 2x, +10)
  ResistanceAmount = 200830, // 0 | 20 (null, -20)
  NumberPokeTools = 201610, // Int, 2 if Double trait from Ancient Origins
  PokeToolText = 200200, // LocalizableText
  EnergyProvided = 201040, // JSON, {options: PokemonType[]}
  ProductDescription = 10060, // LocalizableText
  /**
   * Is this deck a 'Basic' (BW/HGSS/XY) deck? Always skip these items.
   * @type bool
   */
  IsTCDeck = 201280,
  /**
   * Set for McDonald's promo items. Can be skipped.
   * @type bool
   */
  IsMCDPromo = 201414,
  GroupedWith = 200670, // UUID, what other item is this item 'grouped' with? Leftover attribute that is used on two deck bundles from XY7 to point to their coin
  BundleReleaseDate = 201370, // Int, but should be casted to a string (example: 20151021 -> '2015-10-21')
  ProductStoreSKU = 201640, // UUID, used to indicate this product was (or still is) at some point in the in-game store.
  /**
   * @type PokemonType
   */
  DeckBoxTypeA = 201250,
  /**
   * @type PokemonType
   */
  DeckBoxTypeB = 201260,
  /**
   * RGB vector color, e.g. '(0.90, 0.63, 0.00)' = rgb(229, 160, 0)
   * @type string
   */
  DeckBoxColorA = 201930,
  /**
   * RGB vector color, e.g. '(0.90, 0.63, 0.00)' = rgb(229, 160, 0)
   * @type string
   */
  DeckBoxColorB = 201940,
  /**
   * One of the two components of a 'composite' deckbox such as "LightningGrassDeckBox".
   * For 10410 = "$$$product.gameplay.LightningGrassDeckBox$$$",
   * 10510 would be "LightningDeckBox", 200871 would be "LightningGrassDeckBox", 201941 would be "GrassDeckBox"
   * @type string
   */
  CompositeDeckBoxComponentB = 201941,
  /**
   * Asset identifier of this coin's back side.
   * @type string
   */
  CoinBackImageName = 201890,
  // Unused, but provided for completeness as they are leftover (randomly & inconsistently set) in the set data
  /**
   * Present on some DV, HGSS1, and XY7 cards
   * If this is set, it means the rarity (200550) of the card is wrong and needs to be handled manually to perfectly display the card.
   * However, for filtering, PTCGO continue to uses `Rarity`. The card is rendered differently uniquely based on the set.
   *
   * DV cards: rarity icon is supposed to be hidden, but displayed in text as Rare Holo (https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/bw-series/dv1/1/ https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/bw-series/dv1/16/)
   * HGSS1 Gyarados cards: rarity icon is supposed to be Rare, but displayed in text as RareHolo (https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/hgss-series/hgss1/123/)
   * XY7 Primals & Mega Rayquaza: rarity icon is supposed to be RareHoloEX, but displayed in text as RareHolo (https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/xy-series/xy7/96/ https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/xy-series/xy7/97/ https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/xy-series/xy7/98/)
   * @type Attributes_Rarity
   * @unused
   */
  RarityOverride = 200560,
  /**
   * If this is set to `true`, this card is guaranteed to have an alternate print. Not set on many cards.
   */
  HasAlternatePrint = 200520, // Bool
  _UnusedLeftoverFossilBase = 201750, // String
  _UnusedLeftoverIsDeckBoxNotFromTin = 202060, // Bool; set to true for deckboxes that do not originate from tins, otherwise set to `false` explicitly
  _UnusedLeftoverIsFreeGameplayItem = 200950, // Bool; set to true on (free) colored deckboxes as well as two free sleeves. some additional items have this set to `false` explicitly for no reason

  _UnusedLeftoverInitialReleaseDate = 201620, // Int Shows up on erratas/reprints whose legality date was renewed (this attr refers to the initial date)
  _UnusedLeftoverIsHGSS3Defender = 201970, // Bool

  // Avatar items
  // Previous versions of 200890
  /**
   * @enum 'Bottoms' | 'Hats' | 'Face' | 'Tops' | 'Accessories' | 'Footware' | 'Shoes'
   * @type string
   */
  _UnusedLeftoverAvatarGroup = 200960,
  /**
   * TODO: Investigate if the meaning is different
   * @enum 'Bottoms' | 'Hats' | 'Face' | 'Tops' | 'Accessories' | 'Shoes' | 'Footware'
   * @type string
   */
  _UnusedLeftoverAvatarGroup2 = 200250,
  /**
   * Unique ID (int) for this avatar item. Starts with 300. Meaning unclear.
   * @type number
   * @unused
   */
  _todoAvatarNumber = 200220,
  /**
   * @enum "na" | "pikachupokeballf" | "charizardgreatballf" | "charizardgreatballm" | "donphanm" | "donphanf" | "pikachuclubf" | "charizardcosplayf" | "pikachucommonm" | "charizardbowlingf" | "teamflarepackm" | "liepardm" | "charizardcommonm" | "yachtf" | "pikachuathleticm" | "charizardcommonf" | "charizardbowlingm" | "charizardsilhouettem" | "zoroarkf" | "pikachucommonf" | "zoroarkm" | "pikachusilhouettem" | "pikachuathleticf" | "pikachucosplayf" | "pikachupokeballm" | "firem" | "yachtm" | "charizardmotof" | "charizardcosplaym" | "pikachusilhouettef" | "charizardmotom" | "pikachuclubm" | "teamflarepackf" | "charizardsilhouettef" | "firef" | "pikachucosplaym" | "liepardf"
   * @type string
   */
  _todoAvatarLocalizableText = 200880,
  /**
   * TODO: Investigate
   * If set, always true
   * @type bool
   */
  _UnusedLeftoverAvatarAttribute1 = 200950,
  /**
   * Does not have a value. Every avatar item appears to have this set.
   * @unused
   */
  _UnusedLeftoverAvatarAttribute2 = 200910,
  /**
   * Always the same as attribute 200871. Set on all avatar items.
   * @example MRayquazaMegaPants
   * @type string (JSON in protobuf)
   */
  _UnusedLeftoverDuplicateAvatarImageName = 200930,
  /**
   * Always set to 'ZZ'. Set on all avatar items.
   * @type string
   */
  _UnusedLeftoverZZ = 200480,
  /**
   * Seemingly random number between 1-2000. Not set on all avatar items.
   */
  _todoAvatarLocalizableTextInt = 200215,
  /**
   * Unix second timestamp (day resolution)
   * @type string
   */
  AvatarAddedAtDate = 10560,
  /**
   * @type Attribute_Avatar_Group
   */
  AvatarItemGroup = 200890,
  /**
   * Deck this avatar item is a part of (but in the code, refers to sleeves?)
   * @type UUID
   */
  AvatarDeckIsAPartOf = 200940,
  /**
   * Set on most avatar items to `true`
   * @type bool
   */
  _todoAvatarBool = 10490,
  /**
   * Used for avatar items
   * @type Attribute_GenderType
   */
  GenderType = 10220,
  /**
   * @enum 'Unassigned' | 'Common' | 'Very Rare' | 'Rare' | 'Uncommon'
   * @type string (JSON in protobuf)
   */
  AvatarRarity = 200900,
  /**
   * Set to `'UNSET'` for all avatar items
   * @type string (JSON in protobuf)
   */
  _UnusedLeftoverAvatarUNSET = 200920,
}

// An item is Foil if it has a FoilMask OR FoilEffect
// An item is a Bundle Pack if its ProductType = Bundles, or if its ProductType = Packs and its image name contains 'Bundle'
// An item's ImageName is its (ImageName1 || ImageName2)
// An item is a Secret Rare if its rarity is RareSecret, RareRainbow, or has tag IsSecretRareOverride
// An item is a Basic Energy if its CardType is Energy and IsSpecialEnergy is false/null
// An item is a MEGA EVOLUTION if it is IsPokemonEX and its PokemonStage is Stage1

export type Attribute_Issue = 'std' | 'op' | 'yaa' | 'ph' | 'pcd' | 'alt' | 'ref';
export type Attribute_ItemTags =
  | 'ShinyPokemon'
  | 'UltraBeast'
  | 'YellowA'
  | 'TAG'
  | 'League'
  | 'PrismStar'
  | 'V';
// #region Not in Cake.enums
/** Starts with $$$ and ends with $$$. The text inbetween is a translation string. */
export type LocalizableText = string;
export enum Attribute_AbilityType {
  Attack,
  /** @unused */
  NonDamagingAttack,
  PokeAbility,
  PokePower,
  PokeBody,
  /** @unused */
  TechnicalMachine,
  /** Special Energy */
  EnergyAbility,
  /** Play this Stadium */
  StadiumAbility,
  /** @unused */
  TrainerAbility,
  /** Ancient Trait */
  AncientTrait,
  /** Internal */
  PlayAbility,
  /** @unused */
  RetreatAbility,
}

export enum Attribute_PokemonType {
  NoColor = 0,
  Colorless = 1,
  Darkness = 2,
  Dragon = 3,
  Fairy = 4,
  Fighting = 5,
  Fire = 6,
  Grass = 7,
  Lightning = 8,
  Metal = 9,
  Psychic = 10,
  Water = 11,
  /** @unused */
  Strong = 12,
  /** @unused */
  Herbal = 13,
}

export interface Attribute_Ability {
  cost: { [type: string]: number };
  damage: number;
  title: LocalizableText;
  gameText: LocalizableText;
  abilityID: string;
  amountOperator: '+' | 'x' | '';
  abilityType: keyof typeof Attribute_AbilityType;
  /** Always empty */
  conditionExceptions: string[];
  /** Always empty */
  costPrefixes: string[];
  /** Used to indicate an additional optional cost leading to an extra effect (currently just Tag Team GX attacks) */
  costSuffixes: Array<'iconPlus'>;
  /** Overrides sort order */
  sortOrder?: number;
  /** @default false */
  ignoreInFiltering?: boolean;
}

/**
 * Ordering of attack costs, as is shown on the cards.
 * (a, b) => Attribute_Ability_Cost_Order.indexOf(a) - Attribute_Ability_Cost_Order.indexOf(b)
 */
export const Attribute_Ability_Cost_Order = [
  Attribute_PokemonType.Grass,
  Attribute_PokemonType.Fire,
  Attribute_PokemonType.Water,
  Attribute_PokemonType.Lightning,
  Attribute_PokemonType.Psychic,
  Attribute_PokemonType.Fighting,
  Attribute_PokemonType.Darkness,
  Attribute_PokemonType.Metal,
  Attribute_PokemonType.Fairy,
  Attribute_PokemonType.Dragon,
  Attribute_PokemonType.NoColor,
  Attribute_PokemonType.Colorless,
];

export enum Attribute_CurrencyType {
  None = 0,
  EventTickets = -605044899,
  VirtualCurrency = -706482148, // Unused
  RealCurrency = 2012906479,
}
export interface Attribute_BoosterDistribution {
  rarityIcon: Rarity;
  rarityName: LocalizableText;
  count: number; // 1 - 5
}

// Avatar items
export enum Attribute_Avatar_Group {
  UNSET = -1,
  Eyes,
  Eyebrows,
  Face,
  Face_prop,
  face_makeup,
  Facial_hair,
  Hair,
  Hat,
  Jacket,
  Trousers,
  Mouth,
  Nose,
  Shirt,
  Shoes,
  Shape,
  Skin_color,
}
// #endregion

export enum Attribute_GenderType {
  Female = 0,
  Male = 1,
  Neuter = 2,
  Unknown = 3,
  UNSET = -1,
}

export enum Attribute_CardType {
  Pokemon = 0,
  LegendHalf = 1,
  TrainerCard = 2,
  Energy = 3,
}

export enum Attribute_FoilEffect {
  None = 0,
  Cosmos = 1,
  Galaxy = 2,
  Rainbow = 3,
  Cracked_Ice = 4,
  Lithograph = 5,
  Tinsel = 6,
  FlatSilver = 7,
  Etched = 8,
  EtchedSunPillar = 9,
  AngledPillars = 10,
  Squares = 11,
  SunLava = 12,
  SunPillar = 13,
  SunBeam = 14,
  SolgaleoEtch = 15,
  LunalaEtch = 16,
  XYEtch = 17,
  BWEtch = 18,
  TapuFiniEtch = 19,
  TapuBuluEtch = 20,
  TapuKokoEtch = 21,
  TapuLeleEtch = 22,
  SolgaleoHFEtch = 23,
  LunalaHFEtch = 24,
  SwHolo = 25,
  SwSecret = 26,
}
export enum Attribute_FoilMasks {
  None = 0,
  Holo = 1,
  Reverse = 2,
  Thatch = 3,
  Etched = 4,
}

export enum Attribute_PokemonStage {
  Basic = 0,
  Stage1 = 1,
  Stage2 = 2,
  Restored = 3,
  /** Unused (DP-era) */
  LevelUp = 4,
  Legend = 5,
  Break = 6,
  VMAX = 7,
}

export enum Attribute_PokemonTeam {
  TeamPlasma = 0,
  TeamFlare = 1,
  // Parsed to TeamFlare
  HyperGear = 2,
  TeamAqua = 3,
  TeamMagma = 4,
}

/**
 * Of these, only `Bundles`, `Coins`, `DeckBox`, `Decks`, `Item`, `Miscellaneous`, `Packs`, and `Sleeve` exist.
 * `Currency`, `Proofset`, and `Singles` also exist, but are internal items you should ignore when parsing.
 *
 * @attribute 10540
 * @attribute 201507
 */
export enum Attribute_ProductType {
  /** @unused */
  Avatars = 0,
  /** Used for items from AllAvatarArchetypesFound */
  AvatarItems = 1,
  /** @unused */
  AvatarProducts = 2,
  /** Present in nearly every set */
  Bundles = 3,
  /** @unused */
  Campaigns = 4,
  /** Coins */
  Coins = 5,
  /** Currencies; users don't own this as an item, always items with this ProductType */
  Currency = 6,
  /** @unused */
  CurrencyTransfer = 8,
  /** Exclusive to NoSet */
  DeckBox = 11,
  /** Present in nearly every set */
  Decks = 12,
  /** @unused */
  DraftEntry = 13,
  /** @unused */
  Extras = 0xf,
  /** @unused */
  FactionPacks = 0x10,
  /** @unused */
  Gifts = 17,
  /** @unused */
  Investment = 18,
  /** Item cards, only present in sets (not in NoSet) */
  Item = 19,
  /** Tins, various types of boxes, internal items (Newsletter promos); should be parsed as a `Bundle` except for Newsletter promos which should be skipped */
  Miscellaneous = 20,
  /** Boosters, Treasure Chests, and Avatar Boxes */
  Packs = 21,
  /** @unused */
  Playmat = 22,
  /** @unused */
  Powerups = 23,
  /** Internal item used for avatar collections, always skip items with this ProductType */
  Proofset = 24,
  /** @unused */
  Resources = 25,
  /** XY3 singles (Booster, Korrina, M-Lucario EX). These items are likely internal, so it's recommended to skip them */
  Singles = 26,
  /** Exclusive to NoSet */
  Sleeve = 27,
  /** @unused */
  TournamentEntry = 28,
  /** @unused */
  WorkshopRecipe = 30,
  /** @unused */
  ExternalProduct = 14,
  /** @unused */
  CustomProduct = 7,
  /** @unused */
  Collectibles = 9,
  /** @unused */
  CollectibleBases = 10,
}

/** Attribute 200550 and 200560 */
export enum Attribute_Rarity {
  Common = 0,
  Uncommon = 1,
  Rare = 2,
  RareHolo = 3,
  RareHoloEX = 4,
  RareHoloGX = 5,
  RareHoloV = 6,
  RareHoloVMAX = 7,
  RarePrime = 8,
  /** LEGEND */
  Legendary = 9,
  Ace = 10,
  RareUltra = 11,
  RareSecret = 12,
  RareRainbow = 13,
  /** @unused */
  DisplayNone = 14,
  /** Coin */
  medium = 0xf,
  /** PTCGO exclusive (such as Worlds items & type coins) */
  PromoExclusive = 0x10,
  RarePromo = 17,
  /** @unused */
  Token = 18,
  /** @unused */
  ExtraRare = 19,
  /** @unused */
  VeryRare = 20,
  /** @unused */
  Unassigned = 21,
  BreakRare = 22,
  Shining = 23,
  Prism = 24,
}

export enum Attribute_TrainerType {
  Item = 0,
  Stadium = 1,
  Supporter = 2,
  /** @unused */
  TechnicalMachine = 3,
  PokemonTool = 4,
  /** Used for Flare tools; consider this the same as PokemonTool */
  PokemonToolF = 5,
  /** @unused */
  Trainer = 6,
}
