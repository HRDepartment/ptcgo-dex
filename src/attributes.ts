import { Rarity } from './defs';

// Attributes from the PTCGO client
// These enums, consts, and interfaces are only useful to you if you are interacting with the PTCGO protobuf schema.
// pie-src.dll > Cake.enums

export enum ArchetypeAttribute {
  AbilityDescriptions = 200740, // object[]
  AccountGuildID = 10430, // string
  AccountIDAttribute = 200170, // AccountID
  AccountLastLogoutTime = 10380, // long?
  AccountLevel = 10420, // int?
  AccountLevelXP = 10400, // int?
  AccountMissionStatus = 10730, // Dictionary<string, string>
  AccountPreviousLevelXP = 10410, // int?
  AccountSettings = 10230, // Dictionary<int, int>
  AccountXP = 10390, // int?
  AceSpecText = 200190, // LocalizableText
  Administrator = 10240, // bool?
  AdvancedModeOnly = 200770, // bool?
  ArchID = 10000, // ArchetypeID
  MustFlipToPlayTrainer = 201760, // bool?
  AsleepCoinFlips = 201720, // int?
  /**
   * Always set to 'ZZ'. Set on all avatar items.
   * @type string
   */
  AvailabilityZone = 200480, // string
  AvailableInBooster = 200870, // bool?
  /**
   * Unix second timestamp (day resolution)
   * @type string
   */
  AvailableOnDate = 10560, // long?
  /**
   * @enum "na" | "pikachupokeballf" | "charizardgreatballf" | "charizardgreatballm" | "donphanm" | "donphanf" | "pikachuclubf" | "charizardcosplayf" | "pikachucommonm" | "charizardbowlingf" | "teamflarepackm" | "liepardm" | "charizardcommonm" | "yachtf" | "pikachuathleticm" | "charizardcommonf" | "charizardbowlingm" | "charizardsilhouettem" | "zoroarkf" | "pikachucommonf" | "zoroarkm" | "pikachusilhouettem" | "pikachuathleticf" | "pikachucosplayf" | "pikachupokeballm" | "firem" | "yachtm" | "charizardmotof" | "charizardcosplaym" | "pikachusilhouettef" | "charizardmotom" | "pikachuclubm" | "teamflarepackf" | "charizardsilhouettef" | "firef" | "pikachucosplaym" | "liepardf"
   * @type string
   */
  AvatarCollection = 200880, // LocalizableText
  AvatarDefaultDeck = 201310, // bool?
  /**
   * @type Attribute_Avatar_Group
   */
  AvatarGroup = 200890, // LocalizableText
  /**
   * @enum 'Unassigned' | 'Common' | 'Very Rare' | 'Rare' | 'Uncommon'
   * @type string (JSON in protobuf)
   */
  AvatarItemRarity = 200900, // LocalizableText
  AvatarItemsDeck = 201300, // bool?
  AvatarLastSavedTimestamp = 200015, // long?
  /**
   * Does not have a value. Every avatar item appears to have this set.
   * @unused
   */
  AvatarPortrait = 200910, // bool?
  AvatarHairHasBack = 201740, // bool?
  Banned = 10250, // bool?
  Birthdate = 10290, // string
  BoosterCred = -306945826, // int?
  BundleIDs = 201505, // ArchetypeID[]
  BurnAmount = 200430, // int?
  BurnBonus = 200440, // int?
  CASID = 200000, // string
  Campaign = 10010, // ScenarioID
  CampaignMapImage = 201460, // string
  CampaignPreviewImage = 201450, // string
  CanEvolve = 201200, // bool?
  CanTrade = 10260, // bool?
  CannotCloneDeck = 10940, // bool?
  CannotDeleteDeck = 10750, // bool?
  CannotEditDeck = 10760, // bool?
  CannotRenameDeck = 10930, // bool?
  CardImage = 10020, // string
  CardName = 200630, // string
  CardNumber = 10030, // int?
  CardType = 200300, // CardTypes?
  Catalog = 10280, // bool?
  CatalogID = 10570, // string
  Category = 200250, // LocalizableText
  ChessClockRate = 201100, // float?
  /**
   * Set to `'UNSET'` for all avatar items
   * @type string (JSON in protobuf)
   */
  Clear = 200920, // LocalizableText
  ClientStartsMission = 10440, // bool?
  /**
   * Always the same as attribute 200871. Set on all avatar items.
   * @example MRayquazaMegaPants
   * @type string (JSON in protobuf)
   */
  Clip = 200930, // LocalizableText
  Coin = 200670, // ArchetypeID
  CoinFlipOverride = 201220, // int?
  CollectionNumber = 200780, // int?
  /**
   * this is an override called 'Fancy Collection Number' used for Red Star Promos AND YellowA's
   */
  CollectionNumberDisplay = 200790, // string
  CombatDamageTaken = 200510, // int?
  CombatKillOccurred = 201210, // EntityID[]
  CompletePCDs = 201490, // string[]
  CompletionRequirements = 10040, // object[]
  /**
   * JSON list of the preconstructed theme decks this card is part of.
   * The use of this field was apparently discontinued prior to the Sun & Moon set. It’s set on cards from HGSS1 through Promo_SM, excluding SM1 and beyond.
   * @type string[]
   * @obsolete
   */
  ContainedInDecks = 201730, // string[]
  /**
   * One of ('BR', 'DE', 'ES', 'EN', 'PTBR', 'FR', 'IT'), used for localized Champion's Festivals as well as special 10 card packs for Brazil between BW1-XY5
   */
  CountryCode = 10300, // string
  CustomNumber = 10050, // int?
  DeathRedirect = 200500, // EntityID
  DeckArchetypeList = 10830, // ArchetypeID[]
  DeckBox = 200690, // ArchetypeID
  DeckColor1 = 201250, // string
  DeckColor2 = 201260, // string
  DeckDefinitionID = 10820, // DeckID
  DeckEntryID = 10770, // string
  DeckGamesPlayed = 201590, // int?
  DeckGamesPlayedSinceEdit = 201650, // int?
  DeckGamesWon = 201600, // int?
  DeckGamesWonSinceEdit = 201660, // int?
  /**
   * For bundles, the theme deck or deckbox this item unlocks
   * @type string
   */
  DeckImage = 201270, // string
  DeckName = 10800, // LocalizableText
  DeckTags = 10910, // string[]
  DeckUnlockHistory = 201400, // object[]
  DeckUnlockType = 10810, // string
  DeckVersion = 10780, // int?
  /**
   * Deck this avatar item is a part of (but in the code, refers to sleeves?)
   * @type UUID
   */
  DefaultAvatarItem = 200940, // bool?
  DeliverableType = 10700, // ItemTypes?
  Description = 10060, // LocalizableText
  DisabledAttacks = 200750, // AbilityID[]
  DisplayArchetype = 10070, // ArchetypeID
  Email = 10310, // string
  EndOfEvolutionChain = 201690, // bool?
  /**
   * JSON, {options: PokemonType[]}
   */
  EnergyProvided = 201040, // EnergyType
  EntryPacks = 10740, // ArchetypeID[]
  EntryRequirements = 10080, // object[]
  ErrataApplied = 201620, // long?
  EulaVersion = 10480, // int?
  EvolvesFrom = 200280, // LocalizableText
  EvolvesFromBasic = 200290, // int?
  EvolvesFromPokemon = 200640, // string
  ExtraEnergy = 201050, // Dictionary<PokemonTypes, int>
  Featured = 200390, // bool?
  FlavorText = 200320, // LocalizableText
  FoilEffect = 200610, // FoilEffects?
  FoilMask = 200620, // FoilMasks?
  Free = 200950, // bool?
  FriendChatMode = 201510, // string
  FriendList = 10320, // string[]
  FriendMode = 201520, // string
  FriendTradeMode = 201530, // string
  GameChatMode = 201540, // string
  GamePoints = 200120, // int?
  GameText = 200310, // LocalizableText
  Gems = 2215716, // int?
  /**
   * Used for avatar items
   * @type Attribute_GenderType
   */
  Gender = 10220, // GenderTypes?
  /**
   * Seemingly random number between 1-2000. Not set on all avatar items.
   */
  GenderMatch = 200215, // int?
  GreatestAttackDamageDealt = 200020, // int?
  GuestAccount = 200005, // bool?
  GuildMessage = 10880, // string
  HP = 200490, // int?
  HasRetreated = 201240, // bool?
  Height = 200230, // LocalizableText
  Hidden = 10090, // bool?
  IPAddress = 10460, // string
  Illustrator = 200460, // string
  ImageURL = 10510, // string
  InPlay = 10110, // bool?
  IntCardKey = 200210, // int?
  Interstitial = 201480, // string
  IsBase = 10120, // bool?
  IsDeleted = 10130, // bool?
  IsEXCard = 201010, // bool?
  /**
   * All Attribute_Rarity.RareUltra cards are Full Art. This bool is also set to true for FA promos, Secret Rares, and all GXs/V(max) cards (but not Legends).
   * @type bool
   */
  IsFullArt = 201000, // bool?
  IsLegend = 201030, // bool?
  IsNPC = 10620, // bool?
  IsOverflowFrame = 201630, // bool?
  IsSecret = 201020, // bool?
  IsTradable = 10640, // bool?
  IsTutorial = 10720, // bool?
  LastCollectionLossTime = 10470, // long?
  LastLoginDecksGranted = 200160, // ArchetypeID[]
  LastOpponentID = 200126, // AccountID
  LastPlayedTCLeague = 201390, // LocalizableText
  LastUniqueLoginDate = 200090, // long?
  LastUniquePVPDate = 200110, // long?
  LastUsedTCDeck = 201380, // DeckID
  LastValidatedDate = 10870, // long?
  LeagueScenariosScoreMap = 201350, // Dictionary<ScenarioID, int>
  LegendArchID = 200860, // ArchetypeID
  LegendBottomHalf = 201680, // EntityID
  LegendTopHalf = 201670, // EntityID
  Level = 10330, // int?
  LevelText = 200330, // LocalizableText
  LocalAddress = 10340, // string
  MatchmakingGames = 200140, // int?
  MatchmakingPrizesDrawn = 200150, // int?
  MatchmakingSkillRating = 200130, // float?
  MaximumNumberOfPurchases = 10580, // int?
  ModifiedGameTypeWhiteList = 200520, // bool?
  ModifiesAttributes = 10710, // object[]
  MustFlipToAttack = 201230, // bool?
  Mute = 10270, // bool?
  MuteLevel = 10275, // int?
  /** If this does not start with `$$$` or equals `$$$$$$`, this is an internal item (skip it) */
  Name = 10140, // LocalizableText
  NoNameChange = 10840, // bool?
  NumOfTimesBurn = 201130, // int?
  NumOfTimesConfuse = 201150, // int?
  NumOfTimesParalyze = 201160, // int?
  NumOfTimesPoison = 201120, // int?
  NumOfTimesSleep = 201140, // int?
  NumOfTrainersPlayed = 201170, // int?
  NumberOfCardsInBooster = 10200, // int?
  NumberOfGames = 10150, // int?
  NumberOfGamesLost = 10160, // int?
  OfferID = 201515, // string
  OnlineStatus = 10350, // bool?
  OriginalPrint = 201710, // ArchetypeID
  OutOfPlayTriggered = 200730, // AbilityID[]
  OutlineEffect = 200380, // bool?
  PCDBundleContains = 201640, // ArchetypeID
  ParalyzeDuration = 200450, // int?
  Parent = 10170, // string
  ParentEmail = 10315, // string
  PastScenariosMap = 201340, // Dictionary<ScenarioID, Tuple<DeckID, bool>[]>
  PauseClock = 10550, // int?
  Phase = 201180, // Phases?
  PlayAbilities = 200700, // AbilityID[]
  PlayedEnergy = 201060, // bool?
  PlayedStadiums = 201070, // int?
  PlayedSupporters = 201080, // int?
  PlayerLoseText = 201440, // LocalizableText
  PlayerNumber = 10530, // int?
  PlayerWinText = 201430, // LocalizableText
  PoisonAmount = 200410, // int?
  PoisonBonus = 200420, // int?
  PokeToolText = 200200, // LocalizableText
  PokemonFamily = 200260, // int?
  PokemonStages = 200540, // PokemonStage?
  PokemonToolMax = 201610, // int?
  PokemonType = 200570, // PokemonTypes[]
  PreloadedPackages = 201700, // PreloadedPackage[]
  PreventAttackDamageLessThan = 200850, // int?
  PreviousCollectionIDs = 10370, // string[]
  Price = 77381929, // IAttribute<int?>[]
  PrivateMessaging = 201580, // string
  PrizeValue = 200530, // int?
  ProductPrice = 1164969402, // Dictionary<ArchetypeID, int>
  ProductSortOrder = 10500, // int?
  ProductType = 10540, // ProductTypes?
  ProductURL = 10520, // string
  PromoOverlayText = 200400, // bool?
  PromoTournamentTicket = -992199324, // int?
  /**
   * Unique ID (int) for this avatar item. Starts with 300. Meaning unclear.
   * @type number
   * @unused
   */
  PrototypeId = 200220, // int?
  PublicChatMode = 201550, // string
  /**
   * Set on most avatar items to `true`
   * @type bool
   */
  Purchaseable = 10490, // bool?
  Rarity = 200550, // Rarities?
  RarityList = 200350, // string[]
  RealCurrencies = 201535, // Dictionary<string, float>
  RealCurrency = 2012906479, // int?
  ReleaseDate = 201370, // int?
  Reprints = 200990, // int[]
  Resistance = 200600, // PokemonTypes?
  /**
   *  0 | 20 (null, -20)
   */
  ResistanceAmount = 200830, // int?
  ResistanceOperator = 200650, // string
  ResponseAbilities = 200710, // AbilityID[]
  RestoredFromFossil = 201750, // string
  RetreatCost = 200800, // int?
  Rewards = 10630, // RewardDefinition[]
  RulesText = 200180, // LocalizableText
  RunOnce = 10100, // bool?
  RunOnceAbilities = 200760, // AbilityID[]
  ScenID = 10180, // ScenarioID
  ScenarioNumber = 201420, // int?
  ScheduledItemStatus = 10485, // Dictionary<string, int>
  ScreenName = 10360, // string
  ScreenNameStatus = 200003, // string
  /**
   * Release key, e.g. 'BW1', 'Promo_HGSS', 'NoSet'
   * @type string
   */
  Set = 200580, // string
  SetName = 201410, // LocalizableText
  SetNumber = 10190, // int?
  ShoppingMode = 201560, // string
  Sleeve = 200680, // ArchetypeID
  SlotPosition = 10920, // int?
  SniffingEnabled = 10450, // bool?
  SoliID = 10210, // SolitaireID
  SortBy = 200960, // LocalizableText
  SortNumber = 201360, // int?
  SpecialConditionsList = 200340, // SpecialConditions[]
  SpecialDmgModifier = 200840, // int?
  SpecialEnergy = 200970, // bool?
  SpecialVisualizationsList = 200370, // SpecialVisualization[]
  Species = 200810, // int?
  StarBurst = 201555, // string
  StoreRegion = 10900, // string
  SubRarity = 200560, // Rarities?
  SupportersMax = 201090, // int?
  SuppressEffectList = 200470, // SuppressEffects[]
  SuspendTimestamp = 200010, // long?
  Tags = 201545, // string[]
  TCOpponent = 201470, // object
  TCOpponentDeck = 201500, // object
  TeamList = 200360, // PokemonTeams[]
  TempInt = 10600, // int?
  TempTarget = 10590, // EntityID
  TempTargetList = 10610, // EntityID[]
  ThemeDeck = 201290, // bool?
  ThemeDeckVersion = 10790, // int?
  TicketCurrency = -605044899, // int?
  Timers = 10950, // NamedTimer[]
  Tokens = -1784319558, // int?
  TotalCardsDrawn = 200030, // int?
  TotalDamageDealt = 200040, // int?
  TotalDamageTaken = 200050, // int?
  TotalGameTime = 200080, // int?
  TotalGameUpsets = 200085, // int?
  TotalGamesPlayed = 200060, // int?
  TotalGamesWon = 200070, // int?
  TournamentPoints = 200125, // int?
  TournamentTicket = -698801547, // int?
  TradeMode = 201570, // string
  TrainerChallengeDeck = 201280, // bool?
  TrainerType = 200270, // TrainerTypes?
  TriggeredAbilities = 200720, // AbilityID[]
  TurnNumber = 201110, // int?
  TurnSummoned = 201190, // int?
  UniqueLoginDateCount = 200100, // int?
  UnlockMap = 10850, // Dictionary<int, ArchetypeID[]>
  UpgradeDeck = 201330, // DeckID
  ValidatedFor = 10860, // string[]
  VirtualCurrency = -706482148, // int?
  /**
   * 0 | 2 | 10 (null, 2x, +10)
   */
  WeaknessAmount = 200820, // int?
  WeaknessList = 200590, // PokemonTypes[]
  WeaknessOperator = 200660, // string
  Weight = 200240, // LocalizableText
  Worth = 200980, // LocalizableText

