import React, { useState, useEffect } from 'react';
import { Sparkles, Radio, Menu, X, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { useVitalLume } from '../context/VitalLumeContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSimulatingEmergency, apiStatus } = useVitalLume();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Sensors', href: '#sensors' },
    { name: 'Live Dashboard', href: '#dashboard' },
    { name: 'Safety', href: '#safety' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-navy-950/85 backdrop-blur-xl border-b border-cyan-500/20 py-3 shadow-lg shadow-black/40' 
        : 'bg-transparent py-5'
    }`}>
      {isSimulatingEmergency && (
        <div className="bg-red-500 text-white text-xs font-mono font-bold py-1 px-4 text-center tracking-wider flex items-center justify-center gap-2 animate-pulse">
          <ShieldAlert className="w-4 h-4" />
          <span>⚠ SIMULATION ACTIVE: EMERGENCY CONDITION DISPATCHED TO CAREGIVER PORTAL</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-navy-950 shadow-glow-cyan group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
                Vital<span className="text-cyan-400">Lume</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-300 -mt-1 tracking-wider uppercase">
                {isSimulatingEmergency ? 'ALERT' : 'VitalLume'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* API Status Pill & Action */}
          <div className="hidden md:flex items-center gap-3">
            <div className={`px-2.5 py-1 rounded-full text-xs font-mono border flex items-center gap-1.5 ${
              apiStatus === 'connected'
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              {apiStatus === 'connected' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                  <span>API Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span>Demo Mode</span>
                </>
              )}
            </div>

            <a
              href="#dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-navy-950 font-bold text-xs font-mono shadow-glow-cyan hover:from-cyan-300 hover:to-teal-300 transition-all hover:scale-105"
            >
              Explore VitalLume
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-300 hover:text-cyan-400 py-1"
            >
              {item.name}
            </a>
          ))}
          <a
            href="#dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-navy-950 font-bold text-xs font-mono shadow-glow-cyan"
          >
            Explore VitalLume
          </a>
        </div>
      )}
    </header>
  );
}
