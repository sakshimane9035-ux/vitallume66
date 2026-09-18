import React from 'react';
import { Shield, Thermometer, Wind, Flame, Zap } from 'lucide-react';

export default function Safety() {
  const safetyCards = [
    {
      id: 'heat',
      icon: Thermometer,
      title: 'HEAT / ENVIRONMENT',
      sensorUsed: 'BME680 Environmental Sensor',
      headline: 'Extreme Temperature & Humidity Surveillance',
      description: 'Uses continuous temperature and relative humidity telemetry to identify potentially unsafe environmental conditions such as extreme heatwaves, hypothermia risk during winter nights, or sudden HVAC failure.',
      thresholds: 'Cold Alert: <16°C | Extreme Heat: >34°C | Mold Risk: >75% RH',
      color: 'from-amber-500/20 to-orange-500/10',
      borderColor: 'group-hover:border-amber-500/50',
      iconColor: 'text-amber-400',
      badge: 'Ambient Climate'
    },
    {
      id: 'air',
      icon: Wind,
      title: 'AIR QUALITY',
      sensorUsed: 'GP2Y1010AU0F Optical Dust Sensor',
      headline: 'Micro-Particulate PM2.5 & Smog Detection',
      description: 'Uses optical infrared scattering to measure airborne PM2.5 dust particles, smoke fumes, and stagnant indoor pollution that exacerbate senior chronic respiratory conditions.',
      thresholds: 'Good: 0–35 µg/m³ | Moderate: 36–75 µg/m³ | Hazardous: >150 µg/m³',
      color: 'from-cyan-500/20 to-teal-500/10',
      borderColor: 'group-hover:border-cyan-500/50',
      iconColor: 'text-cyan-400',
      badge: 'Aerosol Density'
    },
    {
      id: 'gas',
      icon: Flame,
      title: 'GAS / CO',
      sensorUsed: 'MQ-9 Semiconductor Gas Sensor',
      headline: 'Odorless Carbon Monoxide & Combustible Leak Alert',
      description: 'Uses cyclical heating to detect toxic carbon monoxide (CO) buildup from faulty room heaters and unburned LPG/methane leaks from kitchen stoves before explosive or fatal levels are reached.',
      thresholds: 'Nominal: <25 ppm CO | Early Warning: >50 ppm | Critical: >100 ppm',
      color: 'from-red-500/20 to-rose-500/10',
      borderColor: 'group-hover:border-red-500/50',
      iconColor: 'text-red-400',
      badge: 'Combustible / Toxic'
    },
    {
      id: 'electrical',
      icon: Zap,
      title: 'ELECTRICAL SAFETY',
      sensorUsed: 'ZMPT101B Voltage & ACS712 Current Sensors',
      headline: 'Socket Circuit & Mains Overload Protection',
      description: 'Continuously measures AC mains voltage fluctuations and fixture current draw to catch loose wiring, electrical arcing, overcurrent faults, and domestic brownouts directly at the ceiling socket.',
      thresholds: 'Grid Stability: 210V–245V AC | Max Load: 30A Surge Rated',
      color: 'from-teal-500/20 to-emerald-500/10',
      borderColor: 'group-hover:border-teal-500/50',
      iconColor: 'text-teal-400',
      badge: 'Mains Grid'
    }
  ];

  return (
    <section id="safety" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>Quad-Vector Environmental Defense</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Environmental Safety & Ambient Protection
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Safety extends beyond physical movement. VitalLume monitors invisible hazards that threaten vulnerable elders while they sleep, rest, or cook.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {safetyCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="glass-panel glass-card-hover rounded-3xl p-6 sm:p-8 space-y-4 border-slate-800 relative group overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${card.color} rounded-full blur-3xl pointer-events-none`} />

                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-navy-800 flex items-center justify-center ${card.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-navy-900 border border-slate-800 text-slate-300">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                    {card.sensorUsed}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{card.headline}</h3>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{card.description}</p>

                <div className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800/80 text-xs font-mono text-teal-300">
                  <span className="text-slate-500 block text-[10px] uppercase mb-1">Configured Gating Thresholds</span>
                  <span>{card.thresholds}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
