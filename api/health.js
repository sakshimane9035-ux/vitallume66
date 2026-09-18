import { CONFIG } from './_lib/config.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'VitalLume Ambient Health Guardian API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: CONFIG.DATABASE_URL ? 'PostgreSQL' : (CONFIG.SUPABASE_URL ? 'Supabase' : 'MemoryFallback')
  });
}
