# VitalLume – The Invisible Home Guardian

> **Privacy-Preserving Ambient Home Safety & Health-Monitoring System Living in Your Light Socket.**  
> *No wearables. No cameras. Whole-home awareness.*

Developed by final-year engineering scholars at SKN Sinhgad College of Engineering, Korti, Pandharpur (2026–2027).

---

## 1. Project Architecture

VitalLume turns ordinary ceiling light sockets into passive, 24/7 intelligent health and environmental safety nodes. This project provides a complete **Full-Stack Application**: a **FastAPI + Supabase** backend (with an in-memory fallback) and a high-fidelity React frontend. The original Vercel Node handlers remain under `/api` as a compatibility path.

```
                    +-------------------------------------------------+
                    |                IoT Sensor Edge                  |
                    | ESP32 / Arduino Uno R3 / mmWave / BME680 / etc. |
                    +------------------------+------------------------+
                                             |
                                             | HTTP POST /api/device/data
                                             | (Authorization: Bearer <KEY>)
                                             v
               +------------------------------------------------------------+
               |              VitalLume FastAPI + Supabase API              |
               |                                                            |
               |  /api/sensors/data       /api/sensors/latest               |
               |  /api/device/data        /api/sensors/history              |
               |  /api/alerts             /api/device/status/:deviceId      |
               |  /api/test/sensor-data   /api/health                       |
               +-------------+------------------------------+---------------+
                             |                              |
                             v                              v
             +-------------------------------+   +--------------------+
             |      Health & Safety Engine   |   | Persistent Storage |
             |   - Non-diagnostic physics    |   | PostgreSQL /       |
             |   - Multi-sensor gating       |   | Supabase           |
             |   - NORMAL/WARN/CRITICAL      |   | (Auto-fallback)    |
             +---------------+---------------+   +--------------------+
                             |
                             v
               +------------------------------------------------------------+
               |                   VitalLume React Frontend                 |
               |   - Live Monitoring Dashboard (2.5s real-time stream)      |
               |   - Dynamic SVG Waveform Trend Charts                      |
               |   - Multi-Sensor Fusion Emergency Simulator                |
               |   - Caregiver Dispatch & Incident Trace Modal              |
               +------------------------------------------------------------+
```

---

## 2. API Endpoints

### 2.1 Sensor Data Ingestion
- **`POST /api/sensors/data`**
  - Ingests multi-sensor payload from IoT gateway or edge controllers.
  - Request Example:
    ```json
    {
      "deviceId": "vitallume-001",
      "timestamp": "2026-09-17T10:30:00Z",
      "pir": 1,
      "temperature": 28.4,
      "humidity": 62,
      "pressure": 1008,
      "gas": 120,
      "sound": 35,
      "radar": {
        "motion": true,
        "presence": true,
        "respiration": 18
      }
    }
    ```
  - Response (200 OK):
    ```json
    {
      "success": true,
      "message": "Sensor telemetry processed successfully",
      "deviceId": "vitallume-001",
      "evaluation": {
        "status": "NORMAL",
        "riskLevel": "LOW",
        "activityPattern": "Normal Activity",
        "systemStatus": "ONLINE",
        "confidenceScore": 98,
        "alertsCreated": 0
      }
    }
    ```

### 2.2 ESP32 Dedicated Ingestion
- **`POST /api/device/data`**
  - Secured via `Authorization: Bearer <DEVICE_API_KEY>` or `x-api-key`.
  - Request Example:
    ```json
    {
      "deviceId": "ESP32-001",
      "temperature": 28.5,
      "humidity": 60,
      "gas": 150,
      "sound": 42,
      "motion": true,
      "presence": true
    }
    ```
  - Response (200 OK):
    ```json
    {
      "success": true,
      "message": "Sensor data received",
      "deviceId": "ESP32-001"
    }
    ```

### 2.3 Latest Telemetry
- **`GET /api/sensors/latest?deviceId=vitallume-001`**
  - Returns latest readings, current classification, and device online state.

