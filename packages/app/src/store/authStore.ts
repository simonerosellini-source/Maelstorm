import { create } from 'zustand';
import { supabase } from '../services/supabase';

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
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Get user data from users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          user: userData || {
            id: session.user.id,
            email: session.user.email || '',
            nickname: session.user.user_metadata?.nickname || 'Player'
          },
          session,
          loading: false,
          error: null
        });
      } else {
        set({ loading: false, error: null });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false, error: null });
    }
  },

  signUp: async (email: string, password: string, nickname: string) => {
    try {
      // 1. Create auth user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create account');

      // 2. Create user record in users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          nickname: nickname
        });

      if (userError) {
        console.error('Error creating user record:', userError);
        // Continue anyway - user is authenticated
      }

      const user = {
        id: authData.user.id,
        email: email,
        nickname: nickname
      };

      set({ user, session: authData.session, error: null });
    } catch (error: any) {
      const message = error.message || 'Sign up failed';
      set({ error: message });
      throw new Error(message);
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Login failed');

      // Get user data from users table
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      const user = userData || {
        id: authData.user.id,
        email: authData.user.email || email,
        nickname: authData.user.user_metadata?.nickname || 'Player'
      };

      set({ user, session: authData.session, error: null });
    } catch (error: any) {
      const message = error.message || 'Sign in failed';
      set({ error: message });
      throw new Error(message);
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null, error: null });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ user: null, session: null });
    }
  },
}));
