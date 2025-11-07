import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllSpells, getSpellById, getSpellsByClass } from '../../../lib/gameData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, class: className } = req.query;

  if (id) {
    const spell = getSpellById(id as string);
    if (!spell) {
      return res.status(404).json({ error: 'Spell not found' });
    }
    return res.status(200).json({ spell });
  }

  if (className) {
    const spells = getSpellsByClass(className as string);
    return res.status(200).json({ spells });
  }

  const spells = getAllSpells();
  res.status(200).json({ spells });
}
