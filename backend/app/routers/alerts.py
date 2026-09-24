from fastapi import APIRouter, HTTPException, Path, Query

from app.db import store
from app.services import map_alerts

router = APIRouter()


@router.get("/alerts")
def list_alerts(
    deviceId: str | None = Query(default=None),
    acknowledged: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
):
    alerts = map_alerts(store.get_alerts(deviceId, acknowledged, limit))
    return {"success": True, "count": len(alerts), "alerts": alerts}


@router.post("/alerts", status_code=201)
def create_alert(body: dict | None = None):
    payload = body or {}
    if not payload.get("message"):
        raise HTTPException(status_code=400, detail={"success": False, "error": "Alert message is required"})
    alert = store.create_alert(payload)
    return {"success": True, "message": "Alert created", "alert": map_alerts([alert])[0]}


@router.patch("/alerts/{alert_id}")
def acknowledge_alert(alert_id: str = Path(...)):
    updated = store.acknowledge_alert(alert_id)
    if not updated:
        raise HTTPException(status_code=404, detail={"success": False, "error": f"Alert '{alert_id}' not found."})
    return {
        "success": True,
        "message": "Alert acknowledged successfully",
        "alert": map_alerts([updated])[0],
    }
