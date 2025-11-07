import type { NextApiRequest, NextApiResponse } from 'next';
import { checkDatabaseHealth } from '../../lib/supabase';

/**
 * Health check endpoint
 * GET /api/health
 *
 * Returns the health status of the API and database connection
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dbHealth = await checkDatabaseHealth();

    const response = {
      api: {
        status: 'ok',
        timestamp: new Date().toISOString()
      },
      database: {
        status: dbHealth.healthy ? 'ok' : 'error',
        message: dbHealth.message
      }
    };

    const statusCode = dbHealth.healthy ? 200 : 503;

    return res.status(statusCode).json(response);
  } catch (error: any) {
    console.error('Health check failed:', error);

    return res.status(503).json({
      api: {
        status: 'ok',
        timestamp: new Date().toISOString()
      },
      database: {
        status: 'error',
        message: error.message || 'Unknown error occurred'
      }
    });
  }
}
