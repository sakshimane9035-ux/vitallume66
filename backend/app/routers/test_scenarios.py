from fastapi import APIRouter

from app.db import store
from app.services import process_telemetry

router = APIRouter()

SCENARIOS = {
    "warning_temp": {
        "temperature": 36.8,
        "humidity": 55,
        "pressure": 1008,
        "gas": 22,
        "sound": 35,
        "motion": True,
        "presence": True,
        "radar": {"motion": True, "presence": True, "velocity": 0.2},
    },
    "warning_gas": {
        "temperature": 28.5,
        "humidity": 62,
        "pressure": 1008,
        "gas": 85,
        "sound": 36,
        "motion": True,
        "presence": True,
        "radar": {"motion": True, "presence": True, "velocity": 0.2},
    },
    "critical_fall": {
        "temperature": 28.4,
        "humidity": 63,
        "pressure": 1008,
        "gas": 18,
        "sound": 86,
        "motion": True,
        "presence": True,
        "radar": {"motion": True, "presence": True, "velocity": 2.8},
    },
    "normal": {
        "temperature": 28.4,
        "humidity": 63,
        "pressure": 1008,
        "gas": 18,
        "sound": 34,
        "motion": True,
        "presence": True,
        "radar": {"motion": True, "presence": True, "velocity": 0.24},
    },
}


@router.post("/test/sensor-data")
def run_test_scenario(body: dict | None = None):
    payload = body or {}
    scenario = payload.get("scenario") or "normal"
    device_id = payload.get("deviceId") or "vitallume-demo-01"

    if scenario == "device_offline":
        store.upsert_device(device_id, name="VitalLume Demo Unit", status="OFFLINE")
        return {
            "success": True,
            "scenario": "device_offline",
            "message": "Device offline simulated. Heartbeat halted.",
            "isOnline": False,
        }

    sample = {**SCENARIOS.get(scenario, SCENARIOS["normal"]), "deviceId": device_id}
    _, evaluation, reading = process_telemetry(
        sample,
        default_device_id=device_id,
        device_name="VitalLume Test/Demo Node",
    )
    return {
        "success": True,
        "isDemo": True,
        "scenario": scenario,
        "evaluation": evaluation,
        "reading": reading,
    }
