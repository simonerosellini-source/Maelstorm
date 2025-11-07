// Dice rolling utilities

export interface DiceRollResult {
  rolls: number[];
  total: number;
  modifier: number;
  finalTotal: number;
  formula: string;
}

/**
 * Roll a die with specified number of sides
 */
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll multiple dice
 */
export function rollDice(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => rollDie(sides));
}

/**
 * Parse and roll a dice formula (e.g., "2d6+3", "1d20", "4d6 drop lowest")
 */
export function parseDiceFormula(formula: string): DiceRollResult {
  // Remove spaces
  const clean = formula.replace(/\s+/g, '');

  // Match pattern like "2d6+3" or "1d20-2"
  const match = clean.match(/(\d+)d(\d+)([+-]\d+)?/i);

  if (!match) {
    throw new Error(`Invalid dice formula: ${formula}`);
  }

  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;

  const rolls = rollDice(count, sides);
  const total = rolls.reduce((sum, roll) => sum + roll, 0);
  const finalTotal = total + modifier;

  return {
    rolls,
    total,
    modifier,
    finalTotal,
    formula,
  };
}

/**
 * Roll ability scores using 4d6 drop lowest
 */
export function roll4d6DropLowest(): number {
  const rolls = rollDice(4, 6);
  const sorted = rolls.sort((a, b) => a - b);
  sorted.shift(); // Remove lowest
  return sorted.reduce((sum, roll) => sum + roll, 0);
}

/**
 * Generate a full set of ability scores
 */
export function generateAbilityScores(): number[] {
  return Array.from({ length: 6 }, () => roll4d6DropLowest());
}

/**
 * Calculate ability modifier from ability score
 */
export function calculateModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

/**
 * Roll with advantage (roll twice, take higher)
 */
export function rollWithAdvantage(sides: number): DiceRollResult {
  const roll1 = rollDie(sides);
  const roll2 = rollDie(sides);
  const finalTotal = Math.max(roll1, roll2);

  return {
    rolls: [roll1, roll2],
    total: finalTotal,
    modifier: 0,
    finalTotal,
    formula: `1d${sides} (advantage)`,
  };
}

/**
 * Roll with disadvantage (roll twice, take lower)
 */
export function rollWithDisadvantage(sides: number): DiceRollResult {
  const roll1 = rollDie(sides);
  const roll2 = rollDie(sides);
  const finalTotal = Math.min(roll1, roll2);

  return {
    rolls: [roll1, roll2],
    total: finalTotal,
    modifier: 0,
    finalTotal,
    formula: `1d${sides} (disadvantage)`,
  };
}

/**
 * Roll attack with d20
 */
export function rollAttack(attackBonus: number, advantage?: boolean, disadvantage?: boolean): {
  d20: number;
  modifier: number;
  total: number;
  isCritical: boolean;
  isCriticalFail: boolean;
} {
  let d20: number;

  if (advantage) {
    const result = rollWithAdvantage(20);
    d20 = result.finalTotal;
  } else if (disadvantage) {
    const result = rollWithDisadvantage(20);
    d20 = result.finalTotal;
  } else {
    d20 = rollDie(20);
  }

  return {
    d20,
    modifier: attackBonus,
    total: d20 + attackBonus,
    isCritical: d20 === 20,
    isCriticalFail: d20 === 1,
  };
}

/**
 * Roll damage with optional critical hit
 */
export function rollDamage(damageFormula: string, isCritical: boolean = false): DiceRollResult {
  const result = parseDiceFormula(damageFormula);

  if (isCritical) {
    // On critical hit, double the dice (not the modifier)
    const critRolls = rollDice(result.rolls.length,
      parseInt(damageFormula.match(/d(\d+)/)?.[1] || '6'));
    result.rolls = [...result.rolls, ...critRolls];
    result.total = result.rolls.reduce((sum, roll) => sum + roll, 0);
    result.finalTotal = result.total + result.modifier;
    result.formula = `${damageFormula} (CRITICAL)`;
  }

  return result;
}

/**
 * Roll saving throw
 */
export function rollSavingThrow(savingThrowBonus: number, dc: number): {
  roll: number;
  modifier: number;
  total: number;
  success: boolean;
  dc: number;
} {
  const roll = rollDie(20);
  const total = roll + savingThrowBonus;

  return {
    roll,
    modifier: savingThrowBonus,
    total,
    success: total >= dc,
    dc,
  };
}

/**
 * Roll initiative
 */
export function rollInitiative(dexterityModifier: number): number {
  return rollDie(20) + dexterityModifier;
}
