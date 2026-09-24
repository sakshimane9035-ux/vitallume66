from fastapi import APIRouter, Query

from app.db import reading_to_api, store
from app.safety_engine import evaluate_safety_conditions
from app.services import history_points, is_device_online, process_telemetry, reading_for_evaluation

router = APIRouter()


@router.post("/sensors/data")
def ingest_sensor_data(body: dict | None = None):
    payload = body or {}
    sensor_data, evaluation, saved = process_telemetry(payload)
    return {
        "success": True,
        "message": "Sensor telemetry processed successfully",
        "deviceId": sensor_data["deviceId"],
        "evaluation": {
            "status": evaluation["status"],
            "riskLevel": evaluation["riskLevel"],
            "activityPattern": evaluation["activityPattern"],
            "systemStatus": evaluation["systemStatus"],
            "confidenceScore": evaluation["confidenceScore"],
            "alertsCreated": evaluation["alertsCreated"],
        },
        "data": saved,
    }


@router.get("/sensors/latest")
def latest_sensors(deviceId: str | None = Query(default=None)):
    reading = store.get_latest_sensor_reading(deviceId)
    if not reading:
        return {"success": True, "message": "No sensor data available yet", "data": None}

    api_reading = reading_to_api(reading)
    device = store.get_device(api_reading["deviceId"])
    last_seen = device.get("last_seen") if device else None
    online, _ = is_device_online(last_seen)
    evaluation = evaluate_safety_conditions(reading_for_evaluation(reading))
    return {
        "success": True,
        "deviceId": api_reading["deviceId"],
        "isOnline": online,
        "deviceStatus": (device.get("status") if device and online else "OFFLINE") if device else ("ONLINE" if online else "OFFLINE"),
        "evaluation": evaluation,
        "data": api_reading,
    }


@router.get("/sensors/history")
def sensor_history(
    deviceId: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
):
    rows = store.get_sensor_reading_history(deviceId, limit)
    points = history_points(rows)
    return {"success": True, "count": len(points), "history": points}
