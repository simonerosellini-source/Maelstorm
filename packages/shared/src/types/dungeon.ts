// Dungeon and Exploration Types

import { Monster } from './monster';

export enum DungeonDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  DEADLY = 'deadly',
}

export enum RoomType {
  EMPTY = 'empty',
  MONSTER = 'monster',
  TREASURE = 'treasure',
  TRAP = 'trap',
  PUZZLE = 'puzzle',
  BOSS = 'boss',
  REST = 'rest',
  SHOP = 'shop',
}

export interface Trap {
  id: string;
  name: string;
  description: string;
  detectDC: number;
  disarmDC: number;
  damage: string;
  damageType: string;
  savingThrow?: {
    ability: string;
    dc: number;
  };
}

export interface Puzzle {
  id: string;
  name: string;
  description: string;
  solution: string;
  hints: string[];
  reward?: {
    gold?: number;
    items?: string[];
    experience?: number;
  };
}

export interface DungeonRoom {
  id: string;
  type: RoomType;
  description: string;
  explored: boolean;
  cleared: boolean;

  // Monster encounter
  monsters?: string[]; // Monster IDs

  // Treasure
  treasure?: {
    gold: number;
    items: string[];
  };

  // Trap
  trap?: Trap;

  // Puzzle
  puzzle?: Puzzle;

  // Connections to other rooms
  connections: {
    north?: string;
    south?: string;
    east?: string;
    west?: string;
  };

  position: {
    x: number;
    y: number;
  };
}

export interface Dungeon {
  id: string;
  name: string;
  difficulty: DungeonDifficulty;
  recommendedLevel: number;
  description: string;

  rooms: DungeonRoom[];
  startRoomId: string;
  bossRoomId: string;

  completed: boolean;
  createdAt: Date;
}

export interface DungeonProgress {
  id: string;
  characterId: string;
  dungeonId: string;
  currentRoomId: string;
  exploredRoomIds: string[];
  clearedRoomIds: string[];
  totalRooms: number;
  monstersKilled: number;
  treasureFound: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  startedAt: Date;
  completedAt?: Date;
}

export enum RestType {
  SHORT = 'short',
  LONG = 'long',
}

export interface Rest {
  type: RestType;
  characterId: string;
  hitPointsRecovered: number;
  spellSlotsRecovered: number[];
  abilitiesRecovered: string[];
  timestamp: Date;
}

export interface ExplorationAction {
  type: 'move' | 'search' | 'interact' | 'rest' | 'leave';
  direction?: 'north' | 'south' | 'east' | 'west';
  targetId?: string;
  restType?: RestType;
}

export interface SearchResult {
  success: boolean;
  roll: number;
  dc: number;
  found?: {
    type: 'treasure' | 'trap' | 'secret';
    description: string;
    gold?: number;
    items?: string[];
  };
}
