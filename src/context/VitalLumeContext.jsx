import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { VitalLumeApi } from '../services/api';

const VitalLumeContext = createContext(null);

export function VitalLumeProvider({ children }) {
  // Simulation & UI state
  const [isSimulatingEmergency, setIsSimulatingEmergency] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(87);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('Bedroom');

  // Backend connection & mode state
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [apiStatus, setApiStatus] = useState('connected'); // 'connected', 'offline', 'connecting'
  const [deviceInfo, setDeviceInfo] = useState({
    deviceId: 'vitallume-001',
    isOnline: true,
    status: 'ONLINE',
    lastSeen: new Date().toISOString()
  });
  const [serverAlerts, setServerAlerts] = useState([]);

  // Telemetry metrics
  const [metrics, setMetrics] = useState({
    temperature: 28.4,
    humidity: 63,
    pressure: 1008,
    pm25: 24,
    gasPpm: 18,
    gasStatus: 'Normal',
    lightLux: 420,
    humanPresence: 'Detected',
    radarMovement: 'Normal (0.24 m/s)',
    acousticActivity: 'Normal (34 dB)',
    acousticSpike: false,
    radarSudden: false,
    pirTriggered: true,
    immobilityDetected: false,
    riskLevel: 'LOW',
    activityPattern: 'Normal Activity',
    systemStatus: 'ONLINE',
    acVoltage: 228.6,
    acCurrent: 0.42
  });

  // Telemetry history for charts
  const [history, setHistory] = useState(() => {
    const init = [];
    const now = new Date();
    for (let i = 12; i >= 0; i--) {
      const timeStr = new Date(now.getTime() - i * 3000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      init.push({
        time: timeStr,
        temp: +(28.2 + Math.random() * 0.5).toFixed(1),
        pm25: Math.round(22 + Math.random() * 5),
        activity: Math.round(45 + Math.random() * 20),
        risk: 12
      });
    }
    return init;
  });

  // Polling backend API for real-time sensor updates
  useEffect(() => {
    if (isPaused || isSimulatingEmergency) return;

    let isSubscribed = true;

    const fetchLiveTelemetry = async () => {
      // 1. Fetch latest reading
      const { data: latestRes, error: latestErr } = await VitalLumeApi.getLatestSensors('vitallume-001');

      if (!isSubscribed) return;

      if (latestErr || !latestRes || !latestRes.success) {
        setApiStatus('offline');
        // Fallback local simulation step when backend is unreachable
        setMetrics(prev => {
          const newTemp = +(28.4 + (Math.random() - 0.5) * 0.2).toFixed(1);
          const newHum = Math.min(68, Math.max(58, 63 + Math.round((Math.random() - 0.5) * 2)));
          const newPm25 = Math.min(35, Math.max(16, 24 + Math.round((Math.random() - 0.5) * 3)));
          const newLux = 420 + Math.round((Math.random() - 0.5) * 12);
          const newVolt = +(228.6 + (Math.random() - 0.5) * 1.2).toFixed(1);
          return {
            ...prev,
            temperature: newTemp,
            humidity: newHum,
            pm25: newPm25,
            lightLux: newLux,
            acVoltage: newVolt,
            radarMovement: `Normal (${(0.18 + Math.random() * 0.12).toFixed(2)} m/s)`,
            acousticActivity: `Normal (${Math.round(32 + Math.random() * 6)} dB)`
          };
        });

        setHistory(prev => {
          const nowStr = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          const newPoint = {
            time: nowStr,
            temp: +(28.2 + Math.random() * 0.5).toFixed(1),
            pm25: Math.round(22 + Math.random() * 5),
            activity: Math.round(40 + Math.random() * 25),
            risk: 12
          };
          return [...prev.slice(1), newPoint];
        });
        return;
      }

      setApiStatus('connected');

      // Update metrics from backend
      const r = latestRes.data;
      const ev = latestRes.evaluation || {};
      if (r) {
        setMetrics(prev => ({
          ...prev,
          temperature: r.temperature != null ? Number(r.temperature) : prev.temperature,
          humidity: r.humidity != null ? Number(r.humidity) : prev.humidity,
          pressure: r.pressure != null ? Number(r.pressure) : prev.pressure,
          pm25: r.pm25 != null ? Number(r.pm25) : prev.pm25,
          gasPpm: r.gas != null ? Number(r.gas) : prev.gasPpm,
          gasStatus: r.gas > 80 ? 'Critical' : r.gas > 40 ? 'Elevated' : 'Normal',
          lightLux: r.lightLux != null ? Number(r.lightLux) : prev.lightLux,
          humanPresence: r.presence ? 'Detected' : 'Vacant',
          radarMovement: r.radar && r.radar.velocity 
            ? `${r.radar.velocity > 1.5 ? 'SUDDEN' : 'Normal'} (${r.radar.velocity} m/s)` 
            : prev.radarMovement,
          acousticActivity: r.sound != null ? `${r.sound > 70 ? 'HIGH IMPACT' : 'Normal'} (${Math.round(r.sound)} dB)` : prev.acousticActivity,
          riskLevel: ev.riskLevel || (r.gas > 50 ? 'WARNING' : 'LOW'),
          activityPattern: ev.activityPattern || 'Normal Activity',
          systemStatus: ev.systemStatus || 'ONLINE',
          acVoltage: r.acVoltage != null ? Number(r.acVoltage) : prev.acVoltage,
          acCurrent: r.acCurrent != null ? Number(r.acCurrent) : prev.acCurrent
        }));

        setDeviceInfo({
          deviceId: latestRes.deviceId || 'vitallume-001',
          isOnline: latestRes.isOnline !== undefined ? latestRes.isOnline : true,
          status: latestRes.deviceStatus || 'ONLINE',
          lastSeen: r.timestamp || new Date().toISOString()
        });
      }

      // 2. Fetch history for charts
      const { data: histRes } = await VitalLumeApi.getSensorHistory('vitallume-001', 13);
      if (histRes && histRes.history && histRes.history.length > 0) {
        setHistory(histRes.history);
      }

      // 3. Fetch alerts
      const { data: alertsRes } = await VitalLumeApi.getAlerts({ limit: 5 });
      if (alertsRes && alertsRes.alerts) {
        setServerAlerts(alertsRes.alerts);
      }
    };

    fetchLiveTelemetry();
    const intervalId = setInterval(fetchLiveTelemetry, 2500);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [isPaused, isSimulatingEmergency]);

  // Simulation handlers (preserved behavior)
  const triggerEmergencySimulation = useCallback(() => {
    setIsSimulatingEmergency(true);
    setAlertDismissed(false);
    setSimulationStep(1);

    setMetrics(prev => ({
      ...prev,
      radarSudden: true,
      radarMovement: 'SUDDEN RAPID DESCENT (2.8 m/s)',
      systemStatus: 'ANALYZING',
      activityPattern: 'Abrupt Velocity Vector'
    }));

    setTimeout(() => {
      setSimulationStep(2);
      setMetrics(prev => ({
        ...prev,
        acousticSpike: true,
        acousticActivity: 'HIGH IMPACT SHOCK (86 dB)'
      }));
    }, 900);

    setTimeout(() => {
      setSimulationStep(3);
      setMetrics(prev => ({
        ...prev,
        pirTriggered: true,
        humanPresence: 'Floor Level Presence'
      }));
    }, 1800);

    setTimeout(() => {
      setSimulationStep(4);
      setConfidenceScore(87);
      setMetrics(prev => ({
        ...prev,
        immobilityDetected: true,
        radarMovement: 'NO MOVEMENT DETECTED (0.00 m/s)',
        acousticActivity: 'SILENCE (26 dB)',
        riskLevel: 'CRITICAL',
        activityPattern: 'Post-Impact Immobility',
        systemStatus: 'DISPATCH ALERT'
      }));

      setHistory(prev => {
        const timeStr = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        return [...prev.slice(1), {
          time: timeStr,
          temp: 28.4,
          pm25: 24,
          activity: 95,
          risk: 87
        }];
      });
    }, 2700);
  }, []);

  const resetEmergencySimulation = useCallback(() => {
    setIsSimulatingEmergency(false);
    setSimulationStep(0);
    setAlertDismissed(false);
    setMetrics({
      temperature: 28.4,
      humidity: 63,
      pressure: 1008,
      pm25: 24,
      gasPpm: 18,
      gasStatus: 'Normal',
      lightLux: 420,
      humanPresence: 'Detected',
      radarMovement: 'Normal (0.24 m/s)',
      acousticActivity: 'Normal (34 dB)',
      acousticSpike: false,
      radarSudden: false,
      pirTriggered: true,
      immobilityDetected: false,
      riskLevel: 'LOW',
      activityPattern: 'Normal Activity',
      systemStatus: 'ONLINE',
      acVoltage: 228.6,
      acCurrent: 0.42
    });
  }, []);

  const dismissAlert = () => {
    setAlertDismissed(true);
  };

  const acknowledgeAlertItem = async (alertId) => {
    await VitalLumeApi.acknowledgeAlert(alertId);
    setServerAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  };

  return (
    <VitalLumeContext.Provider value={{
      metrics,
      history,
      isSimulatingEmergency,
      simulationStep,
      confidenceScore,
      alertDismissed,
      selectedRoom,
      setSelectedRoom,
      isPaused,
      setIsPaused,
      isLiveMode,
      setIsLiveMode,
      apiStatus,
      deviceInfo,
      serverAlerts,
      triggerEmergencySimulation,
      resetEmergencySimulation,
      dismissAlert,
      acknowledgeAlertItem
    }}>
      {children}
    </VitalLumeContext.Provider>
  );
}

export function useVitalLume() {
  const context = useContext(VitalLumeContext);
  if (!context) {
    throw new Error('useVitalLume must be used within a VitalLumeProvider');
  }
  return context;
}
