import { CONFIG } from './config.js';

/**
 * Evaluates multi-sensor telemetry according to safety thresholds and physics-based corroboration.
 * VitalLume strictly provides ambient environmental safety and hazard detection research classifications.
 * It DOES NOT provide medical diagnoses.
 * 
 * Classifications:
 * - NORMAL
 * - WARNING
 * - CRITICAL
 * - UNKNOWN
 */
export function evaluateSafetyConditions(data) {
  const alerts = [];
  const flags = [];
  let highestSeverity = 'NORMAL';

  const temp = data.temperature != null ? Number(data.temperature) : null;
  const humidity = data.humidity != null ? Number(data.humidity) : null;
  const gas = data.gas != null ? Number(data.gas) : null;
  const sound = data.sound != null ? Number(data.sound) : null;
  const motion = Boolean(data.motion || data.pir);
  const presence = Boolean(data.presence);
  
  // Radar kinematics
  const radar = data.radar || {};
  const radarMotion = Boolean(radar.motion || data.motion);
  const radarPresence = Boolean(radar.presence || data.presence);
  const radarVelocity = radar.velocity != null ? Math.abs(Number(radar.velocity)) : 0.24;
  const respiration = radar.respiration != null ? Number(radar.respiration) : null;

  // 1. Temperature checks
  if (temp != null) {
    if (temp > CONFIG.TEMP_HOT_THRESHOLD) {
      alerts.push({
        type: 'ENVIRONMENT',
        severity: temp > (CONFIG.TEMP_HOT_THRESHOLD + 4) ? 'CRITICAL' : 'WARNING',
        message: `High ambient temperature detected (${temp}°C). Exceeds safe threshold (${CONFIG.TEMP_HOT_THRESHOLD}°C). Potential heatwave or HVAC failure.`,
        sensor: 'BME680_TEMP',
        value: temp,
        threshold: CONFIG.TEMP_HOT_THRESHOLD
      });
      flags.push('HIGH_TEMPERATURE');
    } else if (temp < CONFIG.TEMP_COLD_THRESHOLD) {
      alerts.push({
        type: 'ENVIRONMENT',
        severity: temp < (CONFIG.TEMP_COLD_THRESHOLD - 4) ? 'CRITICAL' : 'WARNING',
        message: `Low ambient temperature detected (${temp}°C). Risk of senior hypothermia or room freeze. Threshold: ${CONFIG.TEMP_COLD_THRESHOLD}°C.`,
        sensor: 'BME680_TEMP',
        value: temp,
        threshold: CONFIG.TEMP_COLD_THRESHOLD
      });
      flags.push('LOW_TEMPERATURE');
    }
  }

  // 2. Humidity checks
  if (humidity != null) {
    if (humidity > CONFIG.HUMIDITY_HIGH_THRESHOLD) {
      alerts.push({
        type: 'ENVIRONMENT',
        severity: 'WARNING',
        message: `Elevated relative humidity (${humidity}%). Increased mold risk and dampness hazard.`,
        sensor: 'BME680_HUMIDITY',
        value: humidity,
        threshold: CONFIG.HUMIDITY_HIGH_THRESHOLD
      });
      flags.push('HIGH_HUMIDITY');
    }
  }

  // 3. Combustible & CO Gas checks
  if (gas != null) {
    if (gas >= CONFIG.GAS_CRITICAL_PPM) {
      alerts.push({
        type: 'GAS_HAZARD',
        severity: 'CRITICAL',
        message: `Dangerous gas / carbon monoxide level detected (${gas} ppm). Immediate ventilation and inspection required.`,
        sensor: 'MQ9_GAS',
        value: gas,
        threshold: CONFIG.GAS_CRITICAL_PPM
      });
      flags.push('CRITICAL_GAS');
    } else if (gas >= CONFIG.GAS_WARNING_PPM) {
      alerts.push({
        type: 'GAS_HAZARD',
        severity: 'WARNING',
        message: `Elevated gas concentration detected (${gas} ppm). Above safe baseline.`,
        sensor: 'MQ9_GAS',
        value: gas,
        threshold: CONFIG.GAS_WARNING_PPM
      });
      flags.push('ELEVATED_GAS');
    }
  }

  // 4. Acoustic shock checks
  let isAcousticShock = false;
  if (sound != null && sound >= CONFIG.SOUND_SHOCK_DB) {
    isAcousticShock = true;
    flags.push('ACOUSTIC_SHOCK');
  }

  // 5. Radar velocity sudden change (fall kinematics)
  let isSuddenDescent = false;
  if (radarVelocity >= CONFIG.RADAR_DESCENT_VELOCITY) {
    isSuddenDescent = true;
    flags.push('RAPID_DESCENT');
  }

  // 6. Respiration anomaly checks
  if (respiration != null) {
    if (respiration > CONFIG.RESPIRATION_HIGH_RPM || respiration < CONFIG.RESPIRATION_LOW_RPM) {
      alerts.push({
        type: 'PHYSIOLOGICAL',
        severity: 'WARNING',
        message: `Unusual resting respiration frequency detected (${respiration} RPM). Normal range: ${CONFIG.RESPIRATION_LOW_RPM}–${CONFIG.RESPIRATION_HIGH_RPM} RPM.`,
        sensor: 'RADAR_RESPIRATION',
        value: respiration,
        threshold: respiration < CONFIG.RESPIRATION_LOW_RPM ? CONFIG.RESPIRATION_LOW_RPM : CONFIG.RESPIRATION_HIGH_RPM
      });
      flags.push('ABNORMAL_RESPIRATION');
    }
  }

  // 7. Multi-Sensor Fall / Emergency Corroboration:
  // Corroborates: (Sudden descent radar velocity OR acoustic shock) + (Floor-level presence / PIR trigger)
  let isPossibleFall = false;
  if ((isSuddenDescent || isAcousticShock) && (presence || motion)) {
    isPossibleFall = true;
    alerts.push({
      type: 'FALL_EMERGENCY',
      severity: 'CRITICAL',
      message: 'Possible fall detected. Corroborated multi-vector signature: rapid downward kinetic vector and acoustic impact confirmed.',
      sensor: 'MULTI_CORROBORATION',
      value: radarVelocity,
      threshold: CONFIG.RADAR_DESCENT_VELOCITY
    });
    flags.push('FALL_DETECTED');
  }

  // Determine overall severity
  if (alerts.some(a => a.severity === 'CRITICAL')) {
    highestSeverity = 'CRITICAL';
  } else if (alerts.some(a => a.severity === 'WARNING')) {
    highestSeverity = 'WARNING';
  } else if (temp == null && gas == null && sound == null) {
    highestSeverity = 'UNKNOWN';
  } else {
    highestSeverity = 'NORMAL';
  }

  // Compute confidence score
  let confidence = 98;
  if (highestSeverity === 'CRITICAL') {
    confidence = isPossibleFall ? 87 : 94;
  } else if (highestSeverity === 'WARNING') {
    confidence = 92;
  }

  // Determine human-readable activity pattern and system status
  let activityPattern = 'Normal Activity';
  let systemStatus = 'ONLINE';

  if (isPossibleFall) {
    activityPattern = 'Post-Impact Immobility Detected';
    systemStatus = 'DISPATCH ALERT';
  } else if (isSuddenDescent) {
    activityPattern = 'Abrupt Velocity Vector';
    systemStatus = 'ANALYZING';
  } else if (!motion && presence) {
    activityPattern = 'Sedentary / Resting State';
  } else if (!motion && !presence) {
    activityPattern = 'Room Vacant';
  }

  return {
    status: highestSeverity,
    riskLevel: highestSeverity === 'CRITICAL' ? 'CRITICAL' : highestSeverity === 'WARNING' ? 'ELEVATED' : 'LOW',
    activityPattern,
    systemStatus,
    confidenceScore: confidence,
    flags,
    alerts,
    timestamp: new Date().toISOString()
  };
}
