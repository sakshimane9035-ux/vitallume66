import { getSensorReadingHistory } from '../_lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use GET.' });
  }

  try {
    const { deviceId, limit = 20 } = req.query;
    const rawHistory = await getSensorReadingHistory(deviceId, limit);

    // Transform into clean chart-ready points
    const points = rawHistory.map(item => {
      const d = new Date(item.timestamp);
      const timeStr = !isNaN(d.getTime()) 
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : '00:00:00';
      
      const temp = Number(item.temperature) || 28.4;
      const pm25 = Number(item.pm25) || 24;
      const activity = item.motion ? Math.round(45 + Math.random() * 20) : 10;
      const risk = (item.gas > 50 || temp > 34 || temp < 16) ? 75 : 12;

      return {
        time: timeStr,
        timestamp: item.timestamp,
        temp: +temp.toFixed(1),
        pm25: Math.round(pm25),
        activity,
        risk
      };
    });

    return res.status(200).json({
      success: true,
      count: points.length,
      history: points
    });
  } catch (error) {
    console.error('[API /sensors/history] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve sensor history',
      details: error.message
    });
  }
}
