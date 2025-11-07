import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromAuth, supabaseAdmin } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUserFromAuth(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('characters')
        .select('*')
        .eq('id', id as string)
        .single();

      if (error) {
        return res.status(404).json({ error: 'Character not found' });
      }

      // Verify ownership
      if (data.user_id !== user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      res.status(200).json({ character: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      // Verify ownership first
      const { data: existing } = await supabaseAdmin
        .from('characters')
        .select('user_id')
        .eq('id', id as string)
        .single();

      if (!existing || existing.user_id !== user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { data, error } = await supabaseAdmin
        .from('characters')
        .update(req.body)
        .eq('id', id as string)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ character: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Verify ownership first
      const { data: existing } = await supabaseAdmin
        .from('characters')
        .select('user_id')
        .eq('id', id as string)
        .single();

      if (!existing || existing.user_id !== user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { error } = await supabaseAdmin
        .from('characters')
        .delete()
        .eq('id', id as string);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
