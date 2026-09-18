import React from 'react';
import { VitalLumeProvider } from './context/VitalLumeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import HowItWorks from './components/HowItWorks';
import SensorEcosystem from './components/SensorEcosystem';
import Dashboard from './components/Dashboard';
import SensorFusionDemo from './components/SensorFusionDemo';
import Safety from './components/Safety';
import Privacy from './components/Privacy';
import MeshTopology from './components/MeshTopology';
import CaregiverPortal from './components/CaregiverPortal';
import UseCases from './components/UseCases';
import HardwareSpecs from './components/HardwareSpecs';
import FutureScope from './components/FutureScope';
import About from './components/About';
import Footer from './components/Footer';

export default function App() {
  return (
    <VitalLumeProvider>
      <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <ProblemSolution />
          <HowItWorks />
          <SensorEcosystem />
          <Dashboard />
          <SensorFusionDemo />
          <Safety />
          <Privacy />
          <MeshTopology />
          <CaregiverPortal />
          <UseCases />
          <HardwareSpecs />
          <FutureScope />
          <About />
        </main>
        <Footer />
      </div>
    </VitalLumeProvider>
  );
}
