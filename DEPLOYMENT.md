# Deployment Guide for Maelstorm RPG

This guide covers deploying the complete Maelstorm RPG application to production.

## Architecture Overview

- **Database**: Supabase (PostgreSQL + Auth)
- **API Backend**: Vercel (Next.js serverless functions)
- **Web App**: Vercel or Netlify
- **Mobile Apps**: Expo/EAS Build → App Store & Google Play

## Prerequisites

- Supabase project (already setup from development)
- Vercel account
- Expo account (for mobile builds)
- Apple Developer account (for iOS)
- Google Play Console account (for Android)

---

## Part 1: Deploy API Backend to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy from API directory

```bash
cd packages/api
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No
- **What's your project's name?** maelstorm-api
- **In which directory is your code located?** ./
- **Want to override settings?** No

### 4. Set Environment Variables

In Vercel Dashboard (https://vercel.com):

1. Go to your project → Settings → Environment Variables
2. Add these variables for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
NEXT_PUBLIC_APP_URL = https://maelstorm-rpg.vercel.app
```

### 5. Redeploy with Environment Variables

```bash
vercel --prod
```

Your API is now live at: `https://maelstorm-api.vercel.app`

**Test it:** Visit `https://maelstorm-api.vercel.app/api/game/races`

---

## Part 2: Deploy Web App to Vercel

### 1. Build Web App

```bash
cd packages/app
npm install -g expo-cli
expo export:web
```

### 2. Deploy Web Build

```bash
cd web-build
vercel
```

Follow prompts similar to API deployment.

### 3. Update Environment Variables

In Vercel dashboard for the web app:

```
EXPO_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
EXPO_PUBLIC_API_URL = https://maelstorm-api.vercel.app/api
```

### 4. Configure Supabase for Production

In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: `https://your-web-app.vercel.app`
- **Redirect URLs**: Add `https://your-web-app.vercel.app/**`

---

## Part 3: Build & Deploy Mobile Apps

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure EAS

```bash
cd packages/app
eas build:configure
```

### 4. Update app.json for Production

Edit `packages/app/app.json`:

```json
{
  "expo": {
    "name": "Maelstorm RPG",
    "slug": "maelstorm-rpg",
    "version": "1.0.0",
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.maelstorm",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.maelstorm",
      "versionCode": 1
    }
  }
}
```

### 5. Create eas.json

Create `packages/app/eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key",
        "EXPO_PUBLIC_API_URL": "https://maelstorm-api.vercel.app/api"
      }
    }
  }
}
```

### 6. Build iOS App

```bash
eas build --platform ios --profile production
```

This will:
- Create an IPA file
- You can download it from Expo dashboard
- Submit to App Store Connect

### 7. Build Android App

```bash
eas build --platform android --profile production
```

This will:
- Create an AAB/APK file
- You can download it from Expo dashboard
- Submit to Google Play Console

### 8. Submit to App Stores

**iOS:**
```bash
eas submit --platform ios
```

**Android:**
```bash
eas submit --platform android
```

---

## Part 4: Configure Production Database

### 1. Backup Your Database

In Supabase Dashboard → Database → Backups:
- Create a manual backup before any production changes

### 2. Review Row Level Security

Ensure RLS policies are correctly set for production:

```sql
-- Verify policies are enabled
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 3. Set up Database Monitoring

In Supabase Dashboard → Reports:
- Enable query performance monitoring
- Set up alerts for slow queries
- Monitor database size

---

## Part 5: Configure Custom Domain (Optional)

### For Vercel (Web + API)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain (e.g., `maelstorm-rpg.com`)
3. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Update Environment Variables

Update all references to the Vercel URL with your custom domain.

---

## Post-Deployment Checklist

- [ ] API is accessible at production URL
- [ ] Web app loads and can authenticate
- [ ] Database connections work
- [ ] User registration works
- [ ] Character creation works
- [ ] Game data endpoints return correctly
- [ ] Mobile apps connect to production API
- [ ] Push notifications are configured (if implemented)
- [ ] Error tracking is setup (optional: Sentry)
- [ ] Analytics is setup (optional: Google Analytics)

---

## Monitoring & Maintenance

### 1. Vercel Logs

Monitor API logs in Vercel Dashboard → Deployments → Logs

### 2. Supabase Monitoring

- Database → Logs (SQL queries)
- Auth → Users (user growth)
- Storage → Usage (if using file storage)

### 3. Error Tracking (Recommended)

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs @sentry/react-native
```

Configure in `packages/api/sentry.config.js` and `packages/app/sentry.config.js`

### 4. Backup Strategy

- Supabase auto-backups daily (retain 7 days on free tier)
- For critical data, set up additional backups
- Export game data JSON files to version control

---

## Scaling Considerations

### When you grow:

1. **Supabase**:
   - Upgrade to Pro tier for better performance
   - Add read replicas for scaling reads
   - Enable Point-in-Time Recovery

2. **Vercel**:
   - Upgrade to Pro for better performance
   - Add Edge Functions for global latency
   - Use ISR (Incremental Static Regeneration) for game data

3. **Database Optimization**:
   - Add indexes for frequently queried columns
   - Implement database connection pooling
   - Use materialized views for leaderboards

4. **Caching**:
   - Implement Redis for session storage
   - Cache game data (races, classes, monsters)
   - Use CDN for static assets

---

## Troubleshooting Production Issues

### API Returns 500 Errors

1. Check Vercel logs for errors
2. Verify environment variables are set
3. Check Supabase connection limits

### Mobile App Can't Connect

1. Verify EXPO_PUBLIC_API_URL is correct
2. Check CORS settings in API
3. Ensure SSL certificates are valid

### Users Can't Register

1. Check Supabase Auth settings
2. Verify email provider is configured
3. Check RLS policies on users table

---

## Security Best Practices

1. **Never commit `.env` files**
2. **Use service role key only on backend**
3. **Enable RLS on all Supabase tables**
4. **Implement rate limiting** (Vercel Edge Config)
5. **Use HTTPS everywhere**
6. **Regularly update dependencies**
7. **Monitor for vulnerabilities**: `npm audit`

---

## Support & Updates

### Updating the App

**API Updates:**
```bash
cd packages/api
git pull
vercel --prod
```

**Web Updates:**
```bash
cd packages/app
expo export:web
cd web-build
vercel --prod
```

**Mobile Updates:**
```bash
cd packages/app
# Update version in app.json
eas build --platform all --profile production
eas submit --platform all
```

---

**You're now live with Maelstorm RPG!** 🎲⚔️🐉

For questions or issues, open a GitHub issue or check the documentation.
