import React, { useState } from 'react';
import { Bell, ShieldAlert, CircleCheck, TriangleAlert, Clock, MapPin, Check, PhoneCall, X } from 'lucide-react';
import { useVitalLume } from '../context/VitalLumeContext';

export default function CaregiverPortal() {
  const {
    isSimulatingEmergency,
    alertDismissed,
    dismissAlert,
    serverAlerts,
    acknowledgeAlertItem
  } = useVitalLume();

  const [acknowledged, setAcknowledged] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const activeAlert = serverAlerts.find(a => !a.acknowledged) || (isSimulatingEmergency ? {
    id: 'sim-alert-01',
    type: 'FALL_EMERGENCY',
    severity: 'CRITICAL',
    message: 'Abnormal kinetic velocity drop followed by sustained lack of movement in bedroom zone.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } : null);

  const handleAcknowledge = async () => {
    setAcknowledged(true);
    if (activeAlert && activeAlert.id) {
      await acknowledgeAlertItem(activeAlert.id);
    }
  };

  return (
    <section id="caregiver" className="py-24 bg-navy-950/60 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            <span>Caregiver Dispatch Terminal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Caregiver Alert & Telemetry Portal
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            When anomalies are verified across multiple sensors, caregivers receive unambiguous, actionable alerts with zero invasive video footage.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className={`rounded-3xl border transition-all duration-500 shadow-2xl overflow-hidden ${
            (isSimulatingEmergency || activeAlert) && !acknowledged
              ? 'bg-gradient-to-b from-red-950/60 via-navy-900 to-navy-950 border-red-500/70 shadow-glow-alert'
              : 'bg-gradient-to-b from-navy-900/90 to-navy-950 border-slate-800'
          }`}>
            {/* Header bar */}
            <div className={`px-6 py-4 border-b flex items-center justify-between text-xs font-mono ${
              (isSimulatingEmergency || activeAlert) && !acknowledged
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-navy-950/80 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  (isSimulatingEmergency || activeAlert) && !acknowledged ? 'bg-red-500 animate-ping' : 'bg-teal-400'
                }`} />
                <span className="font-bold">
                  {(isSimulatingEmergency || activeAlert) && !acknowledged ? 'HIGH-PRIORITY DISPATCH' : 'SYSTEM STANDBY • MONITORING'}
                </span>
              </div>
              <span>PORTAL ID: VL-RES-9842</span>
            </div>

            {/* Alert content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  (isSimulatingEmergency || activeAlert) && !acknowledged
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : 'bg-teal-500/20 text-teal-400 border border-teal-500/40'
                }`}>
                  {(isSimulatingEmergency || activeAlert) && !acknowledged ? (
                    <TriangleAlert className="w-8 h-8" />
                  ) : (
                    <ShieldAlert className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <h3 className={`text-2xl font-black tracking-tight ${
                    (isSimulatingEmergency || activeAlert) && !acknowledged ? 'text-red-400' : 'text-white'
                  }`}>
                    {(isSimulatingEmergency || activeAlert) && !acknowledged
                      ? '⚠ ALERT — POSSIBLE EMERGENCY'
                      : acknowledged
                      ? '✓ INCIDENT ACKNOWLEDGED'
                      : 'NO ACTIVE EMERGENCIES'}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">
                    {(isSimulatingEmergency || activeAlert) && !acknowledged
                      ? (activeAlert?.message || 'Abnormal kinetic velocity drop followed by sustained lack of movement.')
                      : 'All residence zones reporting nominal ambient telemetry.'}
                  </p>
                </div>
              </div>

              {/* Sensor details table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-navy-950/80 rounded-2xl p-5 border border-slate-800/80 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location:
                  </span>
                  <span className="text-sm font-bold text-white block">Bedroom (Socket #01)</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <TriangleAlert className="w-3.5 h-3.5 text-amber-400" /> Event:
                  </span>
                  <span className={`text-sm font-bold block ${isSimulatingEmergency ? 'text-red-300' : 'text-slate-300'}`}>
                    {isSimulatingEmergency ? 'Possible Fall Detected' : 'Routine Rest Period'}
                  </span>
                </div>

                <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block mb-1.5">Sensor Confirmation Checklist:</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 flex items-center gap-1 font-semibold">
                      <CircleCheck className="w-3.5 h-3.5 text-teal-400" /> Radar ✓ (24GHz Rapid Descent)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 flex items-center gap-1 font-semibold">
                      <CircleCheck className="w-3.5 h-3.5 text-teal-400" /> PIR ✓ (Floor-Level Heat)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 flex items-center gap-1 font-semibold">
                      <CircleCheck className="w-3.5 h-3.5 text-teal-400" /> Acoustic ✓ (Impact Signature)
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pt-2 sm:col-span-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Timestamp:
                  </span>
                  <span className="text-sm font-bold text-cyan-300">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} (Live)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleAcknowledge}
                  disabled={(!isSimulatingEmergency && !activeAlert) || acknowledged}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-navy-950 font-bold text-xs font-mono shadow-glow-cyan hover:from-cyan-300 hover:to-teal-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{acknowledged ? 'Acknowledged' : 'Acknowledge Alert'}</span>
                </button>

                <button
                  onClick={() => setDetailsOpen(true)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 border border-slate-700 text-xs font-mono font-medium transition-colors"
                >
                  View Details
                </button>

                <a
                  href="tel:911"
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Resident</span>
                </a>
              </div>
            </div>

            <div className="px-6 py-3 bg-navy-950 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span>Encrypted Direct Socket Push Protocol</span>
              <span>Zero Video Stream Recorded</span>
            </div>
          </div>
        </div>

        {/* Modal: Incident Telemetry Trace */}
        {detailsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="bg-navy-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-lg font-bold text-white font-mono">Incident Telemetry Trace: #VL-9842</h4>
                <button
                  onClick={() => setDetailsOpen(false)}
                  className="p-1 rounded-lg bg-navy-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="bg-navy-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">T-0.00s:</span>
                  <span>HLK-LD2420 Radar records rapid vertical trajectory change (v = -2.8 m/s).</span>
                </div>
                <div className="bg-navy-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">T+0.12s:</span>
                  <span>LM393 sound module trips threshold with 86 dB impulse acoustic shock.</span>
                </div>
                <div className="bg-navy-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">T+0.45s:</span>
                  <span>HC-SR501 PIR logs broad infrared thermal mass at 0.3m elevation.</span>
                </div>
                <div className="bg-navy-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">T+3.00s:</span>
                  <span>Zero micro-movement Doppler shift detected across 6 consecutive range gates.</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setDetailsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-navy-950 font-bold text-xs font-mono shadow-glow-cyan"
                >
                  Close Trace
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
