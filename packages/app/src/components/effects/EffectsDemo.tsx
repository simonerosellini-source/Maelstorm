import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  ParticleEffect,
  ParticleType,
  DamageText,
  DamageType,
  ScreenFlash,
  SpellCastEffect,
  FadeTransition,
  AnimatedButton,
} from './index';

export const EffectsDemo: React.FC = () => {
  const [showParticles, setShowParticles] = useState(false);
  const [particleType, setParticleType] = useState<ParticleType>('fire');

  const [showDamage, setShowDamage] = useState(false);
  const [damageAmount, setDamageAmount] = useState(25);
  const [damageType, setDamageType] = useState<DamageType>('physical');

  const [showFlash, setShowFlash] = useState(false);
  const [showSpellCast, setShowSpellCast] = useState(false);
  const [showTransition, setShowTransition] = useState(true);

  const triggerParticleEffect = (type: ParticleType) => {
    setParticleType(type);
    setShowParticles(true);
  };

  const triggerDamageText = (amount: number, type: DamageType, isCritical: boolean = false) => {
    setDamageAmount(amount);
    setDamageType(type);
    setShowDamage(true);
  };

  const triggerFlash = (color: string) => {
    setShowFlash(true);
  };

  const triggerSpellCast = () => {
    setShowSpellCast(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Effects Demo</Text>

      {/* Particle Effects */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Particle Effects</Text>
        <View style={styles.buttonRow}>
          <AnimatedButton
            title="Fire"
            onPress={() => triggerParticleEffect('fire')}
            variant="danger"
            style={styles.smallButton}
          />
          <AnimatedButton
            title="Ice"
            onPress={() => triggerParticleEffect('ice')}
            variant="primary"
            style={styles.smallButton}
          />
          <AnimatedButton
            title="Lightning"
            onPress={() => triggerParticleEffect('lightning')}
            variant="success"
            style={styles.smallButton}
          />
        </View>
        <View style={styles.buttonRow}>
          <AnimatedButton
            title="Heal"
            onPress={() => triggerParticleEffect('heal')}
            variant="success"
            style={styles.smallButton}
          />
          <AnimatedButton
            title="Magic"
            onPress={() => triggerParticleEffect('magic')}
            variant="secondary"
            style={styles.smallButton}
          />
          <AnimatedButton
            title="Damage"
            onPress={() => triggerParticleEffect('damage')}
            variant="danger"
            style={styles.smallButton}
          />
        </View>
      </View>

      {/* Damage Text */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Damage / Healing Text</Text>
        <View style={styles.buttonRow}>
          <AnimatedButton
            title="Hit (25)"
            onPress={() => triggerDamageText(25, 'physical', false)}
            variant="secondary"
            style={styles.smallButton}
          />
          <AnimatedButton
            title="Crit! (50)"
            onPress={() => triggerDamageText(50, 'physical', true)}
            variant="danger"
            style={styles.smallButton}
          />
          <AnimatedButton
            title="Heal (30)"
            onPress={() => {
              setDamageAmount(30);
              setShowDamage(true);
            }}
            variant="success"
            style={styles.smallButton}
          />
        </View>
        <View style={styles.buttonRow}>
          <AnimatedButton
            title="Fire (40)"
            onPress={() => triggerDamageText(40, 'fire', false)}
            variant="danger"
            style={styles.smallButton}
          />
          <AnimatedButton
            title="Lightning (35)"
            onPress={() => triggerDamageText(35, 'lightning', false)}
            variant="primary"
            style={styles.smallButton}
          />
          <AnimatedButton
            title="Poison (20)"
            onPress={() => triggerDamageText(20, 'poison', false)}
            variant="success"
            style={styles.smallButton}
          />
        </View>
      </View>

      {/* Screen Flash */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Screen Flash</Text>
        <View style={styles.buttonRow}>
          <AnimatedButton
            title="White Flash"
            onPress={() => triggerFlash('#FFFFFF')}
            variant="secondary"
            style={styles.smallButton}
          />
          <AnimatedButton
            title="Red Flash"
            onPress={() => triggerFlash('#FF0000')}
            variant="danger"
            style={styles.smallButton}
          />
          <AnimatedButton
            title="Blue Flash"
            onPress={() => triggerFlash('#0000FF')}
            variant="primary"
            style={styles.smallButton}
          />
        </View>
      </View>

      {/* Spell Cast Effect */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spell Casting</Text>
        <AnimatedButton
          title="Cast Spell"
          onPress={triggerSpellCast}
          variant="primary"
          style={styles.fullButton}
        />
      </View>

      {/* Transitions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UI Transitions</Text>
        <AnimatedButton
          title={showTransition ? 'Hide' : 'Show'}
          onPress={() => setShowTransition(!showTransition)}
          variant="secondary"
          style={styles.fullButton}
        />
        <FadeTransition visible={showTransition} type="slideUp" style={styles.transitionBox}>
          <Text style={styles.transitionText}>Animated Content</Text>
        </FadeTransition>
      </View>

      {/* Active Effects */}
      {showParticles && (
        <ParticleEffect
          type={particleType}
          count={30}
          duration={1500}
          onComplete={() => setShowParticles(false)}
        />
      )}

      {showDamage && (
        <DamageText
          amount={damageAmount}
          type={damageType}
          isHealing={damageAmount === 30}
          isCritical={damageAmount >= 50}
          onComplete={() => setShowDamage(false)}
        />
      )}

      {showFlash && (
        <ScreenFlash
          color="#FFFFFF"
          duration={300}
          intensity={0.6}
          onComplete={() => setShowFlash(false)}
        />
      )}

      {showSpellCast && (
        <SpellCastEffect
          spellSchool="evocation"
          duration={1500}
          onComplete={() => setShowSpellCast(false)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  fullButton: {
    marginBottom: 15,
  },
  transitionBox: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  transitionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});
