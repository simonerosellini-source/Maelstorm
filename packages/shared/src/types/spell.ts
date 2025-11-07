// Spell System Types

import { AbilityScore } from './character';
import { DamageType } from './combat';

export enum SpellSchool {
  ABJURATION = 'abjuration',
  CONJURATION = 'conjuration',
  DIVINATION = 'divination',
  ENCHANTMENT = 'enchantment',
  EVOCATION = 'evocation',
  ILLUSION = 'illusion',
  NECROMANCY = 'necromancy',
  TRANSMUTATION = 'transmutation',
}

export enum ComponentType {
  VERBAL = 'V',
  SOMATIC = 'S',
  MATERIAL = 'M',
}

export enum CastingTime {
  ACTION = '1 action',
  BONUS_ACTION = '1 bonus action',
  REACTION = '1 reaction',
  MINUTE = '1 minute',
  TEN_MINUTES = '10 minutes',
  HOUR = '1 hour',
  EIGHT_HOURS = '8 hours',
}

export enum SpellRange {
  SELF = 'Self',
  TOUCH = 'Touch',
  FEET_30 = '30 feet',
  FEET_60 = '60 feet',
  FEET_90 = '90 feet',
  FEET_120 = '120 feet',
  FEET_150 = '150 feet',
  FEET_300 = '300 feet',
  FEET_500 = '500 feet',
  MILE = '1 mile',
  SIGHT = 'Sight',
  UNLIMITED = 'Unlimited',
}

export enum SpellDuration {
  INSTANTANEOUS = 'Instantaneous',
  ROUNDS_1 = '1 round',
  MINUTES_1 = '1 minute',
  MINUTES_10 = '10 minutes',
  HOURS_1 = '1 hour',
  HOURS_8 = '8 hours',
  HOURS_24 = '24 hours',
  DAYS_7 = '7 days',
  DAYS_10 = '10 days',
  DAYS_30 = '30 days',
  UNTIL_DISPELLED = 'Until dispelled',
  SPECIAL = 'Special',
}

export interface Spell {
  id: string;
  name: string;
  level: number; // 0-9 (0 = cantrip)
  school: SpellSchool;
  castingTime: CastingTime;
  range: SpellRange;
  components: ComponentType[];
  materialComponents?: string;
  duration: SpellDuration;
  concentration: boolean;
  ritual: boolean;

  description: string;
  atHigherLevels?: string;

  damage?: {
    dice: string;
    type: DamageType;
    scalingDice?: Record<number, string>; // spell slot level -> dice
  };

  healing?: {
    dice: string;
    scalingDice?: Record<number, string>;
  };

  savingThrow?: {
    ability: AbilityScore;
    effect: string;
  };

  attackRoll?: boolean;

  classes: string[]; // Which classes can learn this spell

  tags?: string[];
}

export interface SpellSlots {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  level6: number;
  level7: number;
  level8: number;
  level9: number;
}

export interface SpellSlotsByLevel {
  [characterLevel: number]: SpellSlots;
}

export interface SpellCastResult {
  spellId: string;
  casterId: string;
  targetId?: string;
  slotLevel: number;
  success: boolean;
  damage?: number;
  healing?: number;
  savingThrow?: {
    dc: number;
    ability: AbilityScore;
    result: number;
    success: boolean;
  };
  attackRoll?: {
    roll: number;
    total: number;
    hit: boolean;
  };
  effects?: string[];
}
