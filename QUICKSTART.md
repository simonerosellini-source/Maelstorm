# Maelstorm RPG - Quick Start Guide

Get up and running with Maelstorm RPG in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- Git

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all dependencies for the monorepo (frontend, backend, shared packages).

### 2. Setup Supabase Database

#### Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project name**: `maelstorm-rpg`
   - **Database password**: Choose a strong password
   - **Region**: Select closest to you
5. Wait for project creation (2-3 minutes)

#### Run Database Schema
1. In your Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL Editor
5. Click "Run" or press Ctrl/Cmd + Enter

You should see "Success. No rows returned" - this is correct!

### 3. Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy these three values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`
   - **service_role key**: Another long string starting with `eyJ...` (click "Reveal" button)

### 4. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Open .env in your editor
```

Replace the placeholder values with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

### 5. Start the Application

#### Option A: Run Everything Together (Recommended)

```bash
npm run dev
```

This starts both the API backend and web frontend simultaneously.

#### Option B: Run Separately

Terminal 1 (API):
```bash
npm run api:dev
```

Terminal 2 (Web App):
```bash
npm run web
```

### 6. Access the Application

Open your browser to: **http://localhost:8081**

You should see the Maelstorm RPG login screen!

## First Steps in the Game

1. **Register an Account**
   - Click "Register"
   - Enter email, password, and a unique nickname
   - Click "Register"

2. **Create Your First Character**
   - You'll be taken to the home screen
   - Click "Create New Character"
   - Choose a race (e.g., Human, Elf, Dwarf)
   - Choose a class (e.g., Wizard, Fighter, Cleric)
   - Assign ability scores
   - Name your character
   - Click "Create Character"

3. **Start Playing**
   - Explore dungeons from the Dungeon tab
   - Buy items from the Shop tab
   - View your character stats in the Character tab
   - Join or create a party in the Party tab

## Mobile App Development

To run on mobile devices:

### iOS (macOS only)
```bash
npm run ios
```

### Android
```bash
npm run android
```

You'll need:
- iOS: Xcode installed
- Android: Android Studio with emulator

## Troubleshooting

### "Cannot connect to database"
- Check that you copied the Supabase URL correctly in `.env`
- Make sure you ran the SQL schema in Supabase

### "Unauthorized" errors
- Check that your API keys are correct in `.env`
- Make sure you're using the **anon/public** key, not the service role key for the frontend

### Port already in use
- API default port: 3001
- Web default port: 8081
- Change ports if needed:
  ```bash
  # API on different port
  cd packages/api && npm run dev -- -p 3002

  # Web app will auto-assign another port
  ```

### Module not found errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read the full [README.md](./README.md) for detailed information
- Check [supabase/README.md](./supabase/README.md) for database details
- Explore the codebase:
  - `packages/app` - Frontend React Native app
  - `packages/api` - Backend Next.js API
  - `packages/data` - Game data (races, classes, monsters, etc.)
  - `packages/shared` - Shared TypeScript types

## Need Help?

- Check existing GitHub issues
- Open a new issue with details about your problem
- Include error messages and steps to reproduce

---

Happy adventuring in Maelstorm RPG! 🎲⚔️🐉
