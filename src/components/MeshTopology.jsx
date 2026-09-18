import React, { useState } from 'react';
import { Network, MapPin, Radio, Thermometer, Flame, Zap } from 'lucide-react';
import { useVitalLume } from '../context/VitalLumeContext';

export default function MeshTopology() {
  const { selectedRoom, setSelectedRoom } = useVitalLume();
  const [activeNodeId, setActiveNodeId] = useState('bedroom');

  const nodes = [
    {
      id: 'bedroom',
      name: 'BEDROOM NODE',
      room: 'Bedroom',
      status: 'Active • 28.4°C • Nominal',
      devices: 'Radar, PIR, Acoustic, BME680',
      description: 'Guards against nighttime falls from bed, breathing cessation, and prolonged morning immobility.'
    },
    {
      id: 'bathroom',
      name: 'BATHROOM NODE',
      room: 'Bathroom',
      status: 'Active • 71% RH • Normal',
      devices: 'Radar, PIR, Acoustic, Mold/Humidity',
      description: 'Monitors the highest fall-risk zone in the home. Water-resistant socket enclosure allows zero-camera privacy.'
    },
    {
      id: 'kitchen',
      name: 'KITCHEN NODE',
      room: 'Kitchen',
      status: 'Active • MQ-9 Normal (18 ppm)',
      devices: 'MQ-9 Gas/CO, GP2Y1010 PM2.5, Radar, Current',
      description: 'Monitors stove burn-outs, unlit burner gas leaks, boiling overflows, and appliance overcurrent.'
    },
    {
      id: 'living-room',
      name: 'LIVING ROOM NODE',
      room: 'Living Room',
      status: 'Active • 420 Lux • Ambulatory',
      devices: 'Radar, LDR, PIR, Voltage, Current',
      description: 'Tracks circadian daily rhythms, sofa dwell times, and daytime activity levels without video.'
    }
  ];

  return (
    <section id="mesh" className="py-24 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Room Distributed Topology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Whole-Home Ambient Mesh Topology
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            By screwing into standard overhead ceiling light fixtures across every room, VitalLume units form a whole-house ambient sensor web that reports to a local gateway.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nodes.map((node) => {
            const isSelected = selectedRoom.toLowerCase() === node.room.toLowerCase();
            return (
              <div
                key={node.id}
                onClick={() => {
                  setSelectedRoom(node.room);
                  setActiveNodeId(node.id);
                }}
                className={`glass-panel glass-card-hover rounded-2xl p-6 cursor-pointer space-y-4 transition-all ${
                  isSelected ? 'border-cyan-400 shadow-glow-cyan bg-navy-900/90' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-mono font-bold text-white uppercase">{node.room}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-teal-400'}`} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{node.name}</h4>
                  <p className="text-[11px] text-teal-400 font-mono mt-0.5">{node.status}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{node.description}</p>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                  <span>Transducers: {node.devices}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
