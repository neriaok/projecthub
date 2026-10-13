import dotenv from 'dotenv';

dotenv.config({ quiet: true });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: requireEnv('MONGO_URI'),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  seedPassword: process.env.SEED_PASSWORD,
  /** Optional: when set, request events are posted to this Make (Integromat) webhook. */
  makeWebhookUrl: process.env.MAKE_WEBHOOK_URL || null,
};

export default config;
