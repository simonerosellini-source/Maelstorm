# Setup Database Supabase - Guida Passo-Passo

## 🚨 IMPORTANTE: Esegui questa guida DOPO aver riattivato il progetto Supabase

## Prerequisiti

1. **Progetto Supabase attivo**
   - Vai su [app.supabase.com](https://app.supabase.com)
   - Verifica che il progetto sia **attivo** (non in pausa)
   - Se è in pausa, clicca su "Restore Project" e attendi 2-3 minuti

## Passaggi per Creare il Database

### 1. Accedi al SQL Editor di Supabase

1. Vai su [app.supabase.com](https://app.supabase.com)
2. Seleziona il progetto **Maelstorm**
3. Nel menu laterale sinistro, clicca su **SQL Editor**

### 2. Copia il contenuto del file schema.sql

Ci sono 2 modi per farlo:

#### Opzione A: Copia dal file locale

1. Apri il file `/home/user/Maelstorm/supabase/schema.sql`
2. Seleziona tutto il contenuto (Ctrl+A / Cmd+A)
3. Copia (Ctrl+C / Cmd+C)

#### Opzione B: Usa il comando cat

```bash
cat /home/user/Maelstorm/supabase/schema.sql
```

Poi copia l'output.

### 3. Incolla ed Esegui lo Schema

1. Nel **SQL Editor** di Supabase, clicca su **New query**
2. Incolla tutto il contenuto del file `schema.sql`
3. Clicca sul pulsante **Run** (o premi Ctrl+Enter / Cmd+Enter)
4. Attendi che l'esecuzione sia completata

### 4. Verifica che le Tabelle siano state Create

Nel SQL Editor, esegui questa query per verificare:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Dovresti vedere queste tabelle:
- ✅ `achievements`
- ✅ `characters`
- ✅ `combats`
- ✅ `dungeon_progress`
- ✅ `dungeons`
- ✅ `notifications`
- ✅ `parties`
- ✅ `player_achievements`
- ✅ `player_interactions`
- ✅ `trade_offers`
- ✅ `users`

### 5. Configura le Variabili d'Ambiente

Assicurati che il file `.env.local` nella root del progetto contenga:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-service-role-key

# Expo (per l'app mobile)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-anon-key
EXPO_PUBLIC_API_URL=http://localhost:3001/api

# API
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Come trovare le chiavi:**
1. In Supabase dashboard → Settings → API
2. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 6. Abilita l'Autenticazione Email

1. Vai su **Authentication** → **Providers**
2. Abilita **Email** provider
3. Configura (opzionale):
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 7. Testa la Connessione

Una volta completato il setup, testa la connessione:

```bash
# Avvia il server API
cd packages/api
npm run dev

# In un altro terminale, testa l'endpoint health
curl http://localhost:3001/api/health
```

Dovresti vedere una risposta simile a:

```json
{
  "api": {
    "status": "ok",
    "timestamp": "2025-11-07T..."
  },
  "database": {
    "status": "ok",
    "message": "Database connection is healthy"
  }
}
```

## Risoluzione Problemi

### Errore: "permission denied for schema public"

Esegui questa query nel SQL Editor:

```sql
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;
```

### Errore: "extension uuid-ossp does not exist"

Lo schema lo crea automaticamente, ma se hai problemi:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Tabelle già esistenti

Se alcune tabelle esistono già, puoi:

1. **Eliminarle tutte** (ATTENZIONE: perdi tutti i dati):
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   ```

2. Poi riesegui lo schema completo

### Verificare le Row Level Security (RLS)

Esegui questa query per verificare che RLS sia attiva:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

Tutte le tabelle dovrebbero avere `rowsecurity = true`.

## 📝 Note Importanti

- ⚠️ Lo schema include dati di esempio per gli achievements
- 🔒 Row Level Security (RLS) è abilitata su tutte le tabelle
- 🔄 Trigger automatici aggiornano `updated_at` quando modifichi record
- 👥 Gli utenti possono vedere solo i propri dati (tranne parties)
- 🎮 Le policy RLS proteggono i dati sensibili dei giocatori

## ✅ Setup Completato

Una volta completati tutti i passaggi:

1. ✅ Database schema creato
2. ✅ Tabelle e indici creati
3. ✅ RLS abilitata
4. ✅ Triggers configurati
5. ✅ Achievements di esempio inseriti
6. ✅ Variabili d'ambiente configurate
7. ✅ Connessione testata

Ora puoi iniziare a usare l'applicazione! 🎉
