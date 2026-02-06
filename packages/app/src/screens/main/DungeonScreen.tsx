import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useCharacterStore } from '../../store/characterStore';
import { supabase } from '../../services/supabase';

interface Room {
  id: number;
  type: 'empty' | 'monster' | 'treasure' | 'trap' | 'rest' | 'boss';
  explored: boolean;
  name: string;
}

interface Dungeon {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Deadly';
  recommendedLevel: string;
  description: string;
  floors: number;
  rooms: Room[];
}

const DUNGEONS: Dungeon[] = [
  {
    id: 'crypt',
    name: 'The Shadowy Crypt',
    difficulty: 'Easy',
    recommendedLevel: '1-3',
    description: 'An ancient crypt filled with undead creatures and forgotten treasures.',
    floors: 3,
    rooms: [],
  },
  {
    id: 'goblin',
    name: 'Goblin Warren',
    difficulty: 'Medium',
    recommendedLevel: '3-5',
    description: 'A sprawling network of tunnels inhabited by goblin tribes.',
    floors: 5,
    rooms: [],
  },
  {
    id: 'dragon',
    name: "Dragon's Lair",
    difficulty: 'Deadly',
    recommendedLevel: '15+',
    description: 'Face an ancient red dragon and claim its legendary hoard.',
    floors: 10,
    rooms: [],
  },
];

const generateRooms = (floorCount: number): Room[] => {
  const rooms: Room[] = [];
  const types: Room['type'][] = ['empty', 'monster', 'treasure', 'trap', 'rest'];

  for (let floor = 1; floor <= floorCount; floor++) {
    const roomsPerFloor = 3 + Math.floor(Math.random() * 3);
    for (let r = 0; r < roomsPerFloor; r++) {
      const isLast = floor === floorCount && r === roomsPerFloor - 1;
      const type: Room['type'] = isLast ? 'boss' : types[Math.floor(Math.random() * types.length)];
      const names: Record<Room['type'], string[]> = {
        empty: ['Empty Chamber', 'Dusty Hall', 'Abandoned Room'],
        monster: ['Monster Den', 'Creature Lair', 'Infested Room'],
        treasure: ['Treasure Room', 'Gold Cache', 'Hidden Vault'],
        trap: ['Trap Room', 'Dangerous Hall', 'Hazard Zone'],
        rest: ['Safe Haven', 'Rest Area', 'Sanctuary'],
        boss: ['Boss Chamber', 'Final Arena', 'Guardian Room'],
      };
      rooms.push({
        id: rooms.length + 1,
        type,
        explored: false,
        name: names[type][Math.floor(Math.random() * names[type].length)],
      });
    }
  }
  return rooms;
};

