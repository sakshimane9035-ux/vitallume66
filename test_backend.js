import assert from 'node:assert';
import { CONFIG } from './api/_lib/config.js';
import healthHandler from './api/health.js';
import sensorDataHandler from './api/sensors/data.js';
import sensorLatestHandler from './api/sensors/latest.js';
import sensorHistoryHandler from './api/sensors/history.js';
import deviceDataHandler from './api/device/data.js';
import deviceStatusHandler from './api/device/status/[deviceId].js';
import alertsHandler from './api/alerts/index.js';
import alertIdHandler from './api/alerts/[id].js';
import testSensorHandler from './api/test/sensor-data.js';

// Mock Express/Vercel (req, res) object helper
function createMockReqRes(options = {}) {
  const req = {
    method: options.method || 'GET',
    headers: options.headers || {},
    query: options.query || {},
    body: options.body || {},
    params: options.params || {}
  };

  let statusCode = 200;
  let responseData = null;
  const headers = {};

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    setHeader(key, val) {
      headers[key] = val;
      return res;
    },
    json(data) {
      responseData = data;
      return res;
    },
    end() {
      return res;
    },
    _getStatusCode: () => statusCode,
    _getData: () => responseData,
    _getHeaders: () => headers
  };

  return { req, res };
}

async function runTests() {
  console.log('====================================================');
  console.log('  VitalLume Backend Automated Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${e.message}`);
      failed++;
    }
  }

  // 1. Health check endpoint
  await test('GET /api/health returns healthy status', async () => {
    const { req, res } = createMockReqRes({ method: 'GET' });
    healthHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.strictEqual(res._getData().status, 'healthy');
  });

  // 2. Sensor Ingestion Endpoint
  await test('POST /api/sensors/data handles valid sensor payload', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        deviceId: 'vitallume-test-01',
        temperature: 28.5,
        humidity: 62.0,
        pressure: 1008.0,
        gas: 20.0,
        sound: 35.0,
        motion: true,
        presence: true,
        radar: {
          motion: true,
          presence: true,
          velocity: 0.24,
          respiration: 16
        }
      }
    });

    await sensorDataHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    const data = res._getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.evaluation.status, 'NORMAL');
  });

  // 3. Sensor Ingestion Fall Detection
  await test('POST /api/sensors/data detects fall emergency condition', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: {
        deviceId: 'vitallume-test-01',
        temperature: 28.4,
        humidity: 63.0,
        gas: 18.0,
        sound: 86.0, // Shock impulse
        motion: true,
        presence: true,
        radar: {
          motion: true,
          presence: true,
          velocity: 2.8 // Rapid downward descent
        }
      }
    });

    await sensorDataHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    const data = res._getData();
    assert.strictEqual(data.evaluation.status, 'CRITICAL');
    assert.strictEqual(data.evaluation.systemStatus, 'DISPATCH ALERT');
    assert.strictEqual(data.evaluation.alertsCreated >= 1, true);
  });

  // 4. Latest Sensors Endpoint
  await test('GET /api/sensors/latest returns latest reading', async () => {
    const { req, res } = createMockReqRes({
      method: 'GET',
      query: { deviceId: 'vitallume-test-01' }
    });

    await sensorLatestHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    const data = res._getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.deviceId, 'vitallume-test-01');
  });

  // 5. Sensor History Endpoint
  await test('GET /api/sensors/history returns formatted chart array', async () => {
    const { req, res } = createMockReqRes({
      method: 'GET',
      query: { limit: 5 }
    });

    await sensorHistoryHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    const data = res._getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(Array.isArray(data.history), true);
    assert.strictEqual(data.history.length > 0, true);
    assert.strictEqual(typeof data.history[0].temp, 'number');
  });

  // 6. ESP32 Authentication
  await test('POST /api/device/data rejects unauthorized requests', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      headers: { authorization: 'Bearer invalid_secret_key' },
      body: { deviceId: 'ESP32-001', temperature: 28.5 }
    });

    await deviceDataHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 401);
    assert.strictEqual(res._getData().success, false);
  });

  await test('POST /api/device/data accepts valid authorized requests', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      headers: { authorization: `Bearer ${CONFIG.DEVICE_API_KEY}` },
      body: {
        deviceId: 'ESP32-001',
        temperature: 28.5,
        humidity: 60,
        gas: 150,
        sound: 42,
        motion: true,
        presence: true
      }
    });

    await deviceDataHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.strictEqual(res._getData().success, true);
    assert.strictEqual(res._getData().deviceId, 'ESP32-001');
  });

  // 7. Device Status Heartbeat
  await test('GET /api/device/status/:deviceId returns online status', async () => {
    const { req, res } = createMockReqRes({
      method: 'GET',
      query: { deviceId: 'ESP32-001' }
    });

    await deviceStatusHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    const data = res._getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.isOnline, true);
  });

  // 8. Alerts Ingestion & Acknowledgment
  let createdAlertId = null;
  await test('GET /api/alerts returns alerts list', async () => {
    const { req, res } = createMockReqRes({ method: 'GET' });
    await alertsHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    const data = res._getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(Array.isArray(data.alerts), true);
    if (data.alerts.length > 0) {
      createdAlertId = data.alerts[0].id;
    }
  });

  await test('PATCH /api/alerts/:id acknowledges alert', async () => {
    if (!createdAlertId) return;
    const { req, res } = createMockReqRes({
      method: 'PATCH',
      query: { id: createdAlertId }
    });

    await alertIdHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    const data = res._getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.alert.acknowledged, true);
  });

  // 9. Test Scenarios Endpoint
  await test('POST /api/test/sensor-data runs warning_gas demo scenario', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: { scenario: 'warning_gas' }
    });

    await testSensorHandler(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    const data = res._getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.isDemo, true);
    assert.strictEqual(data.evaluation.status, 'WARNING');
  });

  console.log(`\nSummary: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTests();
