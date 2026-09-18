import { getLatestSensorReading, getDevice } from '../_lib/db.js';
import { evaluateSafetyConditions } from '../_lib/safety-engine.js';
import { CONFIG } from '../_lib/config.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use GET.' });
  }

  try {
    const { deviceId } = req.query;
    const reading = await getLatestSensorReading(deviceId);

    if (!reading) {
      return res.status(200).json({
        success: true,
        message: 'No sensor data available yet',
        data: null
      });
    }

    // Check device online status
    const dev = await getDevice(reading.deviceId);
    let isOnline = true;
    if (dev && dev.lastSeen) {
      const diffSec = (Date.now() - new Date(dev.lastSeen).getTime()) / 1000;
      isOnline = diffSec <= CONFIG.DEVICE_OFFLINE_TIMEOUT_SECONDS;
    }

    const evaluation = evaluateSafetyConditions(reading);

    return res.status(200).json({
      success: true,
      deviceId: reading.deviceId,
      isOnline,
      deviceStatus: isOnline ? (dev ? dev.status : 'ONLINE') : 'OFFLINE',
      evaluation,
      data: reading
    });
  } catch (error) {
    console.error('[API /sensors/latest] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve latest sensor data',
      details: error.message
    });
  }
}