### 2.4 Historical Telemetry
- **`GET /api/sensors/history?deviceId=vitallume-001&limit=20`**
  - Returns historical points for frontend SVG trend charts (`time`, `temp`, `pm25`, `activity`, `risk`).

### 2.5 Device Heartbeat Status
- **`GET /api/device/status/:deviceId`**
  - Checks whether device has transmitted within the configured offline timeout.
  - Response:
    ```json
    {
      "success": true,
      "deviceId": "ESP32-001",
      "name": "ESP32 Ambient Node (ESP32-001)",
      "status": "ONLINE",
      "isOnline": true,
      "lastSeen": "2026-09-18T06:30:00.000Z",
      "secondsSinceLastSeen": 4
    }
    ```

### 2.6 Alert Management
- **`GET /api/alerts?limit=20&acknowledged=false`**
  - Query recent active or historical alerts.
- **`POST /api/alerts`**
  - Create manual/system alert.
- **`PATCH /api/alerts/:id`**
  - Acknowledge an incident. Sets `acknowledged = true` and `acknowledgedAt = NOW()`.

### 2.7 Testing & Demo Scenarios
- **`POST /api/test/sensor-data`**
  - Injects marked demo scenarios: `normal`, `warning_temp`, `warning_gas`, `critical_fall`, `device_offline`.

---

## 3. Database Schema

Schema file is located at `api/_lib/schema.sql`.

```sql
CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  "deviceId" VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  status VARCHAR(32) DEFAULT 'ONLINE',
  "lastSeen" TIMESTAMPTZ DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sensor_readings (
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

CREATE TABLE alerts (
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
```

---

## 4. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
DEVICE_API_KEY=vitallume_secret_device_key_2026

# Supabase (run backend/supabase_schema.sql in the SQL editor)
# SUPABASE_URL=https://xyz.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Threshold Configuration
TEMP_COLD_THRESHOLD=16.0
TEMP_HOT_THRESHOLD=34.0
HUMIDITY_LOW_THRESHOLD=25.0
HUMIDITY_HIGH_THRESHOLD=75.0
GAS_WARNING_PPM=50.0
GAS_CRITICAL_PPM=100.0
SOUND_SHOCK_DB=75.0
RADAR_DESCENT_VELOCITY=2.0
RESPIRATION_LOW_RPM=8.0
RESPIRATION_HIGH_RPM=25.0
DEVICE_OFFLINE_TIMEOUT_SECONDS=90
```

---

## 5. Local Development

```bash
# 1. Install frontend dependencies
npm install

# 2. Install FastAPI backend
python -m pip install -r backend/requirements.txt

# 3. Run schema in the Supabase SQL editor (backend/supabase_schema.sql),
#    then copy project URL + service role key into .env

# 4. Run automated FastAPI test suite
npm test

# 5. Start local development (FastAPI on :3001 + Vite on :5173)
npm run dev
```

Interactive API docs: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## 6. Connecting ESP32 Hardware

1. Open `examples/esp32_vitallume.ino` in Arduino IDE or PlatformIO.
2. Install libraries:
   - `ArduinoJson`
   - `Adafruit BME680 Library`
   - `Adafruit Unified Sensor`
3. Update Wi-Fi settings:
   ```cpp
   const char* WIFI_SSID     = "YOUR_WIFI_NAME";
   const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
   ```
4. Set backend endpoint:
   ```cpp
   const char* SERVER_ENDPOINT = "https://your-deployment.vercel.app/api/device/data";
   const char* DEVICE_API_KEY  = "vitallume_secret_device_key_2026";
   ```
5. Flash to ESP32. Open Serial Monitor at 115200 baud to monitor transmissions.

---

## 7. Vercel Deployment Guide

1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In **Environment Variables**, add:
   - `DEVICE_API_KEY` (e.g. `vitallume_secret_device_key_2026`)
   - `DATABASE_URL` (if using PostgreSQL / Supabase)
4. Click **Deploy**. Vercel will automatically build the Vite frontend and deploy all endpoints in `/api` as high-performance Serverless Functions.
