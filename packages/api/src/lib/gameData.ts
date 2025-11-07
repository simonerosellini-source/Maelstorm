// Game data loaders
import racesData from '../../../../data/races.json';
import classesData from '../../../../data/classes.json';
import spellsData from '../../../../data/spells.json';
import monstersData from '../../../../data/monsters.json';
import itemsData from '../../../../data/items.json';

import type { RaceData, ClassData, Spell, Monster, Item } from '@maelstorm/shared';

export function getAllRaces(): RaceData[] {
  return racesData as RaceData[];
}

export function getRaceById(id: string): RaceData | undefined {
  return racesData.find((race: any) => race.id === id) as RaceData | undefined;
}

export function getAllClasses(): ClassData[] {
  return classesData as ClassData[];
}

export function getClassById(id: string): ClassData | undefined {
  return classesData.find((cls: any) => cls.id === id) as ClassData | undefined;
}

export function getAllSpells(): Spell[] {
  return spellsData as Spell[];
}

export function getSpellById(id: string): Spell | undefined {
  return spellsData.find((spell: any) => spell.id === id) as Spell | undefined;
}

export function getSpellsByClass(className: string): Spell[] {
  return spellsData.filter((spell: any) =>
    spell.classes.includes(className.toLowerCase())
  ) as Spell[];
}

export function getSpellsByLevel(level: number): Spell[] {
  return spellsData.filter((spell: any) => spell.level === level) as Spell[];
}

export function getAllMonsters(): Monster[] {
  return monstersData as Monster[];
}

export function getMonsterById(id: string): Monster | undefined {
  return monstersData.find((monster: any) => monster.id === id) as Monster | undefined;
}

export function getMonstersByCR(cr: number): Monster[] {
  return monstersData.filter((monster: any) =>
    monster.challengeRating === cr
  ) as Monster[];
}

export function getRandomMonsterByCR(cr: number): Monster | undefined {
  const monsters = getMonstersByCR(cr);
  if (monsters.length === 0) return undefined;
  return monsters[Math.floor(Math.random() * monsters.length)];
}

export function getAllItems(): Item[] {
  return itemsData as Item[];
}

export function getItemById(id: string): Item | undefined {
  return itemsData.find((item: any) => item.id === id) as Item | undefined;
}

export function getItemsByType(type: string): Item[] {
  return itemsData.filter((item: any) => item.type === type) as Item[];
}

export function getItemsByRarity(rarity: string): Item[] {
  return itemsData.filter((item: any) => item.rarity === rarity) as Item[];
}
