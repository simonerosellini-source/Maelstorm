// Character Types for D&D 5e RPG

export enum AbilityScore {
  STRENGTH = 'strength',
  DEXTERITY = 'dexterity',
  CONSTITUTION = 'constitution',
  INTELLIGENCE = 'intelligence',
  WISDOM = 'wisdom',
  CHARISMA = 'charisma',
}

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface AbilityModifiers {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export enum CharacterClass {
  BARBARIAN = 'barbarian',
  BARD = 'bard',
  CLERIC = 'cleric',
  DRUID = 'druid',
  FIGHTER = 'fighter',
  MONK = 'monk',
  PALADIN = 'paladin',
  RANGER = 'ranger',
  ROGUE = 'rogue',
  SORCERER = 'sorcerer',
  WARLOCK = 'warlock',
  WIZARD = 'wizard',
}

export enum Race {
  HUMAN = 'human',
  HIGH_ELF = 'high_elf',
  WOOD_ELF = 'wood_elf',
  DARK_ELF = 'dark_elf',
  MOUNTAIN_DWARF = 'mountain_dwarf',
  HILL_DWARF = 'hill_dwarf',
  LIGHTFOOT_HALFLING = 'lightfoot_halfling',
  STOUT_HALFLING = 'stout_halfling',
  DRAGONBORN = 'dragonborn',
  ROCK_GNOME = 'rock_gnome',
  FOREST_GNOME = 'forest_gnome',
  HALF_ELF = 'half_elf',
  HALF_ORC = 'half_orc',
  TIEFLING = 'tiefling',
  AARAKOCRA = 'aarakocra',
  GENASI_FIRE = 'genasi_fire',
  GENASI_WATER = 'genasi_water',
  GENASI_AIR = 'genasi_air',
  GENASI_EARTH = 'genasi_earth',
  GOLIATH = 'goliath',
  TABAXI = 'tabaxi',
  TRITON = 'triton',
}

export enum Skill {
  ACROBATICS = 'acrobatics',
  ANIMAL_HANDLING = 'animal_handling',
  ARCANA = 'arcana',
  ATHLETICS = 'athletics',
  DECEPTION = 'deception',
  HISTORY = 'history',
  INSIGHT = 'insight',
  INTIMIDATION = 'intimidation',
  INVESTIGATION = 'investigation',
  MEDICINE = 'medicine',
  NATURE = 'nature',
  PERCEPTION = 'perception',
  PERFORMANCE = 'performance',
  PERSUASION = 'persuasion',
  RELIGION = 'religion',
  SLEIGHT_OF_HAND = 'sleight_of_hand',
  STEALTH = 'stealth',
  SURVIVAL = 'survival',
}

export enum Condition {
  BLINDED = 'blinded',
  CHARMED = 'charmed',
  DEAFENED = 'deafened',
  FRIGHTENED = 'frightened',
  GRAPPLED = 'grappled',
  INCAPACITATED = 'incapacitated',
  INVISIBLE = 'invisible',
  PARALYZED = 'paralyzed',
  PETRIFIED = 'petrified',
  POISONED = 'poisoned',
  PRONE = 'prone',
  RESTRAINED = 'restrained',
  STUNNED = 'stunned',
  UNCONSCIOUS = 'unconscious',
}

export interface RacialTrait {
  name: string;
  description: string;
}

export interface RaceData {
  id: Race;
  name: string;
  abilityBonuses: Partial<AbilityScores>;
  speed: number;
  size: 'Small' | 'Medium' | 'Large';
  languages: string[];
  traits: RacialTrait[];
  darkvision?: number;
}

export enum HitDie {
  D6 = 6,
  D8 = 8,
  D10 = 10,
  D12 = 12,
}

export interface ClassFeature {
  name: string;
  description: string;
  level: number;
}

export interface ClassData {
  id: CharacterClass;
  name: string;
  hitDie: HitDie;
  primaryAbility: AbilityScore[];
  savingThrows: AbilityScore[];
  skillChoices: number;
  availableSkills: Skill[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  startingEquipment: string[];
  features: ClassFeature[];
  subclasses: string[];
  spellcaster?: {
    ability: AbilityScore;
    cantripsKnown: number[];
    spellsKnown?: number[];
    spellSlots: number[][];
  };
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  race: Race;
  class: CharacterClass;
  subclass?: string;
  level: number;
  experience: number;

  abilityScores: AbilityScores;
  abilityModifiers: AbilityModifiers;

  maxHitPoints: number;
  currentHitPoints: number;
  temporaryHitPoints: number;

  armorClass: number;
  initiative: number;
  speed: number;
  proficiencyBonus: number;

  skills: Partial<Record<Skill, boolean>>;
  savingThrows: Partial<Record<AbilityScore, boolean>>;

  conditions: Condition[];

  inventory: string[];
  equippedItems: {
    head?: string;
    body?: string;
    hands?: string;
    feet?: string;
    mainHand?: string;
    offHand?: string;
    ring1?: string;
    ring2?: string;
    accessory?: string;
  };

  knownSpells: string[];
  preparedSpells: string[];
  spellSlots: number[];
  usedSpellSlots: number[];

  gold: number;

  partyId?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterCreationData {
  name: string;
  race: Race;
  class: CharacterClass;
  abilityScores: AbilityScores;
  skills: Skill[];
  backstory?: string;
}
