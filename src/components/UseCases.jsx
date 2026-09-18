import React from 'react';
import { House, Building2, UserCheck, CloudRain, Award } from 'lucide-react';

export default function UseCases() {
  const cases = [
    {
      icon: House,
      title: 'Single-Room Deployment',
      badge: 'Starter Setup',
      description: 'Ideal for studio apartments or target high-risk areas like the bathroom or bedroom. Screws into existing lamp sockets with zero wiring modifications.',
      highlights: ['Zero construction needed', 'Plug-and-play into standard socket', 'Immediate high-risk coverage']
    },
    {
      icon: Building2,
      title: 'Whole-Home Monitoring',
      badge: 'Comprehensive',
      description: 'Deploy units across bedroom, bathroom, kitchen, and living room to create a seamless indoor ambient radar curtain with automated spatial tracking.',
      highlights: ['Multi-room coverage', 'Mesh network synchrony', 'Zero resident blindspots']
    },
    {
      icon: Building2,
      title: 'Assisted-Living Facilities',
      badge: 'Institutional Care',
      description: 'Empowers care staff with ward-level dashboards, prioritizing nurse visits to residents experiencing genuine kinetic or environmental distress.',
      highlights: ['Preserves patient dignity', 'Cuts false alarm calls', 'Central station integration']
    },
    {
      icon: UserCheck,
      title: 'Elderly Living Independently',
      badge: 'Aging in Place',
      description: 'Provides peace of mind to adult children and remote relatives while honoring the senior’s independence and autonomy without invasive surveillance cameras.',
      highlights: ['24/7 passive guardian', 'No buttons to press', 'Non-stigmatizing appearance']
    },
    {
      icon: CloudRain,
      title: 'Disaster & Environmental Safety',
      badge: 'Hazard Warning',
      description: 'Continuously warns of gas leaks, unburned stove methane, electrical socket overheating, and extreme summer/winter room temperatures during storms.',
      highlights: ['Toxic gas early warning', 'Overheating fire prevention', 'Cold snap hypothermia alert']
    }
  ];

  return (
    <section id="use-cases" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span>Versatile Real-World Applications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Real-World Deployment
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            From single-bulb safety setups to multi-room residences and institutional elder care facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4 border-slate-800 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-navy-900 border border-slate-800 text-slate-300">
                      {c.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{c.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{c.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {c.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-teal-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
