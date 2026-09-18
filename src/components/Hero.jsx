import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Radio, TriangleAlert, RefreshCw } from 'lucide-react';
import { useVitalLume } from '../context/VitalLumeContext';

export default function Hero() {
  const { isSimulatingEmergency, triggerEmergencySimulation, resetEmergencySimulation } = useVitalLume();

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#142247_1px,transparent_1px)] [background-size:32px_32px] opacity-25 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium backdrop-blur-md animate-float">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Gen Ambient Health-Tech Prototype</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-slate-400">Pat. Pending Concept</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              The Invisible Home Guardian Living in Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Light Socket.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              VitalLume is a privacy-preserving ambient home safety and health-monitoring system living in your ceiling light socket. 
              <span className="text-white font-semibold"> No wearables. No cameras. Whole-home awareness.</span>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 text-navy-950 font-bold text-sm font-mono shadow-glow-cyan hover:from-cyan-300 hover:to-teal-300 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {isSimulatingEmergency ? (
                <button
                  onClick={resetEmergencySimulation}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-mono font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span>Reset Emergency</span>
                </button>
              ) : (
                <button
                  onClick={triggerEmergencySimulation}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-sm font-mono font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
                >
                  <TriangleAlert className="w-4 h-4 text-red-400" />
                  <span>Simulate Fall Scenario</span>
                </button>
              )}
            </div>

            {/* Feature Badges */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Zero Optical Cameras</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Hardwired 24/7 Power</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>24GHz mmWave Radar</span>
              </div>
            </div>
          </div>

          {/* Right Column Interactive Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96">
              {/* Radar concentric rings */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-30" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-8 rounded-full border border-cyan-500/25" />
              <div className="absolute inset-16 rounded-full border border-teal-500/25" />
              <div className="absolute inset-24 rounded-full border border-slate-700/60" />

              {/* Radar sweep line */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="w-1/2 h-1/2 absolute top-0 left-0 origin-bottom-right bg-gradient-to-br from-cyan-400/20 to-transparent animate-radar" />
              </div>

              {/* Central Light Socket Unit Graphic */}
              <div className="absolute inset-0 m-auto w-32 h-32 rounded-3xl bg-gradient-to-b from-navy-800 to-navy-950 border border-cyan-500/50 shadow-glow-cyan flex flex-col items-center justify-center p-3 text-center space-y-1">
                <Radio className={`w-8 h-8 ${isSimulatingEmergency ? 'text-red-400 animate-bounce' : 'text-cyan-400'}`} />
                <span className="text-[11px] font-mono font-bold text-white uppercase">Socket Node</span>
                <span className="text-[9px] font-mono text-cyan-300">
                  {isSimulatingEmergency ? 'EMERGENCY' : 'OVERHEAD 24GHz'}
                </span>
              </div>

              {/* Floating Sensor Satellite Tags */}
              <div className="absolute top-2 left-6 px-2.5 py-1 rounded-lg bg-navy-900/90 border border-slate-800 text-[10px] font-mono text-teal-300 shadow-md">
                BME680 Ambient
              </div>
              <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-lg bg-navy-900/90 border border-slate-800 text-[10px] font-mono text-cyan-300 shadow-md">
                HC-SR501 PIR
              </div>
              <div className="absolute top-12 right-2 px-2.5 py-1 rounded-lg bg-navy-900/90 border border-slate-800 text-[10px] font-mono text-amber-300 shadow-md">
                MQ-9 Gas / CO
              </div>
              <div className="absolute bottom-10 right-4 px-2.5 py-1 rounded-lg bg-navy-900/90 border border-slate-800 text-[10px] font-mono text-emerald-300 shadow-md">
                LM393 Acoustic
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
