import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useCharacterStore } from '../../store/characterStore';
import { useNotificationStore } from '../../store/notificationStore';
import NotificationBell from '../../components/NotificationBell';

export default function HomeScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const { characters, currentCharacter, fetchCharacters, selectCharacter } = useCharacterStore();
  const { fetchNotifications, subscribeToNotifications } = useNotificationStore();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400;

  useEffect(() => {
    fetchCharacters();
    fetchNotifications();
    const unsubscribe = subscribeToNotifications();
    return unsubscribe;
  }, []);

  const handleCreateCharacter = () => {
    navigation.navigate('Character');
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        signOut();
      }
    } else {
      signOut();
    }
  };

  // Calculate XP needed for next level (simplified D&D-like progression)
  const xpForNextLevel = currentCharacter ? currentCharacter.level * 1000 : 0;
  const xpProgress = currentCharacter
    ? Math.min(100, (currentCharacter.experience_points / xpForNextLevel) * 100)
    : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
            Welcome, {user?.nickname || 'Adventurer'}!
          </Text>
        </View>
        <View style={styles.headerRight}>
          <NotificationBell />
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {currentCharacter ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Character</Text>
          <Text style={styles.characterName}>{currentCharacter.name}</Text>
          <Text style={styles.characterInfo}>
            Level {currentCharacter.level} {currentCharacter.race} {currentCharacter.class}
          </Text>

          {/* HP Bar */}
          <View style={styles.barContainer}>
            <Text style={styles.barLabel}>HP</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  styles.hpBar,
                  {
                    width: `${(currentCharacter.current_hit_points / currentCharacter.max_hit_points) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.barValue}>
              {currentCharacter.current_hit_points}/{currentCharacter.max_hit_points}
            </Text>
          </View>

          {/* XP Bar */}
          <View style={styles.barContainer}>
            <Text style={styles.barLabel}>XP</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  styles.xpBar,
                  { width: `${xpProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.barValue}>
              {currentCharacter.experience_points}/{xpForNextLevel}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentCharacter.armor_class}</Text>
              <Text style={styles.statLabel}>AC</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{currentCharacter.gold}</Text>
              <Text style={styles.statLabel}>Gold</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>+{currentCharacter.initiative}</Text>
              <Text style={styles.statLabel}>Init</Text>
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
              style={[
                styles.characterItem,
                currentCharacter?.id === char.id && styles.characterItemSelected
              ]}
              onPress={() => selectCharacter(char)}
            >
              <View style={styles.characterItemRow}>
                <View style={styles.characterItemLeft}>
                  <Text style={styles.characterItemName}>{char.name}</Text>
                  <Text style={styles.characterItemInfo}>
                    Lv {char.level} • {char.class}
                  </Text>
                </View>
                <View style={styles.characterItemRight}>
                  <Text style={styles.characterItemHp}>
                    {char.current_hit_points}/{char.max_hit_points} HP
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <TouchableOpacity style={styles.button} onPress={handleCreateCharacter}>
          <Text style={styles.buttonText}>+ Create New Character</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={[styles.actionsGrid, isSmallScreen && styles.actionsGridSmall]}>
          <TouchableOpacity
            style={[styles.actionButton, isSmallScreen && styles.actionButtonSmall]}
            onPress={() => navigation.navigate('Dungeon')}
          >
            <Text style={styles.actionIcon}>🏰</Text>
            <Text style={styles.actionText}>Dungeon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, isSmallScreen && styles.actionButtonSmall]}
            onPress={() => navigation.navigate('Party')}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Party</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, isSmallScreen && styles.actionButtonSmall]}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.actionIcon}>🛍️</Text>
            <Text style={styles.actionText}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, isSmallScreen && styles.actionButtonSmall]}
            onPress={() => navigation.navigate('Combat')}
          >
            <Text style={styles.actionIcon}>⚔️</Text>
            <Text style={styles.actionText}>Combat</Text>
          </TouchableOpacity>
        </View>
      </View>

      {currentCharacter && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ability Scores</Text>
          <View style={styles.abilitiesGrid}>
            {[
              { name: 'STR', value: currentCharacter.strength },
              { name: 'DEX', value: currentCharacter.dexterity },
              { name: 'CON', value: currentCharacter.constitution },
              { name: 'INT', value: currentCharacter.intelligence },
              { name: 'WIS', value: currentCharacter.wisdom },
              { name: 'CHA', value: currentCharacter.charisma },
            ].map((ability) => (
              <View key={ability.name} style={styles.abilityBox}>
                <Text style={styles.abilityName}>{ability.name}</Text>
                <Text style={styles.abilityValue}>{ability.value}</Text>
                <Text style={styles.abilityMod}>
                  {Math.floor((ability.value - 10) / 2) >= 0 ? '+' : ''}
                  {Math.floor((ability.value - 10) / 2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
    padding: 16,
    paddingTop: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  titleSmall: {
    fontSize: 18,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#9d4edd',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#16213e',
    margin: 12,
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9d4edd',
    marginBottom: 12,
  },
  cardText: {
    color: '#94a1b2',
    fontSize: 14,
  },
  characterName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  characterInfo: {
    color: '#94a1b2',
    fontSize: 14,
    marginBottom: 16,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabel: {
    color: '#94a1b2',
    fontSize: 12,
    width: 24,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#0f3460',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  hpBar: {
    backgroundColor: '#10b981',
  },
  xpBar: {
    backgroundColor: '#9d4edd',
  },
  barValue: {
    color: '#fff',
    fontSize: 12,
    width: 60,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
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
  characterItemSelected: {
    borderColor: '#9d4edd',
    borderWidth: 2,
  },
  characterItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterItemLeft: {
    flex: 1,
  },
  characterItemRight: {
    marginLeft: 12,
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
  characterItemHp: {
    color: '#10b981',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#9d4edd',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionsGridSmall: {
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#0f3460',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
    flex: 1,
  },
  actionButtonSmall: {
    minWidth: 70,
    padding: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  abilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  abilityBox: {
    width: '30%',
    backgroundColor: '#0f3460',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  abilityName: {
    color: '#94a1b2',
    fontSize: 11,
    fontWeight: 'bold',
  },
  abilityValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  abilityMod: {
    color: '#9d4edd',
    fontSize: 12,
  },
});
