from fastapi import APIRouter, Header, HTTPException, Path

from app.config import get_settings
from app.db import device_to_api, store
from app.services import is_device_online, process_telemetry

router = APIRouter()


def _require_device_key(authorization: str | None, x_api_key: str | None) -> None:
    settings = get_settings()
    token = ""
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization[7:].strip()
    elif x_api_key:
        token = x_api_key.strip()
    if settings.device_api_key and token != settings.device_api_key:
        raise HTTPException(
            status_code=401,
            detail={
                "success": False,
                "error": "Unauthorized: Invalid or missing device authentication key. Provide Authorization: Bearer <DEVICE_API_KEY>",
            },
        )


@router.post("/device/data")
def ingest_device_data(
    body: dict | None = None,
    authorization: str | None = Header(default=None),
    x_api_key: str | None = Header(default=None),
):
    _require_device_key(authorization, x_api_key)
    payload = {
        "temperature": 28.5,
        "humidity": 60.0,
        "pressure": 1008.0,
        "gas": 150.0,
        "sound": 42.0,
        **(body or {}),
    }
    device_id = payload.get("deviceId") or "ESP32-001"
    process_telemetry(
        payload,
        default_device_id=device_id,
        device_name=f"ESP32 Ambient Node ({device_id})",
    )
    return {"success": True, "message": "Sensor data received", "deviceId": device_id}


@router.get("/device/status/{device_id}")
def device_status(device_id: str = Path(...)):
    device = store.get_device(device_id)
    if not device:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "deviceId": device_id,
                "isOnline": False,
                "status": "OFFLINE",
                "message": f"Device '{device_id}' not found in registry",
            },
        )
    api = device_to_api(device)
    online, seconds = is_device_online(api.get("lastSeen"))
    return {
        "success": True,
        "deviceId": api["deviceId"],
        "name": api["name"],
        "status": api["status"] if online else "OFFLINE",
        "isOnline": online,
        "lastSeen": api["lastSeen"],
        "secondsSinceLastSeen": seconds,
    }


@router.get("/devices")
def list_devices():
    devices = [device_to_api(row) for row in store.get_all_devices()]
    return {"success": True, "count": len(devices), "devices": devices}
