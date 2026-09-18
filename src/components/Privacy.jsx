import React from 'react';
import { Lock, VideoOff, Watch, Cpu, GitMerge } from 'lucide-react';

export default function Privacy() {
  const pillars = [
    {
      icon: VideoOff,
      title: 'NO CAMERA',
      subtitle: 'Zero video surveillance',
      description: 'VitalLume contains no optical lenses, image sensors, or framebuffers. It is physically impossible for the device to record, transmit, or leak images of private moments.',
      tag: 'Zero Optical Data'
    },
    {
      icon: Watch,
      title: 'NO WEARABLE',
      subtitle: 'Zero battery or lanyard burden',
      description: 'Elders never have to remember to wear a wristband, charge a battery, or wear a waterproof pendant into the shower. The system protects ambiently 24/7.',
      tag: 'Zero Resident Friction'
    },
    {
      icon: Cpu,
      title: 'EDGE PROCESSING',
      subtitle: 'Local computation on hardware',
      description: 'Raw analog waveforms and radar range bins are processed locally on the embedded microcontroller. Raw sensor data never leaves the room without event classification.',
      tag: 'Local Intelligence'
    },
    {
      icon: GitMerge,
      title: 'MULTI-SENSOR FUSION',
      subtitle: 'Physics-based corroboration',
      description: 'Instead of invasive computer vision that recognizes faces, VitalLume correlates velocity Doppler shifts, acoustic shock energy, and thermal dynamics.',
      tag: 'Safe Corroboration'
    }
  ];

  return (
    <section id="privacy" className="py-24 bg-navy-950/70 relative border-t border-slate-800/80 overflow-hidden">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>Uncompromising Dignity & Security</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            “Your Home Shouldn’t Need a Camera to Understand What’s Happening.”
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Privacy is not a feature you turn on or off — it is engineered into the hardware physics of VitalLume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="glass-panel rounded-2xl p-6 space-y-4 border-slate-800 hover:border-teal-500/40 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">{p.subtitle}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-2 py-0.5 rounded-md">
                    {p.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
