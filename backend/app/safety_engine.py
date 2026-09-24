from datetime import datetime, timezone

from app.config import Settings, get_settings


def evaluate_safety_conditions(data: dict, settings: Settings | None = None) -> dict:
    """Classify ambient telemetry. Non-diagnostic; environmental safety only."""
    cfg = settings or get_settings()
    alerts: list[dict] = []
    flags: list[str] = []

    temp = _num(data.get("temperature"))
    humidity = _num(data.get("humidity"))
    gas = _num(data.get("gas"))
    sound = _num(data.get("sound"))
    motion = bool(data.get("motion") or data.get("pir"))
    presence = bool(data.get("presence"))

    radar = data.get("radar") or {}
    radar_velocity = abs(_num(radar.get("velocity")) or 0.24)
    respiration = _num(radar.get("respiration"))
    if respiration is None:
        respiration = _num(data.get("respiration"))

    if temp is not None:
        if temp > cfg.temp_hot_threshold:
            severity = "CRITICAL" if temp > (cfg.temp_hot_threshold + 4) else "WARNING"
            alerts.append(
                {
                    "type": "ENVIRONMENT",
                    "severity": severity,
                    "message": (
                        f"High ambient temperature detected ({temp}°C). "
                        f"Exceeds safe threshold ({cfg.temp_hot_threshold}°C). "
                        "Potential heatwave or HVAC failure."
                    ),
                    "sensor": "BME680_TEMP",
                    "value": temp,
                    "threshold": cfg.temp_hot_threshold,
                }
            )
            flags.append("HIGH_TEMPERATURE")
        elif temp < cfg.temp_cold_threshold:
            severity = "CRITICAL" if temp < (cfg.temp_cold_threshold - 4) else "WARNING"
            alerts.append(
                {
                    "type": "ENVIRONMENT",
                    "severity": severity,
                    "message": (
                        f"Low ambient temperature detected ({temp}°C). "
                        f"Risk of senior hypothermia or room freeze. "
                        f"Threshold: {cfg.temp_cold_threshold}°C."
                    ),
                    "sensor": "BME680_TEMP",
                    "value": temp,
                    "threshold": cfg.temp_cold_threshold,
                }
            )
            flags.append("LOW_TEMPERATURE")

    if humidity is not None and humidity > cfg.humidity_high_threshold:
        alerts.append(
            {
                "type": "ENVIRONMENT",
                "severity": "WARNING",
                "message": (
                    f"Elevated relative humidity ({humidity}%). "
                    "Increased mold risk and dampness hazard."
                ),
                "sensor": "BME680_HUMIDITY",
                "value": humidity,
                "threshold": cfg.humidity_high_threshold,
            }
        )
        flags.append("HIGH_HUMIDITY")

    if gas is not None:
        if gas >= cfg.gas_critical_ppm:
            alerts.append(
                {
                    "type": "GAS_HAZARD",
                    "severity": "CRITICAL",
                    "message": (
                        f"Dangerous gas / carbon monoxide level detected ({gas} ppm). "
                        "Immediate ventilation and inspection required."
                    ),
                    "sensor": "MQ9_GAS",
                    "value": gas,
                    "threshold": cfg.gas_critical_ppm,
                }
            )
            flags.append("CRITICAL_GAS")
        elif gas >= cfg.gas_warning_ppm:
            alerts.append(
                {
                    "type": "GAS_HAZARD",
                    "severity": "WARNING",
                    "message": f"Elevated gas concentration detected ({gas} ppm). Above safe baseline.",
                    "sensor": "MQ9_GAS",
                    "value": gas,
                    "threshold": cfg.gas_warning_ppm,
                }
            )
            flags.append("ELEVATED_GAS")

    is_acoustic_shock = sound is not None and sound >= cfg.sound_shock_db
    if is_acoustic_shock:
        flags.append("ACOUSTIC_SHOCK")

    is_sudden_descent = radar_velocity >= cfg.radar_descent_velocity
    if is_sudden_descent:
        flags.append("RAPID_DESCENT")

    if respiration is not None and (
        respiration > cfg.respiration_high_rpm or respiration < cfg.respiration_low_rpm
    ):
        threshold = (
            cfg.respiration_low_rpm
            if respiration < cfg.respiration_low_rpm
            else cfg.respiration_high_rpm
        )
        alerts.append(
            {
                "type": "PHYSIOLOGICAL",
                "severity": "WARNING",
                "message": (
                    f"Unusual resting respiration frequency detected ({respiration} RPM). "
                    f"Normal range: {cfg.respiration_low_rpm}–{cfg.respiration_high_rpm} RPM."
                ),
                "sensor": "RADAR_RESPIRATION",
                "value": respiration,
                "threshold": threshold,
            }
        )
        flags.append("ABNORMAL_RESPIRATION")

    is_possible_fall = (is_sudden_descent or is_acoustic_shock) and (presence or motion)
    if is_possible_fall:
        alerts.append(
            {
                "type": "FALL_EMERGENCY",
                "severity": "CRITICAL",
                "message": (
                    "Possible fall detected. Corroborated multi-vector signature: "
                    "rapid downward kinetic vector and acoustic impact confirmed."
                ),
                "sensor": "MULTI_CORROBORATION",
                "value": radar_velocity,
                "threshold": cfg.radar_descent_velocity,
            }
        )
        flags.append("FALL_DETECTED")

    if any(a["severity"] == "CRITICAL" for a in alerts):
        highest = "CRITICAL"
    elif any(a["severity"] == "WARNING" for a in alerts):
        highest = "WARNING"
    elif temp is None and gas is None and sound is None:
        highest = "UNKNOWN"
    else:
        highest = "NORMAL"

    confidence = 98
    if highest == "CRITICAL":
        confidence = 87 if is_possible_fall else 94
    elif highest == "WARNING":
        confidence = 92

    activity_pattern = "Normal Activity"
    system_status = "ONLINE"
    if is_possible_fall:
        activity_pattern = "Post-Impact Immobility Detected"
        system_status = "DISPATCH ALERT"
    elif is_sudden_descent:
        activity_pattern = "Abrupt Velocity Vector"
        system_status = "ANALYZING"
    elif not motion and presence:
        activity_pattern = "Sedentary / Resting State"
    elif not motion and not presence:
        activity_pattern = "Room Vacant"

    return {
        "status": highest,
        "riskLevel": "CRITICAL" if highest == "CRITICAL" else "ELEVATED" if highest == "WARNING" else "LOW",
        "activityPattern": activity_pattern,
        "systemStatus": system_status,
        "confidenceScore": confidence,
        "flags": flags,
        "alerts": alerts,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def _num(value):
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None
