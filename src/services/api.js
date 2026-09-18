/**
 * VitalLume Frontend API Service Layer
 * Communicates with backend /api endpoints.
 * Automatically compatible with Vercel and local Vite dev proxy.
 */

const API_BASE = ''; // Relative path for Vercel & Vite proxy

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      let errMessage = `HTTP error ${res.status}: ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson && errJson.error) errMessage = errJson.error;
      } catch (_) {}
      return { data: null, error: errMessage, status: res.status };
    }

    const data = await res.json();
    return { data, error: null, status: res.status };
  } catch (err) {
    return {
      data: null,
      error: err.message || 'Network error / Backend unreachable',
      status: 0,
      isOffline: true
    };
  }
}

export const VitalLumeApi = {
  // 1. Get latest sensor telemetry
  async getLatestSensors(deviceId = 'vitallume-001') {
    return request(`/api/sensors/latest?deviceId=${encodeURIComponent(deviceId)}`);
  },

  // 2. Get historical sensor readings for charts
  async getSensorHistory(deviceId = 'vitallume-001', limit = 20) {
    return request(`/api/sensors/history?deviceId=${encodeURIComponent(deviceId)}&limit=${limit}`);
  },

  // 3. Get alerts
  async getAlerts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/api/alerts${query ? `?${query}` : ''}`);
  },

  // 4. Acknowledge an alert
  async acknowledgeAlert(alertId) {
    return request(`/api/alerts/${encodeURIComponent(alertId)}`, {
      method: 'PATCH'
    });
  },

  // 5. Check device status & heartbeat
  async getDeviceStatus(deviceId = 'ESP32-001') {
    return request(`/api/device/status/${encodeURIComponent(deviceId)}`);
  },

  // 6. Send sensor data
  async sendSensorData(sensorPayload) {
    return request('/api/sensors/data', {
      method: 'POST',
      body: JSON.stringify(sensorPayload)
    });
  },

  // 7. Send ESP32 device data
  async sendDeviceData(devicePayload, apiKey) {
    return request('/api/device/data', {
      method: 'POST',
      headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {},
      body: JSON.stringify(devicePayload)
    });
  },

  // 8. Trigger test/demo scenario
  async triggerTestScenario(scenario = 'normal') {
    return request('/api/test/sensor-data', {
      method: 'POST',
      body: JSON.stringify({ scenario })
    });
  },

  // 9. API Health check
  async checkHealth() {
    return request('/api/health');
  }
};

export default VitalLumeApi;
