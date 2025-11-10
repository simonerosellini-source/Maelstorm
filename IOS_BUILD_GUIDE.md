# 📱 Guida Build iOS - Maelstorm RPG

Guida completa per buildare l'app Maelstorm RPG per iOS usando Expo Application Services (EAS).

---

## 📋 Prerequisiti

### 1. Account Necessari
- ✅ **Account Expo** (gratuito) - https://expo.dev
- ✅ **Account Apple Developer** ($99/anno) - https://developer.apple.com
- ✅ **Macchina**: Non serve Mac! EAS Build funziona su cloud ☁️

### 2. Tools da Installare
```bash
# Node.js 18+ (già installato)
node --version

# Expo CLI
npm install -g expo-cli

# EAS CLI
npm install -g eas-cli
```

---

## 🚀 PROCESSO BUILD IOS (Step-by-Step)

### STEP 1: Setup Account Expo (5 minuti)

```bash
cd /home/user/Maelstorm/packages/app

# Login a Expo
eas login
# Inserisci email e password del tuo account Expo
# Se non hai account: eas register
```

**Verifica login**:
```bash
eas whoami
# Dovrebbe mostrare il tuo username
```

---

### STEP 2: Configura Progetto EAS (5 minuti)

```bash
# Inizializza EAS nel progetto
eas build:configure

# Questo comando:
# ✅ Crea/aggiorna eas.json (già fatto!)
# ✅ Registra il progetto su Expo
# ✅ Ti chiederà di scegliere un slug unico
```

**Rispondi ai prompt**:
- `Would you like to automatically create an EAS project?` → **Yes**
- Slug sarà: `maelstorm-rpg` (già configurato in app.json)

---

### STEP 3: Configura Credenziali Apple (10 minuti)

Hai **2 opzioni**:

#### Opzione A: EAS Gestisce Tutto (Raccomandato) ✅

EAS può gestire automaticamente certificati e provisioning profiles:

```bash
# Quando fai il primo build, EAS chiederà:
# "Do you want to generate new credentials?" → Yes
# "Apple ID:" → Inserisci la tua Apple ID
# "Password:" → Password Apple ID
```

EAS creerà automaticamente:
- iOS Distribution Certificate
- Provisioning Profile
- Push Notification Certificate

#### Opzione B: Usa Certificati Esistenti

Se hai già certificati Apple:

```bash
eas credentials

# Scegli: iOS → Production
# Upload manuale dei certificati
```

---

### STEP 4: Aggiorna Configurazione Ambiente

Modifica `packages/app/eas.json` nella sezione `production.env`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://TUOPROGETTO.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "tua-anon-key-qui",
        "EXPO_PUBLIC_API_URL": "https://tua-api.vercel.app/api"
      }
    }
  }
}
```

**IMPORTANTE**: Sostituisci con i tuoi valori reali da Supabase!

---

### STEP 5: Build per iOS (15-30 minuti)

#### Build per Simulatore (Test, più veloce)

```bash
cd /home/user/Maelstorm/packages/app

# Build development per simulatore iOS
eas build --platform ios --profile development

# Questo build:
# - È più veloce (5-10 minuti)
# - Funziona solo su simulatore Mac
# - Include dev tools e hot reload
```

#### Build per Device Reale (Test interno)

```bash
# Build preview per device reali
eas build --platform ios --profile preview

# Questo build:
# - Funziona su device fisici
# - Distribuzione interna (non App Store)
# - Circa 15-20 minuti
```

#### Build per App Store (Production)

```bash
# Build production per App Store
eas build --platform ios --profile production

# Questo build:
# - Ottimizzato per production
# - Pronto per submission App Store
# - Circa 20-30 minuti
```

---

### STEP 6: Monitoraggio Build

Durante il build, vedrai:

```
✔ Build started, it may take a few minutes to complete.
🔗 Build details: https://expo.dev/accounts/USERNAME/projects/maelstorm-rpg/builds/BUILD_ID

Waiting for build to complete...
⠼ Build in progress...
```

**Puoi**:
1. Aspettare nel terminale (mostra progress live)
2. Chiudere e controllare dopo su: https://expo.dev
3. Riceverai email quando il build è completo

---

### STEP 7: Download & Test Build

Quando il build è completato:

```bash
# Lista tutti i build
eas build:list

# Download dell'ultimo build
eas build:download --latest

