import { NextResponse } from 'next/server';
import { checkDbHealth } from '@/lib/mongodb';

/**
 * GET /api/health
 * Returns system health status — DB connectivity, environment, uptime
 * Used after migration to verify everything works
 */
export async function GET() {
  const dbHealth = await checkDbHealth();

  const healthReport = {
    status: dbHealth.status === 'connected' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      status: dbHealth.status,
      host: dbHealth.host ?? 'unknown',
      name: dbHealth.dbName ?? 'unknown',
      pingMs: dbHealth.ping ?? null,
    },
    uptime: Math.floor(process.uptime()),
  };

  const statusCode = healthReport.status === 'ok' ? 200 : 503;
  return NextResponse.json(healthReport, { status: statusCode });
}
