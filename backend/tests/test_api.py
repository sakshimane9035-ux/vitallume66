from fastapi.testclient import TestClient

from app.config import get_settings
from app.main import app

client = TestClient(app)
settings = get_settings()


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "healthy"


def test_sensor_ingest_normal():
    res = client.post(
        "/api/sensors/data",
        json={
            "deviceId": "vitallume-test-01",
            "temperature": 28.5,
            "humidity": 62.0,
            "pressure": 1008.0,
            "gas": 20.0,
            "sound": 35.0,
            "motion": True,
            "presence": True,
            "radar": {"motion": True, "presence": True, "velocity": 0.24, "respiration": 16},
        },
    )
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    assert body["evaluation"]["status"] == "NORMAL"


def test_sensor_ingest_fall():
    res = client.post(
        "/api/sensors/data",
        json={
            "deviceId": "vitallume-test-01",
            "temperature": 28.4,
            "humidity": 63.0,
            "gas": 18.0,
            "sound": 86.0,
            "motion": True,
            "presence": True,
            "radar": {"motion": True, "presence": True, "velocity": 2.8},
        },
    )
    assert res.status_code == 200
    body = res.json()
    assert body["evaluation"]["status"] == "CRITICAL"
    assert body["evaluation"]["systemStatus"] == "DISPATCH ALERT"
    assert body["evaluation"]["alertsCreated"] >= 1


def test_latest_and_history():
    latest = client.get("/api/sensors/latest", params={"deviceId": "vitallume-test-01"})
    assert latest.status_code == 200
    assert latest.json()["success"] is True
    assert latest.json()["deviceId"] == "vitallume-test-01"

    history = client.get("/api/sensors/history", params={"deviceId": "vitallume-test-01", "limit": 5})
    assert history.status_code == 200
    body = history.json()
    assert body["success"] is True
    assert isinstance(body["history"], list)
    assert len(body["history"]) > 0
    assert isinstance(body["history"][0]["temp"], (int, float))


def test_device_auth():
    denied = client.post(
        "/api/device/data",
        headers={"Authorization": "Bearer invalid_secret_key"},
        json={"deviceId": "ESP32-001", "temperature": 28.5},
    )
    assert denied.status_code == 401

    ok = client.post(
        "/api/device/data",
        headers={"Authorization": f"Bearer {settings.device_api_key}"},
        json={
            "deviceId": "ESP32-001",
            "temperature": 28.5,
            "humidity": 60,
            "gas": 20,
            "sound": 42,
            "motion": True,
            "presence": True,
        },
    )
    assert ok.status_code == 200
    assert ok.json()["deviceId"] == "ESP32-001"


def test_device_status():
    res = client.get("/api/device/status/ESP32-001")
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    assert body["isOnline"] is True


def test_alerts_and_ack():
    listed = client.get("/api/alerts")
    assert listed.status_code == 200
    alerts = listed.json()["alerts"]
    assert isinstance(alerts, list)
    if alerts:
        alert_id = alerts[0]["id"]
        patched = client.patch(f"/api/alerts/{alert_id}")
        assert patched.status_code == 200
        assert patched.json()["alert"]["acknowledged"] is True


def test_demo_warning_gas():
    res = client.post("/api/test/sensor-data", json={"scenario": "warning_gas"})
    assert res.status_code == 200
    body = res.json()
    assert body["isDemo"] is True
    assert body["evaluation"]["status"] == "WARNING"
