
import React, { useState } from 'react';
import { Plus, BarChart2, DollarSign, PlayCircle, ImageIcon, Eye, MousePointer, MoreHorizontal } from 'lucide-react';
import { AdCampaign } from '../types';

interface AdManagerProps {
    currency?: string;
}

const MOCK_CAMPAIGNS: AdCampaign[] = [
    { id: '1', clientName: 'Coca Cola Summer', type: 'video_preroll', status: 'active', impressions: 45020, clicks: 1205, budget: '$5,000', spent: '$1,250', startDate: '2023-10-01', endDate: '2023-11-01' },
    { id: '2', clientName: 'Nike Jordan Drop', type: 'banner', status: 'paused', impressions: 12000, clicks: 450, budget: '$2,000', spent: '$800', startDate: '2023-09-15', endDate: '2023-10-15' },
    { id: '3', clientName: 'Samsung S24', type: 'interstitial', status: 'active', impressions: 89000, clicks: 3200, budget: '$10,000', spent: '$4,500', startDate: '2023-10-05', endDate: '2023-12-01' },
];

const AdManager: React.FC<AdManagerProps> = ({ currency = 'USD' }) => {
    const [campaigns, setCampaigns] = useState<AdCampaign[]>(MOCK_CAMPAIGNS);

    const getSymbol = (c: string) => {
        if (c === 'NGN') return '₦';
        if (c === 'EUR') return '€';
        if (c === 'GBP') return '£';
        return '$';
     };
   
     const convert = (amountStr: string, c: string) => {
        let val = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
        if (isNaN(val)) val = 0;
   
        if (c === 'NGN') return Math.round(val * 1600).toLocaleString('en-NG');
        if (c === 'EUR') return (val * 0.92).toLocaleString(undefined, { maximumFractionDigits: 0 });
        if (c === 'GBP') return (val * 0.79).toLocaleString(undefined, { maximumFractionDigits: 0 });
        return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
     }
   
     const symbol = getSymbol(currency);
     const totalRev = convert('$6550', currency);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Ad Monetization</h1>
                    <p className="text-dark-muted">Manage advertising campaigns and revenue ({currency}).</p>
                </div>
                <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-600/20">
                    <Plus size={20} /> Create Campaign
                </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-dark-card border border-white/5 p-6 rounded-2xl">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-white">{symbol}{totalRev}</h3>
                </div>
                <div className="bg-dark-card border border-white/5 p-6 rounded-2xl">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Active Campaigns</p>
                    <h3 className="text-2xl font-bold text-white">12</h3>
                </div>
                <div className="bg-dark-card border border-white/5 p-6 rounded-2xl">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Impressions</p>
                    <h3 className="text-2xl font-bold text-white">146k</h3>
                </div>
                <div className="bg-dark-card border border-white/5 p-6 rounded-2xl">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Avg CTR</p>
                    <h3 className="text-2xl font-bold text-white">2.4%</h3>
                </div>
            </div>

            {/* Campaigns Table */}
            <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white">Campaigns</h3>
                    <button className="text-sm text-brand-400 font-medium hover:text-brand-300">Download Report</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-300 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Client / Campaign</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Performance</th>
                                <th className="px-6 py-4 text-right">Budget ({currency})</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {campaigns.map(camp => (
                                <tr key={camp.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{camp.clientName}</div>
                                        <div className="text-xs text-gray-500">{camp.startDate} - {camp.endDate}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            {camp.type === 'video_preroll' && <PlayCircle size={16} className="text-blue-400" />}
                                            {camp.type === 'banner' && <ImageIcon size={16} className="text-purple-400" />}
                                            {camp.type === 'interstitial' && <BarChart2 size={16} className="text-orange-400" />}
                                            <span className="capitalize">{camp.type.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                            camp.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                            camp.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-gray-700 text-gray-400'
                                        }`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1 text-gray-300 text-xs">
                                                <Eye size={12} /> {camp.impressions.toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-300 text-xs">
                                                <MousePointer size={12} /> {camp.clicks.toLocaleString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="font-mono text-white">
                                            {symbol}{convert(camp.spent, currency)} 
                                            <span className="text-gray-500"> / {symbol}{convert(camp.budget, currency)}</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div 
                                                className="bg-brand-500 h-full" 
                                                style={{ width: `${(parseInt(camp.spent.replace(/\D/g,'')) / parseInt(camp.budget.replace(/\D/g,''))) * 100}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                            <MoreHorizontal size={18} />
                                        </button>
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

export default AdManager;
