import { CONFIG } from '../_lib/config.js';
import { saveSensorReading, upsertDevice, createAlert } from '../_lib/db.js';
import { evaluateSafetyConditions } from '../_lib/safety-engine.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  // Verify device API key
  const authHeader = req.headers['authorization'] || '';
  const apiKeyHeader = req.headers['x-api-key'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : apiKeyHeader.trim();

  if (CONFIG.DEVICE_API_KEY && token !== CONFIG.DEVICE_API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing device authentication key. Provide Authorization: Bearer <DEVICE_API_KEY>'
    });
  }

  try {
    const body = req.body || {};
    const deviceId = body.deviceId || 'ESP32-001';

    // Format sensor data from ESP32
    const sensorData = {
      deviceId,
      timestamp: body.timestamp || new Date().toISOString(),
      temperature: body.temperature != null ? parseFloat(body.temperature) : 28.5,
      humidity: body.humidity != null ? parseFloat(body.humidity) : 60.0,
      pressure: body.pressure != null ? parseFloat(body.pressure) : 1008.0,
      gas: body.gas != null ? parseFloat(body.gas) : 150.0,
      sound: body.sound != null ? parseFloat(body.sound) : 42.0,
      motion: Boolean(body.motion || body.pir),
      presence: Boolean(body.presence),
      radar: {
        motion: Boolean(body.motion),
        presence: Boolean(body.presence),
        velocity: body.velocity != null ? parseFloat(body.velocity) : 0.2
      },
      rawPayload: body
    };

    const evaluation = evaluateSafetyConditions(sensorData);
    await saveSensorReading(sensorData);
    await upsertDevice({
      deviceId,
      name: `ESP32 Ambient Node (${deviceId})`,
      status: evaluation.systemStatus
    });

    for (const alt of evaluation.alerts) {
      await createAlert({
        deviceId,
        type: alt.type,
        severity: alt.severity,
        message: alt.message,
        sensor: alt.sensor,
        value: alt.value,
        threshold: alt.threshold
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sensor data received',
      deviceId
    });
  } catch (error) {
    console.error('[API /device/data] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Invalid sensor data processing error',
      details: error.message
    });
  }
}
