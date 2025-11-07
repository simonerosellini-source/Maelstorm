import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllClasses, getClassById } from '../../../lib/gameData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (id) {
    const classData = getClassById(id as string);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    return res.status(200).json({ class: classData });
  }

  const classes = getAllClasses();
  res.status(200).json({ classes });
}