  // Unused (but present) attributes
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
   * Used by Bundles. One of: ThemeDeck, Tin, Promo (if IsMCDPromo - 201414 is true)
   * If this is set to 'ThemeDeck', the client sees the ProductType as `Decks` instead
   * @type string
   * @unused
   */
  UnlockProductType = 201507,
  // Appears to always be the same as UnlockProductType and always present at the same time
  UnlockProductType2 = 201508,
  /**
   * @type Attribute_BoosterDistribution[]
   */
  BoosterDistribution = 202250,
  RegulationMark = 200872, // String, set on SWSH1 onward. One of ('D') - same as the code printed on the physical card
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
  AdditionalFoilEffects = 200611, // FoilEffect[]
  /**
   * If set, this Pokemon is a GX
   * @type AbilityID[]
   * @unused
   */
  GXAbilities = 202120,
  ItemTags = 202200, // String[] see below
  FoilIntensity = 202080, // Int: 1 | 3 | 5 | 8 | 15 | 200 | 201
  /**
   * Set for McDonald's promo items. Can be skipped.
   * @type bool
   * @unused
   */
  IsMCDPromo = 201414,
  /**
   * RGB vector color, e.g. '(0.90, 0.63, 0.00)' = rgb(229, 160, 0)
   * @type string
   * @unused
   */
  DeckBoxColorA = 201930,
  /**
   * RGB vector color, e.g. '(0.90, 0.63, 0.00)' = rgb(229, 160, 0)
   * @type string
   * @unused
   */
  DeckBoxColorB = 201940,
  /**
   * One of the two components of a 'composite' deckbox such as "LightningGrassDeckBox".
   * For 10410 = "$$$product.gameplay.LightningGrassDeckBox$$$",
   * 10510 would be "LightningDeckBox", 200871 would be "LightningGrassDeckBox", 201941 would be "GrassDeckBox"
   * @type string
   * @unused
   */
  CompositeDeckBoxComponentB = 201941,
  /**
   * Asset identifier of this coin's back side.
   * @type string
   * @unused
   */
  CoinBackImageName = 201890,

