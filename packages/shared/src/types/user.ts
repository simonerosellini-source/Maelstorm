// User and Party Types

export interface User {
  id: string;
  email: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Party {
  id: string;
  name: string;
  code: string; // Unique join code
  leaderId: string;
  memberIds: string[];
  maxMembers: number;
  currentLevel: number; // Average party level
  goal: number; // Level to reach (usually 20)
  status: 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface PartyMember {
  userId: string;
  characterId: string;
  nickname: string;
  characterName: string;
  class: string;
  race: string;
  level: number;
  isOnline: boolean;
  joinedAt: Date;
}

export enum NotificationType {
  ITEM_RECEIVED = 'item_received',
  MONSTER_RECEIVED = 'monster_received',
  CURSE_RECEIVED = 'curse_received',
  PARTY_INVITE = 'party_invite',
  TRADE_OFFER = 'trade_offer',
  LEVEL_UP = 'level_up',
  PARTY_MESSAGE = 'party_message',
  ACHIEVEMENT = 'achievement',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export interface PlayerInteraction {
  id: string;
  fromUserId: string;
  fromCharacterId: string;
  toUserId: string;
  toCharacterId: string;
  type: 'send_item' | 'send_monster' | 'send_curse' | 'trade_offer';
  itemId?: string;
  monsterId?: string;
  curseId?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
}

export interface TradeOffer {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromItems: string[];
  toItems: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
}

export interface Leaderboard {
  characterId: string;
  characterName: string;
  userId: string;
  nickname: string;
  class: string;
  race: string;
  level: number;
  experience: number;
  monstersKilled: number;
  playersHindered: number;
  itemsSent: number;
  rank: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  rewardGold?: number;
  rewardItem?: string;
}

export interface PlayerAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}
