from datetime import datetime, timezone

from app.config import get_settings
from app.db import alert_to_api, reading_to_api, store
from app.safety_engine import evaluate_safety_conditions


def normalize_sensor_payload(body: dict, default_device_id: str = "vitallume-001") -> dict:
    radar = body.get("radar") or {}
    motion = bool(body.get("motion") or body.get("pir") or radar.get("motion"))
    presence = bool(body.get("presence") or radar.get("presence"))
    respiration = radar.get("respiration")
    if respiration is None:
        respiration = body.get("respiration")
    velocity = radar.get("velocity") if radar.get("velocity") is not None else body.get("velocity", 0.24)

    return {
        "deviceId": body.get("deviceId") or default_device_id,
        "timestamp": body.get("timestamp") or datetime.now(timezone.utc).isoformat(),
        "temperature": body.get("temperature", 28.4),
        "humidity": body.get("humidity", 63),
        "pressure": body.get("pressure", 1008),
        "pm25": body.get("pm25", 24),
        "gas": body.get("gas", 18),
        "sound": body.get("sound", 34),
        "motion": motion,
        "presence": presence,
        "respiration": respiration,
        "radar": {
            "motion": bool(radar.get("motion", motion)),
            "presence": presence,
            "respiration": respiration,
            "velocity": velocity,
        },
        "acVoltage": body.get("acVoltage", 228.6),
        "acCurrent": body.get("acCurrent", 0.42),
        "rawPayload": body,
    }


def process_telemetry(
    body: dict,
    *,
    default_device_id: str = "vitallume-001",
    device_name: str | None = None,
) -> tuple[dict, dict, dict]:
    sensor_data = normalize_sensor_payload(body, default_device_id)
    evaluation = evaluate_safety_conditions(sensor_data)
    saved = store.save_sensor_reading(sensor_data)
    store.upsert_device(
        sensor_data["deviceId"],
        name=device_name or body.get("deviceName") or "VitalLume Ambient Node",
        status=evaluation["systemStatus"],
    )
    alerts_created = 0
    for alt in evaluation["alerts"]:
        store.create_alert(
            {
                "deviceId": sensor_data["deviceId"],
                "type": alt["type"],
                "severity": alt["severity"],
                "message": alt["message"],
                "sensor": alt["sensor"],
                "value": alt["value"],
                "threshold": alt["threshold"],
            }
        )
        alerts_created += 1
    evaluation = {**evaluation, "alertsCreated": alerts_created}
    return sensor_data, evaluation, reading_to_api(saved)


def reading_for_evaluation(row: dict) -> dict:
    api = reading_to_api(row)
    return {
        **api,
        "radar": api.get("radar")
        or {
            "motion": api.get("motion"),
            "presence": api.get("presence"),
            "respiration": api.get("respiration"),
            "velocity": 0.24,
        },
    }


def is_device_online(last_seen: str | None) -> tuple[bool, int]:
    settings = get_settings()
    if not last_seen:
        return False, -1
    try:
        parsed = datetime.fromisoformat(str(last_seen).replace("Z", "+00:00"))
    except ValueError:
        return False, -1
    seconds = int((datetime.now(timezone.utc) - parsed.astimezone(timezone.utc)).total_seconds())
    return seconds <= settings.device_offline_timeout_seconds, seconds


def history_points(rows: list[dict]) -> list[dict]:
    points = []
    for item in rows:
        api = reading_to_api(item)
        try:
            stamp = datetime.fromisoformat(str(api["timestamp"]).replace("Z", "+00:00"))
            time_str = stamp.strftime("%H:%M:%S")
        except (TypeError, ValueError):
            time_str = "00:00:00"
        temp = api.get("temperature") or 28.4
        pm25 = api.get("pm25") or 24
        gas = api.get("gas") or 0
        activity = 55 if api.get("motion") else 10
        risk = 75 if (gas > 50 or temp > 34 or temp < 16) else 12
        points.append(
            {
                "time": time_str,
                "timestamp": api.get("timestamp"),
                "temp": round(float(temp), 1),
                "pm25": round(float(pm25)),
                "activity": activity,
                "risk": risk,
            }
        )
    return points


def map_alerts(rows: list[dict]) -> list[dict]:
    return [alert_to_api(row) for row in rows]
