import React from 'react';
import { Rocket, Cpu, Sparkles, Smartphone, Flame, BatteryCharging, Box, Network } from 'lucide-react';

export default function FutureScope() {
  const scopeItems = [
    {
      icon: Cpu,
      title: 'Advanced Edge AI Models',
      description: 'Deploy quantized TinyML neural networks on Cortex-M4/M33 to perform micro-Doppler gait analysis directly on-device without cloud roundtrips.'
    },
    {
      icon: Sparkles,
      title: 'Enhanced Fall Detection Accuracy',
      description: 'Refine trajectory velocity thresholds with multi-zone radar array gating to achieve >98% accuracy in complex postures (bed rollouts, slips).'
    },
    {
      icon: Sparkles,
      title: 'Additional Non-Contact Physiological Sensors',
      description: 'Explore ultra-wideband (UWB) non-contact chest displacement sensing to detect resting respiration rhythms without direct skin contact.'
    },
    {
      icon: Smartphone,
      title: 'Native Mobile Caregiver Application',
      description: 'Develop dedicated iOS and Android apps with background push notifications, direct resident intercom, and activity digest timelines.'
    },
    {
      icon: Flame,
      title: 'Improved Disaster-Response Mode',
      description: 'Autonomous failsafe triggers that shut off domestic gas solenoids or flash socket LEDs during high-severity CO leaks or earthquakes.'
    },
    {
      icon: BatteryCharging,
      title: 'Integrated Battery Backup',
      description: 'Incorporate an on-board supercapacitor or LiFePO4 battery cell to sustain ambient radar and alert dispatch during power grid blackouts.'
    },
    {
      icon: Box,
      title: 'Miniaturized Custom PCB',
      description: 'Transition from breadboard jumper wiring to a dense, multi-layer circular PCB fitting completely within an Edison screw lamp base.'
    },
    {
      icon: Box,
      title: 'Actual E26 / E27 Socket Enclosure',
      description: 'Flame-retardant injection-molded E26/E27 screw-in housing with internal AC-to-DC conversion and thermal isolation baffles.'
    },
    {
      icon: Network,
      title: 'Whole-Home Thread / Matter Mesh',
      description: 'Implement native IEEE 802.15.4 mesh radios running the Thread protocol to enable zero-configuration whole-residence network self-healing.'
    }
  ];

  return (
    <section id="future-scope" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span>Research Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Future Scope & Commercial Roadmap
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            From proof-of-concept laboratory prototype to commercial-scale ambient health infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scopeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel rounded-2xl p-6 space-y-3 border-slate-800 hover:border-cyan-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
