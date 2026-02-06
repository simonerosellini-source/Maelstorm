import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useCharacterStore } from '../../store/characterStore';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { supabase } from '../../services/supabase';

interface PartyMember {
  id: string;
  user_id: string;
  character_id: string;
  nickname: string;
  character_name: string;
  level: number;
  class: string;
  current_hp?: number;
  max_hp?: number;
}

interface Party {
  id: string;
  code: string;
  name: string;
  status: 'lobby' | 'active' | 'finished';
  leader_id: string;
  members: PartyMember[];
}

const MONSTERS_TO_SEND = [
  { id: 'goblin', name: 'Goblin', cr: 0.25, damage: '1d6', cost: 10 },
  { id: 'orc', name: 'Orc', cr: 0.5, damage: '1d12', cost: 25 },
  { id: 'ogre', name: 'Ogre', cr: 2, damage: '2d8', cost: 50 },
  { id: 'troll', name: 'Troll', cr: 5, damage: '2d10', cost: 100 },
  { id: 'dragon_wyrmling', name: 'Dragon Wyrmling', cr: 4, damage: '3d10', cost: 150 },
];

const CURSES_TO_SEND = [
  { id: 'weakness', name: 'Curse of Weakness', effect: '-2 STR for 3 encounters', cost: 20 },
  { id: 'slowness', name: 'Curse of Slowness', effect: '-10 speed for 3 encounters', cost: 20 },
  { id: 'misfortune', name: 'Curse of Misfortune', effect: '-2 to all rolls for 2 encounters', cost: 30 },
  { id: 'vulnerability', name: 'Curse of Vulnerability', effect: '-2 AC for 3 encounters', cost: 35 },
  { id: 'exhaustion', name: 'Curse of Exhaustion', effect: 'Disadvantage on attacks for 2 encounters', cost: 50 },
];

const ITEMS_TO_SEND = [
  { id: 'potion_healing', name: 'Potion of Healing', effect: '+2d4+2 HP', cost: 25 },
  { id: 'scroll_fireball', name: 'Scroll of Fireball', effect: 'One-time 8d6 fire damage', cost: 50 },
  { id: 'bomb', name: 'Smoke Bomb', effect: 'Auto-escape from combat', cost: 30 },
  { id: 'antidote', name: 'Antidote', effect: 'Remove one curse', cost: 40 },
];

const generatePartyCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function PartyScreen() {
  const { currentCharacter, updateCharacter } = useCharacterStore();
  const { user } = useAuthStore();
  const { createNotification } = useNotificationStore();
  const [party, setParty] = useState<Party | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [partyName, setPartyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  // Sabotage modal state
  const [sabotageModal, setSabotageModal] = useState<'monster' | 'curse' | 'item' | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<PartyMember | null>(null);
  const [sendingAction, setSendingAction] = useState(false);

  useEffect(() => {
    if (user) {
      loadCurrentParty();
      subscribeToPartyUpdates();
    }
  }, [user]);

  const subscribeToPartyUpdates = () => {
    if (!user) return;

    const channel = supabase
      .channel('party_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'party_members' },
        () => {
          loadCurrentParty();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadCurrentParty = async () => {
    if (!user) return;

    try {
      const { data: memberData, error: memberError } = await supabase
        .from('party_members')
        .select('party_id')
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData) {
        setParty(null);
        return;
      }

      const { data: partyData, error: partyError } = await supabase
        .from('parties')
        .select('*')
        .eq('id', memberData.party_id)
        .single();

      if (partyError || !partyData) {
        setParty(null);
        return;
      }

      const { data: members, error: membersError } = await supabase
        .from('party_members')
        .select(`
          id,
          user_id,
          character_id,
          users:user_id (nickname),
          characters:character_id (name, level, class, current_hit_points, max_hit_points)
        `)
        .eq('party_id', partyData.id);

      if (membersError) {
        console.error('Failed to load members:', membersError);
        return;
      }

      const partyMembers: PartyMember[] = (members || []).map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        character_id: m.character_id,
        nickname: m.users?.nickname || 'Unknown',
        character_name: m.characters?.name || 'No Character',
        level: m.characters?.level || 1,
        class: m.characters?.class || 'Unknown',
        current_hp: m.characters?.current_hit_points,
        max_hp: m.characters?.max_hit_points,
      }));

      setParty({
        ...partyData,
        members: partyMembers,
      });
    } catch (err) {
      console.error('Failed to load party:', err);
    }
  };

  const createParty = async () => {
    if (!user || !currentCharacter) {
      setError('You need a character to create a party');
      return;
    }

    if (!partyName.trim()) {
      setError('Please enter a party name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const code = generatePartyCode();

      const { data: newParty, error: partyError } = await supabase
        .from('parties')
        .insert({
          code,
          name: partyName.trim(),
          status: 'lobby',
          leader_id: user.id,
        })
        .select()
        .single();

      if (partyError) throw partyError;

      const { error: memberError } = await supabase
        .from('party_members')
        .insert({
          party_id: newParty.id,
          user_id: user.id,
          character_id: currentCharacter.id,
          role: 'leader',
        });

      if (memberError) throw memberError;

      setMessage(`Party created! Share code: ${code}`);
      setShowCreate(false);
      setPartyName('');
      await loadCurrentParty();
    } catch (err: any) {
      setError(err.message || 'Failed to create party');
    } finally {
      setLoading(false);
    }
  };

  const joinParty = async () => {
    if (!user || !currentCharacter) {
      setError('You need a character to join a party');
      return;
    }

    if (!joinCode.trim()) {
      setError('Please enter a party code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: partyData, error: partyError } = await supabase
        .from('parties')
        .select('*')
        .eq('code', joinCode.toUpperCase())
        .eq('status', 'lobby')
        .single();

      if (partyError || !partyData) {
        setError('Party not found or already started');
        setLoading(false);
        return;
      }

      const { data: existing } = await supabase
        .from('party_members')
        .select('id')
        .eq('party_id', partyData.id)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        setError('You are already in this party');
        setLoading(false);
        return;
      }

      const { count } = await supabase
        .from('party_members')
        .select('*', { count: 'exact', head: true })
        .eq('party_id', partyData.id);

      if (count && count >= 6) {
        setError('Party is full (max 6 members)');
        setLoading(false);
        return;
      }

      const { error: joinError } = await supabase
        .from('party_members')
        .insert({
          party_id: partyData.id,
          user_id: user.id,
          character_id: currentCharacter.id,
          role: 'member',
        });

      if (joinError) throw joinError;

      // Notify party members
      const { data: members } = await supabase
        .from('party_members')
        .select('user_id')
        .eq('party_id', partyData.id)
        .neq('user_id', user.id);

      if (members) {
        for (const member of members) {
          await createNotification(
            member.user_id,
            'party_invite',
            'New Party Member!',
            `${currentCharacter.name} has joined the party!`
          );
        }
      }

      setMessage(`Joined ${partyData.name}!`);
      setShowJoin(false);
      setJoinCode('');
      await loadCurrentParty();
    } catch (err: any) {
      setError(err.message || 'Failed to join party');
    } finally {
      setLoading(false);
    }
  };

  const leaveParty = async () => {
    if (!user || !party) return;

    const confirmLeave = typeof window !== 'undefined'
      ? window.confirm('Are you sure you want to leave the party?')
      : true;

    if (!confirmLeave) return;

    setLoading(true);

    try {
      await supabase
        .from('party_members')
        .delete()
        .eq('party_id', party.id)
        .eq('user_id', user.id);

      const { count } = await supabase
        .from('party_members')
        .select('*', { count: 'exact', head: true })
        .eq('party_id', party.id);

      if (count === 0) {
        await supabase.from('parties').delete().eq('id', party.id);
      }

      setMessage('Left the party');
      setParty(null);
    } catch (err: any) {
      setError(err.message || 'Failed to leave party');
    } finally {
      setLoading(false);
    }
  };

  const sendMonster = async (monster: typeof MONSTERS_TO_SEND[0]) => {
    if (!selectedTarget || !currentCharacter || !user) return;

    if (currentCharacter.gold < monster.cost) {
      setError(`Not enough gold! Need ${monster.cost} gp`);
      return;
    }

    setSendingAction(true);
    try {
      // Deduct gold
      const newGold = currentCharacter.gold - monster.cost;
      await supabase
        .from('characters')
        .update({ gold: newGold })
        .eq('id', currentCharacter.id);

      await updateCharacter(currentCharacter.id, { gold: newGold });

      // Calculate damage
      const diceMatch = monster.damage.match(/(\d+)d(\d+)/);
      let damage = 0;
      if (diceMatch) {
        const numDice = parseInt(diceMatch[1]);
        const diceSize = parseInt(diceMatch[2]);
        for (let i = 0; i < numDice; i++) {
          damage += Math.floor(Math.random() * diceSize) + 1;
        }
      }

      // Apply damage to target
      const newHp = Math.max(0, (selectedTarget.current_hp || 10) - damage);
      await supabase
        .from('characters')
        .update({ current_hit_points: newHp })
        .eq('id', selectedTarget.character_id);

      // Send notification
      await createNotification(
        selectedTarget.user_id,
        'monster_attack',
        `${monster.name} Attack!`,
        `${currentCharacter.name} sent a ${monster.name} to attack you! You took ${damage} damage!`,
        { monster_id: monster.id, damage, attacker: currentCharacter.name }
      );

      setMessage(`Sent ${monster.name} to ${selectedTarget.nickname}! Dealt ${damage} damage!`);
      setSabotageModal(null);
      setSelectedTarget(null);
      await loadCurrentParty();
    } catch (err: any) {
      setError(err.message || 'Failed to send monster');
    } finally {
      setSendingAction(false);
    }
  };

  const sendCurse = async (curse: typeof CURSES_TO_SEND[0]) => {
    if (!selectedTarget || !currentCharacter || !user) return;

    if (currentCharacter.gold < curse.cost) {
      setError(`Not enough gold! Need ${curse.cost} gp`);
      return;
    }

    setSendingAction(true);
    try {
      // Deduct gold
      const newGold = currentCharacter.gold - curse.cost;
      await supabase
        .from('characters')
        .update({ gold: newGold })
        .eq('id', currentCharacter.id);

      await updateCharacter(currentCharacter.id, { gold: newGold });

      // Send notification
      await createNotification(
        selectedTarget.user_id,
        'curse',
        `Cursed!`,
        `${currentCharacter.name} cast ${curse.name} on you! ${curse.effect}`,
        { curse_id: curse.id, effect: curse.effect, caster: currentCharacter.name }
      );

      setMessage(`Cast ${curse.name} on ${selectedTarget.nickname}!`);
      setSabotageModal(null);
      setSelectedTarget(null);
    } catch (err: any) {
      setError(err.message || 'Failed to send curse');
    } finally {
      setSendingAction(false);
    }
  };

  const sendItem = async (item: typeof ITEMS_TO_SEND[0]) => {
    if (!selectedTarget || !currentCharacter || !user) return;

    if (currentCharacter.gold < item.cost) {
      setError(`Not enough gold! Need ${item.cost} gp`);
      return;
    }

    setSendingAction(true);
    try {
      // Deduct gold
      const newGold = currentCharacter.gold - item.cost;
      await supabase
        .from('characters')
        .update({ gold: newGold })
        .eq('id', currentCharacter.id);

      await updateCharacter(currentCharacter.id, { gold: newGold });

      // If healing potion, apply healing
      if (item.id === 'potion_healing') {
        const healAmount = Math.floor(Math.random() * 8) + 4; // 2d4+2
        const newHp = Math.min(
          selectedTarget.max_hp || 20,
          (selectedTarget.current_hp || 10) + healAmount
        );
        await supabase
          .from('characters')
          .update({ current_hit_points: newHp })
          .eq('id', selectedTarget.character_id);
      }

      // Send notification
      await createNotification(
        selectedTarget.user_id,
        'item_received',
        `Item Received!`,
        `${currentCharacter.name} sent you a ${item.name}! ${item.effect}`,
        { item_id: item.id, effect: item.effect, sender: currentCharacter.name }
      );

      setMessage(`Sent ${item.name} to ${selectedTarget.nickname}!`);
      setSabotageModal(null);
      setSelectedTarget(null);
      await loadCurrentParty();
    } catch (err: any) {
      setError(err.message || 'Failed to send item');
    } finally {
      setSendingAction(false);
    }
  };

  const renderSabotageModal = () => {
    if (!sabotageModal || !selectedTarget) return null;

    let items: any[] = [];
    let title = '';
    let onSelect: (item: any) => void = () => {};

    if (sabotageModal === 'monster') {
      items = MONSTERS_TO_SEND;
      title = `Send Monster to ${selectedTarget.nickname}`;
      onSelect = sendMonster;
    } else if (sabotageModal === 'curse') {
      items = CURSES_TO_SEND;
      title = `Cast Curse on ${selectedTarget.nickname}`;
      onSelect = sendCurse;
    } else if (sabotageModal === 'item') {
      items = ITEMS_TO_SEND;
      title = `Send Item to ${selectedTarget.nickname}`;
      onSelect = sendItem;
    }

    return (
      <Modal
        visible={true}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setSabotageModal(null);
          setSelectedTarget(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSabotageModal(null);
                  setSelectedTarget(null);
                }}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.goldInfo}>
              Your Gold: {currentCharacter?.gold || 0} gp
            </Text>

            <ScrollView style={styles.itemList}>
              {items.map((item) => {
                const canAfford = (currentCharacter?.gold || 0) >= item.cost;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.itemCard, !canAfford && styles.itemCardDisabled]}
                    onPress={() => canAfford && onSelect(item)}
                    disabled={!canAfford || sendingAction}
                  >
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={[styles.itemCost, !canAfford && styles.itemCostRed]}>
                        {item.cost} gp
                      </Text>
                    </View>
                    <Text style={styles.itemEffect}>
                      {item.effect || item.damage || `CR ${item.cr}`}
                    </Text>
                    {sendingAction && (
                      <ActivityIndicator style={styles.loadingIndicator} color="#9d4edd" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // Show party view if in a party
  if (party) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{party.name}</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Party Code:</Text>
            <Text style={styles.codeText}>{party.code}</Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Party Members ({party.members.length}/6)</Text>
          {party.members.map((member, index) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberRank}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.nickname}</Text>
                <Text style={styles.memberChar}>
                  {member.character_name} - Lv {member.level} {member.class}
                </Text>
                {member.current_hp !== undefined && (
                  <Text style={styles.memberHp}>
                    HP: {member.current_hp}/{member.max_hp}
                  </Text>
                )}
              </View>
              {member.user_id === party.leader_id && (
                <Text style={styles.leaderBadge}>Leader</Text>
              )}
              {member.user_id !== user?.id && (
                <TouchableOpacity
                  style={styles.targetButton}
                  onPress={() => setSelectedTarget(member)}
                >
                  <Text style={styles.targetButtonText}>⚔️</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {selectedTarget && selectedTarget.user_id !== user?.id && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Target: {selectedTarget.nickname}</Text>
            <Text style={styles.cardSubtitle}>Choose an action:</Text>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={[styles.sabotageButton, styles.monsterButton]}
                onPress={() => setSabotageModal('monster')}
              >
                <Text style={styles.sabotageIcon}>👹</Text>
                <Text style={styles.sabotageText}>Monster</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sabotageButton, styles.curseButton]}
                onPress={() => setSabotageModal('curse')}
              >
                <Text style={styles.sabotageIcon}>💀</Text>
                <Text style={styles.sabotageText}>Curse</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sabotageButton, styles.itemButton]}
                onPress={() => setSabotageModal('item')}
              >
                <Text style={styles.sabotageIcon}>🎁</Text>
                <Text style={styles.sabotageText}>Item</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.cancelTargetButton}
              onPress={() => setSelectedTarget(null)}
            >
              <Text style={styles.cancelTargetText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.leaveButton} onPress={leaveParty} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ef4444" />
          ) : (
            <Text style={styles.leaveButtonText}>Leave Party</Text>
          )}
        </TouchableOpacity>

        {renderSabotageModal()}
      </ScrollView>
    );
  }

  // Show create/join options
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Party & Multiplayer</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {message ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Party</Text>
        <Text style={styles.cardText}>Not in a party</Text>

        {showCreate ? (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              value={partyName}
              onChangeText={setPartyName}
              placeholder="Enter party name..."
              placeholderTextColor="#94a1b2"
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={createParty}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCreate(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : showJoin ? (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              value={joinCode}
              onChangeText={(text) => setJoinCode(text.toUpperCase())}
              placeholder="Enter party code..."
              placeholderTextColor="#94a1b2"
              autoCapitalize="characters"
              maxLength={6}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={joinParty}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Join</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowJoin(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setShowCreate(true);
                setShowJoin(false);
                setError('');
              }}
            >
              <Text style={styles.buttonText}>Create Party</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => {
                setShowJoin(true);
                setShowCreate(false);
                setError('');
              }}
            >
              <Text style={styles.buttonText}>Join Party</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>How It Works</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>1</Text>
          <Text style={styles.infoText}>Create or join a party with up to 6 players</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>2</Text>
          <Text style={styles.infoText}>Race to be the first to reach level 20</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>3</Text>
          <Text style={styles.infoText}>Send monsters and curses to slow down competitors</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>4</Text>
          <Text style={styles.infoText}>First to level 20 wins!</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  codeBox: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  codeLabel: { color: '#94a1b2', fontSize: 14, marginRight: 8 },
  codeText: { color: '#9d4edd', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  card: { backgroundColor: '#16213e', margin: 16, padding: 20, borderRadius: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#9d4edd', marginBottom: 12 },
  cardSubtitle: { fontSize: 14, color: '#94a1b2', marginBottom: 12 },
  cardText: { color: '#94a1b2', fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: '#9d4edd', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  buttonSecondary: { backgroundColor: '#0f3460' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  formContainer: { marginTop: 8 },
  input: { backgroundColor: '#0f3460', padding: 16, borderRadius: 8, color: '#fff', fontSize: 16, marginBottom: 12 },
  cancelButton: { padding: 12, alignItems: 'center' },
  cancelButtonText: { color: '#94a1b2', fontSize: 14 },
  memberCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f3460', padding: 12, borderRadius: 8, marginBottom: 8 },
  memberRank: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#9d4edd', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  memberInfo: { flex: 1 },
  memberName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  memberChar: { color: '#94a1b2', fontSize: 14 },
  memberHp: { color: '#10b981', fontSize: 12, marginTop: 2 },
  leaderBadge: { backgroundColor: '#fbbf24', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, color: '#000', fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  targetButton: { padding: 8, marginLeft: 8 },
  targetButtonText: { fontSize: 20 },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-around', gap: 8 },
  sabotageButton: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
  monsterButton: { backgroundColor: '#7f1d1d' },
  curseButton: { backgroundColor: '#581c87' },
  itemButton: { backgroundColor: '#065f46' },
  sabotageIcon: { fontSize: 24, marginBottom: 4 },
  sabotageText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  cancelTargetButton: { marginTop: 12, padding: 12, alignItems: 'center' },
  cancelTargetText: { color: '#94a1b2' },
  leaveButton: { marginHorizontal: 16, marginBottom: 32, padding: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ef4444' },
  leaveButtonText: { color: '#ef4444', fontSize: 16 },
  errorBox: { backgroundColor: '#ff4757', margin: 16, padding: 12, borderRadius: 8 },
  errorText: { color: '#fff', textAlign: 'center' },
  messageBox: { backgroundColor: '#10b981', margin: 16, padding: 12, borderRadius: 8 },
  messageText: { color: '#fff', textAlign: 'center' },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#9d4edd', color: '#fff', textAlign: 'center', lineHeight: 28, fontWeight: 'bold', marginRight: 12, overflow: 'hidden' },
  infoText: { color: '#cbd5e1', fontSize: 14, flex: 1 },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#16213e', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#0f3460' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  closeButton: { color: '#94a1b2', fontSize: 24 },
  goldInfo: { color: '#fbbf24', fontSize: 16, fontWeight: 'bold', paddingHorizontal: 20, paddingTop: 10 },
  itemList: { padding: 16 },
  itemCard: { backgroundColor: '#0f3460', padding: 16, borderRadius: 8, marginBottom: 12 },
  itemCardDisabled: { opacity: 0.5 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  itemCost: { color: '#10b981', fontWeight: 'bold' },
  itemCostRed: { color: '#ef4444' },
  itemEffect: { color: '#94a1b2', fontSize: 14 },
  loadingIndicator: { marginTop: 8 },
});
