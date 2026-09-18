import React, { useState } from 'react';
import { Sparkles, Search, Radio, Activity, Volume2, Zap, Flame, Sun, Wind, Cpu, Layers, X } from 'lucide-react';

const sensors = [{
id:1,name:"HC-SR501 PIR Motion Sensor",shortName:"HC-SR501 PIR",category:"motion",purpose:"Detects human movement and room-level presence through infrared body heat radiation.",role:"Primary macro-motion detection",specs:"Operating Voltage: 4.5V–20V | Detection Range: Up to 7 meters (120° cone) | Delay Time: 0.3s–200s adjustable",interface:"Digital GPIO Out (High/Low)",featured:!0,highlight:"Passive infrared sensing allows ultra-low power continuous presence verification without emitting radiation or capturing visual images.",badge:"Presence"}
,{
id:2,name:"LM393 Sound Sensor Module",shortName:"LM393 Sound Sensor",category:"acoustic",purpose:"Detects sudden, high-amplitude acoustic shockwaves, impact sounds, or loud distress events.",role:"Threshold-triggered acoustic monitor",specs:"Operating Voltage: 3.3V–5V | Comparator: LM393 Dual Differential | Sensitivity: On-board potentiometer",interface:"Digital Output (DO)",featured:!1,highlight:"Triggers instant interrupts when acoustic amplitude exceeds adjustable ambient thresholds, acting as an instant sound tripwire.",badge:"Impact Noise"}
,{
id:3,name:"ZMPT101B AC Voltage Sensor",shortName:"ZMPT101B Voltage",category:"electrical",purpose:"Monitors domestic AC mains voltage and detects electrical anomalies, brownouts, or overvoltage in the light socket circuit.",role:"Mains grid & socket health",specs:"Voltage Range: Up to 250V AC | Transformer Ratio: 2mA:2mA | Accuracy: Class 0.2",interface:"Analog Output (ADC)",featured:!0,highlight:"High-precision micro voltage transformer that safely isolates high-voltage AC mains to provide real-time socket safety metrics.",badge:"Mains AC"}
,{
id:4,name:"ACS712 30A Current Sensor",shortName:"ACS712 Current",category:"electrical",purpose:"Measures electrical current drawn through the socket to detect circuit overloads, power surges, or abnormal appliance loads.",role:"Current draw & load detection",specs:"Measurement Range: -30A to +30A | Scale Factor: 66 mV/A | Isolation: 2.1 kVRMS dielectric",interface:"Analog Output (Hall Effect)",featured:!1,highlight:"Based on Hall effect technology, allowing non-invasive continuous current monitoring without interrupting socket operation.",badge:"30A Hall"}
,{
id:5,name:"BME680 Environmental Sensor",shortName:"BME680 4-in-1",category:"environment",purpose:"Measures ambient temperature, barometric pressure, relative humidity, and provides comprehensive indoor climate sensing.",role:"Multi-parametric environmental monitor",specs:"Temp: -40 to +85°C (±1.0°C) | Humidity: 0–100% (±3%) | Pressure: 300–1100 hPa (±0.6 hPa)",interface:"I2C / SPI Communication",featured:!0,highlight:"Industrial-grade Bosch MEMS sensor integrating 4 physical climate parameters into a miniature footprint for hyper-accurate comfort and hazard tracking.",badge:"Temp/Hum/Press"}
,{
id:6,name:"LDR Sensor Module",shortName:"LDR Light Sensor",category:"environment",purpose:"Detects ambient light levels to determine room illumination, day/night cycles, and circadian light patterns.",role:"Ambient illuminance tracker",specs:"Operating Voltage: 3.3V–5V | Photosensitive Resistor: Cadmium Sulfide (CdS) | Dual Output: DO & AO",interface:"Analog & Digital GPIO",featured:!1,highlight:"Allows the system to contextualize resident activity against day/night cycles and identify whether room lights were left on or off during anomalous periods.",badge:"Illuminance"}
,{
id:7,name:"Arduino Uno R3",shortName:"Arduino Uno R3",category:"microcontroller",purpose:"Main prototype microcontroller for multiplexing, sampling, signal conditioning, and processing multi-sensor telemetry.",role:"Central edge microcontroller",specs:"Processor: ATmega328P @ 16 MHz | Flash: 32 KB | SRAM: 2 KB | 14 Digital I/O (6 PWM) | 6 Analog Inputs",interface:"USB UART / SPI / I2C / GPIO",featured:!0,highlight:"Executes embedded C/C++ firmware, handles analog-to-digital conversions, schedules synchronous sensor polling, and drives serial telemetry frames.",badge:"Edge Brain"}
,{
id:8,name:"HLK-LD2420 24GHz Human Motion Radar",shortName:"HLK-LD2420 Radar",category:"motion",purpose:"Contactless millimeter-wave human micro-motion and presence radar capable of sensing subtle movements and stationary presence.",role:"Precision micro-motion & immobility detection",specs:"Frequency: 24.000–24.250 GHz ISM band | Range: 0.2m–8m | Distance Resolution: 0.75m per gate",interface:"UART (Serial) & GPIO Out",featured:!0,highlight:"Penetrates non-metallic lamp shades and enclosures. Detects micro-movements even when a person is resting or motionless, making it the core fall-detection pillar.",badge:"24GHz mmWave"}
,{
id:9,name:"Analog Sound Sensor / Microphone Module",shortName:"Analog Microphone Module",category:"acoustic",purpose:"Captures dynamic acoustic waveform energy to detect impact noises, thuds, shattering, or vocal distress patterns.",role:"Continuous acoustic amplitude sensing",specs:"Operating Voltage: 3.3V–5V | Transducer: Electret Condenser Microphone | High-gain Pre-amplifier",interface:"Analog Output (AO) & Digital Out",featured:!1,highlight:"Measures continuous sound pressure variations without storing or transmitting conversational audio, strictly preserving resident speech privacy.",badge:"Sound Energy"}
,{
id:10,name:"MQ-9 Gas Sensor",shortName:"MQ-9 CO & Combustible Gas",category:"environment",purpose:"Detects Carbon Monoxide (CO), Methane (CH4), and Liquefied Petroleum Gas (LPG) combustible hazards.",role:"Toxic gas and combustible leak detection",specs:"Target Gas: CO (10–1000 ppm), LPG/CH4 (100–10000 ppm) | Heating: High/Low cycle 5.0V / 1.5V",interface:"Analog Output & Digital Threshold",featured:!0,highlight:"Features a dual-temperature cyclic heating cycle allowing sensitive selective discrimination of deadly odorless carbon monoxide and combustible leaks.",badge:"CO / Gas Hazard"}
,{
id:11,name:"Breadboard",shortName:"Prototype Breadboard",category:"microcontroller",purpose:"Provides solderless matrix breadboard for rapid electrical prototyping and signal bus distribution.",role:"Hardware testbed & bus distribution",specs:"830 Tie-Points | Dual Power Distribution Rails | Standard 2.54mm (0.1 in) pitch",interface:"Conductive Spring Clips",featured:!1,highlight:"Houses the analog front-end, pull-up resistors, voltage dividers, and common power/ground bus rails during prototype validation.",badge:"Prototyping"}
,{
id:12,name:"Male-to-Male Jumper Wires",shortName:"M-to-M Jumper Wires",category:"microcontroller",purpose:"Interconnects common breadboard bus tie-points and distributed power distribution channels.",role:"Internal circuit jumpering",specs:"Length: 20cm / 10cm | 26 AWG Copper Core | High-durability DuPont connectors",interface:"2.54mm Pin-to-Pin",featured:!1,highlight:"Ensures low-resistance electrical connectivity across breadboard power rails and sensor signal pathways.",badge:"Wiring"}
,{
id:13,name:"Male-to-Female Jumper Wires",shortName:"M-to-F Jumper Wires",category:"microcontroller",purpose:"Bridges Arduino Uno header sockets directly to modular breakout board pin headers.",role:"Board-to-sensor interfacing",specs:"Length: 20cm | Flexible ribbon configuration | Gold-plated contact points",interface:"Pin-to-Socket DuPont",featured:!1,highlight:"Connects modular breakout sensors (such as BME680 and MQ-9) directly into the Arduino Uno headers.",badge:"Wiring"}
,{
id:14,name:"Female-to-Female Jumper Wires",shortName:"F-to-F Jumper Wires",category:"microcontroller",purpose:"Connects male header breakout pins between sensor breakout boards and peripheral adapters.",role:"Component-to-component bridging",specs:"Length: 20cm | Insulated PVC jacket | Standard 0.1 inch mating",interface:"Socket-to-Socket DuPont",featured:!1,highlight:"Provides modular header-to-header connections for the radar module and UART breakout accessories.",badge:"Wiring"}
,{
id:15,name:"GP2Y1010AU0F PM2.5 Dust/Smoke Particle Sensor",shortName:"GP2Y1010AU0F PM2.5",category:"environment",purpose:"Detects fine particulate matter (PM2.5), airborne dust, smoke, and aerosolized particulate pollution.",role:"Indoor air quality & smoke detection",specs:"Operating Voltage: 5V–7V | Current: 20mA max | Sensitivity: 0.5V per 0.1mg/m³ | Optical infrared diode",interface:"Analog Voltage Output",featured:!0,highlight:"Uses optical infrared light scattering through an internal airflow channel to quantify fine airborne particulate density in real time.",badge:"PM2.5 / Smoke"}
];

