# Supabase Setup for Maelstorm RPG

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: `maelstorm-rpg`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Wait for project to be created

### 2. Run Database Schema

**📖 For detailed step-by-step instructions, see [SETUP_DATABASE.md](./SETUP_DATABASE.md)**

Quick steps:
1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `schema.sql`
3. Paste into the SQL Editor
4. Click "Run"

This will create all necessary tables, indexes, and policies.

**⚠️ IMPORTANT**: The schema file has been updated to fix table dependency order. Make sure to use the latest version.

### 3. Get API Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Enable Authentication

1. In Supabase dashboard, go to Authentication > Providers
2. Enable Email provider
3. Configure email templates (optional)
4. Set Site URL to your app URL

### 6. Configure Storage (Optional)

For character avatars and game assets:

1. Go to Storage
2. Create a new bucket named `game-assets`
3. Make it public
4. Upload default character avatars

## Database Structure

### Core Tables

- **users**: User accounts with email and nickname
- **characters**: Player characters with all stats and inventory
- **parties**: Competitive parties that players join
- **combats**: Active and historical combat encounters
- **dungeons**: Procedurally generated dungeons
- **dungeon_progress**: Player progress through dungeons
- **notifications**: Push notifications for player interactions
- **player_interactions**: Items/monsters sent between players
- **trade_offers**: Trading system between players
- **achievements**: Game achievements
- **player_achievements**: Unlocked achievements per player

### Security

All tables have Row Level Security (RLS) enabled:
- Users can only view/modify their own data
- Party members can view each other's basic info
- Interactions are visible to both sender and receiver

## Maintenance

### Backups

Supabase automatically backs up your database daily. You can also:
1. Go to Database > Backups
2. Create manual backups before major changes
3. Download backups for local storage

### Monitoring

Check database health:
1. Go to Database > Logs
2. Monitor query performance
3. Check for slow queries
4. Optimize indexes if needed

## Troubleshooting

### Connection Issues

If you can't connect:
1. Check API URL and keys are correct
2. Verify network/firewall settings
3. Check Supabase project status

#### Error: "57P03: the database system is not accepting connections"

This error occurs when the Supabase database is in standby mode or paused. **Solutions:**

1. **Check Project Status** (Most Common)
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your project
   - If you see "Project Paused" banner, click **"Restore Project"**
   - Wait 2-3 minutes for the database to fully restart

2. **Free Tier Auto-Pause**
   - Free tier projects pause after 7 days of inactivity
   - Upgrade to Pro tier to prevent auto-pause
   - Or ensure regular activity to keep project active

3. **Check Database Status**
   - Go to Database → Settings in Supabase dashboard
   - Verify database is in "Healthy" state
   - Check for any ongoing maintenance or restore operations

4. **Verify Connection Using Health Endpoint**
   ```bash
   # Check API health
   curl http://localhost:3001/api/health
   ```

5. **Automatic Retry**
   - The API now includes automatic retry logic
   - Will retry up to 3 times with exponential backoff
   - Check console logs for retry attempts

6. **Contact Support**
   - If issue persists after restoring project
   - Check [Supabase Status Page](https://status.supabase.com)
   - Contact Supabase support if regional outage

### RLS Errors

If you get permission errors:
1. Verify user is authenticated
2. Check RLS policies in SQL Editor
3. Ensure `auth.uid()` matches user_id

### Performance

For better performance:
1. Add indexes on frequently queried columns
2. Use Supabase caching
3. Implement pagination for large lists
4. Use Supabase Realtime for live updates
