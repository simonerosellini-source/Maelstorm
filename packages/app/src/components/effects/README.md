# Effects System Documentation

Sistema completo di effetti grafici e animazioni per Maelstorm RPG.

## Componenti Disponibili

### 1. ParticleEffect

Effetti particellari per spell e azioni magiche.

**Tipi supportati:**
- `fire` - Particelle di fuoco (rosso/arancione)
- `ice` - Particelle di ghiaccio (blu)
- `lightning` - Particelle di fulmine (giallo)
- `heal` - Particelle di guarigione (verde)
- `damage` - Particelle di danno (rosso scuro)
- `magic` - Particelle magiche (viola)

**Esempio:**
```tsx
<ParticleEffect
  type="fire"
  count={30}
  duration={1500}
  onComplete={() => console.log('Effect complete')}
/>
```

**Props:**
- `type`: ParticleType - Tipo di particelle
- `count?`: number - Numero di particelle (default: 20)
- `duration?`: number - Durata in ms (default: 1000)
- `onComplete?`: () => void - Callback al completamento

---

### 2. DamageText

Testo animato per mostrare danni e guarigioni.

**Tipi di danno supportati:**
- `physical` - Grigio
- `fire` - Rosso/arancione
- `cold` - Blu
- `lightning` - Giallo
- `poison` - Verde
- `acid` - Verde acido
- `psychic` - Rosa/viola
- `necrotic` - Viola scuro
- `radiant` - Oro
- `force` - Viola chiaro

**Esempio:**
```tsx
<DamageText
  amount={42}
  type="fire"
  isCritical={true}
  onComplete={() => setShowDamage(false)}
/>

<DamageText
  amount={25}
  type="physical"
  isHealing={true}
/>
```

**Props:**
- `amount`: number - Quantità di danno/guarigione
- `type`: DamageType - Tipo di danno
- `isHealing?`: boolean - Se true, mostra guarigione (default: false)
- `isCritical?`: boolean - Se true, effetto più grande (default: false)
- `onComplete?`: () => void - Callback al completamento

---

### 3. ScreenFlash

Flash dello schermo per impatti e effetti drammatici.

**Esempio:**
```tsx
<ScreenFlash
  color="#FF0000"
  duration={300}
  intensity={0.6}
  onComplete={() => setShowFlash(false)}
/>
```

**Props:**
- `color?`: string - Colore del flash (default: '#FFFFFF')
- `duration?`: number - Durata in ms (default: 300)
- `intensity?`: number - Intensità 0-1 (default: 0.5)
- `onComplete?`: () => void - Callback al completamento

---

### 4. SpellCastEffect

Effetto completo di casting spell con cerchi magici rotanti.

**Scuole di magia supportate:**
- `abjuration` - Blu
- `conjuration` - Viola
- `divination` - Oro
- `enchantment` - Rosa
- `evocation` - Rosso
- `illusion` - Rosa/viola chiaro
- `necromancy` - Grigio scuro/nero
- `transmutation` - Verde

**Esempio:**
```tsx
<SpellCastEffect
  spellSchool="evocation"
  duration={1500}
  onComplete={() => setShowSpell(false)}
/>
```

**Props:**
- `spellSchool`: string - Scuola di magia
- `duration?`: number - Durata in ms (default: 1200)
- `onComplete?`: () => void - Callback al completamento

---

### 5. FadeTransition

Transizioni animate per UI elements.

**Tipi di transizione:**
- `fade` - Dissolvenza semplice
- `slideUp` - Scivola dal basso
- `slideDown` - Scivola dall'alto
- `slideLeft` - Scivola da destra
- `slideRight` - Scivola da sinistra
- `scale` - Scala in/out

**Esempio:**
```tsx
<FadeTransition
  visible={isVisible}
  type="slideUp"
  duration={300}
>
  <View>
    <Text>Contenuto animato</Text>
  </View>
</FadeTransition>
```

**Props:**
- `children`: React.ReactNode - Contenuto da animare
- `visible`: boolean - Visibilità
- `duration?`: number - Durata in ms (default: 300)
- `type?`: string - Tipo di transizione (default: 'fade')
- `style?`: ViewStyle - Stile custom

---

### 6. AnimatedButton

Pulsante con feedback visivo e animazioni.

**Varianti:**
- `primary` - Blu
- `secondary` - Grigio
- `danger` - Rosso
- `success` - Verde

**Esempio:**
```tsx
<AnimatedButton
  title="Cast Fireball"
  onPress={handleCast}
  variant="danger"
/>
```

**Props:**
- `title`: string - Testo del pulsante
- `onPress`: () => void - Handler click
- `variant?`: string - Variante di colore (default: 'primary')
- `disabled?`: boolean - Disabilitato (default: false)
- `style?`: ViewStyle - Stile custom
- `textStyle?`: TextStyle - Stile testo custom

---

## Utilizzo negli Screen

### Esempio: Combat Screen

```tsx
import { ParticleEffect, DamageText, ScreenFlash } from '@/components/effects';

const CombatScreen = () => {
  const [effects, setEffects] = useState({
    particles: false,
    damage: false,
    flash: false,
  });

  const handleAttack = () => {
    // Flash rosso
    setEffects(prev => ({ ...prev, flash: true }));

    // Dopo 100ms, particelle di fuoco
    setTimeout(() => {
      setEffects(prev => ({ ...prev, particles: true }));
    }, 100);

    // Dopo 300ms, testo danno
    setTimeout(() => {
      setEffects(prev => ({ ...prev, damage: true }));
    }, 300);
  };

  return (
    <View>
      {/* UI normale */}
      <AnimatedButton title="Attack" onPress={handleAttack} />

      {/* Effetti */}
      {effects.flash && (
        <ScreenFlash
          color="#FF0000"
          onComplete={() => setEffects(prev => ({ ...prev, flash: false }))}
        />
      )}

      {effects.particles && (
        <ParticleEffect
          type="fire"
          onComplete={() => setEffects(prev => ({ ...prev, particles: false }))}
        />
      )}

      {effects.damage && (
        <DamageText
          amount={42}
          type="fire"
          onComplete={() => setEffects(prev => ({ ...prev, damage: false }))}
        />
      )}
    </View>
  );
};
```

### Esempio: Spell Cast

```tsx
const handleCastSpell = (spell: Spell) => {
  // Mostra effetto casting
  setShowSpellCast(true);

  // Dopo l'animazione, applica effetto
  setTimeout(() => {
    setShowParticles(true);
    applySpellEffect(spell);
  }, 800);
};
```

---

## Performance Tips

1. **Limitare particelle simultanee**: Max 2-3 effetti particellari contemporaneamente
2. **Riutilizzare componenti**: Usare state per show/hide invece di mount/unmount
3. **Ottimizzare durate**: Effetti troppo lunghi rallentano l'app
4. **Web compatibility**: Tutti gli effetti funzionano su iOS, Android e Web

---

## Dependencies

- `react-native-reanimated` ~3.6.2
- `react-native-svg` 14.1.0
- `expo-linear-gradient` ~12.7.0
- `lottie-react-native` 6.5.1
