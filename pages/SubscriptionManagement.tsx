
import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Calendar, ArrowUpRight } from 'lucide-react';
import { Subscription } from '../types';

interface SubMgmtProps {
    currency?: string;
}

const MOCK_SUBS: Subscription[] = [
  { id: 'sub_1', userId: '101', userName: 'John Doe', planId: 'premium', amount: '$9.99', status: 'active', startDate: '2023-10-01', nextBilling: '2023-11-01' },
  { id: 'sub_2', userId: '102', userName: 'Sarah Connor', planId: 'vip', amount: '$199.00', status: 'active', startDate: '2023-09-15', nextBilling: '2023-10-15' },
  { id: 'sub_3', userId: '103', userName: 'Kyle Reese', planId: 'premium', amount: '$9.99', status: 'cancelled', startDate: '2023-08-01', nextBilling: 'N/A' },
  { id: 'sub_4', userId: '104', userName: 'Ellen Ripley', planId: 'premium', amount: '$9.99', status: 'active', startDate: '2023-10-20', nextBilling: '2023-11-20' },
];

const SubscriptionManagement: React.FC<SubMgmtProps> = ({ currency = 'USD' }) => {
  
  const getSymbol = (c: string) => {
     if (c === 'NGN') return '₦';
     if (c === 'EUR') return '€';
     if (c === 'GBP') return '£';
     return '$';
  };

  const convert = (amountStr: string | number, c: string) => {
     let val = typeof amountStr === 'string' ? parseFloat(amountStr.replace(/[^0-9.]/g, '')) : amountStr;
     if (isNaN(val)) val = 0;

     if (c === 'NGN') return Math.round(val * 1600).toLocaleString('en-NG');
     if (c === 'EUR') return (val * 0.92).toLocaleString(undefined, { maximumFractionDigits: 2 });
     if (c === 'GBP') return (val * 0.79).toLocaleString(undefined, { maximumFractionDigits: 2 });
     return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  const symbol = getSymbol(currency);
  const mrrValue = convert(12450, currency);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Subscription & Revenue</h1>
        <p className="text-dark-muted">Track financial performance and recurring billing ({currency}).</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/20 rounded-2xl">
           <div className="flex items-start justify-between mb-4">
              <div>
                 <p className="text-green-400 text-sm font-bold uppercase tracking-wider">MRR</p>
                 <h3 className="text-3xl font-bold text-white mt-1">{symbol}{mrrValue}</h3>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                 <DollarSign size={24} />
              </div>
           </div>
           <p className="text-xs text-green-300 flex items-center gap-1">
             <TrendingUp size={14} /> +8.5% from last month
           </p>
        </div>

        <div className="p-6 bg-dark-card border border-white/5 rounded-2xl">
           <div className="flex items-start justify-between mb-4">
              <div>
                 <p className="text-blue-400 text-sm font-bold uppercase tracking-wider">Active Subs</p>
                 <h3 className="text-3xl font-bold text-white mt-1">842</h3>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                 <CreditCard size={24} />
              </div>
           </div>
           <p className="text-xs text-gray-400">
             24 new today
           </p>
        </div>

        <div className="p-6 bg-dark-card border border-white/5 rounded-2xl">
           <div className="flex items-start justify-between mb-4">
              <div>
                 <p className="text-purple-400 text-sm font-bold uppercase tracking-wider">Churn Rate</p>
                 <h3 className="text-3xl font-bold text-white mt-1">1.2%</h3>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                 <ArrowUpRight size={24} />
              </div>
           </div>
           <p className="text-xs text-gray-400">
             -0.4% improvement
           </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
           <h3 className="font-bold text-white text-lg">Recent Subscriptions</h3>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead className="bg-white/5 text-gray-400 font-medium">
               <tr>
                 <th className="px-6 py-4">Customer</th>
                 <th className="px-6 py-4">Plan</th>
                 <th className="px-6 py-4">Amount ({currency})</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Next Billing</th>
                 <th className="px-6 py-4 text-right">Invoice</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5 text-gray-300">
               {MOCK_SUBS.map(sub => (
                 <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                   <td className="px-6 py-4 font-medium text-white">{sub.userName}</td>
                   <td className="px-6 py-4 capitalize">{sub.planId}</td>
                   <td className="px-6 py-4 font-mono text-white">
                      {symbol}{convert(sub.amount, currency)}
                   </td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                       sub.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                     }`}>
                       {sub.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 flex items-center gap-2">
                     <Calendar size={14} className="text-gray-500" /> {sub.nextBilling}
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button className="text-brand-400 hover:text-brand-300 text-xs font-bold">Download</button>
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

export default SubscriptionManagement;
