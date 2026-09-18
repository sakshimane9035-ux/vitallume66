import React from 'react';
import { Zap, Radio, Volume2, Flame, UserCheck, TriangleAlert, RefreshCw } from 'lucide-react';
import { useVitalLume } from '../context/VitalLumeContext';

export default function SensorFusionDemo() {
  const {
    isSimulatingEmergency,
    simulationStep,
    confidenceScore,
    triggerEmergencySimulation,
    resetEmergencySimulation
  } = useVitalLume();

  const steps = [
    {
      step: 1,
      name: 'RADAR VELOCITY DROP',
      sensor: 'HLK-LD2420 24GHz mmWave Radar',
      desc: 'Rapid descent vector (v = -2.8 m/s) captured via Doppler frequency shift.',
      active: simulationStep >= 1
    },
    {
      step: 2,
      name: 'ACOUSTIC SHOCK IMPULSE',
      sensor: 'LM393 Acoustic Impact Microphone',
      desc: 'High-frequency acoustic shock wave (86 dB impulse) corroborated at T+0.12s.',
      active: simulationStep >= 2
    },
    {
      step: 3,
      name: 'FLOOR-LEVEL PRESENCE',
      sensor: 'HC-SR501 Pyroelectric Infrared',
      desc: 'Thermal infrared presence confirmed concentrated at low 0.3m elevation zone.',
      active: simulationStep >= 3
    },
    {
      step: 4,
      name: 'POST-IMPACT IMMOBILITY',
      sensor: 'Multi-Sensor Corroboration Engine',
      desc: 'Absence of restorative micro-motion Doppler across 6 range bins verifies hazard.',
      active: simulationStep >= 4
    }
  ];

  return (
    <section id="sensor-fusion" className="py-24 bg-navy-900/40 relative border-t border-slate-800/80">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none -z-10 transition-colors duration-700 ${
        isSimulatingEmergency ? 'bg-red-500/15' : 'bg-teal-500/10'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Centerpiece Technology Demonstration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Multi-Sensor Fusion Emergency Demo
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Experience how VitalLume combines contactless 24GHz mmWave radar, acoustic impact telemetry, and PIR motion to detect real emergencies while rejecting false alarms.
          </p>
        </div>

        <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 transition-all duration-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                Multi-Sensor Corroboration Pipeline
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {isSimulatingEmergency ? '🔴 Critical Fall Scenario in Progress' : '🟢 Multi-Sensor Nominal State'}
              </h3>
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
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-navy-950 font-bold text-xs font-mono shadow-glow-cyan hover:from-cyan-300 hover:to-teal-300 transition-all"
                >
                  Trigger Corroboration Sequence
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {steps.map((st) => (
              <div
                key={st.step}
                className={`rounded-2xl p-5 border transition-all duration-500 space-y-3 ${
                  st.active
                    ? 'bg-navy-900 border-cyan-400 shadow-glow-cyan scale-105'
                    : 'bg-navy-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                    st.active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-500'
                  }`}>
                    Step 0{st.step}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {st.active ? '✓ TRIGGERED' : 'STANDBY'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{st.name}</h4>
                  <p className="text-[11px] text-teal-400 font-mono mt-0.5">{st.sensor}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          {/* Verification banner */}
          <div className="mt-8 p-4 rounded-2xl bg-navy-950/80 border border-slate-800 text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-slate-400">
              Corroboration Logic: Cross-entropy window gating ensures single sensor spikes do not cause false dispatches.
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Confidence Score:</span>
              <span className="font-bold text-cyan-300 text-sm">{confidenceScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
