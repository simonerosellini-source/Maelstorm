import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useCharacterStore } from '../../store/characterStore';

export default function HomeScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const { characters, currentCharacter, fetchCharacters } = useCharacterStore();

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleCreateCharacter = () => {
    navigation.navigate('CreateCharacter');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.nickname}!</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {currentCharacter ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Character</Text>
          <Text style={styles.characterName}>{currentCharacter.name}</Text>
          <Text style={styles.characterInfo}>
            Level {currentCharacter.level} {currentCharacter.race} {currentCharacter.class}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentCharacter.currentHitPoints}/{currentCharacter.maxHitPoints}</Text>
              <Text style={styles.statLabel}>HP</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentCharacter.experience}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentCharacter.armorClass}</Text>
              <Text style={styles.statLabel}>AC</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No Character Selected</Text>
          <Text style={styles.cardText}>
            Create or select a character to begin your adventure!
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Characters ({characters.length})</Text>
        {characters.length === 0 ? (
          <Text style={styles.cardText}>You haven't created any characters yet.</Text>
        ) : (
          characters.map((char) => (
            <TouchableOpacity
              key={char.id}
              style={styles.characterItem}
              onPress={() => useCharacterStore.getState().selectCharacter(char)}
            >
              <Text style={styles.characterItemName}>{char.name}</Text>
              <Text style={styles.characterItemInfo}>
                Lv {char.level} • {char.class}
              </Text>
            </TouchableOpacity>
          ))
        )}
        <TouchableOpacity style={styles.button} onPress={handleCreateCharacter}>
          <Text style={styles.buttonText}>+ Create New Character</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>🏰 Enter Dungeon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>👥 Join Party</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>🛍️ Visit Shop</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leaderboard</Text>
        <Text style={styles.cardText}>Coming soon...</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutText: {
    color: '#9d4edd',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#16213e',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9d4edd',
    marginBottom: 12,
  },
  cardText: {
    color: '#94a1b2',
    fontSize: 16,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  characterInfo: {
    color: '#94a1b2',
    fontSize: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a1b2',
    marginTop: 4,
  },
  characterItem: {
    backgroundColor: '#0f3460',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  characterItemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterItemInfo: {
    color: '#94a1b2',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#9d4edd',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#0f3460',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
});