# File scaricato: maelstorm-rpg-1.0.0.ipa (o .tar.gz per simulator)
```

#### Test su Simulatore:

```bash
# Se hai un Mac con Xcode:
cd ~/Downloads
tar -xvf maelstorm-rpg-*.tar.gz
xcrun simctl install booted Maelstorm\ RPG.app
xcrun simctl launch booted com.maelstorm.rpg
```

#### Test su Device Reale:

**Opzione 1 - TestFlight (interno)**:
```bash
eas submit --platform ios --profile preview
```

**Opzione 2 - Direct Install**:
- Scarica l'IPA file
- Usa Apple Configurator 2 o Xcode
- Installa direttamente sul device connesso

---

### STEP 8: Submission App Store (Opzionale)

#### 8.1 Prepara App Store Connect

1. Vai su https://appstoreconnect.apple.com
2. Clicca "My Apps" → "+" → "New App"
3. Compila informazioni:
   - **Name**: Maelstorm RPG
   - **Bundle ID**: com.maelstorm.rpg (select from dropdown)
   - **SKU**: maelstorm-rpg-001
   - **User Access**: Full Access

4. Prepara metadata:
   - Screenshots (richiesti 6.5", 5.5")
   - App icon 1024x1024
   - Description
   - Keywords
   - Privacy Policy URL
   - Support URL

#### 8.2 Submit Build

```bash
# Automatic submission via EAS
eas submit --platform ios --profile production

# Segui i prompt:
# - Apple ID: tua-apple-id@example.com
# - Password: (o App-Specific Password se hai 2FA)
# - ASC App ID: (da App Store Connect)
```

#### 8.3 Submit for Review

1. Torna su App Store Connect
2. Seleziona il build appena uploadato
3. Compila tutte le informazioni richieste
4. Clicca "Submit for Review"
5. Attendi 1-3 giorni per la review Apple

---

## 🎯 Comandi Rapidi di Riferimento

```bash
# === LOGIN ===
eas login
eas whoami

# === CONFIGURAZIONE ===
eas build:configure
eas credentials

# === BUILD ===
# Simulator (dev)
eas build --platform ios --profile development

# Device test (internal)
eas build --platform ios --profile preview

# Production (App Store)
eas build --platform ios --profile production

# === MONITORING ===
eas build:list
eas build:view BUILD_ID
eas build:download --latest

# === SUBMISSION ===
eas submit --platform ios
```

---

## 📊 Profili Build Spiegati

### Development Profile
```json
"development": {
  "developmentClient": true,
  "distribution": "internal",
  "ios": {
    "simulator": true
  }
}
```
- **Uso**: Testing locale su simulatore
- **Tempo**: 5-10 minuti
- **Output**: .tar.gz con .app
- **Richiede**: Nessuna credential Apple
- **Dev tools**: ✅ Inclusi

### Preview Profile
```json
"preview": {
  "distribution": "internal",
  "ios": {
    "simulator": false,
    "buildConfiguration": "Release"
  }
}
```
- **Uso**: Testing interno su device reali
- **Tempo**: 15-20 minuti
- **Output**: .ipa file
- **Richiede**: Development Certificate
- **Distribution**: Ad-hoc o Enterprise

### Production Profile
```json
"production": {
  "ios": {
    "buildConfiguration": "Release"
  }
}
```
- **Uso**: Submission App Store
- **Tempo**: 20-30 minuti
- **Output**: .ipa file
- **Richiede**: Distribution Certificate
- **Distribution**: App Store

---

## 🔧 Troubleshooting Comuni

### Errore: "Bundle identifier already exists"

**Causa**: Il bundle ID è già usato da un'altra app
**Soluzione**: Cambia in app.json:
```json
"ios": {
  "bundleIdentifier": "com.tuonome.maelstorm"
}
```

### Errore: "Invalid Apple ID credentials"

**Causa**: Password errata o 2FA attivo
**Soluzione**:
1. Se hai 2FA, genera App-Specific Password:
   - Vai su appleid.apple.com
   - Security → App-Specific Passwords
   - Genera nuova password
   - Usa quella invece della password normale

### Errore: "No matching provisioning profiles"

**Causa**: Provisioning profile non configurato
**Soluzione**:
```bash
eas credentials
# Seleziona iOS → Production → Generate new
```

### Build fallisce con "Out of memory"

**Causa**: Progetto troppo grande per tier gratuito
**Soluzione**:
1. Upgrade a EAS Production plan ($29/mese)
2. Oppure ottimizza bundle:
   - Rimuovi assets non usati
   - Usa .png compressi per immagini

### Errore: "Invalid entitlements"

**Causa**: Capabilities non configurate in App Store Connect
**Soluzione**:
1. Vai su developer.apple.com
2. Certificates → Identifiers
3. Seleziona il tuo bundle ID
4. Abilita capabilities necessarie

---

## 📦 Cosa Include il Build

Il build iOS includerà:

✅ **App Code**:
- Tutte le screen (Combat, Character, Dungeon, etc.)
- Sistema effetti grafici
- Navigazione completa

✅ **Game Data**:
- 100 mostri
- 135 incantesimi
- 12 classi
- 81 items
- 22 razze

✅ **Assets**:
- Icon e Splash screen
- Fonts
- Immagini

✅ **Dependencies**:
- React Native
- Expo SDK
- react-native-reanimated (animazioni)
- Supabase client
- Tutte le altre dipendenze

**Dimensione finale**: ~50-80 MB (compressed IPA)

---

## ⚙️ Configurazione Avanzata

### Custom Native Code

Se hai bisogno di native code personalizzato:

```bash
# Crea configurazione custom
expo prebuild

