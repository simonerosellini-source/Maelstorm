import React, { useState, useEffect } from 'react';
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

interface PartyMember {
  id: string;
  user_id: string;
  character_id: string;
  nickname: string;
  character_name: string;
  level: number;
  class: string;
}

interface Party {
  id: string;
  code: string;
  name: string;
  status: 'lobby' | 'active' | 'finished';
  leader_id: string;
  members: PartyMember[];
}

const generatePartyCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function PartyScreen() {
  const { currentCharacter } = useCharacterStore();
  const { user } = useAuthStore();
  const [party, setParty] = useState<Party | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [partyName, setPartyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    if (user) {
      loadCurrentParty();
    }
  }, [user]);

  const loadCurrentParty = async () => {
    if (!user) return;

    try {
      // Check if user is in a party
      const { data: memberData, error: memberError } = await supabase
        .from('party_members')
        .select('party_id')
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData) {
        setParty(null);
        return;
      }

      // Load party details
      const { data: partyData, error: partyError } = await supabase
        .from('parties')
        .select('*')
        .eq('id', memberData.party_id)
        .single();

      if (partyError || !partyData) {
        setParty(null);
        return;
      }

      // Load party members
      const { data: members, error: membersError } = await supabase
        .from('party_members')
        .select(`
          id,
          user_id,
          character_id,
          users:user_id (nickname),
          characters:character_id (name, level, class)
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

      // Create party
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

      // Add creator as member
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
      // Find party by code
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

      // Check if already a member
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

      // Check party size (max 6)
      const { count } = await supabase
        .from('party_members')
        .select('*', { count: 'exact', head: true })
        .eq('party_id', partyData.id);

      if (count && count >= 6) {
        setError('Party is full (max 6 members)');
        setLoading(false);
        return;
      }

      // Join party
      const { error: joinError } = await supabase
        .from('party_members')
        .insert({
          party_id: partyData.id,
          user_id: user.id,
          character_id: currentCharacter.id,
          role: 'member',
        });

      if (joinError) throw joinError;

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

      // If party is empty, delete it
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
              </View>
              {member.user_id === party.leader_id && (
                <Text style={styles.leaderBadge}>Leader</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Competitive Actions</Text>
          <Text style={styles.cardText}>
            Send items or monsters to hinder your competitors!
          </Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Send Item (Coming Soon)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Send Monster (Coming Soon)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.leaveButton} onPress={leaveParty} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ef4444" />
          ) : (
            <Text style={styles.leaveButtonText}>Leave Party</Text>
          )}
        </TouchableOpacity>
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
  leaderBadge: { backgroundColor: '#fbbf24', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, color: '#000', fontSize: 12, fontWeight: 'bold' },
  actionButton: { backgroundColor: '#0f3460', padding: 16, borderRadius: 8, marginBottom: 8 },
  actionText: { color: '#94a1b2', fontSize: 16, textAlign: 'center' },
  leaveButton: { marginHorizontal: 16, marginBottom: 32, padding: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#ef4444' },
  leaveButtonText: { color: '#ef4444', fontSize: 16 },
  errorBox: { backgroundColor: '#ff4757', margin: 16, padding: 12, borderRadius: 8 },
  errorText: { color: '#fff', textAlign: 'center' },
  messageBox: { backgroundColor: '#10b981', margin: 16, padding: 12, borderRadius: 8 },
  messageText: { color: '#fff', textAlign: 'center' },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#9d4edd', color: '#fff', textAlign: 'center', lineHeight: 28, fontWeight: 'bold', marginRight: 12 },
  infoText: { color: '#cbd5e1', fontSize: 14, flex: 1 },
});
