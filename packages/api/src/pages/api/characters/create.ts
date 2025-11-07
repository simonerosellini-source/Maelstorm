import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromAuth, supabaseAdmin } from '../../../lib/supabase';
import { createCharacterFromData } from '../../../lib/characterUtils';
import type { CharacterCreationData } from '@maelstorm/shared';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await getUserFromAuth(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const creationData: CharacterCreationData = req.body;

  // Validate creation data
  if (!creationData.name || !creationData.race || !creationData.class) {
    return res.status(400).json({ error: 'Name, race, and class are required' });
  }

  if (!creationData.abilityScores) {
    return res.status(400).json({ error: 'Ability scores are required' });
  }

  try {
    // Create character object
    const character = createCharacterFromData(user.id, creationData);

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('characters')
      .insert(character)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ character: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
