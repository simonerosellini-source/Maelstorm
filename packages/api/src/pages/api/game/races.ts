import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllRaces, getRaceById } from '../../../lib/gameData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (id) {
    const race = getRaceById(id as string);
    if (!race) {
      return res.status(404).json({ error: 'Race not found' });
    }
    return res.status(200).json({ race });
  }

  const races = getAllRaces();
  res.status(200).json({ races });
}