# Questo genera:
# - ios/ directory con progetto Xcode
# - android/ directory con progetto Android

# Poi puoi usare EAS per build con native code
eas build --platform ios
```

### Update Over-The-Air (OTA)

Per aggiornare l'app senza rebuild completo:

```bash
# Pubblica update JavaScript
eas update --branch production --message "Fix combat bug"

# Gli utenti riceveranno l'update automaticamente
# Funziona solo per JavaScript/assets, non native code
```

---

## 💰 Costi

### Expo EAS Build
- **Free tier**: 30 build/mese
- **Production**: $29/mese, build illimitati
- **Enterprise**: $99/mese, priority build

### Apple Developer
- **Developer Program**: $99/anno (obbligatorio per App Store)

### Totale per iniziare:
- **Minimo**: $99/anno (solo Apple Developer)
- **Consigliato**: $99/anno + $29/mese = $447/anno

---

## 📱 Testing Prima del Launch

### 1. TestFlight (Raccomandato)

```bash
# Submit a TestFlight
eas submit --platform ios

# In App Store Connect:
# - Aggiungi beta testers
# - Invita via email
# - Riceveranno link per TestFlight app
```

**Vantaggi**:
- Fino a 10,000 beta testers
- Distribuzione facile
- Crash reports automatici
- Feedback integrato

### 2. Ad-Hoc Distribution

Per team interno (max 100 devices):

```bash
# Build con profilo ad-hoc
eas build --platform ios --profile preview

# Distribuisci IPA via:
# - Xcode
# - Apple Configurator
# - DiAWI, InstallrApp, etc.
```

---

## 🎯 Checklist Prima del Build

Prima di fare il build production, verifica:

- [ ] `app.json` configurato correttamente
  - [ ] Nome app
  - [ ] Version number
  - [ ] Bundle identifier unico
  - [ ] Icon e splash screen presenti

- [ ] `eas.json` configurato
  - [ ] Environment variables corrette
  - [ ] Profili build definiti

- [ ] Apple Developer Account
  - [ ] Pagamento attivo
  - [ ] Agreements accettati

- [ ] App Store Connect
  - [ ] App creata
  - [ ] Bundle ID registrato

- [ ] Testing
  - [ ] App testata su simulatore
  - [ ] Testata su device fisico
  - [ ] Nessun crash critico

- [ ] Legal
  - [ ] Privacy Policy preparata
  - [ ] Terms of Service
  - [ ] EULA (se necessario)

---

## 📚 Risorse Utili

- **Expo EAS Docs**: https://docs.expo.dev/build/introduction/
- **Apple Developer**: https://developer.apple.com/documentation/
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Expo Discord**: https://chat.expo.dev/
- **Stack Overflow**: Tag `expo` e `eas-build`

---

## 🚀 Next Steps

Dopo il primo build iOS:

1. **Test completo** su TestFlight con beta testers
2. **Fix bugs** e rilascia updates
3. **Build Android** seguendo processo simile
4. **Submit per review** App Store
5. **Marketing** e launch! 🎉

---

**Pronto per iniziare? Esegui:**

```bash
cd /home/user/Maelstorm/packages/app
eas login
eas build --platform ios --profile production
```

**Buon build! 🍎⚔️🐉**
