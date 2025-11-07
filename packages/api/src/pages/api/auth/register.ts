import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ error: 'Email, password, and nickname are required' });
  }

  try {
    // Check if nickname is already taken
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('nickname', nickname)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Nickname already taken' });
    }

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Create user record in users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        nickname,
      })
      .select()
      .single();

    if (userError) {
      // Rollback auth user creation if user table insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ error: 'Failed to create user record' });
    }

    res.status(201).json({
      user: userData,
      session: authData.session,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
