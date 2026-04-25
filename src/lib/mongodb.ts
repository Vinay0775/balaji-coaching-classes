/**
 * ============================================================
 * MIGRATION-READY MONGODB CONNECTION MODULE
 * ============================================================
 * - DB URI comes ONLY from environment (config.ts)
 * - Zero hardcoded credentials
 * - Works across dev/prod by switching .env file only
 * - Connection pooling with global cache for Next.js HMR
 * - Detailed logging in development mode
 * ============================================================
 */

import mongoose from 'mongoose';
import config from './config';

// ── Types ────────────────────────────────────────────────────
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnected: boolean;
}

// ── Global cache (survives Next.js hot reloads) ──────────────
declare global {
  var __mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.__mongooseCache ?? {
  conn: null,
  promise: null,
  isConnected: false,
};

if (!global.__mongooseCache) {
  global.__mongooseCache = cached;
}

// ── Logger (only logs in development) ────────────────────────
function dbLog(message: string) {
  if (config.app.isDev) {
    console.log(`[MongoDB] ${message}`);
  }
}

// ── Main Connection Function ──────────────────────────────────
async function dbConnect(): Promise<typeof mongoose> {
  // Return existing connection if healthy
  if (cached.isConnected && cached.conn) {
    dbLog('Using existing connection');
    return cached.conn;
  }

  if (!cached.promise) {
    dbLog(`Connecting to database: ${config.db.name} [${config.app.nodeEnv}]`);

    cached.promise = mongoose
      .connect(config.db.uri, config.db.options)
      .then((mongooseInstance) => {
        cached.isConnected = true;
        dbLog(`Connected successfully → ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        cached.isConnected = false;
        console.error('[MongoDB] Connection failed:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// ── Connection Health Check ───────────────────────────────────
export async function checkDbHealth(): Promise<{
  status: 'connected' | 'disconnected' | 'error';
  host?: string;
  dbName?: string;
  ping?: number;
}> {
  try {
    const start = Date.now();
    await dbConnect();
    const db = mongoose.connection.db;
    await db?.admin().ping();
    return {
      status: 'connected',
      host: mongoose.connection.host,
      dbName: mongoose.connection.name,
      ping: Date.now() - start,
    };
  } catch (error: any) {
    return { status: 'error' };
  }
}

// ── Graceful Disconnect (useful for scripts/tests) ───────────
export async function dbDisconnect(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    cached.isConnected = false;
    dbLog('Disconnected from database');
  }
}

export default dbConnect;
