import React, { useState } from 'react';
import * as R from 'react';
import * as l from 'react/jsx-runtime';

import {
  Activity,
  Cpu,
  GitMerge,
  ShieldAlert,
  Bell,
  BellRing,
  Rocket,
  ArrowRight,
  Radio,
  Volume2,
  Flame,
  Wind,
  Sliders,
  Sparkles,
  Check
} from 'lucide-react';
const pipelineStages = [{
step:1,id:"sense",title:"SENSE",subtitle:"Continuous Multi-Modal Ambient Collection",description:"Sensors continuously collect movement, acoustic, environmental, gas, and air-quality data directly from the overhead light socket.",details:["24GHz radar and PIR scan spatial volume for human presence and speed gradients.","Acoustic sensors continuously monitor frequency signatures and shock thresholds.","BME680, GP2Y1010AU0F, and MQ-9 continuously sample temperature, humidity, PM2.5, and gas particulates.","Electrical sensors track domestic socket voltage integrity and current draw."],technicalMetrics:"Sampling Rate: 20–50 Hz (Sensors) | Non-invasive Ambient Sensing | 0 Cameras",iconName:"Activity"}
,{
step:2,id:"process",title:"PROCESS",subtitle:"Edge Processing & Signal Conditioning",description:"The edge microcontroller processes sensor data locally without transmitting raw analog or audio streams.",details:["Analog-to-digital conversion and moving-average digital filtering remove mechanical and transient noise.","Acoustic signals are decomposed into energy envelopes without recording intelligible audio.","Radar Doppler waveforms are parsed into range gates and micro-motion vectors.","Low latency ensures sub-second edge evaluation without cloud dependency."],technicalMetrics:"Latency: <80ms | Local ATmega328P Filtering | Pure Numerical Vectors",iconName:"Cpu"}
,{
step:3,id:"cross-check",title:"CROSS-CHECK",subtitle:"Multi-Sensor Corroboration",description:"Multiple disparate sensors are cross-correlated in real time to virtually eliminate false alarms.",details:["An isolated acoustic spike (e.g. dropping a book) is checked against radar motion—if motion resumes normally, no alarm fires.","A sudden drop in height or fast velocity profile from the radar is correlated against acoustic impact signatures.","Thermal readings are cross-verified with barometric pressure and gas levels to distinguish kitchen cooking from actual fire/gas hazards.","Eliminates the high false-alarm rates that plague single-modality sensors."],technicalMetrics:"False Positive Reduction: >92% | Multi-Vector Temporal Windows | Cross-Entropy Gating",iconName:"GitMerge"}
,{
step:4,id:"classify",title:"CLASSIFY",subtitle:"Contextual Anomaly Categorization",description:"The system classifies situations as normal activity, abnormal activity, environmental hazard, or possible emergency.",details:["Normal Activity: Routine movement, sedentary rest, day/night sleep cycles.","Abnormal Activity: Prolonged bathroom immobility, erratic pacing, circadian disruption.","Environmental Hazard: Spike in PM2.5 air pollution, dangerous CO concentration, extreme heat/freezing.","Possible Emergency: Sudden rapid descent followed by prolonged silence and immobility."],technicalMetrics:"4 Distinct Operational States | Confidence Scoring (0–100%) | Multi-Tier Hazard Classification",iconName:"Sliders"}
,{
step:5,id:"alert",title:"ALERT",subtitle:"Deterministic Multi-Channel Escalation",description:"Confirmed events generate instant prioritized alerts for the caregiver, local hub, or emergency contact.",details:["Local socket audio/light chime can softly ask the resident for confirmation or verbal dismissal.","High-priority alerts sent to the caregiver dashboard with verified sensor indicators and exact timestamps.","Audible chime and visual cue at the local hub for on-premise attendants.","Configurable escalation tiers: Push notification ➔ SMS ➔ Automated phone call."],technicalMetrics:"Dispatch Latency: <1.5s | Cryptographically Signed Packets | Multi-Channel Webhook & Push",iconName:"BellRing"}
,{
step:6,id:"learn",title:"LEARN",subtitle:"Personalized Ambient Baselines",description:"The system builds a privacy-first baseline of normal daily activity patterns to progressively sharpen anomaly detection.",details:["Discovers routine waking, sleeping, meal preparation, and bathroom dwell times without manual configuration.","Adapts sensitivity according to room type (e.g. bedroom vs. living room vs. kitchen).","Flags subtle long-term behavioral trends (such as declining mobility or increased nocturnal wandering).","All baseline models remain stored locally or on the designated home hub, preserving resident sovereignty."],technicalMetrics:"Continuous Adaptive Profiling | Zero Facial Data | Autonomous Threshold Tuning",iconName:"Sparkles"}
],di={
Activity:Activity,
Cpu:Cpu,
GitMerge:GitMerge,
Sliders:Sliders,
BellRing:BellRing,
Sparkles:Sparkles
};

