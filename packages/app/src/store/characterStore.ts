import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { useAuthStore } from './authStore';

interface Character {
  id: string;
  user_id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  experience: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  max_hit_points: number;
  current_hit_points: number;
  armor_class: number;
  initiative: number;
  speed: number;
  proficiency_bonus: number;
  skills: any;
  inventory: any[];
  gold: number;
  party_id?: string;
  created_at?: string;
}

// Map database fields to app fields
const mapDbToApp = (dbChar: any): Character => ({
  id: dbChar.id,
  user_id: dbChar.user_id,
  name: dbChar.name,
  race: dbChar.race,
  class: dbChar.class,
  level: dbChar.level,
  experience: dbChar.experience,
  strength: dbChar.strength,
  dexterity: dbChar.dexterity,
  constitution: dbChar.constitution,
  intelligence: dbChar.intelligence,
  wisdom: dbChar.wisdom,
  charisma: dbChar.charisma,
  max_hit_points: dbChar.max_hit_points,
  current_hit_points: dbChar.current_hit_points,
  armor_class: dbChar.armor_class,
  initiative: dbChar.initiative,
  speed: dbChar.speed,
  proficiency_bonus: dbChar.proficiency_bonus,
  skills: dbChar.skills || {},
  inventory: dbChar.inventory || [],
  gold: dbChar.gold || 0,
  party_id: dbChar.party_id,
  created_at: dbChar.created_at,
});

interface CharacterState {
  characters: Character[];
  currentCharacter: Character | null;
  loading: boolean;
  error: string | null;
  fetchCharacters: () => Promise<void>;
  selectCharacter: (character: Character) => void;
  createCharacter: (data: any) => Promise<void>;
  updateCharacter: (id: string, data: any) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  characters: [],
  currentCharacter: null,
  loading: false,
  error: null,

  fetchCharacters: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ characters: [], loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const characters = (data || []).map(mapDbToApp);
      set({
        characters,
        loading: false,
        // Auto-select first character if none selected
        currentCharacter: get().currentCharacter || characters[0] || null
      });
    } catch (error: any) {
      console.error('Failed to fetch characters:', error);
      set({ loading: false, error: error.message, characters: [] });
    }
  },

  selectCharacter: (character: Character) => {
    set({ currentCharacter: character });
  },

  createCharacter: async (data: any) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('Not authenticated');

    set({ loading: true, error: null });
    try {
      const characterData = {
        user_id: user.id,
        name: data.name,
        race: data.race,
        class: data.class,
        level: 1,
        experience: 0,
        strength: data.strength || 10,
        dexterity: data.dexterity || 10,
        constitution: data.constitution || 10,
        intelligence: data.intelligence || 10,
        wisdom: data.wisdom || 10,
        charisma: data.charisma || 10,
        max_hit_points: data.maxHitPoints || 10,
        current_hit_points: data.maxHitPoints || 10,
        armor_class: data.armorClass || 10,
        initiative: data.initiative || 0,
        speed: data.speed || 30,
        proficiency_bonus: 2,
        skills: data.skills || {},
        inventory: [],
        gold: 50,
      };

      const { data: newChar, error } = await supabase
        .from('characters')
        .insert(characterData)
        .select()
        .single();

      if (error) throw error;

      const character = mapDbToApp(newChar);
      set((state) => ({
        characters: [character, ...state.characters],
        currentCharacter: character,
        loading: false,
      }));
    } catch (error: any) {
      console.error('Failed to create character:', error);
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  updateCharacter: async (id: string, data: any) => {
    set({ error: null });
    try {
      const { data: updated, error } = await supabase
        .from('characters')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const character = mapDbToApp(updated);
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === id ? character : c
        ),
        currentCharacter:
          state.currentCharacter?.id === id
            ? character
            : state.currentCharacter,
      }));
    } catch (error: any) {
      console.error('Failed to update character:', error);
      set({ error: error.message });
      throw error;
    }
  },

  deleteCharacter: async (id: string) => {
    set({ error: null });
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        characters: state.characters.filter((c) => c.id !== id),
        currentCharacter:
          state.currentCharacter?.id === id ? null : state.currentCharacter,
      }));
    } catch (error: any) {
      console.error('Failed to delete character:', error);
      set({ error: error.message });
      throw error;
    }
  },
}));
