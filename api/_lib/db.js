import { CONFIG } from './config.js';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const { Pool } = pg;

// Global fallback in-memory store for local testing or when no external DB is configured
const memoryStore = {
  devices: new Map([
    ['vitallume-001', {
      id: '1',
      deviceId: 'vitallume-001',
      name: 'Master Overhead Socket Node',
      status: 'ONLINE',
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }],
    ['ESP32-001', {
      id: '2',
      deviceId: 'ESP32-001',
      name: 'Living Room Sensor Cluster',
      status: 'ONLINE',
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }]
  ]),
  readings: [],
  alerts: [
    {
      id: 'alert-init-01',
      deviceId: 'vitallume-001',
      type: 'SYSTEM',
      severity: 'NORMAL',
      message: 'System nominal. Multi-sensor array calibrated and online.',
      sensor: 'SYSTEM_BOOT',
      value: 100,
      threshold: 100,
      acknowledged: true,
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]
};

// Seed 15 initial readings for history charts
const now = Date.now();
for (let i = 14; i >= 0; i--) {
  const t = new Date(now - i * 3000);
  memoryStore.readings.push({
    id: `read-${15 - i}`,
    deviceId: 'vitallume-001',
    timestamp: t.toISOString(),
    temperature: +(28.2 + Math.random() * 0.4).toFixed(1),
    humidity: Math.round(61 + Math.random() * 3),
    pressure: 1008,
    pm25: Math.round(22 + Math.random() * 4),
    gas: Math.round(18 + Math.random() * 3),
    sound: Math.round(32 + Math.random() * 4),
    motion: true,
    presence: true,
    respiration: 16,
    acVoltage: 228.6,
    acCurrent: 0.42,
    createdAt: t.toISOString()
  });
}

let pgPool = null;
let supabaseClient = null;

if (CONFIG.DATABASE_URL) {
  try {
    pgPool = new Pool({
      connectionString: CONFIG.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    console.log('[DB] Configured PostgreSQL pool with DATABASE_URL');
  } catch (err) {
    console.error('[DB] Failed to initialize PostgreSQL pool:', err.message);
  }
} else if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_KEY) {
  try {
    supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
    console.log('[DB] Configured Supabase client with SUPABASE_URL');
  } catch (err) {
    console.error('[DB] Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('[DB] Running with high-availability in-memory/serverless fallback store.');
}

export async function upsertDevice(deviceData) {
  const { deviceId, name = 'VitalLume Socket Node', status = 'ONLINE' } = deviceData;
  const lastSeen = new Date().toISOString();

  if (pgPool) {
    try {
      const query = `
        INSERT INTO devices ("deviceId", name, status, "lastSeen")
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT ("deviceId") 
        DO UPDATE SET status = $3, "lastSeen" = NOW()
        RETURNING *;
      `;
      const res = await pgPool.query(query, [deviceId, name, status]);
      return res.rows[0];
    } catch (e) {
      console.warn('[DB] PostgreSQL error in upsertDevice:', e.message);
    }
  }

  // Memory fallback
  const existing = memoryStore.devices.get(deviceId) || {
    id: String(memoryStore.devices.size + 1),
    deviceId,
    name,
    createdAt: lastSeen
  };
  const updated = { ...existing, name: name || existing.name, status, lastSeen };
  memoryStore.devices.set(deviceId, updated);
  return updated;
}

export async function getDevice(deviceId) {
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT * FROM devices WHERE "deviceId" = $1', [deviceId]);
      if (res.rows.length > 0) return res.rows[0];
    } catch (e) {
      console.warn('[DB] PostgreSQL error in getDevice:', e.message);
    }
  }
  return memoryStore.devices.get(deviceId) || null;
}

export async function getAllDevices() {
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT * FROM devices ORDER BY "lastSeen" DESC');
      return res.rows;
    } catch (e) {
      console.warn('[DB] PostgreSQL error in getAllDevices:', e.message);
    }
  }
  return Array.from(memoryStore.devices.values());
}

export async function saveSensorReading(reading) {
  const id = `read-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const record = {
    id,
    deviceId: reading.deviceId || 'vitallume-001',
    timestamp: reading.timestamp || new Date().toISOString(),
    temperature: reading.temperature != null ? Number(reading.temperature) : 28.4,
    humidity: reading.humidity != null ? Number(reading.humidity) : 63,
    pressure: reading.pressure != null ? Number(reading.pressure) : 1008,
    pm25: reading.pm25 != null ? Number(reading.pm25) : 24,
    gas: reading.gas != null ? Number(reading.gas) : 18,
    sound: reading.sound != null ? Number(reading.sound) : 34,
    motion: Boolean(reading.motion || reading.pir),
    presence: Boolean(reading.presence),
    respiration: reading.respiration != null ? Number(reading.respiration) : null,
    acVoltage: reading.acVoltage != null ? Number(reading.acVoltage) : 228.6,
    acCurrent: reading.acCurrent != null ? Number(reading.acCurrent) : 0.42,
    rawPayload: reading.rawPayload || null,
    createdAt: new Date().toISOString()
  };

  if (pgPool) {
    try {
      const query = `
        INSERT INTO sensor_readings 
        ("deviceId", timestamp, temperature, humidity, pressure, gas, sound, motion, presence, respiration, "rawPayload")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;
      const res = await pgPool.query(query, [
        record.deviceId,
        record.timestamp,
        record.temperature,
        record.humidity,
        record.pressure,
        record.gas,
        record.sound,
        record.motion,
        record.presence,
        record.respiration,
        JSON.stringify(record.rawPayload)
      ]);
      return res.rows[0];
    } catch (e) {
      console.warn('[DB] PostgreSQL error in saveSensorReading:', e.message);
    }
  }

  // Memory fallback
  memoryStore.readings.push(record);
  if (memoryStore.readings.length > 500) {
    memoryStore.readings.shift();
  }
  return record;
}

