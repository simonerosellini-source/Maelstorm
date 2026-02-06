-- Maelstorm RPG Database Schema for Supabase
-- This schema supports the competitive D&D-based RPG mobile/web app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nickname ON users(nickname);

-- ============================================
-- CHARACTERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  race TEXT NOT NULL,
  class TEXT NOT NULL,
  subclass TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL DEFAULT 0,

  -- Ability Scores
  strength INTEGER NOT NULL,
  dexterity INTEGER NOT NULL,
  constitution INTEGER NOT NULL,
  intelligence INTEGER NOT NULL,
  wisdom INTEGER NOT NULL,
  charisma INTEGER NOT NULL,

  -- Combat Stats
  max_hit_points INTEGER NOT NULL,
  current_hit_points INTEGER NOT NULL,
  temporary_hit_points INTEGER DEFAULT 0,
  armor_class INTEGER NOT NULL,
  initiative INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  proficiency_bonus INTEGER NOT NULL,

  -- Skills (stored as JSONB for flexibility)
  skills JSONB DEFAULT '{}',
  saving_throws JSONB DEFAULT '{}',

  -- Status
  conditions JSONB DEFAULT '[]',

  -- Inventory
  inventory JSONB DEFAULT '[]',
  equipped_items JSONB DEFAULT '{}',

  -- Spells
  known_spells JSONB DEFAULT '[]',
  prepared_spells JSONB DEFAULT '[]',
  spell_slots JSONB DEFAULT '[]',
  used_spell_slots JSONB DEFAULT '[]',

  -- Economy
  gold INTEGER DEFAULT 0,

  -- Party
  party_id UUID REFERENCES parties(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_party_id ON characters(party_id);
CREATE INDEX idx_characters_level ON characters(level);

-- ============================================
-- PARTIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  leader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  max_members INTEGER DEFAULT 6,
  goal INTEGER DEFAULT 20,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_parties_code ON parties(code);
CREATE INDEX idx_parties_leader_id ON parties(leader_id);

-- ============================================
-- PARTY MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS party_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  party_id UUID NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(party_id, user_id)
);

CREATE INDEX idx_party_members_party_id ON party_members(party_id);
CREATE INDEX idx_party_members_user_id ON party_members(user_id);

-- ============================================
-- COMBATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS combats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  monster_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  current_turn INTEGER DEFAULT 0,
  current_participant_id TEXT,
  participants JSONB NOT NULL DEFAULT '[]',
  log JSONB DEFAULT '[]',
  rewards JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_combats_character_id ON combats(character_id);
CREATE INDEX idx_combats_status ON combats(status);

-- ============================================
-- DUNGEONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS dungeons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  recommended_level INTEGER NOT NULL,
  description TEXT,
  rooms JSONB NOT NULL DEFAULT '[]',
  start_room_id TEXT NOT NULL,
  boss_room_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dungeons_difficulty ON dungeons(difficulty);
CREATE INDEX idx_dungeons_recommended_level ON dungeons(recommended_level);

-- ============================================
-- DUNGEON PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS dungeon_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  dungeon_id UUID NOT NULL REFERENCES dungeons(id) ON DELETE CASCADE,
  current_room_id TEXT NOT NULL,
  explored_room_ids JSONB DEFAULT '[]',
  cleared_room_ids JSONB DEFAULT '[]',
  total_rooms INTEGER NOT NULL,
  monsters_killed INTEGER DEFAULT 0,
  treasure_found INTEGER DEFAULT 0,
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_dungeon_progress_character_id ON dungeon_progress(character_id);
CREATE INDEX idx_dungeon_progress_status ON dungeon_progress(status);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ============================================
-- PLAYER INTERACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS player_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  item_id TEXT,
  monster_id TEXT,
  curse_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_player_interactions_from_user ON player_interactions(from_user_id);
CREATE INDEX idx_player_interactions_to_user ON player_interactions(to_user_id);
CREATE INDEX idx_player_interactions_status ON player_interactions(status);

-- ============================================
-- TRADE OFFERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS trade_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_items JSONB NOT NULL DEFAULT '[]',
  to_items JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_trade_offers_from_user ON trade_offers(from_user_id);
CREATE INDEX idx_trade_offers_to_user ON trade_offers(to_user_id);
CREATE INDEX idx_trade_offers_status ON trade_offers(status);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement TEXT NOT NULL,
  reward_gold INTEGER,
  reward_item TEXT
);

-- ============================================
-- PLAYER ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS player_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_player_achievements_user_id ON player_achievements(user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parties_updated_at BEFORE UPDATE ON parties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_combats_updated_at BEFORE UPDATE ON combats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE combats ENABLE ROW LEVEL SECURITY;
ALTER TABLE dungeons ENABLE ROW LEVEL SECURITY;
ALTER TABLE dungeon_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_members ENABLE ROW LEVEL SECURITY;

-- Users: Can read their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Characters: Can read own characters and party members' characters
CREATE POLICY "Users can view own characters"
  ON characters FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own characters"
  ON characters FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own characters"
  ON characters FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Parties: Can view all parties (for joining)
CREATE POLICY "Users can view all parties"
  ON parties FOR SELECT
  TO authenticated
  USING (true);

-- Notifications: Can only view own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Player Interactions: Can view interactions involving them
CREATE POLICY "Users can view interactions involving them"
  ON player_interactions FOR SELECT
  USING (auth.uid()::text = from_user_id::text OR auth.uid()::text = to_user_id::text);

-- Trade Offers: Can view trade offers involving them
CREATE POLICY "Users can view trade offers involving them"
  ON trade_offers FOR SELECT
  USING (auth.uid()::text = from_user_id::text OR auth.uid()::text = to_user_id::text);

-- Party Members: Full access for authenticated users
CREATE POLICY "Users can view party members"
  ON party_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert party members"
  ON party_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own party membership"
  ON party_members FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Parties: Insert and Update
CREATE POLICY "Users can create parties"
  ON parties FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = leader_id::text);

CREATE POLICY "Leaders can update parties"
  ON parties FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = leader_id::text);

CREATE POLICY "Leaders can delete parties"
  ON parties FOR DELETE
  TO authenticated
  USING (auth.uid()::text = leader_id::text);

-- ============================================
-- SAMPLE ACHIEVEMENTS
-- ============================================
INSERT INTO achievements (name, description, icon, requirement, reward_gold) VALUES
  ('First Blood', 'Defeat your first monster', '⚔️', 'Kill 1 monster', 50),
  ('Monster Slayer', 'Defeat 100 monsters', '🗡️', 'Kill 100 monsters', 500),
  ('Level 5', 'Reach level 5', '🌟', 'Reach level 5', 100),
  ('Level 10', 'Reach level 10', '⭐', 'Reach level 10', 500),
  ('Level 20', 'Reach maximum level', '🏆', 'Reach level 20', 5000),
  ('Munchkin Master', 'Send 50 items or monsters to other players', '😈', 'Send 50 items/monsters', 1000),
  ('Dragon Slayer', 'Defeat a dragon', '🐉', 'Kill any dragon', 2000),
  ('Treasure Hunter', 'Find 100 pieces of treasure', '💰', 'Find 100 treasures', 500);
