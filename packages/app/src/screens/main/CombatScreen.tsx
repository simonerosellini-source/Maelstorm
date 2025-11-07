import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import {
  ParticleEffect,
  ParticleType,
  DamageText,
  DamageType,
  ScreenFlash,
  SpellCastEffect,
  FadeTransition,
  AnimatedButton,
} from '@/components/effects';

interface CombatEntity {
  id: string;
  name: string;
  currentHp: number;
  maxHp: number;
  armorClass: number;
  isPlayer: boolean;
}

interface CombatEffects {
  particles: boolean;
  particleType: ParticleType;
  damage: boolean;
  damageAmount: number;
  damageType: DamageType;
  isCritical: boolean;
  isHealing: boolean;
  flash: boolean;
  flashColor: string;
  spellCast: boolean;
  spellSchool: string;
}

export default function CombatScreen() {
  const [player, setPlayer] = useState<CombatEntity>({
    id: 'player',
    name: 'Adventurer',
    currentHp: 45,
    maxHp: 58,
    armorClass: 16,
    isPlayer: true,
  });

  const [enemy, setEnemy] = useState<CombatEntity>({
    id: 'goblin',
    name: 'Goblin Warrior',
    currentHp: 15,
    maxHp: 21,
    armorClass: 13,
    isPlayer: false,
  });

  const [effects, setEffects] = useState<CombatEffects>({
    particles: false,
    particleType: 'fire',
    damage: false,
    damageAmount: 0,
    damageType: 'physical',
    isCritical: false,
    isHealing: false,
    flash: false,
    flashColor: '#FFFFFF',
    spellCast: false,
    spellSchool: 'evocation',
  });

  const [combatLog, setCombatLog] = useState<string[]>([
    'Combat begins!',
    'A Goblin Warrior approaches...',
  ]);

  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [isAnimating, setIsAnimating] = useState(false);

  const addToLog = (message: string) => {
    setCombatLog((prev) => [...prev, message]);
  };

  const damageEntity = (
    target: CombatEntity,
    amount: number,
    type: DamageType,
    isCrit: boolean = false
  ) => {
    const newHp = Math.max(0, target.currentHp - amount);
    if (target.isPlayer) {
      setPlayer((prev) => ({ ...prev, currentHp: newHp }));
    } else {
      setEnemy((prev) => ({ ...prev, currentHp: newHp }));
    }
    return newHp;
  };

  const healEntity = (target: CombatEntity, amount: number) => {
    const newHp = Math.min(target.maxHp, target.currentHp + amount);
    if (target.isPlayer) {
      setPlayer((prev) => ({ ...prev, currentHp: newHp }));
    } else {
      setEnemy((prev) => ({ ...prev, currentHp: newHp }));
    }
    return newHp;
  };

  const handleAttack = async () => {
    if (isAnimating || turn !== 'player') return;
    setIsAnimating(true);

    // Roll for hit
    const attackRoll = Math.floor(Math.random() * 20) + 1;
    const isCritical = attackRoll === 20;
    const damage = isCritical
      ? Math.floor(Math.random() * 8) + Math.floor(Math.random() * 8) + 4
      : Math.floor(Math.random() * 8) + 4;

    if (attackRoll + 5 >= enemy.armorClass || isCritical) {
      addToLog(
        `${player.name} attacks with sword! ${isCritical ? 'CRITICAL HIT!' : 'Hit!'} (${damage} damage)`
      );

      // Flash effect
      setEffects((prev) => ({ ...prev, flash: true, flashColor: '#FF0000' }));

      // Wait for flash
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Particle effect
      setEffects((prev) => ({ ...prev, particles: true, particleType: 'damage' }));

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Damage text
      const newHp = damageEntity(enemy, damage, 'physical', isCritical);
      setEffects((prev) => ({
        ...prev,
        damage: true,
        damageAmount: damage,
        damageType: 'physical',
        isCritical,
        isHealing: false,
      }));

      // Check if enemy defeated
      if (newHp <= 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        addToLog(`${enemy.name} is defeated!`);
        setIsAnimating(false);
        return;
      }

      // Enemy turn
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTurn('enemy');
      enemyTurn();
    } else {
      addToLog(`${player.name} attacks but misses!`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTurn('enemy');
      enemyTurn();
    }
  };

  const handleCastSpell = async (
    spellName: string,
    school: string,
    damageAmount: number,
    damageType: DamageType,
    particleType: ParticleType
  ) => {
    if (isAnimating || turn !== 'player') return;
    setIsAnimating(true);

    addToLog(`${player.name} casts ${spellName}!`);

    // Spell casting animation
    setEffects((prev) => ({
      ...prev,
      spellCast: true,
      spellSchool: school,
    }));

    // Wait for spell animation
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Spell particles
    setEffects((prev) => ({
      ...prev,
      particles: true,
      particleType,
    }));

    // Flash
    const flashColors: Record<DamageType, string> = {
      physical: '#CCCCCC',
      fire: '#FF4500',
      cold: '#00BFFF',
      lightning: '#FFD700',
      poison: '#32CD32',
      acid: '#ADFF2F',
      psychic: '#FF69B4',
      necrotic: '#8B008B',
      radiant: '#FFD700',
      force: '#9370DB',
    };
    setEffects((prev) => ({
      ...prev,
      flash: true,
      flashColor: flashColors[damageType],
    }));

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Damage
    const newHp = damageEntity(enemy, damageAmount, damageType);
    setEffects((prev) => ({
      ...prev,
      damage: true,
      damageAmount,
      damageType,
      isCritical: false,
      isHealing: false,
    }));

    addToLog(`${spellName} deals ${damageAmount} ${damageType} damage!`);

    // Check if enemy defeated
    if (newHp <= 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToLog(`${enemy.name} is defeated!`);
      setIsAnimating(false);
      return;
    }

    // Enemy turn
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTurn('enemy');
    enemyTurn();
  };

  const handleHeal = async () => {
    if (isAnimating || turn !== 'player') return;
    setIsAnimating(true);

    const healAmount = Math.floor(Math.random() * 8) + 8;
    addToLog(`${player.name} uses a healing potion! (+${healAmount} HP)`);

    // Healing particles
    setEffects((prev) => ({
      ...prev,
      particles: true,
      particleType: 'heal',
    }));

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Healing text
    healEntity(player, healAmount);
    setEffects((prev) => ({
      ...prev,
      damage: true,
      damageAmount: healAmount,
      damageType: 'radiant',
      isCritical: false,
      isHealing: true,
    }));

    // Enemy turn
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTurn('enemy');
    enemyTurn();
  };

  const enemyTurn = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const damage = Math.floor(Math.random() * 6) + 3;
    addToLog(`${enemy.name} attacks! (${damage} damage)`);

    // Enemy attack effects
    setEffects((prev) => ({
      ...prev,
      flash: true,
      flashColor: '#8B0000',
    }));

    await new Promise((resolve) => setTimeout(resolve, 300));

    setEffects((prev) => ({
      ...prev,
      particles: true,
      particleType: 'damage',
    }));

    await new Promise((resolve) => setTimeout(resolve, 300));

    damageEntity(player, damage, 'physical');
    setEffects((prev) => ({
      ...prev,
      damage: true,
      damageAmount: damage,
      damageType: 'physical',
      isCritical: false,
      isHealing: false,
    }));

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTurn('player');
    setIsAnimating(false);
  };

  const renderHealthBar = (entity: CombatEntity) => {
    const percentage = (entity.currentHp / entity.maxHp) * 100;
    return (
      <View style={styles.entityCard}>
        <Text style={styles.entityName}>{entity.name}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>HP: {entity.currentHp}/{entity.maxHp}</Text>
          <Text style={styles.statText}>AC: {entity.armorClass}</Text>
        </View>
        <View style={styles.healthBarContainer}>
          <View
            style={[
              styles.healthBar,
              {
                width: `${percentage}%`,
                backgroundColor: percentage > 50 ? '#10b981' : percentage > 25 ? '#f59e0b' : '#ef4444',
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Combat Area */}
      <View style={styles.combatArea}>
        {/* Enemy */}
        <FadeTransition visible={enemy.currentHp > 0} type="slideDown" duration={300}>
          {renderHealthBar(enemy)}
        </FadeTransition>

        {/* VS Indicator */}
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>⚔️</Text>
          <Text style={styles.turnText}>
            {turn === 'player' ? 'Your Turn' : 'Enemy Turn'}
          </Text>
        </View>

        {/* Player */}
        <FadeTransition visible={true} type="slideUp" duration={300}>
          {renderHealthBar(player)}
        </FadeTransition>
      </View>

      {/* Combat Log */}
      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Combat Log</Text>
        <ScrollView style={styles.logScroll}>
          {combatLog.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))}
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <AnimatedButton
          title="Attack"
          onPress={handleAttack}
          variant="danger"
          disabled={isAnimating || turn !== 'player' || enemy.currentHp <= 0}
          style={styles.actionButton}
        />
        <AnimatedButton
          title="Fireball"
          onPress={() => handleCastSpell('Fireball', 'evocation', 28, 'fire', 'fire')}
          variant="danger"
          disabled={isAnimating || turn !== 'player' || enemy.currentHp <= 0}
          style={styles.actionButton}
        />
        <AnimatedButton
          title="Lightning"
          onPress={() => handleCastSpell('Lightning Bolt', 'evocation', 24, 'lightning', 'lightning')}
          variant="primary"
          disabled={isAnimating || turn !== 'player' || enemy.currentHp <= 0}
          style={styles.actionButton}
        />
        <AnimatedButton
          title="Heal"
          onPress={handleHeal}
          variant="success"
          disabled={isAnimating || turn !== 'player' || enemy.currentHp <= 0}
          style={styles.actionButton}
        />
      </View>

      {/* Effects */}
      {effects.flash && (
        <ScreenFlash
          color={effects.flashColor}
          duration={300}
          intensity={0.5}
          onComplete={() => setEffects((prev) => ({ ...prev, flash: false }))}
        />
      )}

      {effects.particles && (
        <ParticleEffect
          type={effects.particleType}
          count={30}
          duration={1500}
          onComplete={() => setEffects((prev) => ({ ...prev, particles: false }))}
        />
      )}

      {effects.damage && (
        <DamageText
          amount={effects.damageAmount}
          type={effects.damageType}
          isHealing={effects.isHealing}
          isCritical={effects.isCritical}
          onComplete={() => setEffects((prev) => ({ ...prev, damage: false }))}
        />
      )}

      {effects.spellCast && (
        <SpellCastEffect
          spellSchool={effects.spellSchool}
          duration={1200}
          onComplete={() => setEffects((prev) => ({ ...prev, spellCast: false }))}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  combatArea: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 20,
  },
  entityCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
  },
  entityName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statText: {
    color: '#94a1b2',
    fontSize: 16,
  },
  healthBarContainer: {
    height: 12,
    backgroundColor: '#0f3460',
    borderRadius: 6,
    overflow: 'hidden',
  },
  healthBar: {
    height: '100%',
    borderRadius: 6,
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  vsText: {
    fontSize: 40,
    marginBottom: 10,
  },
  turnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9d4edd',
  },
  logContainer: {
    backgroundColor: '#16213e',
    padding: 16,
    maxHeight: 150,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9d4edd',
    marginBottom: 8,
  },
  logScroll: {
    maxHeight: 100,
  },
  logText: {
    color: '#94a1b2',
    fontSize: 14,
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
  },
});