export default function SensorEcosystem() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSensor, setSelectedSensor] = useState(null);

  const categories = [
    { id: 'all', label: 'All Sensors' },
    { id: 'motion', label: 'Motion & Radar' },
    { id: 'environment', label: 'Environment' },
    { id: 'acoustic', label: 'Acoustic' },
    { id: 'electrical', label: 'Electrical Mains' },
    { id: 'microcontroller', label: 'Microcontroller' },
  ];

  const filteredSensors = sensors.filter(s => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(term) || 
                          (s.purpose && s.purpose.toLowerCase().includes(term)) ||
                          (s.role && s.role.toLowerCase().includes(term));
    return matchesCat && matchesSearch;
  });

  return (
    <section id="sensors" className="py-24 bg-navy-950/60 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Actual Laboratory Prototype Hardware</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The VitalLume Sensor Ecosystem
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Every physical sensor transducer embedded within our overhead research prototype fixture, engineered to corroborate safety events without cameras.
          </p>
        </div>

        {/* Category Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeCategory === c.id
                    ? 'bg-cyan-500 text-navy-950 font-bold shadow-glow-cyan'
                    : 'bg-navy-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sensors..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-navy-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSensors.map(sensor => (
            <div
              key={sensor.id}
              onClick={() => setSelectedSensor(sensor)}
              className="glass-panel glass-card-hover rounded-2xl p-6 cursor-pointer space-y-4 relative border-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {sensor.category}
                </span>
                <span className="text-xs font-mono text-slate-500">#0{sensor.id}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {sensor.name}
                </h3>
                <p className="text-xs text-teal-400 font-mono mt-1">{sensor.role}</p>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                {sensor.purpose}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-slate-800/80 text-slate-500">
                <span>View Full Specs</span>
                <span className="text-cyan-400">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sensor Detail Modal */}
        {selectedSensor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="bg-navy-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Hardware Specification</span>
                <button
                  onClick={() => setSelectedSensor(null)}
                  className="p-1 rounded-lg bg-navy-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">{selectedSensor.name}</h3>
                <p className="text-sm text-teal-400 font-mono mt-1">{selectedSensor.role}</p>
              </div>

              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase block">Functional Purpose</span>
                  <p>{selectedSensor.purpose}</p>
                </div>

                {selectedSensor.specs && (
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 text-xs font-mono text-slate-300">
                    <span className="text-slate-500 uppercase block mb-1">Electrical & Spatial Specs</span>
                    <p>{selectedSensor.specs}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedSensor(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-navy-950 font-bold text-xs font-mono shadow-glow-cyan"
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
