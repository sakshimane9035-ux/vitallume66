-- VitalLume Database Schema for PostgreSQL / Supabase

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  "deviceId" VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  status VARCHAR(32) DEFAULT 'ONLINE',
  "lastSeen" TIMESTAMPTZ DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Sensor readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
  id SERIAL PRIMARY KEY,
  "deviceId" VARCHAR(64) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  temperature NUMERIC(5, 2),
  humidity NUMERIC(5, 2),
  pressure NUMERIC(7, 2),
  gas NUMERIC(7, 2),
  sound NUMERIC(5, 2),
  motion BOOLEAN DEFAULT FALSE,
  presence BOOLEAN DEFAULT FALSE,
  respiration NUMERIC(5, 2),
  "rawPayload" JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR(64) PRIMARY KEY,
  "deviceId" VARCHAR(64) NOT NULL,
  type VARCHAR(64) NOT NULL,
  severity VARCHAR(32) NOT NULL,
  message TEXT NOT NULL,
  sensor VARCHAR(64) NOT NULL,
  value NUMERIC(7, 2),
  threshold NUMERIC(7, 2),
  acknowledged BOOLEAN DEFAULT FALSE,
  "acknowledgedAt" TIMESTAMPTZ,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high-performance time-series queries
CREATE INDEX IF NOT EXISTS idx_sensor_readings_device_time ON sensor_readings("deviceId", timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_device_time ON alerts("deviceId", timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_ack ON alerts(acknowledged);
