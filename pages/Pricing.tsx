import React from 'react';
import { Check } from 'lucide-react';

interface PricingProps {
    currency: string;
}

const Pricing: React.FC<PricingProps> = ({ currency }) => {
  // Exchange Rates (Mock)
  const rates: Record<string, number> = {
      'USD': 1,
      'NGN': 1600, // 1 USD = 1600 NGN
      'EUR': 0.92,
      'GBP': 0.79
  };

  const symbols: Record<string, string> = {
      'USD': '$',
      'NGN': '₦',
      'EUR': '€',
      'GBP': '£'
  };

  const formatPrice = (usdPrice: number) => {
      const rate = rates[currency] || 1;
      const converted = usdPrice * rate;
      const symbol = symbols[currency] || '$';
      
      // Formatting for NGN: Remove decimals completely for cleaner look (e.g. ₦16000 instead of ₦16000.00)
      if (currency === 'NGN') {
          // Round to nearest integer
          const rounded = Math.round(converted);
          return `${symbol}${rounded.toLocaleString('en-NG')}`;
      }
      
      // Default formatting for other currencies (keep decimals if not whole numbers)
      return `${symbol}${converted.toLocaleString(undefined, { 
          minimumFractionDigits: usdPrice % 1 !== 0 ? 2 : 0, 
          maximumFractionDigits: 2 
      })}`;
  };

  const plans = [
    {
      name: 'Free',
      priceUSD: 0,
      period: 'forever',
      features: ['5 Searches / Month', 'Standard Speed', 'Ad Supported', 'Community Access'],
      cta: 'Current Plan',
      active: true,
    },
    {
      name: 'Premium',
      priceUSD: 9.99,
      period: '/ month',
      features: ['Unlimited Searches', 'Priority AI Processing', 'No Ads', 'Full Movie Details', 'HD Trailers'],
      cta: 'Upgrade',
      highlight: true,
    },
    {
      name: 'VIP Studio',
      priceUSD: 199,
      period: '/ month',
      features: ['API Access', 'Promote Your Reels', 'Detailed Analytics', 'Dedicated Support', 'Early Feature Access'],
      cta: 'Contact Sales',
      active: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto text-center py-12 animate-fade-in">
      <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
      <p className="text-dark-muted mb-12">Unlock the full power of VidFind+ video discovery engine.</p>
      
      {currency === 'NGN' && (
          <div className="mb-8 inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium animate-pulse">
             🇳🇬 Local pricing enabled for Nigeria (Rate: ₦1,600/$)
          </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-8 rounded-3xl border ${plan.highlight ? 'bg-brand-900/20 border-brand-500 shadow-2xl shadow-brand-500/20' : 'bg-dark-card border-white/5'} flex flex-col`}>
             {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Most Popular
                </div>
             )}
             <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
             <div className="flex items-baseline justify-center gap-1 mb-6">
                <span className="text-4xl font-bold text-white">{formatPrice(plan.priceUSD)}</span>
                <span className="text-dark-muted">{plan.period}</span>
             </div>

             <ul className="space-y-4 mb-8 flex-1 text-left">
                {plan.features.map(feat => (
                    <li key={feat} className="flex items-center gap-3 text-gray-300">
                        <div className="p-1 rounded-full bg-green-500/20 text-green-500">
                            <Check size={14} />
                        </div>
                        <span className="text-sm">{feat}</span>
                    </li>
                ))}
             </ul>

             <button className={`w-full py-3 rounded-xl font-bold transition-all ${
                 plan.highlight 
                 ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25' 
                 : 'bg-white/10 hover:bg-white/20 text-white'
             }`}>
                {plan.cta}
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;