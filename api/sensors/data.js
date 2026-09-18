import { saveSensorReading, upsertDevice, createAlert } from '../_lib/db.js';
import { evaluateSafetyConditions } from '../_lib/safety-engine.js';

export default async function handler(req, res) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed. Use POST.` });
  }

  try {
    const body = req.body || {};
    const deviceId = body.deviceId || 'vitallume-001';

    // Validate sensor payload
    const temperature = body.temperature != null ? parseFloat(body.temperature) : 28.4;
    const humidity = body.humidity != null ? parseFloat(body.humidity) : 63.0;
    const pressure = body.pressure != null ? parseFloat(body.pressure) : 1008.0;
    const gas = body.gas != null ? parseFloat(body.gas) : 18.0;
    const sound = body.sound != null ? parseFloat(body.sound) : 34.0;
    const motion = Boolean(body.motion || body.pir);
    const presence = Boolean(body.presence || (body.radar && body.radar.presence));
    const respiration = body.radar && body.radar.respiration != null ? parseFloat(body.radar.respiration) : null;
    const radarVelocity = body.radar && body.radar.velocity != null ? parseFloat(body.radar.velocity) : 0.24;

    const sensorData = {
      deviceId,
      timestamp: body.timestamp || new Date().toISOString(),
      temperature,
      humidity,
      pressure,
      pm25: body.pm25 != null ? parseFloat(body.pm25) : 24,
      gas,
      sound,
      motion,
      presence,
      respiration,
      radar: {
        motion: body.radar ? Boolean(body.radar.motion) : motion,
        presence,
        respiration,
        velocity: radarVelocity
      },
      acVoltage: body.acVoltage != null ? parseFloat(body.acVoltage) : 228.6,
      acCurrent: body.acCurrent != null ? parseFloat(body.acCurrent) : 0.42,
      rawPayload: body
    };

    // Evaluate health and safety logic
    const evaluation = evaluateSafetyConditions(sensorData);

    // Persist sensor reading
    const savedReading = await saveSensorReading(sensorData);

    // Update device heartbeat
    await upsertDevice({
      deviceId,
      name: body.deviceName || 'VitalLume Ambient Node',
      status: evaluation.systemStatus
    });

    // Create alerts if abnormal conditions detected
    let alertsCreated = 0;
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
      alertsCreated++;
    }

    return res.status(200).json({
      success: true,
      message: 'Sensor telemetry processed successfully',
      deviceId,
      evaluation: {
        status: evaluation.status,
        riskLevel: evaluation.riskLevel,
        activityPattern: evaluation.activityPattern,
        systemStatus: evaluation.systemStatus,
        confidenceScore: evaluation.confidenceScore,
        alertsCreated
      },
      data: savedReading
    });
  } catch (error) {
    console.error('[API /sensors/data] Error processing payload:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error processing sensor data',
      details: error.message
    });
  }
}
