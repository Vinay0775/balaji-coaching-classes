/**
 * ============================================================
 * CENTRALIZED ENVIRONMENT CONFIGURATION MODULE
 * ============================================================
 * All environment variables are read HERE only.
 * No other file should read process.env directly.
 * Change DB, ports, or URLs by updating .env.local only.
 * ============================================================
 */

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(
      `[Config] Missing required environment variable: "${key}"\n` +
      `Please add it to your .env.local file. See .env.example for reference.`
    );
  }
  return value;
}

const config = {
  // ── Database ─────────────────────────────────────────────
  db: {
    uri: requireEnv('MONGODB_URI'),
    name: process.env.DB_NAME || 'institute-db',
    options: {
      bufferCommands: false,
      maxPoolSize: 10,          // connection pool size
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  // ── Application ──────────────────────────────────────────
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
    name: process.env.APP_NAME || 'Balaji Computer Classes',
    nodeEnv: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',
    whatsapp: process.env.APP_WHATSAPP || '919876543210',
  },

  // ── Auth ─────────────────────────────────────────────────
  auth: {
    secret: requireEnv('NEXTAUTH_SECRET'),
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    adminSecretCode: process.env.ADMIN_SECRET_CODE || 'ADMIN2024TECHVIDYA',
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },

  // ── Email ─────────────────────────────────────────────────
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'Balaji Computer Classes <noreply@balajicomputerclasses.in>',
  },

  // ── Cloudinary ────────────────────────────────────────────
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
};

export default config;
