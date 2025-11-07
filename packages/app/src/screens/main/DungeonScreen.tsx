import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function DungeonScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dungeon Exploration</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Available Dungeons</Text>

        <TouchableOpacity style={styles.dungeonCard}>
          <View style={styles.dungeonHeader}>
            <Text style={styles.dungeonName}>The Shadowy Crypt</Text>
            <Text style={styles.difficulty}>Easy</Text>
          </View>
          <Text style={styles.dungeonInfo}>Recommended Level: 1-3</Text>
          <Text style={styles.dungeonDesc}>
            An ancient crypt filled with undead creatures and forgotten treasures.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dungeonCard}>
          <View style={styles.dungeonHeader}>
            <Text style={styles.dungeonName}>Goblin Warren</Text>
            <Text style={styles.difficultyMedium}>Medium</Text>
          </View>
          <Text style={styles.dungeonInfo}>Recommended Level: 3-5</Text>
          <Text style={styles.dungeonDesc}>
            A sprawling network of tunnels inhabited by goblin tribes.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dungeonCard}>
          <View style={styles.dungeonHeader}>
            <Text style={styles.dungeonName}>Dragon's Lair</Text>
            <Text style={styles.difficultyHard}>Deadly</Text>
          </View>
          <Text style={styles.dungeonInfo}>Recommended Level: 15+</Text>
          <Text style={styles.dungeonDesc}>
            Face an ancient red dragon and claim its legendary hoard.
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Exploration</Text>
        <Text style={styles.cardText}>No active dungeon run</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  card: { backgroundColor: '#16213e', margin: 16, padding: 20, borderRadius: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#9d4edd', marginBottom: 12 },
  cardText: { color: '#94a1b2', fontSize: 16 },
  dungeonCard: { backgroundColor: '#0f3460', padding: 16, borderRadius: 8, marginBottom: 12 },
  dungeonHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dungeonName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  difficulty: { backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 'bold' },
  difficultyMedium: { backgroundColor: '#f59e0b', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 'bold' },
  difficultyHard: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 'bold' },
  dungeonInfo: { color: '#94a1b2', fontSize: 14, marginBottom: 4 },
  dungeonDesc: { color: '#cbd5e1', fontSize: 14 },
});