const pt = Activity;
const ht = Cpu;
const Pu = GitMerge;
const Tf = Sliders;
const Cm = BellRing;
const Sl = Sparkles;
const Cu = Check;
const Ga = ArrowRight;
const kn = pipelineStages;
function ip(){
const[e,t]=R.useState(0),n=kn[e],r=di[n.iconName]||pt;
return l.jsxs("section",{
id:"how-it-works",className:"py-24 relative overflow-hidden",children:[l.jsx("div",{
className:"absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"}
),l.jsxs("div",{
className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[l.jsxs("div",{
className:"text-center max-w-3xl mx-auto space-y-4 mb-16",children:[l.jsx("div",{
className:"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono",children:l.jsx("span",{
children:"6-Stage Autonomous Pipeline"}
)}
),l.jsx("h2",{
className:"text-3xl sm:text-4xl font-extrabold text-white tracking-tight",children:"How VitalLume Works"}
),l.jsx("p",{
className:"text-slate-300 text-base sm:text-lg leading-relaxed",children:"From overhead photon and acoustic waves to intelligent caregiver dispatch — completely local, autonomous, and camera-free."}
)]}
),l.jsx("div",{
className:"mb-12",children:l.jsxs("div",{
className:"relative flex items-center justify-between overflow-x-auto pb-4 pt-2 no-scrollbar",children:[l.jsx("div",{
className:"absolute top-6 left-6 right-6 h-0.5 bg-slate-800 -z-0"}
),l.jsx("div",{
className:"absolute top-6 left-6 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-500 -z-0",style:{
width:`${
e/(kn.length-1)*92}
%`}
}
),kn.map((s,a)=>{
const o=di[s.iconName]||pt,i=a===e,c=a<e;
return l.jsxs("button",{
onClick:()=>t(a),className:"flex flex-col items-center group relative z-10 px-2 sm:px-4 focus:outline-none flex-shrink-0",children:[l.jsx("div",{
className:`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
i?"bg-gradient-to-br from-cyan-400 to-teal-500 text-navy-950 font-bold shadow-glow-cyan scale-110":c?"bg-navy-800 text-teal-400 border border-teal-500/40":"bg-navy-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"}
`,children:l.jsx(o,{
className:"w-5 h-5"}
)}
),l.jsxs("span",{
className:`mt-3 text-xs font-mono font-semibold tracking-wider transition-colors ${
i?"text-cyan-300":"text-slate-400 group-hover:text-slate-300"}
`,children:[s.step,". ",s.title]}
)]}
,s.id)}
)]}
)}
),l.jsx("div",{
className:"glass-panel-glow rounded-3xl p-8 sm:p-10 transition-all duration-500",children:l.jsxs("div",{
className:"grid grid-cols-1 lg:grid-cols-12 gap-8 items-center",children:[l.jsxs("div",{
className:"lg:col-span-7 space-y-6",children:[l.jsxs("div",{
className:"flex items-center gap-3",children:[l.jsxs("span",{
className:"w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-mono font-bold text-sm",children:["0",n.step]}
),l.jsxs("div",{
children:[l.jsxs("h3",{
className:"text-2xl sm:text-3xl font-extrabold text-white tracking-tight",children:[n.title,": ",n.subtitle]}
),l.jsx("p",{
className:"text-xs font-mono text-teal-300 mt-0.5",children:"Pipeline Execution Phase"}
)]}
)]}
),l.jsx("p",{
className:"text-slate-200 text-base sm:text-lg leading-relaxed font-normal",children:n.description}
),l.jsx("div",{
className:"space-y-3 pt-2",children:n.details.map((s,a)=>l.jsxs("div",{
className:"flex items-start gap-3 text-sm text-slate-300",children:[l.jsx("div",{
className:"w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5",children:l.jsx(Cu,{
className:"w-3 h-3"}
)}
),l.jsx("span",{
children:s}
)]}
,a))}
),l.jsxs("div",{
className:"pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4",children:[l.jsx("div",{
className:"text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3.5 py-2 rounded-xl border border-cyan-500/30",children:n.technicalMetrics}
),l.jsxs("div",{
className:"flex items-center gap-2",children:[l.jsx("button",{
disabled:e===0,onClick:()=>t(s=>Math.max(0,s-1)),className:"px-3 py-1.5 rounded-lg bg-navy-800 text-xs font-mono text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700",children:"Previous"}
),l.jsxs("button",{
disabled:e===kn.length-1,onClick:()=>t(s=>Math.min(kn.length-1,s+1)),className:"px-3 py-1.5 rounded-lg bg-cyan-500/20 text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed border border-cyan-500/40 flex items-center gap-1",children:[l.jsx("span",{
children:"Next Stage"}
),l.jsx(Ga,{
className:"w-3.5 h-3.5"}
)]}
)]}
)]}
)]}
),l.jsx("div",{
className:"lg:col-span-5 flex justify-center",children:l.jsxs("div",{
className:"w-full max-w-sm rounded-2xl bg-navy-900/90 border border-cyan-500/30 p-6 space-y-6 shadow-2xl relative overflow-hidden",children:[l.jsxs("div",{
className:"flex items-center justify-between border-b border-slate-800 pb-4",children:[l.jsx("span",{
className:"text-xs font-mono text-slate-400 uppercase",children:"Process Architecture"}
),l.jsxs("span",{
className:"text-xs font-mono text-cyan-400 font-semibold",children:["STAGE ",n.step,"/6"]}
)]}
),l.jsxs("div",{
className:"py-6 flex flex-col items-center justify-center text-center space-y-4",children:[l.jsx("div",{
className:"w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-2 border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-glow-cyan",children:l.jsx(r,{
className:"w-10 h-10 animate-pulse"}
)}
),l.jsxs("div",{
children:[l.jsx("h4",{
className:"text-xl font-bold text-white",children:n.title}
),l.jsxs("p",{
className:"text-xs text-slate-400 font-mono mt-1",children:[n.id.toUpperCase(),"_ENGINE_V1"]}
)]}
)]}
),l.jsxs("div",{
className:"bg-navy-950/80 rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1",children:[l.jsxs("div",{
className:"flex justify-between",children:[l.jsx("span",{
children:"Target Latency:"}
),l.jsx("span",{
className:"text-cyan-300",children:"Sub-100ms"}
)]}
),l.jsxs("div",{
className:"flex justify-between",children:[l.jsx("span",{
children:"Privacy Mode:"}
),l.jsx("span",{
className:"text-teal-300",children:"Zero Vision Buffer"}
)]}
),l.jsxs("div",{
className:"flex justify-between",children:[l.jsx("span",{
children:"Verification:"}
),l.jsx("span",{
className:"text-slate-200",children:"Continuous Loop"}
)]}
)]}
)]}
)}
)]}
)}
)]}
)]}
)}
const cp=[{
id:"all",label:"All Components (15)"}
,{
id:"motion",label:"Motion & Presence"}
,{
id:"acoustic",label:"Acoustic Sensing"}
,{
id:"environment",label:"Air & Environment"}
,{
id:"electrical",label:"Electrical Safety"}
,{
id:"microcontroller",label:"Circuit & Controller"}
],up=[{
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

const iconMap = {
  sense: Radio,
  process: Cpu,
  corroborate: GitMerge,
  classify: ShieldAlert,
  alert: Bell,
  dispatch: Rocket
};

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const currentStage = pipelineStages[activeStep];
  const CurrentIcon = iconMap[currentStage.id] || Activity;

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono">
            <span>6-Stage Autonomous Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How VitalLume Works
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            From overhead photon and acoustic waves to intelligent caregiver dispatch — completely local, autonomous, and camera-free.
          </p>
        </div>

        {/* Interactive Stage Progress Bar */}
        <div className="mb-12">
          <div className="relative flex items-center justify-between overflow-x-auto pb-4 pt-2 no-scrollbar">
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-800 -z-0" />
            <div 
              className="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-500 -z-0"
              style={{ width: `${(activeStep / (pipelineStages.length - 1)) * 92}%` }}
            />

            {pipelineStages.map((stage, idx) => {
              const Icon = iconMap[stage.id] || Activity;
              const isActive = activeStep === idx;
              const isDone = activeStep > idx;

              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStep(idx)}
                  className="flex flex-col items-center gap-2 relative z-10 group min-w-[70px]"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-gradient-to-br from-cyan-400 to-teal-500 text-navy-950 font-bold shadow-glow-cyan scale-110' 
                      : isDone 
                      ? 'bg-teal-500 text-navy-950 font-bold' 
                      : 'bg-navy-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-mono transition-colors ${
                    isActive ? 'text-cyan-300 font-bold' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    0{stage.step} {stage.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detail Panel */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  STAGE 0{currentStage.step} OF 06
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentStage.subtitle}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {currentStage.title}: {currentStage.description}
              </h3>

              <div className="space-y-3 pt-2">
                {currentStage.details && currentStage.details.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  disabled={activeStep === pipelineStages.length - 1}
                  onClick={() => setActiveStep(prev => Math.min(pipelineStages.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-navy-950 font-bold text-xs font-mono flex items-center gap-2 shadow-glow-cyan disabled:opacity-40"
                >
                  <span>Next Pipeline Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-navy-950/80 rounded-2xl p-6 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-cyan-400 font-bold">STAGE TELEMETRY SPEC</span>
                <span className="text-slate-500">Node ATmega328P</span>
              </div>

              <div className="space-y-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[11px]">Primary Transducer</span>
                  <span className="text-white font-semibold">{currentStage.sensorUsed || 'Multi-Sensor Array'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Technical Metrics</span>
                  <span className="text-teal-300 font-semibold">{currentStage.technicalMetrics || 'Sampling Rate: 20–50 Hz | 0 Cameras'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">False Alarm Reduction</span>
                  <span className="text-slate-200">Cross-entropy gating eliminates single-sensor error rates by &gt;92%.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
