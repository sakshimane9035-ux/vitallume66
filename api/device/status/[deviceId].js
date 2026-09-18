import { getDevice } from '../../_lib/db.js';
import { CONFIG } from '../../_lib/config.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use GET.' });
  }

  try {
    // Extract deviceId from query or path
    const deviceId = req.query.deviceId || 'ESP32-001';
    const device = await getDevice(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        deviceId,
        isOnline: false,
        status: 'OFFLINE',
        message: `Device '${deviceId}' not found in registry`
      });
    }

    const lastSeenTime = new Date(device.lastSeen).getTime();
    const now = Date.now();
    const secondsSinceLastSeen = Math.round((now - lastSeenTime) / 1000);
    const isOnline = secondsSinceLastSeen <= CONFIG.DEVICE_OFFLINE_TIMEOUT_SECONDS;

    return res.status(200).json({
      success: true,
      deviceId: device.deviceId,
      name: device.name,
      status: isOnline ? device.status : 'OFFLINE',
      isOnline,
      lastSeen: device.lastSeen,
      secondsSinceLastSeen
    });
  } catch (error) {
    console.error('[API /device/status] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve device status',
      details: error.message
    });
  }
}
