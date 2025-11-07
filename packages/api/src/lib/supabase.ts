import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Connection configuration with retry logic
const connectionConfig = {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: { 'x-application': 'maelstorm-rpg' }
  }
};

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, connectionConfig);

// Regular client for user operations
export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

/**
 * Database connection error codes that might be transient
 */
const TRANSIENT_ERROR_CODES = [
  '57P03', // Database not accepting connections
  '08000', // Connection exception
  '08003', // Connection does not exist
  '08006', // Connection failure
  '08001', // Unable to establish connection
  '08004', // Connection rejected
  'PGRST301' // JWT expired
];

/**
 * Check if error is a transient connection issue
 */
function isTransientError(error: any): boolean {
  if (!error) return false;

  const errorCode = error.code || error.error_code || '';
  const errorMessage = error.message || '';

  return TRANSIENT_ERROR_CODES.some(code => errorCode.includes(code)) ||
         errorMessage.includes('not accepting connections') ||
         errorMessage.includes('connection') ||
         errorMessage.includes('Hot standby');
}

/**
 * Retry logic for database operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // If it's not a transient error, don't retry
      if (!isTransientError(error)) {
        throw error;
      }

      // If this was the last attempt, throw
      if (attempt === maxRetries - 1) {
        throw new Error(
          `Database connection failed after ${maxRetries} attempts. ` +
          `The database may be paused or in maintenance mode. ` +
          `Please check your Supabase dashboard. Original error: ${error.message}`
        );
      }

      // Wait before retrying with exponential backoff
      const waitTime = delayMs * Math.pow(2, attempt);
      console.warn(`Database connection attempt ${attempt + 1} failed, retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

/**
 * Check database connection health
 */
export async function checkDatabaseHealth(): Promise<{ healthy: boolean; message: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)
      .single();

    if (error && isTransientError(error)) {
      return {
        healthy: false,
        message: 'Database is not accepting connections. The project may be paused or in maintenance mode.'
      };
    }

    return {
      healthy: true,
      message: 'Database connection is healthy'
    };
  } catch (error: any) {
    return {
      healthy: false,
      message: `Database health check failed: ${error.message}`
    };
  }
}

/**
 * Get user from authorization header with retry logic
 */
export async function getUserFromAuth(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const result = await withRetry(async () => {
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error) {
        throw error;
      }

      return user;
    });

    return result;
  } catch (error) {
    console.error('Failed to get user from auth token:', error);
    return null;
  }
}
