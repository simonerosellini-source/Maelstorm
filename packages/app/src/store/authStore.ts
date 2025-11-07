import { create } from 'zustand';
import { supabase } from '../services/supabase';
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
  signUp: (email: string, password: string, nickname: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      apiService.setToken(session.access_token);

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      set({ user: userData, session, loading: false });
    } else {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, nickname: string) => {
    const response: any = await apiService.register(email, password, nickname);

    if (response.session) {
      apiService.setToken(response.session.access_token);
      set({ user: response.user, session: response.session });
    }
  },

  signIn: async (email: string, password: string) => {
    const response: any = await apiService.login(email, password);

    if (response.session) {
      apiService.setToken(response.session.access_token);
      set({ user: response.user, session: response.session });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    apiService.setToken(null);
    set({ user: null, session: null });
  },
}));
