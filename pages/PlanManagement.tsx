
import React, { useState } from 'react';
import { Edit2, Plus, Check, Trash2 } from 'lucide-react';
import { PricingPlan } from '../types';

interface PlanProps {
    currency?: string;
}

const INITIAL_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Tier',
    price: '$0',
    period: 'forever',
    features: ['5 Searches / Month', 'Standard Speed', 'Ad Supported', 'Community Access'],
    active: true,
    highlight: false,
    cta: 'Current Plan'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: '/ month',
    features: ['Unlimited Searches', 'Priority AI Processing', 'No Ads', 'Full Movie Details'],
    active: true,
    highlight: true,
    cta: 'Upgrade'
  },
  {
    id: 'vip',
    name: 'VIP Studio',
    price: '$199',
    period: '/ month',
    features: ['API Access', 'Promote Your Reels', 'Detailed Analytics', 'Dedicated Support'],
    active: true,
    highlight: false,
    cta: 'Contact Sales'
  },
];

const PlanManagement: React.FC<PlanProps> = ({ currency = 'USD' }) => {
  const [plans, setPlans] = useState<PricingPlan[]>(INITIAL_PLANS);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => setEditingId(id);
  
  const handleSave = (id: string) => {
    // Save logic here (API call)
    setEditingId(null);
  };

  const handleUpdate = (id: string, field: keyof PricingPlan, value: any) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleFeatureChange = (id: string, index: number, value: string) => {
    setPlans(plans.map(p => {
        if (p.id !== id) return p;
        const newFeatures = [...p.features];
        newFeatures[index] = value;
        return { ...p, features: newFeatures };
    }));
  };

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
    if (c === 'EUR') return (val * 0.92).toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (c === 'GBP') return (val * 0.79).toLocaleString(undefined, { maximumFractionDigits: 2 });
    return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
 }

 const symbol = getSymbol(currency);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Pricing Plans</h1>
           <p className="text-dark-muted">Configure public facing subscription tiers. (Editing in USD base)</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-brand-600/20">
            <Plus size={18} /> Add New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className={`relative p-6 rounded-3xl border ${plan.highlight ? 'border-brand-500 bg-brand-900/10' : 'border-white/10 bg-dark-card'} flex flex-col transition-all group`}>
             
             {/* Header */}
             <div className="flex justify-between items-start mb-4">
                {editingId === plan.id ? (
                    <input 
                      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xl font-bold text-white w-full mr-2"
                      value={plan.name}
                      onChange={(e) => handleUpdate(plan.id, 'name', e.target.value)}
                    />
                ) : (
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                )}
                
                <div className="flex gap-2">
                    {editingId === plan.id ? (
                        <button onClick={() => handleSave(plan.id)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30">
                            <Check size={16} />
                        </button>
                    ) : (
                        <button onClick={() => handleEdit(plan.id)} className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 group-hover:text-white">
                            <Edit2 size={16} />
                        </button>
                    )}
                </div>
             </div>

             {/* Price */}
             <div className="flex items-baseline gap-1 mb-6">
                {editingId === plan.id ? (
                    <input 
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-3xl font-bold text-white w-24"
                        value={plan.price}
                        onChange={(e) => handleUpdate(plan.id, 'price', e.target.value)}
                        placeholder="$"
                    />
                ) : (
                    <span className="text-4xl font-bold text-white">
                        {symbol}{convert(plan.price, currency)}
                    </span>
                )}
                <span className="text-dark-muted">{plan.period}</span>
             </div>

             {/* Features */}
             <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                        <div className="p-1 rounded-full bg-green-500/20 text-green-500 flex-shrink-0">
                            <Check size={12} />
                        </div>
                        {editingId === plan.id ? (
                            <input 
                                className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-sm text-white w-full"
                                value={feat}
                                onChange={(e) => handleFeatureChange(plan.id, idx, e.target.value)}
                            />
                        ) : (
                            <span className="text-sm">{feat}</span>
                        )}
                        {editingId === plan.id && (
                            <button className="text-red-400 hover:text-red-300">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </li>
                ))}
                {editingId === plan.id && (
                    <button className="w-full py-2 border border-dashed border-white/20 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/40">
                        + Add Feature
                    </button>
                )}
             </ul>

             {/* Status Badge */}
             <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                 <span className="text-xs font-bold text-dark-muted uppercase">Status</span>
                 <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-bold ${plan.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                     <span className={`w-2 h-2 rounded-full ${plan.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                     {plan.active ? 'Active' : 'Disabled'}
                 </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanManagement;
