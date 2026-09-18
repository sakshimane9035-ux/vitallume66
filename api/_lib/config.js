import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3001,
  DEVICE_API_KEY: process.env.DEVICE_API_KEY || 'vitallume_secret_device_key_2026',
  
  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL || null,
  SUPABASE_URL: process.env.SUPABASE_URL || null,
  SUPABASE_KEY: process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || null,

  // Environmental thresholds
  TEMP_COLD_THRESHOLD: parseFloat(process.env.TEMP_COLD_THRESHOLD || '16.0'),
  TEMP_HOT_THRESHOLD: parseFloat(process.env.TEMP_HOT_THRESHOLD || '34.0'),
  HUMIDITY_LOW_THRESHOLD: parseFloat(process.env.HUMIDITY_LOW_THRESHOLD || '25.0'),
  HUMIDITY_HIGH_THRESHOLD: parseFloat(process.env.HUMIDITY_HIGH_THRESHOLD || '75.0'),
  
  // Toxic Gas / Air quality
  GAS_WARNING_PPM: parseFloat(process.env.GAS_WARNING_PPM || '50.0'),
  GAS_CRITICAL_PPM: parseFloat(process.env.GAS_CRITICAL_PPM || '100.0'),
  
  // Sound / Acoustic Shock
  SOUND_SHOCK_DB: parseFloat(process.env.SOUND_SHOCK_DB || '75.0'),
  
  // Radar & Respiration
  RADAR_DESCENT_VELOCITY: parseFloat(process.env.RADAR_DESCENT_VELOCITY || '2.0'),
  RESPIRATION_LOW_RPM: parseFloat(process.env.RESPIRATION_LOW_RPM || '8.0'),
  RESPIRATION_HIGH_RPM: parseFloat(process.env.RESPIRATION_HIGH_RPM || '25.0'),
  
  // Device connectivity
  DEVICE_OFFLINE_TIMEOUT_SECONDS: parseInt(process.env.DEVICE_OFFLINE_TIMEOUT_SECONDS || '90', 10),
};
