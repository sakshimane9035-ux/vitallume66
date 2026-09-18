import { getAlerts, createAlert } from '../_lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const { deviceId, acknowledged, limit = 20 } = req.query;
      const alerts = await getAlerts({ deviceId, acknowledged, limit });
      return res.status(200).json({
        success: true,
        count: alerts.length,
        alerts
      });
    } catch (error) {
      console.error('[API /alerts GET] Error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch alerts',
        details: error.message
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      if (!body.message) {
        return res.status(400).json({ success: false, error: 'Alert message is required' });
      }

      const alert = await createAlert(body);
      return res.status(201).json({
        success: true,
        message: 'Alert created',
        alert
      });
    } catch (error) {
      console.error('[API /alerts POST] Error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create alert',
        details: error.message
      });
    }
  }

  return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
}
