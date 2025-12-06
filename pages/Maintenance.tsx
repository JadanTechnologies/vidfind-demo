import React from 'react';
import { Hammer, Wrench, RefreshCw, ArrowLeft } from 'lucide-react';

interface MaintenanceProps {
  onLogin: () => void; // Allow admins to login to bypass
}

const Maintenance: React.FC<MaintenanceProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Animations */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="z-10 text-center max-w-2xl mx-auto space-y-8 animate-fade-in-up">
        
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-24 h-24 bg-[#1e293b] rounded-2xl border border-white/10 flex items-center justify-center mx-auto shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <Wrench size={48} className="text-brand-500 animate-spin-slow" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#1e293b] rounded-xl border border-white/10 flex items-center justify-center shadow-xl transform -rotate-12">
                <Hammer size={32} className="text-purple-500" />
            </div>
        </div>

        <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-purple-400">
                System Upgrade
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
                VidFind+ is currently undergoing scheduled maintenance to bring you better AI features. 
                <br className="hidden md:block"/> We will be back online shortly.
            </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10">
                <RefreshCw size={18} className="animate-spin" />
                <span className="text-sm font-mono text-gray-300">Estimated downtime: 45 mins</span>
            </div>
        </div>

        <div className="pt-12 border-t border-white/5 w-full">
            <button 
                onClick={onLogin}
                className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
            >
                Are you an Admin? <ArrowLeft size={14} className="rotate-180" />
            </button>
        </div>

      </div>
    </div>
  );
};

export default Maintenance;