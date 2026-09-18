import React from 'react';
import { Activity, Wind, Flame, ThermometerSnowflake, UserX, CircleAlert, Watch, VideoOff, House, BellOff } from 'lucide-react';

export default function ProblemSolution() {
  const hazards = [
    {
      icon: Activity,
      title: 'Falls & Abnormal Movement',
      description: 'Falls are the #1 cause of fatal and non-fatal injuries in seniors. When a fall occurs, seconds matter.',
      tag: 'Critical Hazard'
    },
    {
      icon: Wind,
      title: 'Poor Indoor Air Quality',
      description: 'Dust accumulation and PM2.5 particulates degrade respiratory health, particularly for those with COPD or asthma.',
      tag: 'Chronic Threat'
    },
    {
      icon: Flame,
      title: 'CO & Toxic Gas Hazards',
      description: 'Colorless, odorless carbon monoxide leaks and unburned cooking gas create silent, fatal hazards.',
      tag: 'Deadly Gas'
    },
    {
      icon: ThermometerSnowflake,
      title: 'Extreme Temp & Humidity',
      description: 'Senior thermoregulation is impaired; hyperthermia or sudden hypothermia can develop unnoticed.',
      tag: 'Environmental'
    },
    {
      icon: UserX,
      title: 'Unusual Inactivity',
      description: 'Prolonged lack of movement in bed or the bathroom often indicates physical distress, fainting, or stroke.',
      tag: 'Behavioral Anomaly'
    },
    {
      icon: CircleAlert,
      title: 'Acoustic Emergency Signs',
      description: 'Glass shattering, sudden body thuds, or faint cries for help often go unheard across closed doors.',
      tag: 'Acoustic Shock'
    }
  ];

  const comparisons = [
    {
      icon: Watch,
      title: 'Wearables are Removed or Forgotten',
      problem: 'Smartwatches and emergency pendants are frequently taken off before sleeping, showering (the highest fall risk), or simply left on the nightstand while charging.',
      vitalLumeFix: 'VitalLume is hardwired into your existing light socket—permanently powered, never forgotten, 100% passive.'
    },
    {
      icon: VideoOff,
      title: 'Cameras Violate Personal Privacy',
      problem: 'Cameras in private sanctuaries like bedrooms and bathrooms cause extreme distress, dignity loss, and create severe cybersecurity/video leak risks.',
      vitalLumeFix: 'Zero lenses, zero video streams. Senses ambient millimeter-wave radar and physical thermodynamics only.'
    },
    {
      icon: House,
      title: 'Single-Room Sensors Leave Blindspots',
      problem: 'Tabletop emergency hubs only protect the living room. When an elder falls in the hallway or bathroom, they remain isolated.',
      vitalLumeFix: 'Every room has a ceiling light socket. VitalLume turns every bulb location into an ambient safety node.'
    },
    {
      icon: BellOff,
      title: 'Single-Sensor False Alarms',
      problem: 'Standalone sound detectors alarm on loud TV movies, and simple PIR sensors trigger on pets, causing alert fatigue and discarded systems.',
      vitalLumeFix: 'Multi-sensor fusion: Corroborates radar velocity, impact sound, PIR presence, and post-event immobility.'
    }
  ];

  return (
    <section id="problem" className="py-24 bg-navy-900/40 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
            <span>The Aging-In-Place Crisis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Independent Living Shouldn’t Mean Invisible Danger
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Millions of seniors choose to live independently at home, but existing safety technologies force an unacceptable compromise between dignity, comfort, and safety.
          </p>
        </div>

        {/* Hazard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {hazards.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="glass-panel rounded-2xl p-6 hover:border-cyan-500/40 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {h.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{h.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{h.description}</p>
              </div>
            );
          })}
        </div>

        {/* Why Existing Solutions Fail */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-white">Why Conventional Safety Tech Fails Seniors</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparisons.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4 border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">{c.title}</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{c.problem}</p>
                <div className="p-4 rounded-xl bg-navy-950/80 border border-cyan-500/30 text-xs text-cyan-300 font-mono space-y-1">
                  <span className="text-white font-bold block">VitalLume Solution:</span>
                  <span>{c.vitalLumeFix}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
