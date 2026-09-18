import React from 'react';
import { GraduationCap, Award, Users, BookOpen } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-navy-950/80 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Academic Capstone Project</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About the Project & Team
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            VitalLume is developed by final-year engineering scholars at SKN Sinhgad College of Engineering, blending embedded systems, multi-sensor telemetrics, and privacy-preserving ambient design.
          </p>
        </div>

        <div className="glass-panel-glow rounded-3xl p-8 sm:p-10 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
            <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0 md:pr-4">
              <span className="text-xs font-mono text-cyan-400 flex items-center justify-center md:justify-start gap-1.5">
                <Award className="w-3.5 h-3.5" /> Project Title
              </span>
              <h3 className="text-xl font-extrabold text-white">VitalLume</h3>
              <p className="text-xs text-slate-400 font-mono">The Invisible Home Guardian</p>
            </div>

            <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0 md:pr-4">
              <span className="text-xs font-mono text-teal-400 flex items-center justify-center md:justify-start gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Institution
              </span>
              <h3 className="text-lg font-bold text-white">SKN Sinhgad COE</h3>
              <p className="text-xs text-slate-400 font-mono">Korti, Pandharpur</p>
            </div>

            <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-800/80 pb-4 md:pb-0 md:pr-4">
              <span className="text-xs font-mono text-emerald-400 flex items-center justify-center md:justify-start gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Discipline
              </span>
              <h3 className="text-lg font-bold text-white">B.E. Final Year</h3>
              <p className="text-xs text-slate-400 font-mono">IoT & Embedded Systems</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono text-amber-400 flex items-center justify-center md:justify-start gap-1.5">
                <Users className="w-3.5 h-3.5" /> Academic Year
              </span>
              <h3 className="text-lg font-bold text-white">2026 – 2027</h3>
              <p className="text-xs text-slate-400 font-mono">Engineering Capstone</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
