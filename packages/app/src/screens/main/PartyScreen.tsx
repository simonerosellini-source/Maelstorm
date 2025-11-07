import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function PartyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Party & Multiplayer</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Party</Text>
        <Text style={styles.cardText}>Not in a party</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Party</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
          <Text style={styles.buttonText}>Join Party</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leaderboard</Text>
        <Text style={styles.cardText}>Compete to be the first to reach level 20!</Text>
        <View style={styles.leaderboardItem}>
          <Text style={styles.rank}>1st</Text>
          <Text style={styles.playerName}>DarkWizard</Text>
          <Text style={styles.level}>Lv 15</Text>
        </View>
        <View style={styles.leaderboardItem}>
          <Text style={styles.rank}>2nd</Text>
          <Text style={styles.playerName}>SwordMaster</Text>
          <Text style={styles.level}>Lv 13</Text>
        </View>
        <View style={styles.leaderboardItem}>
          <Text style={styles.rank}>3rd</Text>
          <Text style={styles.playerName}>HealerQueen</Text>
          <Text style={styles.level}>Lv 12</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Send Items/Monsters</Text>
        <Text style={styles.cardText}>
          Hinder your competitors by sending them cursed items or powerful monsters!
        </Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>📦 Send Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>👹 Send Monster</Text>
        </TouchableOpacity>
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
  cardText: { color: '#94a1b2', fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: '#9d4edd', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  buttonSecondary: { backgroundColor: '#0f3460' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  leaderboardItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#0f3460', borderRadius: 8, marginBottom: 8 },
  rank: { color: '#9d4edd', fontSize: 16, fontWeight: 'bold' },
  playerName: { color: '#fff', fontSize: 16, flex: 1, marginLeft: 12 },
  level: { color: '#94a1b2', fontSize: 16 },
  actionButton: { backgroundColor: '#0f3460', padding: 16, borderRadius: 8, marginBottom: 8 },
  actionText: { color: '#fff', fontSize: 16 },
});
