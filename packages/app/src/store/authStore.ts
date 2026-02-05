import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import apiService from '../services/api';

interface User {
  id: string;
  email: string;
  nickname: string;
}

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, nickname: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured - running in demo mode');
        set({ loading: false, error: null });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        apiService.setToken(session.access_token);

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ user: userData, session, loading: false, error: null });
      } else {
        set({ loading: false, error: null });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false, error: 'Failed to initialize auth' });
    }
  },

  signUp: async (email: string, password: string, nickname: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Backend not configured');
      }
      const response: any = await apiService.register(email, password, nickname);

      if (response.session) {
        apiService.setToken(response.session.access_token);
        set({ user: response.user, session: response.session, error: null });
      }
    } catch (error: any) {
      set({ error: error.message || 'Sign up failed' });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Backend not configured');
      }
      const response: any = await apiService.login(email, password);

      if (response.session) {
        apiService.setToken(response.session.access_token);
        set({ user: response.user, session: response.session, error: null });
      }
    } catch (error: any) {
      set({ error: error.message || 'Sign in failed' });
      throw error;
    }
  },

  signOut: async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      apiService.setToken(null);
      set({ user: null, session: null, error: null });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ user: null, session: null });
    }
  },
}));
