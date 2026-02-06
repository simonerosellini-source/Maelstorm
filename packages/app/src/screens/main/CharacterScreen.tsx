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
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';

const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'];
const CLASSES = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Paladin', 'Barbarian', 'Bard', 'Druid', 'Monk', 'Sorcerer', 'Warlock'];
const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;
const ABILITY_LABELS: Record<string, string> = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
};

// Roll 4d6, drop lowest
const rollStat = () => {
  const rolls = Array(4).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => b - a);
  return rolls.slice(0, 3).reduce((sum, r) => sum + r, 0);
};

const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

export default function CharacterScreen() {
  const { currentCharacter, createCharacter, loading } = useCharacterStore();
  const { user } = useAuthStore();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [selectedRace, setSelectedRace] = useState('Human');
  const [selectedClass, setSelectedClass] = useState('Fighter');

  // New stat allocation system
  const [rolledValues, setRolledValues] = useState<number[]>([]);
  const [assignments, setAssignments] = useState<Record<string, number | null>>({
    strength: null,
    dexterity: null,
    constitution: null,
    intelligence: null,
    wisdom: null,
    charisma: null,
  });
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [rerollsLeft, setRerollsLeft] = useState(3);
  const [error, setError] = useState('');

  const handleRollAllStats = () => {
    if (rerollsLeft <= 0) {
      setError('No rerolls left!');
      return;
    }

    // Roll 6 values
    const newValues = Array(6).fill(0).map(() => rollStat());
    newValues.sort((a, b) => b - a); // Sort descending for convenience
    setRolledValues(newValues);

    // Reset assignments
    setAssignments({
      strength: null,
      dexterity: null,
      constitution: null,
      intelligence: null,
      wisdom: null,
      charisma: null,
    });
    setSelectedValue(null);
    setRerollsLeft(prev => prev - 1);
    setError('');
  };

  const handleSelectValue = (value: number, index: number) => {
    // Check if this value is already assigned
    const isAssigned = Object.values(assignments).includes(value);
    if (isAssigned) return;

    setSelectedValue(value);
  };

  const handleAssignToAbility = (ability: string) => {
    if (selectedValue === null) return;

    // If this ability already has a value, unassign it first
    const currentValue = assignments[ability];

    setAssignments(prev => ({
      ...prev,
      [ability]: selectedValue,
    }));
    setSelectedValue(null);
  };

  const handleUnassign = (ability: string) => {
    setAssignments(prev => ({
      ...prev,
      [ability]: null,
    }));
  };

  const isValueAssigned = (value: number) => {
    return Object.values(assignments).includes(value);
  };

  const allStatsAssigned = () => {
    return ABILITIES.every(ability => assignments[ability] !== null);
  };

  const ensureUserExists = async () => {
    if (!user) throw new Error('Not authenticated');

    // Check if user exists in users table
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existingUser) {
      // Create user record
      const { error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          nickname: user.email?.split('@')[0] || 'Player',
        });

      if (createError && !createError.message.includes('duplicate')) {
        throw new Error('Failed to create user profile: ' + createError.message);
      }
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter a character name');
      return;
    }

    if (!allStatsAssigned()) {
      setError('Please assign all ability scores');
      return;
    }

    setError('');
    try {
      // Ensure user exists in users table first
      await ensureUserExists();

      const stats = {
        strength: assignments.strength!,
        dexterity: assignments.dexterity!,
        constitution: assignments.constitution!,
        intelligence: assignments.intelligence!,
        wisdom: assignments.wisdom!,
        charisma: assignments.charisma!,
      };

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
      setRolledValues([]);
      setRerollsLeft(3);
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
            <TouchableOpacity
              style={[styles.rollButton, rerollsLeft <= 0 && styles.rollButtonDisabled]}
              onPress={handleRollAllStats}
              disabled={rerollsLeft <= 0}
            >
              <Text style={styles.rollButtonText}>
                🎲 Roll ({rerollsLeft} left)
              </Text>
            </TouchableOpacity>
          </View>

          {rolledValues.length === 0 ? (
            <View style={styles.instructionBox}>
              <Text style={styles.instructionText}>
                Press "Roll" to generate 6 ability scores (4d6 drop lowest).
              </Text>
              <Text style={styles.instructionText}>
                You have 3 rerolls total per character.
              </Text>
            </View>
          ) : (
            <>
              {/* Rolled Values Pool */}
              <Text style={styles.subLabel}>Available Values (tap to select)</Text>
              <View style={styles.rolledValuesContainer}>
                {rolledValues.map((value, index) => {
                  const assigned = isValueAssigned(value);
                  const isSelected = selectedValue === value && !assigned;
                  return (
                    <TouchableOpacity
                      key={`${value}-${index}`}
                      style={[
                        styles.rolledValue,
                        assigned && styles.rolledValueAssigned,
                        isSelected && styles.rolledValueSelected,
                      ]}
                      onPress={() => !assigned && handleSelectValue(value, index)}
                      disabled={assigned}
                    >
                      <Text style={[
                        styles.rolledValueText,
                        assigned && styles.rolledValueTextAssigned,
                        isSelected && styles.rolledValueTextSelected,
                      ]}>
                        {value}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedValue !== null && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedText}>
                    Selected: {selectedValue} - Tap an ability to assign
                  </Text>
                </View>
              )}

              {/* Ability Assignment */}
              <Text style={[styles.subLabel, { marginTop: 16 }]}>Assign to Abilities (tap to assign/remove)</Text>
              <View style={styles.statsGrid}>
                {ABILITIES.map((ability) => {
                  const value = assignments[ability];
                  const hasValue = value !== null;
                  return (
                    <TouchableOpacity
                      key={ability}
                      style={[
                        styles.statBox,
                        hasValue && styles.statBoxFilled,
                        selectedValue !== null && !hasValue && styles.statBoxHighlight,
                      ]}
                      onPress={() => {
                        if (hasValue) {
                          handleUnassign(ability);
                        } else if (selectedValue !== null) {
                          handleAssignToAbility(ability);
                        }
                      }}
                    >
                      <Text style={styles.statName}>{ABILITY_LABELS[ability]}</Text>
                      <Text style={[styles.statValue, !hasValue && styles.statValueEmpty]}>
                        {hasValue ? value : '—'}
                      </Text>
                      {hasValue && (
                        <Text style={styles.statMod}>
                          {calculateModifier(value!) >= 0 ? '+' : ''}{calculateModifier(value!)}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.createButton, (loading || !allStatsAssigned()) && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading || !allStatsAssigned()}
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
          {ABILITIES.map((stat) => (
            <View key={stat} style={styles.statBox}>
              <Text style={styles.statName}>{ABILITY_LABELS[stat]}</Text>
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
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Experience:</Text>
          <Text style={styles.statValueText}>{currentCharacter.experience_points} XP</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.newCharButton} onPress={() => {
        setShowCreate(true);
        setRolledValues([]);
        setRerollsLeft(3);
        setAssignments({
          strength: null,
          dexterity: null,
          constitution: null,
          intelligence: null,
          wisdom: null,
          charisma: null,
        });
      }}>
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
  subLabel: {
    fontSize: 14,
    color: '#94a1b2',
    marginBottom: 8,
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
  rollButtonDisabled: {
    backgroundColor: '#4a4a6a',
    opacity: 0.6,
  },
  rollButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  instructionBox: {
    backgroundColor: '#0f3460',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  instructionText: {
    color: '#94a1b2',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  rolledValuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  rolledValue: {
    width: 50,
    height: 50,
    backgroundColor: '#0f3460',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rolledValueAssigned: {
    backgroundColor: '#1a1a2e',
    opacity: 0.4,
  },
  rolledValueSelected: {
    borderColor: '#fbbf24',
    backgroundColor: '#3d2e00',
  },
  rolledValueText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rolledValueTextAssigned: {
    color: '#666',
  },
  rolledValueTextSelected: {
    color: '#fbbf24',
  },
  selectedIndicator: {
    backgroundColor: '#3d2e00',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  selectedText: {
    color: '#fbbf24',
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statBoxFilled: {
    borderColor: '#10b981',
  },
  statBoxHighlight: {
    borderColor: '#fbbf24',
    borderStyle: 'dashed',
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
  statValueEmpty: {
    color: '#4a4a6a',
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
