// Item and Equipment Types

import { DamageType } from './combat';

export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  SHIELD = 'shield',
  POTION = 'potion',
  SCROLL = 'scroll',
  RING = 'ring',
  AMULET = 'amulet',
  WONDROUS = 'wondrous',
  TOOL = 'tool',
  TREASURE = 'treasure',
  CONSUMABLE = 'consumable',
  CURSED = 'cursed',
}

export enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  VERY_RARE = 'very_rare',
  LEGENDARY = 'legendary',
  ARTIFACT = 'artifact',
}

export enum WeaponType {
  SIMPLE_MELEE = 'simple_melee',
  SIMPLE_RANGED = 'simple_ranged',
  MARTIAL_MELEE = 'martial_melee',
  MARTIAL_RANGED = 'martial_ranged',
}

export enum WeaponProperty {
  LIGHT = 'light',
  FINESSE = 'finesse',
  THROWN = 'thrown',
  TWO_HANDED = 'two_handed',
  VERSATILE = 'versatile',
  AMMUNITION = 'ammunition',
  LOADING = 'loading',
  HEAVY = 'heavy',
  REACH = 'reach',
}

export enum ArmorType {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
}

export interface WeaponData {
  type: WeaponType;
  damage: string; // e.g., "1d8", "2d6"
  damageType: DamageType;
  properties: WeaponProperty[];
  range?: { normal: number; long?: number };
  versatileDamage?: string;
}

export interface ArmorData {
  type: ArmorType;
  armorClass: number;
  maxDexBonus?: number;
  strengthRequirement?: number;
  stealthDisadvantage: boolean;
}

export interface MagicEffect {
  type: 'bonus_ac' | 'bonus_attack' | 'bonus_damage' | 'spell_cast' | 'ability_bonus' | 'resistance' | 'immunity' | 'advantage' | 'custom';
  value?: number;
  ability?: string;
  description: string;
}

export interface CurseEffect {
  description: string;
  effect: string;
  duration?: number; // in combats or days
  removable: boolean;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  description: string;
  value: number; // in gold pieces
  weight: number; // in pounds

  // Weapon-specific
  weapon?: WeaponData;

  // Armor-specific
  armor?: ArmorData;

  // Shield-specific
  shield?: {
    armorClassBonus: number;
  };

  // Magic item effects
  magicBonus?: number; // +1, +2, +3 for weapons/armor
  effects?: MagicEffect[];

  // Cursed item
  curse?: CurseEffect;

  // Consumable
  consumable?: {
    effect: string;
    healing?: string; // e.g., "2d4+2"
    duration?: number;
  };

  // Scroll
  scroll?: {
    spellId: string;
    spellLevel: number;
  };

  // Equip slot
  equipSlot?: 'head' | 'body' | 'hands' | 'feet' | 'mainHand' | 'offHand' | 'ring' | 'accessory';

  // Attunement
  requiresAttunement: boolean;
  attunementRequirements?: string;

  imageUrl?: string;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  isEquipped: boolean;
  isAttuned: boolean;
}

export interface CoinPurse {
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
}

// Conversion: 1 pp = 10 gp = 100 sp = 1000 cp
export const COIN_CONVERSION = {
  platinum: 1000,
  gold: 100,
  electrum: 50,
  silver: 10,
  copper: 1,
};
