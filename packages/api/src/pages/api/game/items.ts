import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllItems, getItemById, getItemsByType } from '../../../lib/gameData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, type } = req.query;

  if (id) {
    const item = getItemById(id as string);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    return res.status(200).json({ item });
  }

  if (type) {
    const items = getItemsByType(type as string);
    return res.status(200).json({ items });
  }

  const items = getAllItems();
  res.status(200).json({ items });
}
