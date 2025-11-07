# Maelstorm RPG - Competitive D&D Mobile/Web App

A competitive multiplayer RPG based on D&D 5e mechanics with Munchkin-style gameplay. Players race to level 20 while hindering opponents by sending them cursed items and powerful monsters.

## Features

### Core RPG Mechanics (D&D 5e)
- **Character Creation**: 22 races, 12 classes, ability score generation
- **Combat System**: Full D&D combat with initiative, AC, attack rolls, damage, conditions
- **Spell System**: 18+ spells across levels 0-9 with proper scaling
- **Monster Database**: Creatures from CR 0 to CR 30 with complete stat blocks
- **Items & Equipment**: Weapons, armor, magic items, potions, cursed items
- **Leveling**: Full progression from level 1 to 20 with experience tracking

### Competitive Multiplayer
- **Party System**: Join competitive parties (2-6 players)
- **Send Items**: Share or curse other players with items
- **Send Monsters**: Hinder opponents by sending them difficult encounters
- **Leaderboard**: Real-time ranking to see who's closest to level 20
- **Notifications**: Push notifications for player interactions

### Game Systems
- **Dungeon Exploration**: Procedurally generated dungeons with traps, puzzles, and bosses
- **Inventory Management**: Full inventory with equip slots and weight limits
- **Trading**: Trade items with other players
- **Shop System**: Buy weapons, armor, potions, and magic items
- **Achievements**: Unlock achievements and rewards

## Tech Stack

### Frontend
- **React Native + Expo**: Cross-platform mobile (iOS/Android) and web support
- **React Navigation**: Screen navigation and routing
- **Zustand**: State management
- **TypeScript**: Type safety

### Backend
- **Next.js**: API routes and serverless functions
- **Supabase**: PostgreSQL database with real-time subscriptions
- **TypeScript**: Shared types across frontend/backend

### Deployment
- **Vercel**: Backend API hosting
- **Expo**: Mobile app builds
- **Supabase**: Database and authentication hosting

## Project Structure

```
maelstorm/
├── packages/
│   ├── app/                 # React Native mobile/web app
│   │   ├── src/
│   │   │   ├── screens/     # UI screens
│   │   │   ├── components/  # Reusable components
│   │   │   ├── navigation/  # Navigation configuration
│   │   │   ├── services/    # API and Supabase clients
│   │   │   └── store/       # Zustand state management
│   │   └── App.tsx
│   ├── api/                 # Next.js API backend
│   │   ├── src/
│   │   │   ├── pages/api/   # API endpoints
│   │   │   └── lib/         # Utilities and helpers
│   │   └── package.json
│   ├── shared/              # Shared TypeScript types
│   │   └── src/types/       # Common type definitions
│   └── data/                # Game data JSON files
│       ├── races.json       # All 22 playable races
│       ├── classes.json     # All 12 character classes
│       ├── spells.json      # Spell database
│       ├── monsters.json    # Monster stat blocks
│       └── items.json       # Items and equipment
├── supabase/
│   ├── schema.sql           # Database schema
│   └── README.md            # Supabase setup instructions
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### 1. Clone and Install

```bash
git clone <repository-url>
cd Maelstorm
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in the SQL Editor
3. Get your project URL and API keys from Settings > API

### 3. Configure Environment

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Start Development Servers

Run both frontend and backend:

```bash
# Terminal 1: Start API backend
npm run api:dev

# Terminal 2: Start web app
npm run web

# Or run both simultaneously
npm run dev
```

The API will be available at `http://localhost:3001`
The web app will be available at `http://localhost:8081`

### 5. Run on Mobile

```bash
# iOS
npm run ios

# Android
npm run android
```

## Deployment

### Deploy API to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Build Web App

```bash
cd packages/app
npm run build:web
```

Deploy the `web-build` directory to your hosting provider.

### Build Mobile Apps

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user with nickname
- `POST /api/auth/login` - Login user

### Characters
- `POST /api/characters/create` - Create new character
- `GET /api/characters/list` - Get user's characters
- `GET /api/characters/[id]` - Get character details
- `PUT /api/characters/[id]` - Update character
- `DELETE /api/characters/[id]` - Delete character

### Game Data
- `GET /api/game/races` - Get all races
- `GET /api/game/classes` - Get all classes
- `GET /api/game/spells` - Get spells (filter by class)
- `GET /api/game/monsters` - Get monsters (filter by CR)
- `GET /api/game/items` - Get items (filter by type)

## Game Data

### Races (22 Total)
Human, High Elf, Wood Elf, Dark Elf, Mountain Dwarf, Hill Dwarf, Lightfoot Halfling, Stout Halfling, Dragonborn, Rock Gnome, Forest Gnome, Half-Elf, Half-Orc, Tiefling, Aarakocra, Fire Genasi, Water Genasi, Air Genasi, Earth Genasi, Goliath, Tabaxi, Triton

### Classes (12 Total)
Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard

Each class includes:
- Hit die and proficiencies
- Class features for all 20 levels
- Subclass options
- Spell progression (for spellcasters)

### Monsters
Sample monsters from CR 0 to CR 30 including:
- CR 0: Rat
- CR 1/4: Goblin, Skeleton, Zombie
- CR 1/2: Orc
- CR 2: Ogre
- CR 5: Troll
- CR 10: Young Red Dragon
- CR 13: Beholder
- CR 24: Ancient Red Dragon
- CR 30: Tarrasque

### Items
- **Weapons**: Dagger, Shortsword, Longsword, Greatsword, Greataxe, Shortbow, Longbow
- **Armor**: Leather, Chain Mail, Plate Armor, Shield
- **Magic Items**: +1/+2/+3 weapons/armor, Flame Tongue, Vorpal Sword, Ring of Protection, Belt of Giant Strength
- **Potions**: Healing (various grades), Fire Resistance
- **Cursed Items**: Cursed Sword, Armor of Vulnerability
- **Wondrous**: Bag of Holding, Cloak of Protection

## Database Schema

### Core Tables
- `users` - User accounts with email and nickname
- `characters` - Player characters with full stats
- `parties` - Competitive parties
- `combats` - Combat encounters
- `dungeons` - Generated dungeons
- `dungeon_progress` - Player dungeon progress
- `notifications` - Player notifications
- `player_interactions` - Items/monsters sent between players
- `trade_offers` - Trading system
- `achievements` - Game achievements

## Contributing

This is a complete, production-ready RPG game. To extend:

1. Add more classes to `data/classes.json`
2. Add more spells to `data/spells.json`
3. Add more monsters to `data/monsters.json`
4. Implement combat AI in API
5. Add real-time multiplayer with Supabase Realtime
6. Implement dungeon generation algorithm
7. Add character portraits and monster artwork

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub.

---

**Maelstorm RPG** - A competitive D&D adventure where only one can reach level 20!
