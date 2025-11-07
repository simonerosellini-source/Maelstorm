// Combat System Types

import { AbilityScore, Condition } from './character';

export enum DamageType {
  BLUDGEONING = 'bludgeoning',
  PIERCING = 'piercing',
  SLASHING = 'slashing',
  ACID = 'acid',
  COLD = 'cold',
  FIRE = 'fire',
  FORCE = 'force',
  LIGHTNING = 'lightning',
  NECROTIC = 'necrotic',
  POISON = 'poison',
  PSYCHIC = 'psychic',
  RADIANT = 'radiant',
  THUNDER = 'thunder',
}

export interface DamageRoll {
  dice: string; // e.g., "2d6", "1d8+3"
  type: DamageType;
}

export interface AttackRoll {
  d20: number;
  modifier: number;
  total: number;
  isCritical: boolean;
  isCriticalFail: boolean;
}

export interface DamageResult {
  rolls: number[];
  modifier: number;
  total: number;
  type: DamageType;
  isCritical: boolean;
}

export enum ActionType {
  ATTACK = 'attack',
  SPELL = 'spell',
  DODGE = 'dodge',
  DISENGAGE = 'disengage',
  HELP = 'help',
  HIDE = 'hide',
  DASH = 'dash',
  USE_ITEM = 'use_item',
  SPECIAL_ABILITY = 'special_ability',
}

export interface CombatAction {
  type: ActionType;
  name: string;
  description: string;
  targetId?: string;
  spellId?: string;
  itemId?: string;
  abilityId?: string;
}

export interface CombatLog {
  id: string;
  timestamp: Date;
  actorId: string;
  actorName: string;
  action: string;
  target?: string;
  attackRoll?: AttackRoll;
  damage?: DamageResult;
  healing?: number;
  effect?: string;
}

export interface CombatParticipant {
  id: string;
  name: string;
  type: 'character' | 'monster';
  initiative: number;
  currentHp: number;
  maxHp: number;
  armorClass: number;
  conditions: Condition[];
  isAlive: boolean;
}

export enum CombatStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  VICTORY = 'victory',
  DEFEAT = 'defeat',
  FLED = 'fled',
}

export interface Combat {
  id: string;
  characterId: string;
  monsterId: string;
  status: CombatStatus;
  currentTurn: number;
  currentParticipantId: string;
  participants: CombatParticipant[];
  log: CombatLog[];
  rewards?: {
    experience: number;
    gold: number;
    items: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SavingThrow {
  dc: number;
  ability: AbilityScore;
  success: boolean;
  roll: number;
  modifier: number;
  total: number;
}
