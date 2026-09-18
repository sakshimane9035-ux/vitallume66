import React from 'react';
import { Radio, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-navy-950">
                <Radio className="w-4 h-4 font-bold" />
              </div>
              <span className="text-xl font-extrabold text-white font-sans tracking-tight">
                Vital<span className="text-cyan-400">Lume</span>
              </span>
            </div>
            <p className="text-sm font-sans text-slate-300">
              “The Invisible Home Guardian That Lives in Your Light Socket.”
            </p>
            <p className="text-[11px] text-slate-500">
              No wearables. No cameras. Whole-home awareness.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#sensors" className="hover:text-cyan-400 transition-colors">Sensors</a>
            <a href="#dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</a>
            <a href="#privacy" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] text-slate-500">
          <p>
            © 2026–27 VitalLume Engineering Project. SKN Sinhgad College of Engineering, Korti, Pandharpur.
          </p>
          <p className="text-slate-600">
            VitalLume is strictly an ambient environmental safety and physical hazard detection research prototype. It does not provide medical diagnoses.
          </p>
        </div>
      </div>
    </footer>
  );
}
