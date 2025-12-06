import React, { useState } from 'react';
import { Server, Activity, Database, Shield, Power, Key, RefreshCw, Cpu, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface SuperAdminProps {
    isMaintenanceMode: boolean;
    setMaintenanceMode: (v: boolean) => void;
}

const mockSystemData = [
  { time: '00:00', load: 24, api: 120 },
  { time: '04:00', load: 18, api: 80 },
  { time: '08:00', load: 45, api: 450 },
  { time: '12:00', load: 85, api: 1200 },
  { time: '16:00', load: 70, api: 980 },
  { time: '20:00', load: 50, api: 600 },
  { time: '24:00', load: 30, api: 200 },
];

const SuperAdminDashboard: React.FC<SuperAdminProps> = ({ isMaintenanceMode, setMaintenanceMode }) => {
  const [serverStatus, setServerStatus] = useState<'online' | 'restarting' | 'maintenance'>('online');

  const handleRestart = () => {
    setServerStatus('restarting');
    setTimeout(() => setServerStatus('online'), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Control Center</h1>
          <p className="text-dark-muted">Master control for VidFind+ Infrastructure.</p>
        </div>
        <div className="flex gap-3">
             <button className={`px-4 py-2 border rounded-lg font-medium text-sm flex items-center gap-2 ${isMaintenanceMode ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-green-500/10 border-green-500/50 text-green-500'}`}>
                {isMaintenanceMode ? <Wrench size={16} /> : <Activity size={16} />} 
                {isMaintenanceMode ? 'MAINTENANCE MODE' : 'System Healthy'}
             </button>
        </div>
      </div>

      {/* Emergency / Maintenance Control */}
      <div className={`p-6 rounded-2xl border transition-all ${isMaintenanceMode ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-dark-card border-white/5'}`}>
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isMaintenanceMode ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-gray-400'}`}>
                      <Wrench size={24} />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-white">Maintenance Mode</h3>
                      <p className="text-sm text-gray-400">
                          {isMaintenanceMode 
                            ? "Platform is locked. Only Admins can access. Users see a maintenance page." 
                            : "Platform is live and accessible to all users."}
                      </p>
                  </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isMaintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                  />
                  <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
          </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-dark-card border border-white/5 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Server size={64} />
             </div>
             <p className="text-sm font-medium text-red-400 uppercase tracking-wider mb-1">Server Load</p>
             <h3 className="text-3xl font-bold text-white">42%</h3>
             <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-red-500 w-[42%]"></div>
             </div>
         </div>

         <div className="bg-dark-card border border-white/5 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Database size={64} />
             </div>
             <p className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-1">Database Size</p>
             <h3 className="text-3xl font-bold text-white">2.4 TB</h3>
             <p className="text-xs text-dark-muted mt-2">+120GB this week</p>
         </div>

         <div className="bg-dark-card border border-white/5 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Cpu size={64} />
             </div>
             <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-1">AI Instances</p>
             <h3 className="text-3xl font-bold text-white">12 / 20</h3>
             <p className="text-xs text-dark-muted mt-2">Auto-scaling active</p>
         </div>

         <div className="bg-dark-card border border-white/5 p-6 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Key size={64} />
             </div>
             <p className="text-sm font-medium text-yellow-400 uppercase tracking-wider mb-1">API Requests</p>
             <h3 className="text-3xl font-bold text-white">1.2M</h3>
             <p className="text-xs text-dark-muted mt-2">Last 24 hours</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live Performance Chart */}
         <div className="lg:col-span-2 bg-dark-card border border-white/5 p-6 rounded-2xl">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <Activity size={20} className="text-red-500" /> Real-time System Load
             </h3>
             <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockSystemData}>
                        <defs>
                            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#475569" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        />
                        <Area type="monotone" dataKey="load" stroke="#ef4444" strokeWidth={2} fill="url(#colorLoad)" />
                        <Area type="monotone" dataKey="api" stroke="#3b82f6" strokeWidth={2} fill="transparent" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
         </div>

         {/* Quick Actions */}
         <div className="bg-dark-card border border-white/5 p-6 rounded-2xl">
             <h3 className="text-lg font-bold text-white mb-6">Critical Actions</h3>
             <div className="space-y-4">
                 <button 
                   onClick={handleRestart}
                   className="w-full p-4 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-xl flex items-center justify-between group transition-all"
                 >
                     <div className="flex items-center gap-3">
                         <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:text-red-400">
                             <Power size={20} />
                         </div>
                         <div className="text-left">
                             <div className="text-sm font-bold text-white">Restart Services</div>
                             <div className="text-xs text-dark-muted">{serverStatus === 'restarting' ? 'Processing...' : 'Zero downtime restart'}</div>
                         </div>
                     </div>
                 </button>

                 <button className="w-full p-4 bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/50 rounded-xl flex items-center justify-between group transition-all">
                     <div className="flex items-center gap-3">
                         <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 group-hover:text-yellow-400">
                             <RefreshCw size={20} />
                         </div>
                         <div className="text-left">
                             <div className="text-sm font-bold text-white">Flush Cache</div>
                             <div className="text-xs text-dark-muted">Redis & CDN Clear</div>
                         </div>
                     </div>
                 </button>

                 <button className="w-full p-4 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-xl flex items-center justify-between group transition-all">
                     <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:text-blue-400">
                             <Key size={20} />
                         </div>
                         <div className="text-left">
                             <div className="text-sm font-bold text-white">Rotate API Keys</div>
                             <div className="text-xs text-dark-muted">Gemini & AWS Keys</div>
                         </div>
                     </div>
                 </button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;