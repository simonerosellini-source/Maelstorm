// Character creation and management utilities
import {
  Character,
  CharacterCreationData,
  Race,
  CharacterClass,
  AbilityScores,
  HitDie,
  Skill
} from '@maelstorm/shared';
import {
  calculateAbilityModifiers,
  calculateMaxHitPoints,
  calculateArmorClass
} from '@maelstorm/shared';
import { getProficiencyBonus } from '@maelstorm/shared';
import { getRaceById, getClassById } from './gameData';

/**
 * Create a new character from creation data
 */
export function createCharacterFromData(
  userId: string,
  creationData: CharacterCreationData
): Omit<Character, 'id' | 'createdAt' | 'updatedAt'> {
  const race = getRaceById(creationData.race);
  const classData = getClassById(creationData.class);

  if (!race || !classData) {
    throw new Error('Invalid race or class');
  }

  // Apply racial bonuses to ability scores
  const finalAbilityScores = applyRacialBonuses(
    creationData.abilityScores,
    race.abilityBonuses
  );

  const abilityModifiers = calculateAbilityModifiers(finalAbilityScores);
  const proficiencyBonus = getProficiencyBonus(1);

  // Calculate hit points
  const maxHitPoints = calculateMaxHitPoints(
    creationData.class,
    1,
    abilityModifiers.constitution,
    classData.hitDie
  );

  // Calculate AC (base 10 + dex modifier, will be updated with armor)
  const armorClass = 10 + abilityModifiers.dexterity;

  // Calculate initiative
  const initiative = abilityModifiers.dexterity;

  // Build skills object
  const skills: Partial<Record<Skill, boolean>> = {};
  creationData.skills.forEach(skill => {
    skills[skill] = true;
  });

  // Build saving throws object
  const savingThrows: any = {};
  classData.savingThrows.forEach(ability => {
    savingThrows[ability] = true;
  });

  return {
    userId,
    name: creationData.name,
    race: creationData.race,
    class: creationData.class,
    subclass: undefined,
    level: 1,
    experience: 0,

    abilityScores: finalAbilityScores,
    abilityModifiers,

    maxHitPoints,
    currentHitPoints: maxHitPoints,
    temporaryHitPoints: 0,

    armorClass,
    initiative,
    speed: race.speed,
    proficiencyBonus,

    skills,
    savingThrows,

    conditions: [],

    inventory: [],
    equippedItems: {},

    knownSpells: [],
    preparedSpells: [],
    spellSlots: [],
    usedSpellSlots: [],

    gold: 50, // Starting gold

    partyId: undefined
  };
}

/**
 * Apply racial bonuses to ability scores
 */
function applyRacialBonuses(
  baseScores: AbilityScores,
  racialBonuses: Partial<AbilityScores>
): AbilityScores {
  return {
    strength: baseScores.strength + (racialBonuses.strength || 0),
    dexterity: baseScores.dexterity + (racialBonuses.dexterity || 0),
    constitution: baseScores.constitution + (racialBonuses.constitution || 0),
    intelligence: baseScores.intelligence + (racialBonuses.intelligence || 0),
    wisdom: baseScores.wisdom + (racialBonuses.wisdom || 0),
    charisma: baseScores.charisma + (racialBonuses.charisma || 0),
  };
}

/**
 * Level up a character
 */
export function levelUpCharacter(
  character: Character,
  classData: any
): Partial<Character> {
  const newLevel = character.level + 1;
  const newProficiencyBonus = getProficiencyBonus(newLevel);

  // Roll hit points (or take average)
  const hitDie = classData.hitDie;
  const constitutionMod = character.abilityModifiers.constitution;
  const hpIncrease = Math.floor(hitDie / 2) + 1 + constitutionMod;

  const newMaxHp = character.maxHitPoints + hpIncrease;

  return {
    level: newLevel,
    proficiencyBonus: newProficiencyBonus,
    maxHitPoints: newMaxHp,
    currentHitPoints: character.currentHitPoints + hpIncrease,
    updatedAt: new Date()
  };
}

/**
 * Add experience to character and check for level up
 */
export function addExperience(
  character: Character,
  xpGained: number
): { character: Partial<Character>; leveledUp: boolean; newLevel?: number } {
  const newXP = character.experience + xpGained;

  // Import experience table
  const { EXPERIENCE_TABLE, calculateLevel } = require('@maelstorm/shared');

  const currentLevel = calculateLevel(character.experience);
  const newLevel = calculateLevel(newXP);

  if (newLevel > currentLevel) {
    return {
      character: { experience: newXP },
      leveledUp: true,
      newLevel
    };
  }

  return {
    character: { experience: newXP, updatedAt: new Date() },
    leveledUp: false
  };
}
