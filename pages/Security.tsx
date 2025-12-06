import React, { useState } from 'react';
import { Shield, Globe, Smartphone, Monitor, AlertTriangle, Plus, X } from 'lucide-react';
import { AccessRule } from '../types';

const MOCK_RULES: AccessRule[] = [
    { id: '1', type: 'ip', value: '185.22.11.1', action: 'block', reason: 'DDoS Attempt', dateAdded: '2023-10-24' },
    { id: '2', type: 'country', value: 'North Korea', action: 'block', reason: 'Sanctions', dateAdded: '2023-01-01' },
    { id: '3', type: 'os', value: 'Windows XP', action: 'block', reason: 'Security Risk (Outdated)', dateAdded: '2023-05-12' },
    { id: '4', type: 'region', value: 'Moscow', action: 'block', reason: 'Policy', dateAdded: '2023-03-15' },
];

const Security: React.FC = () => {
    const [rules, setRules] = useState<AccessRule[]>(MOCK_RULES);
    const [newRuleType, setNewRuleType] = useState('ip');
    const [newRuleValue, setNewRuleValue] = useState('');

    const addRule = () => {
        if (!newRuleValue) return;
        const newRule: AccessRule = {
            id: Date.now().toString(),
            type: newRuleType as any,
            value: newRuleValue,
            action: 'block',
            reason: 'Manual Block',
            dateAdded: new Date().toLocaleDateString()
        };
        setRules([newRule, ...rules]);
        setNewRuleValue('');
    };

    const removeRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Access Control & Security</h1>
                    <p className="text-dark-muted">Manage firewall rules, IP bans, and region locks.</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">{rules.length}</h3>
                        <p className="text-sm text-red-400">Active Blocks</p>
                    </div>
                </div>
                <div className="p-6 bg-dark-card border border-white/5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">12</h3>
                        <p className="text-sm text-gray-400">Blocked Regions</p>
                    </div>
                </div>
                 <div className="p-6 bg-dark-card border border-white/5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-500">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">145</h3>
                        <p className="text-sm text-gray-400">Threats Mitigated (24h)</p>
                    </div>
                </div>
            </div>

            {/* Add Rule Interface */}
            <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Add New Access Rule</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <select 
                        value={newRuleType}
                        onChange={(e) => setNewRuleType(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none"
                    >
                        <option value="ip">Block IP Address</option>
                        <option value="country">Block Country</option>
                        <option value="region">Block Region/State</option>
                        <option value="device">Block Device Type</option>
                        <option value="os">Block Operating System</option>
                    </select>
                    <input 
                        type="text"
                        value={newRuleValue}
                        onChange={(e) => setNewRuleValue(e.target.value)}
                        placeholder={`Enter value (e.g., ${newRuleType === 'ip' ? '192.168.1.1' : newRuleType === 'country' ? 'Russia' : 'Windows XP'})`}
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none"
                    />
                    <button 
                        onClick={addRule}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl px-6 py-3 flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} /> Block Access
                    </button>
                </div>
            </div>

            {/* Rules Table */}
             <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-300 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Rule Type</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Date Added</th>
                                <th className="px-6 py-4 text-right">Remove</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {rules.map(rule => (
                                <tr key={rule.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 capitalize flex items-center gap-2 text-white">
                                        {rule.type === 'ip' && <Monitor size={14} className="text-blue-400"/>}
                                        {rule.type === 'country' && <Globe size={14} className="text-green-400"/>}
                                        {rule.type === 'device' && <Smartphone size={14} className="text-purple-400"/>}
                                        {rule.type}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-300">{rule.value}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs font-bold uppercase border border-red-500/20">
                                            {rule.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{rule.reason}</td>
                                    <td className="px-6 py-4 text-gray-500">{rule.dateAdded}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => removeRule(rule.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={16} />
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

export default Security;