export default function DungeonScreen() {
  const { currentCharacter, updateCharacter } = useCharacterStore();
  const [activeDungeon, setActiveDungeon] = useState<Dungeon | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [exploring, setExploring] = useState(false);

  const startDungeon = (dungeon: Dungeon) => {
    if (!currentCharacter) {
      setMessage('Create a character first!');
      return;
    }
    const generatedRooms = generateRooms(dungeon.floors);
    setRooms(generatedRooms);
    setActiveDungeon({ ...dungeon, rooms: generatedRooms });
    setCurrentRoomIndex(0);
    setMessage(`Entering ${dungeon.name}...`);
    setExploring(true);
  };

  const exploreRoom = async () => {
    if (!activeDungeon || !currentCharacter) return;

    const room = rooms[currentRoomIndex];
    if (room.explored) {
      // Move to next room
      if (currentRoomIndex < rooms.length - 1) {
        setCurrentRoomIndex(currentRoomIndex + 1);
      } else {
        completeDungeon();
      }
      return;
    }

    setLoading(true);

    // Simulate exploration
    await new Promise(resolve => setTimeout(resolve, 1000));

    let resultMessage = '';
    let goldGain = 0;
    let xpGain = 0;
    let hpChange = 0;

    switch (room.type) {
      case 'empty':
        resultMessage = 'The room is empty. You find nothing of interest.';
        break;
      case 'monster':
        const damage = Math.floor(Math.random() * 8) + 2;
        hpChange = -damage;
        xpGain = Math.floor(Math.random() * 50) + 25;
        resultMessage = `You fight a monster! You take ${damage} damage but gain ${xpGain} XP.`;
        break;
      case 'treasure':
        goldGain = Math.floor(Math.random() * 50) + 10;
        resultMessage = `You found treasure! +${goldGain} gold.`;
        break;
      case 'trap':
        const trapDamage = Math.floor(Math.random() * 6) + 1;
        hpChange = -trapDamage;
        resultMessage = `You triggered a trap! You take ${trapDamage} damage.`;
        break;
      case 'rest':
        const healAmount = Math.floor(Math.random() * 10) + 5;
        hpChange = healAmount;
        resultMessage = `You found a safe spot to rest. +${healAmount} HP.`;
        break;
      case 'boss':
        const bossDamage = Math.floor(Math.random() * 15) + 10;
        hpChange = -bossDamage;
        xpGain = Math.floor(Math.random() * 200) + 100;
        goldGain = Math.floor(Math.random() * 100) + 50;
        resultMessage = `BOSS FIGHT! You defeat the boss! -${bossDamage} HP, +${xpGain} XP, +${goldGain} gold!`;
        break;
    }

    // Update character stats
    const newHp = Math.max(0, Math.min(
      currentCharacter.max_hit_points,
      currentCharacter.current_hit_points + hpChange
    ));
    const newGold = currentCharacter.gold + goldGain;
    const newXp = currentCharacter.experience_points + xpGain;

    try {
      await supabase.from('characters').update({
        current_hit_points: newHp,
        gold: newGold,
        experience: newXp,
      }).eq('id', currentCharacter.id);

      // Update local store
      await updateCharacter(currentCharacter.id, {
        current_hit_points: newHp,
        gold: newGold,
        experience_points: newXp,
      });
    } catch (err) {
      console.error('Failed to update character:', err);
    }

    // Mark room as explored
    const updatedRooms = [...rooms];
    updatedRooms[currentRoomIndex].explored = true;
    setRooms(updatedRooms);

    setMessage(resultMessage);
    setLoading(false);

    // Check if character died
    if (newHp <= 0) {
      setMessage('You have been defeated! Return to town to heal.');
      setExploring(false);
      setActiveDungeon(null);
    }
  };

  const completeDungeon = async () => {
    if (!currentCharacter) return;

    const bonusXp = 50;
    const bonusGold = 25;

    try {
      await supabase.from('characters').update({
        experience: currentCharacter.experience_points + bonusXp,
        gold: currentCharacter.gold + bonusGold,
      }).eq('id', currentCharacter.id);

      await updateCharacter(currentCharacter.id, {
        experience_points: currentCharacter.experience_points + bonusXp,
        gold: currentCharacter.gold + bonusGold,
      });
    } catch (err) {
      console.error('Failed to update character:', err);
    }

    setMessage(`Dungeon Complete! Bonus: +${bonusXp} XP, +${bonusGold} gold!`);
    setExploring(false);
    setActiveDungeon(null);
  };

  const leaveDungeon = () => {
    setExploring(false);
    setActiveDungeon(null);
    setRooms([]);
    setCurrentRoomIndex(0);
    setMessage('You fled the dungeon!');
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return styles.difficultyEasy;
      case 'Medium': return styles.difficultyMedium;
      case 'Hard': return styles.difficultyHard;
      case 'Deadly': return styles.difficultyDeadly;
      default: return styles.difficultyEasy;
    }
  };

  const getRoomIcon = (type: Room['type']) => {
    switch (type) {
      case 'empty': return '🚪';
      case 'monster': return '👹';
      case 'treasure': return '💰';
      case 'trap': return '⚠️';
      case 'rest': return '🏕️';
      case 'boss': return '🐉';
      default: return '❓';
    }
  };

  // Show dungeon exploration
  if (exploring && activeDungeon) {
    const currentRoom = rooms[currentRoomIndex];
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{activeDungeon.name}</Text>
          <Text style={styles.subtitle}>Room {currentRoomIndex + 1} of {rooms.length}</Text>
        </View>

        {currentCharacter && (
          <View style={styles.statsBar}>
            <Text style={styles.statText}>
              HP: {currentCharacter.current_hit_points}/{currentCharacter.max_hit_points}
            </Text>
            <Text style={styles.statText}>Gold: {currentCharacter.gold}</Text>
            <Text style={styles.statText}>XP: {currentCharacter.experience_points}</Text>
          </View>
        )}

        {message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        <View style={styles.roomCard}>
          <Text style={styles.roomIcon}>{getRoomIcon(currentRoom.type)}</Text>
          <Text style={styles.roomName}>{currentRoom.name}</Text>
          <Text style={styles.roomType}>
            {currentRoom.explored ? 'Explored' : 'Unexplored'}
          </Text>
        </View>

        <View style={styles.roomsProgress}>
          {rooms.map((room, index) => (
            <View
              key={room.id}
              style={[
                styles.roomDot,
                room.explored && styles.roomDotExplored,
                index === currentRoomIndex && styles.roomDotCurrent,
              ]}
            >
              <Text style={styles.roomDotText}>
                {room.explored ? '✓' : index === currentRoomIndex ? '→' : '•'}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.exploreButton, loading && styles.buttonDisabled]}
          onPress={exploreRoom}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {currentRoom.explored ? 'Next Room' : 'Explore Room'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.fleeButton} onPress={leaveDungeon}>
          <Text style={styles.fleeButtonText}>Flee Dungeon</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Show dungeon selection
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dungeon Exploration</Text>
      </View>

      {message ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Available Dungeons</Text>

        {DUNGEONS.map((dungeon) => (
          <TouchableOpacity
            key={dungeon.id}
            style={styles.dungeonCard}
            onPress={() => startDungeon(dungeon)}
          >
            <View style={styles.dungeonHeader}>
              <Text style={styles.dungeonName}>{dungeon.name}</Text>
              <Text style={getDifficultyStyle(dungeon.difficulty)}>{dungeon.difficulty}</Text>
            </View>
            <Text style={styles.dungeonInfo}>Recommended Level: {dungeon.recommendedLevel}</Text>
            <Text style={styles.dungeonDesc}>{dungeon.description}</Text>
            <Text style={styles.dungeonFloors}>{dungeon.floors} floors</Text>
          </TouchableOpacity>
        ))}
      </View>

      {currentCharacter && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Stats</Text>
          <Text style={styles.statLine}>
            HP: {currentCharacter.current_hit_points}/{currentCharacter.max_hit_points}
          </Text>
          <Text style={styles.statLine}>Level: {currentCharacter.level}</Text>
          <Text style={styles.statLine}>Gold: {currentCharacter.gold} gp</Text>
          <Text style={styles.statLine}>XP: {currentCharacter.experience_points}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#94a1b2', marginTop: 4 },
  card: { backgroundColor: '#16213e', margin: 16, padding: 20, borderRadius: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#9d4edd', marginBottom: 12 },
  dungeonCard: { backgroundColor: '#0f3460', padding: 16, borderRadius: 8, marginBottom: 12 },
  dungeonHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dungeonName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  difficultyEasy: { backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  difficultyMedium: { backgroundColor: '#f59e0b', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  difficultyHard: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  difficultyDeadly: { backgroundColor: '#7f1d1d', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  dungeonInfo: { color: '#94a1b2', fontSize: 14, marginBottom: 4 },
  dungeonDesc: { color: '#cbd5e1', fontSize: 14 },
  dungeonFloors: { color: '#9d4edd', fontSize: 12, marginTop: 8 },
  statsBar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#16213e', padding: 12, marginHorizontal: 16, borderRadius: 8 },
  statText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  statLine: { color: '#fff', fontSize: 16, marginBottom: 8 },
  messageBox: { backgroundColor: '#0f3460', margin: 16, padding: 16, borderRadius: 8 },
  messageText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  roomCard: { backgroundColor: '#16213e', margin: 16, padding: 24, borderRadius: 12, alignItems: 'center' },
  roomIcon: { fontSize: 48, marginBottom: 16 },
  roomName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  roomType: { color: '#94a1b2', fontSize: 16 },
  roomsProgress: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 16, gap: 8 },
  roomDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#0f3460', justifyContent: 'center', alignItems: 'center' },
  roomDotExplored: { backgroundColor: '#10b981' },
  roomDotCurrent: { backgroundColor: '#9d4edd' },
  roomDotText: { color: '#fff', fontSize: 14 },
  exploreButton: { backgroundColor: '#9d4edd', margin: 16, padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  fleeButton: { marginHorizontal: 16, marginBottom: 32, padding: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ef4444' },
  fleeButtonText: { color: '#ef4444', fontSize: 16 },
});
