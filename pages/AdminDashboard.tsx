
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, DollarSign, Video, AlertTriangle } from 'lucide-react';

interface AdminDashboardProps {
  currency?: string;
}

const data = [
  { name: 'Jan', sales: 4000, users: 2400 },
  { name: 'Feb', sales: 3000, users: 1398 },
  { name: 'Mar', sales: 2000, users: 9800 },
  { name: 'Apr', sales: 2780, users: 3908 },
  { name: 'May', sales: 1890, users: 4800 },
  { name: 'Jun', sales: 2390, users: 3800 },
  { name: 'Jul', sales: 3490, users: 4300 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currency = 'USD' }) => {
  
  const getSymbol = (c: string) => {
     if (c === 'NGN') return '₦';
     if (c === 'EUR') return '€';
     if (c === 'GBP') return '£';
     return '$';
  };

  const convert = (amount: number, c: string) => {
     // NGN Conversion: 1 USD = 1600 NGN. Remove decimals for cleanliness.
     if (c === 'NGN') return Math.round(amount * 1600).toLocaleString('en-NG');
     if (c === 'EUR') return (amount * 0.92).toLocaleString(undefined, { maximumFractionDigits: 2 });
     if (c === 'GBP') return (amount * 0.79).toLocaleString(undefined, { maximumFractionDigits: 2 });
     return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  const symbol = getSymbol(currency);
  const revenueValue = convert(45231, currency);

  const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-dark-card border border-white/5 p-6 rounded-2xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-dark-muted text-sm font-medium uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-green-400 font-medium">+12.5%</span>
        <span className="text-dark-muted">from last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 text-xs font-bold border border-brand-500/30">
               CURRENCY: {currency}
            </span>
        </div>
        <p className="text-dark-muted">Platform overview and analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="124,592" icon={Users} color="bg-blue-500" />
        <StatCard title="Revenue" value={`${symbol}${revenueValue}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Video Scans" value="1.2M" icon={Video} color="bg-brand-500" />
        <StatCard title="Flagged Content" value="34" icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark-card border border-white/5 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Growth ({currency})</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: any) => [`${symbol}${convert(value, currency)}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="sales" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-card border border-white/5 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">User Activity</h3>
           <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                   cursor={{fill: '#334155', opacity: 0.4}}
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Bar dataKey="users" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Table */}
      <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Recent Uploads to Review</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 text-gray-200 uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Content Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {[1, 2, 3, 4].map((i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">User_{100 + i}</td>
                            <td className="px-6 py-4">Short Reel</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs">Pending</span></td>
                            <td className="px-6 py-4">Oct 24, 2023</td>
                            <td className="px-6 py-4">
                                <button className="text-brand-400 hover:text-brand-300 font-medium">Review</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