export async function getLatestSensorReading(deviceId) {
  if (pgPool) {
    try {
      const query = deviceId
        ? 'SELECT * FROM sensor_readings WHERE "deviceId" = $1 ORDER BY timestamp DESC LIMIT 1'
        : 'SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 1';
      const params = deviceId ? [deviceId] : [];
      const res = await pgPool.query(query, params);
      if (res.rows.length > 0) return res.rows[0];
    } catch (e) {
      console.warn('[DB] PostgreSQL error in getLatestSensorReading:', e.message);
    }
  }

  // Memory fallback
  const filtered = deviceId 
    ? memoryStore.readings.filter(r => r.deviceId === deviceId)
    : memoryStore.readings;

  if (filtered.length > 0) {
    return filtered[filtered.length - 1];
  }
  return null;
}

export async function getSensorReadingHistory(deviceId, limit = 20) {
  const maxLimit = Math.min(Math.max(1, parseInt(limit, 10) || 20), 100);

  if (pgPool) {
    try {
      const query = deviceId
        ? 'SELECT * FROM sensor_readings WHERE "deviceId" = $1 ORDER BY timestamp DESC LIMIT $2'
        : 'SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT $1';
      const params = deviceId ? [deviceId, maxLimit] : [maxLimit];
      const res = await pgPool.query(query, params);
      return res.rows.reverse();
    } catch (e) {
      console.warn('[DB] PostgreSQL error in getSensorReadingHistory:', e.message);
    }
  }

  // Memory fallback
  const filtered = deviceId 
    ? memoryStore.readings.filter(r => r.deviceId === deviceId)
    : memoryStore.readings;
  
  return filtered.slice(-maxLimit);
}

export async function createAlert(alertData) {
  const alert = {
    id: alertData.id || `alt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    deviceId: alertData.deviceId || 'vitallume-001',
    type: alertData.type || 'HAZARD',
    severity: alertData.severity || 'WARNING', // NORMAL, WARNING, CRITICAL, UNKNOWN
    message: alertData.message || 'Abnormal condition detected',
    sensor: alertData.sensor || 'MULTI_SENSOR',
    value: alertData.value != null ? Number(alertData.value) : null,
    threshold: alertData.threshold != null ? Number(alertData.threshold) : null,
    acknowledged: Boolean(alertData.acknowledged),
    acknowledgedAt: alertData.acknowledged ? new Date().toISOString() : null,
    timestamp: alertData.timestamp || new Date().toISOString()
  };

  if (pgPool) {
    try {
      const query = `
        INSERT INTO alerts 
        (id, "deviceId", type, severity, message, sensor, value, threshold, acknowledged, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;
      const res = await pgPool.query(query, [
        alert.id,
        alert.deviceId,
        alert.type,
        alert.severity,
        alert.message,
        alert.sensor,
        alert.value,
        alert.threshold,
        alert.acknowledged,
        alert.timestamp
      ]);
      return res.rows[0];
    } catch (e) {
      console.warn('[DB] PostgreSQL error in createAlert:', e.message);
    }
  }

  // Memory fallback
  memoryStore.alerts.unshift(alert);
  if (memoryStore.alerts.length > 200) {
    memoryStore.alerts.pop();
  }
  return alert;
}

export async function getAlerts({ deviceId, acknowledged, limit = 20 } = {}) {
  const maxLimit = Math.min(Math.max(1, parseInt(limit, 10) || 20), 100);

  if (pgPool) {
    try {
      let query = 'SELECT * FROM alerts WHERE 1=1';
      const params = [];
      if (deviceId) {
        params.push(deviceId);
        query += ` AND "deviceId" = $${params.length}`;
      }
      if (acknowledged !== undefined) {
        params.push(acknowledged === 'true' || acknowledged === true);
        query += ` AND acknowledged = $${params.length}`;
      }
      params.push(maxLimit);
      query += ` ORDER BY timestamp DESC LIMIT $${params.length}`;

      const res = await pgPool.query(query, params);
      return res.rows;
    } catch (e) {
      console.warn('[DB] PostgreSQL error in getAlerts:', e.message);
    }
  }

  // Memory fallback
  return memoryStore.alerts
    .filter(a => {
      if (deviceId && a.deviceId !== deviceId) return false;
      if (acknowledged !== undefined) {
        const boolAck = acknowledged === 'true' || acknowledged === true;
        if (a.acknowledged !== boolAck) return false;
      }
      return true;
    })
    .slice(0, maxLimit);
}

export async function acknowledgeAlert(alertId) {
  const now = new Date().toISOString();

  if (pgPool) {
    try {
      const query = `
        UPDATE alerts 
        SET acknowledged = TRUE, "acknowledgedAt" = NOW() 
        WHERE id = $1 
        RETURNING *;
      `;
      const res = await pgPool.query(query, [alertId]);
      if (res.rows.length > 0) return res.rows[0];
    } catch (e) {
      console.warn('[DB] PostgreSQL error in acknowledgeAlert:', e.message);
    }
  }

  // Memory fallback
  const alert = memoryStore.alerts.find(a => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
    alert.acknowledgedAt = now;
    return alert;
  }
  return null;
}
