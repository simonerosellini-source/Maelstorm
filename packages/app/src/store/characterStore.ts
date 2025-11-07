import { create } from 'zustand';
import type { Character } from '@maelstorm/shared';
import apiService from '../services/api';

interface CharacterState {
  characters: Character[];
  currentCharacter: Character | null;
  loading: boolean;
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

  fetchCharacters: async () => {
    set({ loading: true });
    try {
      const response: any = await apiService.getCharacters();
      set({ characters: response.characters, loading: false });
    } catch (error) {
      console.error('Failed to fetch characters:', error);
      set({ loading: false });
    }
  },

  selectCharacter: (character: Character) => {
    set({ currentCharacter: character });
  },

  createCharacter: async (data: any) => {
    set({ loading: true });
    try {
      const response: any = await apiService.createCharacter(data);
      const newCharacter = response.character;
      set((state) => ({
        characters: [...state.characters, newCharacter],
        currentCharacter: newCharacter,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to create character:', error);
      set({ loading: false });
      throw error;
    }
  },

  updateCharacter: async (id: string, data: any) => {
    try {
      const response: any = await apiService.updateCharacter(id, data);
      const updatedCharacter = response.character;
      set((state) => ({
        characters: state.characters.map((c) =>
          c.id === id ? updatedCharacter : c
        ),
        currentCharacter:
          state.currentCharacter?.id === id
            ? updatedCharacter
            : state.currentCharacter,
      }));
    } catch (error) {
      console.error('Failed to update character:', error);
      throw error;
    }
  },

  deleteCharacter: async (id: string) => {
    try {
      await apiService.deleteCharacter(id);
      set((state) => ({
        characters: state.characters.filter((c) => c.id !== id),
        currentCharacter:
          state.currentCharacter?.id === id ? null : state.currentCharacter,
      }));
    } catch (error) {
      console.error('Failed to delete character:', error);
      throw error;
    }
  },
}));
