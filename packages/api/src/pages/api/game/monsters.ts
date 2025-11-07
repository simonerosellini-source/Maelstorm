import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllMonsters, getMonsterById, getMonstersByCR } from '../../../lib/gameData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, cr } = req.query;

  if (id) {
    const monster = getMonsterById(id as string);
    if (!monster) {
      return res.status(404).json({ error: 'Monster not found' });
    }
    return res.status(200).json({ monster });
  }

  if (cr) {
    const monsters = getMonstersByCR(parseFloat(cr as string));
    return res.status(200).json({ monsters });
  }

  const monsters = getAllMonsters();
  res.status(200).json({ monsters });
}
