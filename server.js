import express from 'express';
import cors from 'cors';
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

const app = express();
app.use(cors());
app.use(express.json());

// Adapter to connect express (req, res) to Vercel serverless function signature
const adapt = (handler) => (req, res) => {
  // Ensure query params and path params are merged
  req.query = { ...req.query, ...req.params };
  return handler(req, res);
};

// Route definitions
app.all('/api/health', adapt(healthHandler));
app.all('/api/sensors/data', adapt(sensorDataHandler));
app.all('/api/sensors/latest', adapt(sensorLatestHandler));
app.all('/api/sensors/history', adapt(sensorHistoryHandler));
app.all('/api/device/data', adapt(deviceDataHandler));
app.all('/api/device/status/:deviceId', adapt(deviceStatusHandler));
app.all('/api/alerts', adapt(alertsHandler));
app.all('/api/alerts/:id', adapt(alertIdHandler));
app.all('/api/test/sensor-data', adapt(testSensorHandler));

const PORT = CONFIG.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[VitalLume Backend] Server running on http://localhost:${PORT}`);
  console.log(`[VitalLume Backend] API Key: ${CONFIG.DEVICE_API_KEY}`);
});
