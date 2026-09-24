from __future__ import annotations

import random
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from app.config import get_settings

try:
    from supabase import Client, create_client
except ImportError:  # pragma: no cover
    Client = Any  # type: ignore
    create_client = None  # type: ignore


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _iso(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.isoformat()
    return str(value)


class DataStore:
    def __init__(self) -> None:
        settings = get_settings()
        self.client: Client | None = None
        self.backend_name = "MemoryFallback"

        url = settings.supabase_url
        key = settings.supabase_api_key
        if url and key and create_client is not None:
            try:
                self.client = create_client(url, key)
                self.backend_name = "Supabase"
            except Exception as exc:  # pragma: no cover
                print(f"[DB] Failed to initialize Supabase: {exc}")
                self.client = None

        now = utc_now()
        self.devices: dict[str, dict] = {
            "vitallume-001": {
                "id": 1,
                "device_id": "vitallume-001",
                "name": "Master Overhead Socket Node",
                "status": "ONLINE",
                "last_seen": now,
                "created_at": now,
            },
            "ESP32-001": {
                "id": 2,
                "device_id": "ESP32-001",
                "name": "Living Room Sensor Cluster",
                "status": "ONLINE",
                "last_seen": now,
                "created_at": now,
            },
        }
        self.readings: list[dict] = []
        self.alerts: list[dict] = [
            {
                "id": "alert-init-01",
                "device_id": "vitallume-001",
                "type": "SYSTEM",
                "severity": "NORMAL",
                "message": "System nominal. Multi-sensor array calibrated and online.",
                "sensor": "SYSTEM_BOOT",
                "value": 100,
                "threshold": 100,
                "acknowledged": True,
                "acknowledged_at": now,
                "timestamp": (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat(),
            }
        ]
        seed_now = datetime.now(timezone.utc)
        for i in range(14, -1, -1):
            t = seed_now - timedelta(seconds=i * 3)
            self.readings.append(
                {
                    "id": 15 - i,
                    "device_id": "vitallume-001",
                    "timestamp": t.isoformat(),
                    "temperature": round(28.2 + random.random() * 0.4, 1),
                    "humidity": round(61 + random.random() * 3),
                    "pressure": 1008,
                    "pm25": round(22 + random.random() * 4),
                    "gas": round(18 + random.random() * 3),
                    "sound": round(32 + random.random() * 4),
                    "motion": True,
                    "presence": True,
                    "respiration": 16,
                    "ac_voltage": 228.6,
                    "ac_current": 0.42,
                    "raw_payload": None,
                    "created_at": t.isoformat(),
                }
            )

    def upsert_device(self, device_id: str, name: str = "VitalLume Socket Node", status: str = "ONLINE") -> dict:
        last_seen = utc_now()
        payload = {
            "device_id": device_id,
            "name": name,
            "status": status,
            "last_seen": last_seen,
        }
        if self.client:
            try:
                res = self.client.table("devices").upsert(payload, on_conflict="device_id").execute()
                if res.data:
                    return res.data[0]
            except Exception as exc:
                print(f"[DB] Supabase error in upsert_device: {exc}")

        existing = self.devices.get(device_id) or {
            "id": len(self.devices) + 1,
            "device_id": device_id,
            "name": name,
            "created_at": last_seen,
        }
        updated = {**existing, "name": name or existing.get("name"), "status": status, "last_seen": last_seen}
        self.devices[device_id] = updated
        return updated

    def get_device(self, device_id: str) -> dict | None:
        if self.client:
            try:
                res = (
                    self.client.table("devices")
                    .select("*")
                    .eq("device_id", device_id)
                    .limit(1)
                    .execute()
                )
                if res.data:
                    return res.data[0]
            except Exception as exc:
                print(f"[DB] Supabase error in get_device: {exc}")
        return self.devices.get(device_id)

    def get_all_devices(self) -> list[dict]:
        if self.client:
            try:
                res = self.client.table("devices").select("*").order("last_seen", desc=True).execute()
                return res.data or []
            except Exception as exc:
                print(f"[DB] Supabase error in get_all_devices: {exc}")
        return sorted(self.devices.values(), key=lambda d: d.get("last_seen") or "", reverse=True)

    def save_sensor_reading(self, reading: dict) -> dict:
        record = {
            "device_id": reading.get("deviceId") or reading.get("device_id") or "vitallume-001",
            "timestamp": reading.get("timestamp") or utc_now(),
            "temperature": _to_float(reading.get("temperature"), 28.4),
            "humidity": _to_float(reading.get("humidity"), 63),
            "pressure": _to_float(reading.get("pressure"), 1008),
            "pm25": _to_float(reading.get("pm25"), 24),
            "gas": _to_float(reading.get("gas"), 18),
            "sound": _to_float(reading.get("sound"), 34),
            "motion": bool(reading.get("motion") or reading.get("pir")),
            "presence": bool(reading.get("presence")),
            "respiration": _to_float(reading.get("respiration"), None),
            "ac_voltage": _to_float(reading.get("acVoltage") or reading.get("ac_voltage"), 228.6),
            "ac_current": _to_float(reading.get("acCurrent") or reading.get("ac_current"), 0.42),
            "raw_payload": reading.get("rawPayload") or reading.get("raw_payload") or reading.get("radar"),
        }
        if self.client:
            try:
                res = self.client.table("sensor_readings").insert(record).execute()
                if res.data:
                    return res.data[0]
            except Exception as exc:
                print(f"[DB] Supabase error in save_sensor_reading: {exc}")

        record["id"] = f"read-{uuid.uuid4().hex[:10]}"
        record["created_at"] = utc_now()
        self.readings.append(record)
        if len(self.readings) > 500:
            self.readings.pop(0)
        return record

    def get_latest_sensor_reading(self, device_id: str | None = None) -> dict | None:
        if self.client:
            try:
                query = self.client.table("sensor_readings").select("*").order("timestamp", desc=True).limit(1)
                if device_id:
                    query = query.eq("device_id", device_id)
                res = query.execute()
                if res.data:
                    return res.data[0]
            except Exception as exc:
                print(f"[DB] Supabase error in get_latest_sensor_reading: {exc}")

        filtered = [r for r in self.readings if not device_id or r["device_id"] == device_id]
        return filtered[-1] if filtered else None

    def get_sensor_reading_history(self, device_id: str | None = None, limit: int = 20) -> list[dict]:
        max_limit = min(max(1, int(limit or 20)), 100)
        if self.client:
            try:
                query = (
                    self.client.table("sensor_readings")
                    .select("*")
                    .order("timestamp", desc=True)
                    .limit(max_limit)
                )
                if device_id:
                    query = query.eq("device_id", device_id)
                res = query.execute()
                rows = res.data or []
                return list(reversed(rows))
            except Exception as exc:
                print(f"[DB] Supabase error in get_sensor_reading_history: {exc}")

        filtered = [r for r in self.readings if not device_id or r["device_id"] == device_id]
        return filtered[-max_limit:]

    def create_alert(self, alert_data: dict) -> dict:
        alert = {
            "id": alert_data.get("id") or f"alt-{uuid.uuid4().hex[:12]}",
            "device_id": alert_data.get("deviceId") or alert_data.get("device_id") or "vitallume-001",
            "type": alert_data.get("type") or "HAZARD",
            "severity": alert_data.get("severity") or "WARNING",
            "message": alert_data.get("message") or "Abnormal condition detected",
            "sensor": alert_data.get("sensor") or "MULTI_SENSOR",
            "value": _to_float(alert_data.get("value"), None),
            "threshold": _to_float(alert_data.get("threshold"), None),
            "acknowledged": bool(alert_data.get("acknowledged")),
            "acknowledged_at": utc_now() if alert_data.get("acknowledged") else None,
            "timestamp": alert_data.get("timestamp") or utc_now(),
        }
        if self.client:
            try:
                res = self.client.table("alerts").insert(alert).execute()
                if res.data:
                    return res.data[0]
            except Exception as exc:
                print(f"[DB] Supabase error in create_alert: {exc}")

        self.alerts.insert(0, alert)
        if len(self.alerts) > 200:
            self.alerts.pop()
        return alert

    def get_alerts(
        self,
        device_id: str | None = None,
        acknowledged: bool | str | None = None,
        limit: int = 20,
    ) -> list[dict]:
        max_limit = min(max(1, int(limit or 20)), 100)
        ack_filter = _parse_bool(acknowledged)

        if self.client:
            try:
                query = self.client.table("alerts").select("*").order("timestamp", desc=True).limit(max_limit)
                if device_id:
                    query = query.eq("device_id", device_id)
                if ack_filter is not None:
                    query = query.eq("acknowledged", ack_filter)
                res = query.execute()
                return res.data or []
            except Exception as exc:
                print(f"[DB] Supabase error in get_alerts: {exc}")

        results = []
        for alert in self.alerts:
            if device_id and alert["device_id"] != device_id:
                continue
            if ack_filter is not None and bool(alert.get("acknowledged")) != ack_filter:
                continue
            results.append(alert)
            if len(results) >= max_limit:
                break
        return results

    def acknowledge_alert(self, alert_id: str) -> dict | None:
        now = utc_now()
        if self.client:
            try:
                res = (
                    self.client.table("alerts")
                    .update({"acknowledged": True, "acknowledged_at": now})
                    .eq("id", alert_id)
                    .execute()
                )
                if res.data:
                    return res.data[0]
            except Exception as exc:
                print(f"[DB] Supabase error in acknowledge_alert: {exc}")

        for alert in self.alerts:
            if alert["id"] == alert_id:
                alert["acknowledged"] = True
                alert["acknowledged_at"] = now
                return alert
        return None


def _to_float(value: Any, default: float | None) -> float | None:
    if value is None or value == "":
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _parse_bool(value: Any) -> bool | None:
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        lowered = value.strip().lower()
        if lowered in {"true", "1", "yes"}:
            return True
        if lowered in {"false", "0", "no"}:
            return False
    return bool(value)


def device_to_api(row: dict) -> dict:
    return {
        "id": row.get("id"),
        "deviceId": row.get("device_id") or row.get("deviceId"),
        "name": row.get("name"),
        "status": row.get("status"),
        "lastSeen": _iso(row.get("last_seen") or row.get("lastSeen")),
        "createdAt": _iso(row.get("created_at") or row.get("createdAt")),
    }


def reading_to_api(row: dict) -> dict:
    raw = row.get("raw_payload") or row.get("rawPayload")
    radar = None
    if isinstance(raw, dict) and ("motion" in raw or "presence" in raw or "velocity" in raw or "respiration" in raw):
        radar = raw
    elif isinstance(raw, dict) and isinstance(raw.get("radar"), dict):
        radar = raw["radar"]

    return {
        "id": row.get("id"),
        "deviceId": row.get("device_id") or row.get("deviceId"),
        "timestamp": _iso(row.get("timestamp")),
        "temperature": _to_float(row.get("temperature"), None),
        "humidity": _to_float(row.get("humidity"), None),
        "pressure": _to_float(row.get("pressure"), None),
        "pm25": _to_float(row.get("pm25"), None),
        "gas": _to_float(row.get("gas"), None),
        "sound": _to_float(row.get("sound"), None),
        "motion": bool(row.get("motion")),
        "presence": bool(row.get("presence")),
        "respiration": _to_float(row.get("respiration"), None),
        "acVoltage": _to_float(row.get("ac_voltage") or row.get("acVoltage"), None),
        "acCurrent": _to_float(row.get("ac_current") or row.get("acCurrent"), None),
        "rawPayload": raw,
        "radar": radar,
        "createdAt": _iso(row.get("created_at") or row.get("createdAt")),
    }


def alert_to_api(row: dict) -> dict:
    return {
        "id": row.get("id"),
        "deviceId": row.get("device_id") or row.get("deviceId"),
        "type": row.get("type"),
        "severity": row.get("severity"),
        "message": row.get("message"),
        "sensor": row.get("sensor"),
        "value": _to_float(row.get("value"), None),
        "threshold": _to_float(row.get("threshold"), None),
        "acknowledged": bool(row.get("acknowledged")),
        "acknowledgedAt": _iso(row.get("acknowledged_at") or row.get("acknowledgedAt")),
        "timestamp": _iso(row.get("timestamp")),
    }


store = DataStore()