  // Deprecated aliases
  GUID = ArchID,
  RegionCode = CountryCode,
  ReleaseCode = Set,
  FancyCollectionNumber = CollectionNumberDisplay,
  OriginalPrintID = OriginalPrint,
  PokemonTeams = TeamList, // PokemonTeams[]
  IsLeague = PromoOverlayText, // Bool
  CardCode = CardName, // String
  PokemonStage = PokemonStages,
  IsLEGEND = IsLegend, // Bool;
  ImageName1 = ImageURL, // String
  AssetPath = CardImage, // String
  UnlockedItem = DeckImage,
  ValidForTrade = IsTradable,
  CurrencyType_RealCurrency = RealCurrency, // Set to 1 (int) if this item is CurrencyType.RealCurrency (Gems)
  CurrencyType_EventTickets = TicketCurrency, // Set to 1 (int) if this item is CurrencyType.EventTickets (Tournament Tickets)
  IsPokemonEX = IsEXCard, // Boolean
  Abilities = AbilityDescriptions, // Array<{title: string, gameText: string, abilityID: uuid, abilityType: AbilityType, sortOrder: int, buttonOverride: string, bonusInfo: {originalOwnerTypes: PokemonType[]}}>
  IsSpecialEnergy = SpecialEnergy,
  /**
   * @type LocalizableText
   */
  PreviousEvolution = EvolvesFrom,
  FamilyID = PokemonFamily, // Int, PokemonFamily
  PokemonBurnAmount = BurnAmount, // Int, 20
  Types = PokemonType, // PokemonType[] up to 2 entries
  Weaknesses = WeaknessList, // PokemonType[],
  Resistence = Resistance, // PokemonType[],
  EvolvesFromCardCode = EvolvesFromPokemon,
  ResistanceOp = ResistanceOperator, // '-'
  WeaknessOp = WeaknessOperator, // 'x' | '+'
  NumberPokeTools = PokemonToolMax, // Int, 2 if Double trait from Ancient Origins
  ProductDescription = Description, // LocalizableText
  /**
   * Is this deck a 'Basic' (BW/HGSS/XY) deck? Always skip these items.
   * @type bool
   */
  IsTCDeck = TrainerChallengeDeck,
  GroupedWith = Coin, // UUID, what other item is this item 'grouped' with? Leftover attribute that is used on two deck bundles from XY7 to point to their coin
  BundleReleaseDate = ReleaseDate, // Int, but should be casted to a string (example: 20151021 -> '2015-10-21')
  ProductStoreSKU = PCDBundleContains,
  /**
   * @type PokemonType
   */
  DeckBoxTypeA = DeckColor1,
  /**
   * @type PokemonType
   */
  DeckBoxTypeB = DeckColor2,
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
  RarityOverride = SubRarity,
  /**
   * If this is set to `true`, this card is guaranteed to have an alternate print. Not set on many cards.
   */
  HasAlternatePrint = ModifiedGameTypeWhiteList, // Bool
  _UnusedLeftoverFossilBase = RestoredFromFossil, // String
  _UnusedLeftoverIsDeckBoxNotFromTin = 202060, // Bool; set to true for deckboxes that do not originate from tins, otherwise set to `false` explicitly
  _UnusedLeftoverIsFreeGameplayItem = Free, // Bool; set to true on (free) colored deckboxes as well as two free sleeves, and free avatar items. some additional items have this set to `false` explicitly for no reason

  _UnusedLeftoverInitialReleaseDate = ErrataApplied, // Int Shows up on erratas/reprints whose legality date was renewed (this attr refers to the initial date)
  _UnusedLeftoverIsHGSS3Defender = 201970, // Bool

  // Avatar items
  // Previous versions of 200890
  /**
   * @enum 'Bottoms' | 'Hats' | 'Face' | 'Tops' | 'Accessories' | 'Footware' | 'Shoes'
   * @type string
   */
  _UnusedLeftoverAvatarGroup = SortBy,
  /**
   * TODO: Investigate if the meaning is different
   * @enum 'Bottoms' | 'Hats' | 'Face' | 'Tops' | 'Accessories' | 'Shoes' | 'Footware'
   * @type string
   */
  _UnusedLeftoverAvatarGroup2 = Category,
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
