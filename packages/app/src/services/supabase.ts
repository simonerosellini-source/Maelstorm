import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jqpmllgsmypnwqpscrim.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcG1sbGdzbXlwbndxcHNjcmltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDYzMzMsImV4cCI6MjA3NjYyMjMzM30._dGpdSvr8KAX11IGPTtsDOUzviwEw9-LYeBhEweuYJw';

// Always configured since we have default values
export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
