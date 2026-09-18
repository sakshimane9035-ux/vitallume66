import { saveSensorReading, createAlert, upsertDevice } from '../_lib/db.js';
import { evaluateSafetyConditions } from '../_lib/safety-engine.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const { scenario = 'normal', deviceId = 'vitallume-demo-01' } = req.body || {};
    let sample = {};

    switch (scenario) {
      case 'warning_temp':
        sample = {
          deviceId,
          temperature: 36.8,
          humidity: 55,
          pressure: 1008,
          gas: 22,
          sound: 35,
          motion: true,
          presence: true,
          radar: { motion: true, presence: true, velocity: 0.2 }
        };
        break;

      case 'warning_gas':
        sample = {
          deviceId,
          temperature: 28.5,
          humidity: 62,
          pressure: 1008,
          gas: 85, // Above warning threshold
          sound: 36,
          motion: true,
          presence: true,
          radar: { motion: true, presence: true, velocity: 0.2 }
        };
        break;

      case 'critical_fall':
        sample = {
          deviceId,
          temperature: 28.4,
          humidity: 63,
          pressure: 1008,
          gas: 18,
          sound: 86, // Acoustic shock spike
          motion: true,
          presence: true,
          radar: { motion: true, presence: true, velocity: 2.8 } // Rapid descent
        };
        break;

      case 'device_offline':
        await upsertDevice({
          deviceId,
          name: 'VitalLume Demo Unit',
          status: 'OFFLINE'
        });
        return res.status(200).json({
          success: true,
          scenario: 'device_offline',
          message: 'Device offline simulated. Heartbeat halted.',
          isOnline: false
        });

      case 'normal':
      default:
        sample = {
          deviceId,
          temperature: 28.4,
          humidity: 63,
          pressure: 1008,
          gas: 18,
          sound: 34,
          motion: true,
          presence: true,
          radar: { motion: true, presence: true, velocity: 0.24 }
        };
        break;
    }

    const evaluation = evaluateSafetyConditions(sample);
    const reading = await saveSensorReading(sample);
    await upsertDevice({
      deviceId,
      name: 'VitalLume Test/Demo Node',
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
      isDemo: true,
      scenario,
      evaluation,
      reading
    });
  } catch (error) {
    console.error('[API /test/sensor-data] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to run test scenario',
      details: error.message
    });
  }
}
