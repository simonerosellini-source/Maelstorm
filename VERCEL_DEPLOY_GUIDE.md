# ☁️ Guida Deploy Vercel - Maelstorm RPG API

Guida completa per deployare l'API backend di Maelstorm RPG su Vercel.

---

## 📋 Cosa Deployeremo

**API Backend Next.js** con:
- ✅ 10+ API endpoints (auth, characters, game data)
- ✅ Database Supabase integration
- ✅ TypeScript strict mode
- ✅ Serverless functions
- ✅ Automatic HTTPS
- ✅ Global CDN

**Endpoints disponibili**:
- `/api/auth/register` - Registrazione utenti
- `/api/auth/login` - Login utenti
- `/api/characters/*` - CRUD personaggi
- `/api/game/monsters` - 100 mostri
- `/api/game/spells` - 135 incantesimi
- `/api/game/classes` - 12 classi
- `/api/game/races` - 22 razze
- `/api/game/items` - 81 oggetti

---

## 🎯 QUICK START (3 Metodi)

### **Metodo 1: Deploy via Dashboard Vercel** (5 minuti) ⭐ FACILE

1. Vai su https://vercel.com
2. Sign up con GitHub
3. Click "Add New..." → "Project"
4. Importa repository `Maelstorm`
5. Configura (vedi sotto)
6. Deploy!

### **Metodo 2: Deploy via CLI** (10 minuti) ⭐ RACCOMANDATO

```bash
# Installa Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /home/user/Maelstorm
vercel

# Deploy production
vercel --prod
```

### **Metodo 3: Deploy via Git Push** (Auto) ⭐ PRO

Configura auto-deploy su ogni push:
1. Connetti repository su Vercel Dashboard
2. Ogni push a main/master → auto deploy production
3. Ogni push a branch → auto deploy preview

---

## 🚀 PROCESSO COMPLETO STEP-BY-STEP

### **STEP 1: Prerequisiti** (2 minuti)

