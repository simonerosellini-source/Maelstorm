import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useCharacterStore } from '../../store/characterStore';

export default function CharacterScreen() {
  const currentCharacter = useCharacterStore((state) => state.currentCharacter);

  if (!currentCharacter) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No character selected</Text>
          <Text style={styles.emptySubtext}>Go to Home and select a character</Text>
        </View>
      </View>
    );
  }

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
        <View style={styles.abilityGrid}>
          {Object.entries(currentCharacter.abilityScores).map(([ability, score]) => (
            <View key={ability} style={styles.abilityBox}>
              <Text style={styles.abilityName}>{ability.substring(0, 3).toUpperCase()}</Text>
              <Text style={styles.abilityScore}>{score}</Text>
              <Text style={styles.abilityModifier}>
                {currentCharacter.abilityModifiers[ability as keyof typeof currentCharacter.abilityModifiers] >= 0 ? '+' : ''}
                {currentCharacter.abilityModifiers[ability as keyof typeof currentCharacter.abilityModifiers]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Combat Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Hit Points:</Text>
          <Text style={styles.statValue}>
            {currentCharacter.currentHitPoints} / {currentCharacter.maxHitPoints}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Armor Class:</Text>
          <Text style={styles.statValue}>{currentCharacter.armorClass}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Initiative:</Text>
          <Text style={styles.statValue}>+{currentCharacter.initiative}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Speed:</Text>
          <Text style={styles.statValue}>{currentCharacter.speed} ft</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Proficiency Bonus:</Text>
          <Text style={styles.statValue}>+{currentCharacter.proficiencyBonus}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Inventory</Text>
        {currentCharacter.inventory.length === 0 ? (
          <Text style={styles.emptyText}>No items</Text>
        ) : (
          currentCharacter.inventory.map((itemId, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{itemId}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Equipped Items</Text>
        {Object.entries(currentCharacter.equippedItems).map(([slot, itemId]) => (
          itemId && (
            <View key={slot} style={styles.statRow}>
              <Text style={styles.statLabel}>{slot}:</Text>
              <Text style={styles.statValue}>{itemId}</Text>
            </View>
          )
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Wealth</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Gold:</Text>
          <Text style={styles.statValue}>{currentCharacter.gold} gp</Text>
        </View>
      </View>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9d4edd',
    marginBottom: 16,
  },
  abilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  abilityBox: {
    width: '30%',
    backgroundColor: '#0f3460',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  abilityName: {
    color: '#94a1b2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  abilityScore: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  abilityModifier: {
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
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemRow: {
    backgroundColor: '#0f3460',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a1b2',
    fontSize: 18,
  },
  emptySubtext: {
    color: '#94a1b2',
    fontSize: 14,
    marginTop: 8,
  },
});
