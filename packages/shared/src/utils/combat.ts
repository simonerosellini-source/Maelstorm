// Combat utilities

import { AbilityScores, Character } from '../types/character';
import { calculateModifier } from './dice';

/**
 * Calculate Armor Class
 */
export function calculateArmorClass(
  character: Character,
  baseAC: number = 10
): number {
  let ac = baseAC;

  // Add Dexterity modifier (unless wearing heavy armor)
  ac += character.abilityModifiers.dexterity;

  // Additional bonuses from equipped items would be added here

  return ac;
}

/**
 * Calculate initiative
 */
export function calculateInitiative(dexterityModifier: number): number {
  return dexterityModifier;
}

/**
 * Calculate max hit points for a character
 */
export function calculateMaxHitPoints(
  characterClass: string,
  level: number,
  constitutionModifier: number,
  hitDie: number
): number {
  // First level: max hit die + con modifier
  let hp = hitDie + constitutionModifier;

  // Subsequent levels: average of hit die (rounded up) + con modifier
  for (let i = 2; i <= level; i++) {
    hp += Math.ceil(hitDie / 2) + 1 + constitutionModifier;
  }

  return Math.max(1, hp); // Minimum 1 HP
}

/**
 * Calculate spell save DC
 */
export function calculateSpellSaveDC(
  proficiencyBonus: number,
  spellcastingModifier: number
): number {
  return 8 + proficiencyBonus + spellcastingModifier;
}

/**
 * Calculate spell attack bonus
 */
export function calculateSpellAttackBonus(
  proficiencyBonus: number,
  spellcastingModifier: number
): number {
  return proficiencyBonus + spellcastingModifier;
}

/**
 * Calculate carrying capacity
 */
export function calculateCarryingCapacity(strengthScore: number): number {
  return strengthScore * 15; // in pounds
}

/**
 * Check if attack hits
 */
export function doesAttackHit(attackTotal: number, targetAC: number): boolean {
  return attackTotal >= targetAC;
}

/**
 * Apply damage to a character/monster
 */
export function applyDamage(currentHp: number, damage: number): number {
  return Math.max(0, currentHp - damage);
}

/**
 * Apply healing to a character/monster
 */
export function applyHealing(
  currentHp: number,
  healing: number,
  maxHp: number
): number {
  return Math.min(maxHp, currentHp + healing);
}

/**
 * Check if saving throw succeeds
 */
export function savingThrowSucceeds(
  roll: number,
  modifier: number,
  dc: number
): boolean {
  return roll + modifier >= dc;
}

/**
 * Calculate ability modifiers from scores
 */
export function calculateAbilityModifiers(
  scores: AbilityScores
): Record<keyof AbilityScores, number> {
  return {
    strength: calculateModifier(scores.strength),
    dexterity: calculateModifier(scores.dexterity),
    constitution: calculateModifier(scores.constitution),
    intelligence: calculateModifier(scores.intelligence),
    wisdom: calculateModifier(scores.wisdom),
    charisma: calculateModifier(scores.charisma),
  };
}

/**
 * Sort combatants by initiative (highest first)
 */
export function sortByInitiative<T extends { initiative: number }>(
  combatants: T[]
): T[] {
  return [...combatants].sort((a, b) => b.initiative - a.initiative);
}

/**
 * Check if character is dead
 */
export function isDead(currentHp: number): boolean {
  return currentHp <= 0;
}

/**
 * Calculate skill bonus
 */
export function calculateSkillBonus(
  abilityModifier: number,
  proficiencyBonus: number,
  isProficient: boolean
): number {
  return abilityModifier + (isProficient ? proficiencyBonus : 0);
}