#### Account Necessari:
- ✅ **GitHub account** (già ce l'hai - hai il repository)
- ✅ **Vercel account** (gratuito) - https://vercel.com
- ✅ **Supabase account** (gratuito) - https://supabase.com

#### Verifica Setup:
```bash
cd /home/user/Maelstorm

# Verifica struttura progetto
ls -la packages/api/src/pages/api/

# Dovrebbe mostrare:
# auth/, characters/, game/

# Verifica vercel.json
cat vercel.json
```

---

### **STEP 2: Setup Supabase** (10 minuti)

Prima di deployare su Vercel, devi avere Supabase pronto.

#### 2.1 Crea Progetto Supabase

1. Vai su https://supabase.com
2. Sign up / Login
3. Click "New Project"
4. Compila:
   - **Name**: `maelstorm-rpg`
   - **Database Password**: (scegli password forte, salvala!)
   - **Region**: `Europe West (Frankfurt)` o più vicina
5. Click "Create project" → Attendi 2-3 minuti

#### 2.2 Esegui Database Schema

```bash
# 1. Nel Supabase Dashboard → SQL Editor
# 2. Copia contenuto di:
cat /home/user/Maelstorm/supabase/schema.sql

# 3. Incolla nell'editor SQL
# 4. Click "Run"
# 5. Verifica: "Success. No rows returned"
```

#### 2.3 Ottieni API Keys

Nel Supabase Dashboard:
1. Vai su **Settings** → **API**
2. Copia questi 3 valori:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANTE**: Salva questi valori! Li userai nel prossimo step.

---

### **STEP 3: Deploy su Vercel via Dashboard** (5 minuti)

#### 3.1 Crea Account Vercel

1. Vai su https://vercel.com
2. Click "Sign Up"
3. Scegli "Continue with GitHub"
4. Autorizza Vercel ad accedere a GitHub

#### 3.2 Importa Progetto

1. Dashboard Vercel → Click "Add New..." → "Project"
2. Seleziona repository `Maelstorm` dalla lista
3. Click "Import"

#### 3.3 Configura Progetto

Nella schermata di configurazione:

**Framework Preset**: `Next.js` (dovrebbe auto-detect)

**Root Directory**: `packages/api`
- ⚠️ IMPORTANTE: Clicca "Edit" e specifica `packages/api`
- NON usare la root del monorepo

**Build Command**: `npm run build` (default OK)

**Output Directory**: `.next` (default OK)

**Install Command**: `npm install` (default OK)

#### 3.4 Configura Environment Variables

Clicca "Environment Variables" e aggiungi:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxxxxxxxxxx.supabase.co
Environment: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development
```

⚠️ **IMPORTANTE**: Usa i tuoi valori reali da Supabase!

#### 3.5 Deploy!

1. Click "Deploy"
2. Attendi 2-5 minuti
3. Verrai reindirizzato alla dashboard del progetto
4. Vedrai il build in progress

---

### **STEP 4: Deploy su Vercel via CLI** (Alternativa)

Se preferisci usare il terminale:

#### 4.1 Installa Vercel CLI

```bash
npm install -g vercel
```

#### 4.2 Login

```bash
vercel login

# Scegli metodo:
# - Email (ricevi link via email)
# - GitHub (autorizza via browser)
# - GitLab
# - Bitbucket
```

#### 4.3 Deploy

```bash
cd /home/user/Maelstorm

# First deploy (interactive)
vercel

# Rispondi ai prompt:
# Set up and deploy "~/Maelstorm"? → Yes
# Which scope? → Your account
# Link to existing project? → No
# What's your project's name? → maelstorm-api
# In which directory is your code located? → packages/api
# Want to override the settings? → No
```

**Durante il deploy**, vedrai:

```
🔍 Inspect: https://vercel.com/username/maelstorm-api/xxxxx
✅ Preview: https://maelstorm-api-xxxxx.vercel.app
```

#### 4.4 Configura Environment Variables via CLI

```bash
# Aggiungi Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL

# Quando richiesto:
# What's the value? → https://xxxxxxxxxxxxx.supabase.co
# Add to which environments? → Production, Preview, Development

# Aggiungi Anon Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Value: tua-anon-key

# Aggiungi Service Role Key
vercel env add SUPABASE_SERVICE_ROLE_KEY
# Value: tua-service-role-key
```

#### 4.5 Redeploy con Environment Variables

```bash
# Deploy production con env vars
vercel --prod
```

---

### **STEP 5: Verifica Deploy** (2 minuti)

Una volta completato il deploy, testa gli endpoints:

#### 5.1 Ottieni URL

Nella Vercel Dashboard o CLI output:
```
✅ Production: https://maelstorm-api.vercel.app
```

#### 5.2 Test Endpoints

**Test 1 - Health Check**:
```bash
curl https://maelstorm-api.vercel.app/api/game/races

# Dovrebbe restituire JSON con 22 razze
```

**Test 2 - Monsters**:
```bash
curl https://maelstorm-api.vercel.app/api/game/monsters

# Dovrebbe restituire JSON con 100 mostri
```

**Test 3 - Spells**:
```bash
curl https://maelstorm-api.vercel.app/api/game/spells

# Dovrebbe restituire JSON con 135 spell
```

**Test 4 - Classes**:
```bash
curl https://maelstorm-api.vercel.app/api/game/classes

# Dovrebbe restituire JSON con 12 classi
```

**Test 5 - Items**:
```bash
curl https://maelstorm-api.vercel.app/api/game/items

# Dovrebbe restituire JSON con 81 items
```

Se tutti i test passano → **✅ DEPLOY SUCCESSFUL!**

---

### **STEP 6: Configura Custom Domain** (Opzionale, 10 minuti)

Se hai un dominio personalizzato (es. `api.maelstorm.com`):

#### 6.1 Aggiungi Domain su Vercel

1. Dashboard Vercel → Your Project → Settings → Domains
2. Click "Add"
3. Inserisci: `api.maelstorm.com`
4. Vercel ti darà i DNS records da configurare

#### 6.2 Configura DNS

Nel tuo provider DNS (GoDaddy, Namecheap, Cloudflare, etc.):

```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
TTL: Auto
```

#### 6.3 Attendi Propagazione

- Verifica: https://dnschecker.org
- Tempo: 5 minuti - 48 ore (di solito ~15 minuti)
- Quando pronto, Vercel emette certificato SSL automatico

#### 6.4 Update App

Aggiorna URL API nella tua app mobile:

```bash
# In packages/app/eas.json
"EXPO_PUBLIC_API_URL": "https://api.maelstorm.com/api"
```

---

## 📊 Configurazione Vercel (vercel.json)

Il progetto ha già `vercel.json` configurato:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "packages/api/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "packages/api/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-key"
  }
}
```

**Cosa fa**:
- ✅ Specifica build Next.js in `packages/api`
- ✅ Route tutte le richieste `/api/*` al backend
- ✅ Definisce environment variables necessarie

---

## 🔧 Gestione Environment Variables

### Via Dashboard

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Edit / Add / Delete variables
3. **IMPORTANTE**: Dopo modifiche, redeploy:
   - Deployments → Latest → ⋯ → Redeploy

### Via CLI

```bash
# Lista tutte le env vars
vercel env ls

# Aggiungi nuova
vercel env add VARIABLE_NAME

# Rimuovi
vercel env rm VARIABLE_NAME

# Pull env vars localmente (per testing)
vercel env pull .env.local
```

---

## 🚀 Deployment Workflow

### Development Workflow

```bash
# 1. Fai modifiche al codice
vim packages/api/src/pages/api/game/monsters.ts

# 2. Test locale
cd packages/api
npm run dev
# Test su http://localhost:3001/api/game/monsters

# 3. Commit
git add .
git commit -m "Add new monster endpoint feature"

# 4. Push
git push origin main

# 5. Vercel auto-deploya! (se configurato)
# Oppure manualmente:
vercel --prod
```

### Preview Deployments

Ogni branch ha preview automatico:

```bash
# Crea feature branch
git checkout -b feature/new-api

# Fai modifiche e push
git push origin feature/new-api

# Vercel crea automaticamente:
# https://maelstorm-api-feature-new-api-xxxxx.vercel.app
```

### Production Deployment

```bash
# Merge to main
git checkout main
git merge feature/new-api
git push origin main

# Vercel deploya automaticamente a production
# https://maelstorm-api.vercel.app
```

---

## 📈 Monitoring & Logs

### Vercel Dashboard

1. **Analytics**:
   - Project → Analytics
   - Vedi requests, errors, performance

2. **Logs**:
   - Project → Deployments → Click deployment → Logs
   - Real-time function logs
   - Filter by function, severity

3. **Performance**:
   - Project → Speed Insights
   - Core Web Vitals
   - Function execution times

### Via CLI

```bash
# Tail logs in real-time
vercel logs

# Logs per specific deployment
vercel logs DEPLOYMENT_URL

# Filter logs
vercel logs --follow
```

---

## 💰 Costi Vercel

### Hobby Plan (FREE) ✅

**Include**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/mese
- ✅ Serverless Functions (100 GB-hours)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Git integration

**Limiti**:
- ⚠️ 1 concurrent build
- ⚠️ 10s max function execution
- ⚠️ No team collaboration

**Perfetto per**: Testing, progetti personali, MVP

### Pro Plan ($20/mese)

**Include tutto Hobby +**:
- ✅ 1 TB bandwidth/mese
- ✅ 1000 GB-hours functions
- ✅ 60s max function execution
- ✅ Team collaboration
- ✅ Password protection
- ✅ Analytics avanzate

**Perfetto per**: Startup, app in crescita

### Enterprise (Custom)

Contatta sales per:
- ✅ Bandwidth illimitato
- ✅ SLA 99.99%
- ✅ Dedicated support
- ✅ Advanced security

---

## 🔐 Security Best Practices

### 1. Environment Variables

**MAI committare secrets**:
```bash
# ❌ WRONG
git add .env
git commit -m "Add env"

# ✅ CORRECT
# Use Vercel Dashboard o CLI per env vars
vercel env add SECRET_KEY
```

### 2. CORS Configuration

Se l'app mobile ha problemi CORS, aggiungi in `packages/api/src/middleware.ts`:

```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
```

### 3. Rate Limiting

Per proteggere da abusi, usa Vercel Edge Config:

```typescript
import { kv } from '@vercel/kv';

export async function rateLimit(ip: string) {
  const requests = await kv.incr(`rate:${ip}`);
  await kv.expire(`rate:${ip}`, 60); // 60 seconds

  if (requests > 100) {
    throw new Error('Rate limit exceeded');
  }
}
```

### 4. API Key Authentication

Per endpoints sensibili:

```typescript
export default async function handler(req, res) {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ... rest of handler
}
```

---

## 🔧 Troubleshooting

### Errore: "Build failed"

**Causa**: Errori TypeScript o build
**Soluzione**:
```bash
# Test build locale
cd packages/api
npm install
npm run build

# Fix errori e redeploy
```

### Errore: "Function execution timed out"

**Causa**: Function impiega >10s (Hobby) o >60s (Pro)
**Soluzione**:
- Ottimizza query database
- Aggiungi indici in Supabase
- Cache dati frequenti
- Upgrade a Pro plan

### Errore: "Module not found"

**Causa**: Dipendenza non installata o path errato
**Soluzione**:
```bash
# Verifica package.json
cat packages/api/package.json

# Verifica imports in codice
grep -r "from '@maelstorm" packages/api/src
```

### Errore: "Environment variable not defined"

**Causa**: Env var non configurata
**Soluzione**:
```bash
# Lista env vars
vercel env ls

# Aggiungi mancante
vercel env add VARIABLE_NAME

# Redeploy
vercel --prod
```

### Errore: "Database connection failed"

**Causa**: Supabase URL o key errata
**Soluzione**:
1. Verifica credentials in Supabase Dashboard
2. Re-aggiungi env vars su Vercel
3. Redeploy

### Preview URL non funziona

**Causa**: Branch non pusciato o auto-deploy disabilitato
**Soluzione**:
1. Vercel Dashboard → Project → Settings → Git
2. Verifica "Automatic Deployments" sia ON
3. Push branch: `git push origin feature-branch`

---

## 📱 Integrazione con App Mobile

Dopo deploy, aggiorna app mobile con l'URL production:

### packages/app/eas.json

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://xxxxxxxxxxxxx.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGc...",
        "EXPO_PUBLIC_API_URL": "https://maelstorm-api.vercel.app/api"
      }
    }
  }
}
```

### Test da App Mobile

```bash
# Rebuild app con nuovo URL
eas build --platform ios --profile production

