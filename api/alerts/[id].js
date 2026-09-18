import { acknowledgeAlert } from '../_lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'PATCH') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use PATCH.' });
  }

  try {
    const alertId = req.query.id;
    if (!alertId) {
      return res.status(400).json({ success: false, error: 'Alert ID parameter missing' });
    }

    const updated = await acknowledgeAlert(alertId);
    if (!updated) {
      return res.status(404).json({ success: false, error: `Alert '${alertId}' not found.` });
    }

    return res.status(200).json({
      success: true,
      message: 'Alert acknowledged successfully',
      alert: updated
    });
  } catch (error) {
    console.error('[API /alerts/:id PATCH] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to acknowledge alert',
      details: error.message
    });
  }
}
