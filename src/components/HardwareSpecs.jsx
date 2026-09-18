import React from 'react';
import { CircuitBoard, Cpu, Layers } from 'lucide-react';

export default function HardwareSpecs() {
  const hardwareList = [
    { name: 'Arduino Uno R3 / ESP32', role: 'Central ATmega328P / ESP32 edge microcontroller executing firmware polling loops' },
    { name: 'PIR Motion Sensor (HC-SR501)', role: 'Pyroelectric infrared sensor for room-level thermal presence' },
    { name: '24GHz Radar (HLK-LD2420)', role: 'Millimeter-wave radar measuring spatial distance gates and micro-motion' },
    { name: 'BME680 Environmental Sensor', role: 'Bosch 4-in-1 MEMS measuring temperature, barometric pressure, and humidity' },
    { name: 'MQ-9 Gas Sensor', role: 'Semiconductor sensor for carbon monoxide (CO) and combustible gases' },
    { name: 'PM2.5 Particle Sensor (GP2Y1010AU0F)', role: 'Optical dust sensor utilizing infrared scattering for smoke and fine dust' },
    { name: 'Microphone Module (LM393 / Analog)', role: 'Acoustic shock sensor capturing impact energy without speech recording' },
    { name: 'LDR Sensor Module', role: 'Cadmium sulfide photoresistor for ambient light level tracking' },
    { name: 'ACS712 30A Current Sensor', role: 'Hall-effect current transducer measuring domestic fixture electrical load' },
    { name: 'ZMPT101B AC Voltage Sensor', role: 'Precision isolation voltage transformer monitoring AC mains stability' }
  ];

  const firmwareStack = [
    { name: 'Embedded C/C++', role: 'Low-latency bare-metal firmware running on the ATmega328P / ESP32 edge MCU' },
    { name: 'Edge Processing', role: 'On-device digital filtering, rolling average buffers, and threshold gating' },
    { name: 'Serial / Wi-Fi Telemetry', role: 'Structured JSON telemetry packet stream at 2.5s intervals' },
    { name: 'Zero Cloud Dependency', role: 'Local buzzer and LED beacon activate instantly without internet connectivity' }
  ];

  return (
    <section id="specs" className="py-24 bg-navy-950/60 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <CircuitBoard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technical Architecture Specifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Prototype Hardware & Firmware Stack
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Our current prototype integrates physical laboratory-grade transducers operating on dedicated edge microcontrollers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Hardware list */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border-slate-800">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-mono text-cyan-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>PHYSICAL SENSOR TRANSDUCERS (HARDWARE)</span>
            </div>

            <div className="space-y-3">
              {hardwareList.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-navy-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <span className="font-bold text-white">{item.name}</span>
                  <span className="text-slate-400 text-[11px] sm:text-right">{item.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Firmware stack */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-mono text-teal-400 font-bold">
                <Layers className="w-4 h-4" />
                <span>EDGE FIRMWARE & PROCESSING PIPELINE</span>
              </div>

              <div className="space-y-3 pt-4">
                {firmwareStack.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800/80 space-y-1 text-xs font-mono">
                    <span className="font-bold text-cyan-300 block">{item.name}</span>
                    <span className="text-slate-400 leading-relaxed block text-[11px]">{item.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-cyan-500/20 text-xs font-mono text-slate-300">
              <span className="text-cyan-400 font-bold block mb-1">Total System Power Budget:</span>
              <span>Average 2.8W operating power draw — comfortably below standard E26 light socket thermal ratings.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