# Oppure per testing rapido, usa Expo Go:
cd packages/app
expo start
# Premi 'i' per iOS o 'a' per Android
```

---

## 🎯 Comandi Rapidi di Riferimento

```bash
# === SETUP ===
npm install -g vercel              # Installa CLI
vercel login                       # Login
vercel link                        # Link progetto esistente

# === DEPLOY ===
vercel                             # Deploy preview
vercel --prod                      # Deploy production
vercel --force                     # Force redeploy

# === ENVIRONMENT ===
vercel env ls                      # Lista env vars
vercel env add VAR_NAME            # Aggiungi env var
vercel env rm VAR_NAME             # Rimuovi env var
vercel env pull                    # Download env vars localmente

# === MONITORING ===
vercel logs                        # View logs
vercel logs --follow               # Tail logs
vercel inspect DEPLOYMENT_URL      # Dettagli deployment

# === PROJECTS ===
vercel list                        # Lista progetti
vercel switch                      # Cambia progetto
vercel domains add domain.com      # Aggiungi domain

# === ROLLBACK ===
vercel rollback DEPLOYMENT_URL     # Rollback a deployment specifico
```

---

## ✅ Checklist Pre-Deploy

Prima di fare il deploy production, verifica:

- [ ] **Supabase configurato**
  - [ ] Database schema eseguito
  - [ ] API keys salvate

- [ ] **Codice pronto**
  - [ ] Tutti i test passano
  - [ ] Build locale funziona (`npm run build`)
  - [ ] No errori TypeScript

- [ ] **Vercel account**
  - [ ] Account creato
  - [ ] Repository connesso (se auto-deploy)

- [ ] **Environment variables**
  - [ ] NEXT_PUBLIC_SUPABASE_URL configurata
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configurata
  - [ ] SUPABASE_SERVICE_ROLE_KEY configurata

- [ ] **Testing**
  - [ ] API testata localmente
  - [ ] Endpoints rispondono correttamente

- [ ] **Git**
  - [ ] Tutto committato
  - [ ] Pushato su GitHub

---

## 🚀 Deploy in 3 Comandi

**Setup veloce**:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy!
cd /home/user/Maelstorm
vercel --prod

# Done! 🎉
# Your API is live at: https://maelstorm-api.vercel.app
```

---

## 📚 Risorse Utili

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vercel CLI Reference**: https://vercel.com/docs/cli
- **Vercel Support**: https://vercel.com/support

---

## 🎉 Prossimi Step

Dopo deploy successful:

1. ✅ Testa tutti gli endpoints
2. ✅ Integra URL nell'app mobile
3. ✅ Setup custom domain (opzionale)
4. ✅ Configura monitoring e alerts
5. ✅ Deploy app mobile iOS/Android
6. ✅ Launch! 🚀

---

**Pronto per il deploy? Esegui:**

```bash
vercel login
cd /home/user/Maelstorm
vercel --prod
```

**Buon deploy! ☁️⚔️🐉**
