// Monster Types

import { AbilityScores, Skill, Condition } from './character';
import { DamageType } from './combat';

export enum MonsterType {
  ABERRATION = 'aberration',
  BEAST = 'beast',
  CELESTIAL = 'celestial',
  CONSTRUCT = 'construct',
  DRAGON = 'dragon',
  ELEMENTAL = 'elemental',
  FEY = 'fey',
  FIEND = 'fiend',
  GIANT = 'giant',
  HUMANOID = 'humanoid',
  MONSTROSITY = 'monstrosity',
  OOZE = 'ooze',
  PLANT = 'plant',
  UNDEAD = 'undead',
}

export enum MonsterSize {
  TINY = 'tiny',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  HUGE = 'huge',
  GARGANTUAN = 'gargantuan',
}

export enum Environment {
  ARCTIC = 'arctic',
  COAST = 'coast',
  DESERT = 'desert',
  FOREST = 'forest',
  GRASSLAND = 'grassland',
  MOUNTAIN = 'mountain',
  SWAMP = 'swamp',
  UNDERDARK = 'underdark',
  UNDERWATER = 'underwater',
  URBAN = 'urban',
  DUNGEON = 'dungeon',
}

export interface MonsterAction {
  name: string;
  description: string;
  attackBonus?: number;
  damage?: string;
  damageType?: DamageType;
  reach?: number;
  range?: string;
  savingThrow?: {
    ability: string;
    dc: number;
    effect: string;
  };
}

export interface MonsterLegendaryAction {
  name: string;
  description: string;
  cost: number;
}

export interface MonsterTrait {
  name: string;
  description: string;
}

export interface LootTableEntry {
  itemId: string;
  chance: number; // 0-100
  quantity: { min: number; max: number };
}

export interface Monster {
  id: string;
  name: string;
  type: MonsterType;
  size: MonsterSize;
  alignment: string;
  challengeRating: number;
  experiencePoints: number;

  armorClass: number;
  hitPoints: number;
  hitDice: string;

  speed: {
    walk: number;
    swim?: number;
    fly?: number;
    burrow?: number;
    climb?: number;
  };

  abilityScores: AbilityScores;

  savingThrows?: Partial<AbilityScores>;
  skills?: Partial<Record<Skill, number>>;

  damageResistances?: DamageType[];
  damageImmunities?: DamageType[];
  damageVulnerabilities?: DamageType[];
  conditionImmunities?: Condition[];

  senses: {
    darkvision?: number;
    blindsight?: number;
    tremorsense?: number;
    truesight?: number;
    passivePerception: number;
  };

  languages: string[];

  traits?: MonsterTrait[];
  actions: MonsterAction[];
  legendaryActions?: MonsterLegendaryAction[];

  lootTable: LootTableEntry[];
  goldDrops: { min: number; max: number };

  environment: Environment[];

  description?: string;
  imageUrl?: string;
}

export interface MonsterInstance {
  monsterId: string;
  currentHitPoints: number;
  conditions: Condition[];
  isAlive: boolean;
}
