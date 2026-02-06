import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useCharacterStore } from '../../store/characterStore';

const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'];
const CLASSES = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Paladin', 'Barbarian', 'Bard', 'Druid', 'Monk', 'Sorcerer', 'Warlock'];

// Roll 4d6, drop lowest
const rollStat = () => {
  const rolls = Array(4).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => b - a);
  return rolls.slice(0, 3).reduce((sum, r) => sum + r, 0);
};

const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

export default function CharacterScreen() {
  const { currentCharacter, createCharacter, loading } = useCharacterStore();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [selectedRace, setSelectedRace] = useState('Human');
  const [selectedClass, setSelectedClass] = useState('Fighter');
  const [stats, setStats] = useState({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });
  const [error, setError] = useState('');

  const handleRollStats = () => {
    setStats({
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat(),
    });
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter a character name');
      return;
    }

    setError('');
    try {
      const conMod = calculateModifier(stats.constitution);
      const hitDice: Record<string, number> = {
        'Barbarian': 12, 'Fighter': 10, 'Paladin': 10, 'Ranger': 10,
        'Cleric': 8, 'Druid': 8, 'Monk': 8, 'Rogue': 8, 'Warlock': 8, 'Bard': 8,
        'Sorcerer': 6, 'Wizard': 6
      };
      const maxHP = (hitDice[selectedClass] || 8) + conMod;

      await createCharacter({
        name: name.trim(),
        race: selectedRace,
        class: selectedClass,
        ...stats,
        maxHitPoints: maxHP,
        armorClass: 10 + calculateModifier(stats.dexterity),
        initiative: calculateModifier(stats.dexterity),
        speed: selectedRace === 'Dwarf' ? 25 : 30,
      });
      setShowCreate(false);
      setName('');
    } catch (err: any) {
      setError(err.message || 'Failed to create character');
    }
  };

  // Show creation form
  if (showCreate || !currentCharacter) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Character</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.label}>Character Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name..."
            placeholderTextColor="#94a1b2"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Race</Text>
          <View style={styles.optionGrid}>
            {RACES.map((race) => (
              <TouchableOpacity
                key={race}
                style={[styles.option, selectedRace === race && styles.optionSelected]}
                onPress={() => setSelectedRace(race)}
              >
                <Text style={[styles.optionText, selectedRace === race && styles.optionTextSelected]}>
                  {race}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Class</Text>
          <View style={styles.optionGrid}>
            {CLASSES.map((cls) => (
              <TouchableOpacity
                key={cls}
                style={[styles.option, selectedClass === cls && styles.optionSelected]}
                onPress={() => setSelectedClass(cls)}
              >
                <Text style={[styles.optionText, selectedClass === cls && styles.optionTextSelected]}>
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.label}>Ability Scores</Text>
            <TouchableOpacity style={styles.rollButton} onPress={handleRollStats}>
              <Text style={styles.rollButtonText}>🎲 Roll Stats</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            {Object.entries(stats).map(([stat, value]) => (
              <View key={stat} style={styles.statBox}>
                <Text style={styles.statName}>{stat.substring(0, 3).toUpperCase()}</Text>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statMod}>
                  {calculateModifier(value) >= 0 ? '+' : ''}{calculateModifier(value)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Character</Text>
          )}
        </TouchableOpacity>

        {currentCharacter && (
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCreate(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }

  // Show character details
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{currentCharacter.name}</Text>
        <Text style={styles.class}>
          Level {currentCharacter.level} {currentCharacter.race} {currentCharacter.class}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ability Scores</Text>
        <View style={styles.statsGrid}>
          {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((stat) => (
            <View key={stat} style={styles.statBox}>
              <Text style={styles.statName}>{stat.substring(0, 3).toUpperCase()}</Text>
              <Text style={styles.statValue}>{(currentCharacter as any)[stat]}</Text>
              <Text style={styles.statMod}>
                {calculateModifier((currentCharacter as any)[stat]) >= 0 ? '+' : ''}
                {calculateModifier((currentCharacter as any)[stat])}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Combat Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Hit Points:</Text>
          <Text style={styles.statValueText}>
            {currentCharacter.current_hit_points} / {currentCharacter.max_hit_points}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Armor Class:</Text>
          <Text style={styles.statValueText}>{currentCharacter.armor_class}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Initiative:</Text>
          <Text style={styles.statValueText}>+{currentCharacter.initiative}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Speed:</Text>
          <Text style={styles.statValueText}>{currentCharacter.speed} ft</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Gold:</Text>
          <Text style={styles.statValueText}>{currentCharacter.gold} gp</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.newCharButton} onPress={() => setShowCreate(true)}>
        <Text style={styles.newCharButtonText}>+ Create New Character</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    backgroundColor: '#16213e',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9d4edd',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  class: {
    fontSize: 16,
    color: '#94a1b2',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#16213e',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9d4edd',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9d4edd',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#0f3460',
    padding: 16,
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: '#0f3460',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: '#9d4edd',
    backgroundColor: '#1a1a2e',
  },
  optionText: {
    color: '#94a1b2',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#9d4edd',
    fontWeight: 'bold',
  },
  rollButton: {
    backgroundColor: '#9d4edd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  rollButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    width: '30%',
    backgroundColor: '#0f3460',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statName: {
    color: '#94a1b2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statMod: {
    color: '#9d4edd',
    fontSize: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    color: '#94a1b2',
    fontSize: 16,
  },
  statValueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#9d4edd',
    margin: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#94a1b2',
  },
  cancelButtonText: {
    color: '#94a1b2',
    fontSize: 16,
  },
  newCharButton: {
    backgroundColor: '#0f3460',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newCharButtonText: {
    color: '#9d4edd',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ff4757',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
});
