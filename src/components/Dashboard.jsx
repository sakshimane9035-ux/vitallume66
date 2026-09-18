import React, { useState } from 'react';
import { Activity, Thermometer, Radio, Volume2, Cpu, TrendingUp, ShieldCheck, TriangleAlert, RefreshCw, Play, Pause, Wifi, WifiOff } from 'lucide-react';
import { useVitalLume } from '../context/VitalLumeContext';

export default function Dashboard() {
  const {
    metrics,
    history,
    isSimulatingEmergency,
    isPaused,
    setIsPaused,
    selectedRoom,
    setSelectedRoom,
    triggerEmergencySimulation,
    resetEmergencySimulation,
    apiStatus,
    deviceInfo
  } = useVitalLume();

  const [activeChartKey, setActiveChartKey] = useState('temp');
  const rooms = ['Bedroom', 'Living Room', 'Bathroom', 'Kitchen'];

  // SVG points calculator
  const buildSvgPoints = (key, min, max, height = 120, width = 450) => {
    if (!history || history.length === 0) return '';
    const step = width / (history.length - 1);
    return history.map((pt, i) => {
      const val = pt[key] != null ? pt[key] : min;
      const normalized = Math.max(0, Math.min(1, (val - min) / (max - min || 1)));
      const y = height - (normalized * (height - 24) + 12);
      return `${i * step},${y}`;
    }).join(' ');
  };

  const chartConfigs = {
    temp: {
      title: 'Ambient Temperature Trend',
      unit: '°C',
      current: `${metrics.temperature}°C`,
      color: '#06b6d4',
      min: 24,
      max: 36,
      dataKey: 'temp',
      normalRange: 'Normal: 24°C - 30°C'
    },
    pm25: {
      title: 'Fine Particulate Air Quality (PM2.5)',
      unit: 'µg/m³',
      current: `${metrics.pm25} µg/m³`,
      color: '#14b8a6',
      min: 10,
      max: 60,
      dataKey: 'pm25',
      normalRange: 'Good: < 35 µg/m³'
    },
    activity: {
      title: 'Human Motion & Radar Activity Index',
      unit: '%',
      current: isSimulatingEmergency ? '95%' : '48%',
      color: '#38bdf8',
      min: 0,
      max: 100,
      dataKey: 'activity',
      normalRange: 'Normal Room Movement'
    },
    risk: {
      title: 'AI Anomaly Risk Assessment',
      unit: '%',
      current: isSimulatingEmergency ? '87%' : '12%',
      color: isSimulatingEmergency ? '#ef4444' : '#10b981',
      min: 0,
      max: 100,
      dataKey: 'risk',
      normalRange: 'Nominal Risk: < 25%'
    }
  };

  const activeChart = chartConfigs[activeChartKey];

  return (
    <section id="dashboard" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Telemetry Stream</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              VitalLume Live Monitoring Dashboard
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Real-time multi-sensor telemetry stream from active overhead socket node.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Device & API Status Pill */}
            <div className="px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-xs font-mono flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${deviceInfo.isOnline ? 'bg-teal-400 animate-ping' : 'bg-red-400'}`} />
              <span className="text-slate-300 font-bold">{deviceInfo.deviceId}</span>
              <span className="text-slate-500">|</span>
              <span className={deviceInfo.isOnline ? 'text-teal-300' : 'text-red-400'}>
                {deviceInfo.isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            {/* Room Switcher */}
            <div className="flex items-center bg-navy-900 border border-slate-800 p-1 rounded-xl">
              {rooms.map((room) => (
                <button
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    selectedRoom === room
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>

            {/* Pause/Play Stream */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title={isPaused ? 'Resume Live Stream' : 'Pause Live Stream'}
            >
              {isPaused ? <Play className="w-4 h-4 text-teal-400" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Home Status Banner */}
        <div className={`p-6 rounded-2xl border transition-all duration-500 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 ${
          isSimulatingEmergency
            ? 'bg-red-950/40 border-red-500/50 shadow-glow-alert'
            : 'bg-gradient-to-r from-navy-900/90 to-teal-950/30 border-cyan-500/30'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isSimulatingEmergency
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
            }`}>
              {isSimulatingEmergency ? <TriangleAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                HOME STATUS • {selectedRoom}
              </span>
              <h3 className={`text-2xl font-black ${isSimulatingEmergency ? 'text-red-400' : 'text-teal-300'}`}>
                {isSimulatingEmergency ? '🔴 POSSIBLE EMERGENCY / FALL' : '🟢 SAFE'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {isSimulatingEmergency
                  ? `Multiple disparate sensors corroborate abrupt descent and post-impact immobility in ${selectedRoom}.`
                  : '“No immediate threat detected.” All environmental parameters within nominal thresholds.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSimulatingEmergency ? (
              <button
                onClick={resetEmergencySimulation}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold font-mono transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            ) : (
              <button
                onClick={triggerEmergencySimulation}
                className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold font-mono transition-colors flex items-center gap-2 shadow-lg hover:shadow-red-500/20"
              >
                <TriangleAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Simulate Fall Scenario</span>
              </button>
            )}
          </div>
        </div>

        {/* Three Primary Telemetry Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 1. Environment Card */}
          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-4 h-4" />
                <span>ENVIRONMENT</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">BME680 + GP2Y + MQ9</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-navy-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Temperature</span>
                <span className="text-lg font-bold text-white font-mono">{metrics.temperature}°C</span>
                <span className="text-[10px] text-teal-400 block mt-0.5">Nominal</span>
              </div>
              <div className="bg-navy-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Humidity</span>
                <span className="text-lg font-bold text-white font-mono">{metrics.humidity}%</span>
                <span className="text-[10px] text-teal-400 block mt-0.5">Comfortable</span>
              </div>
              <div className="bg-navy-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Pressure</span>
                <span className="text-lg font-bold text-white font-mono">{metrics.pressure} hPa</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Barometric</span>
              </div>
              <div className="bg-navy-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">PM2.5 Dust</span>
                <span className="text-lg font-bold text-white font-mono">{metrics.pm25} µg/m³</span>
                <span className="text-[10px] text-teal-400 block mt-0.5">Good Air Quality</span>
              </div>
              <div className="bg-navy-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Gas / CO</span>
                <span className="text-lg font-bold text-teal-300 font-mono">{metrics.gasStatus}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{metrics.gasPpm} ppm</span>
              </div>
              <div className="bg-navy-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Light (LDR)</span>
                <span className="text-lg font-bold text-white font-mono">{metrics.lightLux} lux</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Well-lit</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
              <span>Socket AC Voltage:</span>
              <span className="text-cyan-300 font-semibold">{metrics.acVoltage} V (50Hz)</span>
            </div>
          </div>

          {/* 2. Activity & Presence Card */}
          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono uppercase text-teal-400 font-semibold tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>ACTIVITY</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">24GHz Radar + PIR + Sound</span>
            </div>

            <div className="space-y-3 pt-1">
              <div className="bg-navy-900/80 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Human Presence</span>
                  <span className="text-base font-bold text-white font-mono">{metrics.humanPresence}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                isSimulatingEmergency
                  ? 'bg-red-950/50 border-red-500/40 text-red-300'
                  : 'bg-navy-900/80 border-slate-800/80 text-white'
              }`}>
                <div>
                  <span className="text-[11px] text-slate-400 block">Radar Movement (HLK-LD2420)</span>
                  <span className="text-sm font-bold font-mono">{metrics.radarMovement}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                isSimulatingEmergency
                  ? 'bg-red-950/50 border-red-500/40 text-red-300'
                  : 'bg-navy-900/80 border-slate-800/80 text-white'
              }`}>
                <div>
                  <span className="text-[11px] text-slate-400 block">Acoustic Activity (LM393)</span>
                  <span className="text-sm font-bold font-mono">{metrics.acousticActivity}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
              <span>Zero-Camera Guarantee:</span>
              <span className="text-teal-300 font-semibold">100% Blind Sensing</span>
            </div>
          </div>

          {/* 3. AI / Risk Engine Card */}
          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>AI / RISK ENGINE</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Edge Classification</span>
            </div>

            <div className="space-y-3 pt-1">
              <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                isSimulatingEmergency
                  ? 'bg-red-950/60 border-red-500/60'
                  : 'bg-navy-900/80 border-slate-800/80'
              }`}>
                <div>
                  <span className="text-[11px] text-slate-400 block">Current Risk Level</span>
                  <span className={`text-2xl font-black font-mono ${
                    isSimulatingEmergency ? 'text-red-400 animate-pulse' : 'text-teal-300'
                  }`}>
                    {metrics.riskLevel}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">CONFIDENCE</span>
                  <span className="text-base font-bold font-mono text-white">
                    {isSimulatingEmergency ? '87%' : '98%'}
                  </span>
                </div>
              </div>

              <div className="bg-navy-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Activity Pattern</span>
                <span className="text-sm font-semibold text-slate-200 font-mono mt-0.5 block">
                  {metrics.activityPattern}
                </span>
              </div>

              <div className="bg-navy-900/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">System Status</span>
                  <span className="text-sm font-bold text-teal-300 font-mono mt-0.5 block">
                    {metrics.systemStatus}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                  <span className="text-xs font-mono text-teal-300">Live</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
              <span>Local Processing:</span>
              <span className="text-cyan-300 font-semibold">Edge ATmega328P / ESP32</span>
            </div>
          </div>
        </div>

        {/* Interactive SVG Trend Chart */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h4 className="text-lg font-bold text-white">{activeChart.title}</h4>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Rolling 30-Second Window • {activeChart.normalRange}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveChartKey('temp')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeChartKey === 'temp'
                    ? 'bg-cyan-500 text-navy-950 font-bold'
                    : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Temperature
              </button>
              <button
                onClick={() => setActiveChartKey('pm25')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeChartKey === 'pm25'
                    ? 'bg-teal-500 text-navy-950 font-bold'
                    : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                PM2.5 Dust
              </button>
              <button
                onClick={() => setActiveChartKey('activity')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeChartKey === 'activity'
                    ? 'bg-sky-500 text-navy-950 font-bold'
                    : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Motion Activity
              </button>
              <button
                onClick={() => setActiveChartKey('risk')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeChartKey === 'risk'
                    ? 'bg-emerald-500 text-navy-950 font-bold'
                    : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Risk Score
              </button>
            </div>
          </div>

          <div className="relative w-full h-52 bg-navy-950/80 rounded-2xl border border-slate-800/80 p-4 flex flex-col justify-between overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-x-4 top-8 h-[1px] bg-slate-800/60" />
            <div className="absolute inset-x-4 top-24 h-[1px] bg-slate-800/60" />
            <div className="absolute inset-x-4 top-40 h-[1px] bg-slate-800/60" />

            <div className="absolute top-4 right-6 bg-navy-900/90 border border-slate-700/80 px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-2 z-10">
              <span className="text-slate-400">Current:</span>
              <span className="font-bold text-cyan-300">{activeChart.current}</span>
            </div>

            {/* SVG Chart */}
            <div className="w-full h-36 mt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 450 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeChart.color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={activeChart.color} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <polygon
                  points={`0,120 ${buildSvgPoints(activeChart.dataKey, activeChart.min, activeChart.max)} 450,120`}
                  fill="url(#chartGradient)"
                />

                <polyline
                  fill="none"
                  stroke={activeChart.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={buildSvgPoints(activeChart.dataKey, activeChart.min, activeChart.max)}
                />

                {history.map((pt, idx) => {
                  const val = pt[activeChart.dataKey] != null ? pt[activeChart.dataKey] : activeChart.min;
                  const normalized = Math.max(0, Math.min(1, (val - activeChart.min) / (activeChart.max - activeChart.min || 1)));
                  const cy = 120 - (normalized * 96 + 12);
                  const cx = idx * (450 / (history.length - 1));
                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r="3.5"
                      fill="#070C1A"
                      stroke={activeChart.color}
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Time labels */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
              <span>{history[0]?.time || 'T - 30s'}</span>
              <span>{history[Math.floor(history.length / 2)]?.time || 'T - 15s'}</span>
              <span>{history[history.length - 1]?.time || 'Now (Live)'}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
            <span>Sensor Source: Physical Hardware Transducers via Arduino Uno R3 / ESP32</span>
            <span className="text-cyan-400 font-semibold">Telemetry Polling Rate: 2.5s</span>
          </div>
        </div>
      </div>
    </section>
  );
}
