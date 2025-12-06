import React, { useState } from 'react';
import { Video, Menu, Bell, LogOut, ChevronDown, Globe, Wallet, Moon, Sun } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  toggleSidebar: () => void;
  currency: string;
  setCurrency: (c: string) => void;
  language: string;
  setLanguage: (l: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, toggleSidebar, currency, setCurrency, language, setLanguage, isDarkMode, toggleTheme }) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const currencies = [
      { code: 'USD', symbol: '$', label: 'US Dollar' },
      { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
      { code: 'EUR', symbol: '€', label: 'Euro' },
      { code: 'GBP', symbol: '£', label: 'British Pound' },
  ];

  const languages = [
      { code: 'en', label: 'English', flag: '🇺🇸' },
      { code: 'es', label: 'Español', flag: '🇪🇸' },
      { code: 'fr', label: 'Français', flag: '🇫🇷' },
      { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];
  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 z-50 flex items-center justify-between px-4 lg:px-8 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2 text-brand-500">
          <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-1.5 rounded-lg shadow-lg shadow-brand-500/20">
             <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white hidden sm:block">VidFind<span className="text-brand-500">+</span></span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Theme Toggle */}
        <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            title="Toggle Dark Mode"
        >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Currency Selector */}
        <div className="relative">
            <button 
                onClick={() => { setShowCurrencyMenu(!showCurrencyMenu); setShowLangMenu(false); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            >
                <span className="text-brand-600 dark:text-brand-400">{currentCurrency.symbol}</span> {currentCurrency.code} <ChevronDown size={12} />
            </button>
            
            {showCurrencyMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-1 animate-fade-in z-50">
                    {currencies.map(c => (
                        <button 
                            key={c.code}
                            onClick={() => { 
                                setCurrency(c.code); 
                                setShowCurrencyMenu(false); 
                            }}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 ${currency === c.code ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10' : 'text-slate-600 dark:text-gray-300'}`}
                        >
                            <span>{c.label}</span>
                            <span className="font-mono opacity-50">{c.symbol}</span>
                        </button>
                    ))}
                </div>
            )}
            {showCurrencyMenu && <div className="fixed inset-0 z-40" onClick={() => setShowCurrencyMenu(false)}></div>}
        </div>

        {/* Language Selector */}
        <div className="relative hidden sm:block">
            <button 
                onClick={() => { setShowLangMenu(!showLangMenu); setShowCurrencyMenu(false); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            >
                <span className="text-lg leading-none">{currentLang.flag}</span> <ChevronDown size={12} />
            </button>
             {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-1 animate-fade-in z-50">
                    {languages.map(l => (
                        <button 
                            key={l.code}
                            onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 ${language === l.code ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10' : 'text-slate-600 dark:text-gray-300'}`}
                        >
                            <span className="text-lg leading-none">{l.flag}</span>
                            <span>{l.label}</span>
                        </button>
                    ))}
                </div>
            )}
            {showLangMenu && <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)}></div>}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

        <button className="relative p-2 text-slate-400 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0f172a]"></span>
        </button>

        <div className="group relative flex items-center gap-3 cursor-pointer">
           <div className="flex flex-col items-end hidden sm:block">
              <span className="text-sm font-medium text-slate-800 dark:text-white">{user.name}</span>
              <span className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-900/30 px-1.5 py-0.5 rounded border border-brand-200 dark:border-brand-500/20">
                {user.role.replace('_', ' ')}
              </span>
           </div>
           
           <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-brand-500 to-purple-500">
             <img 
               src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
               alt="Profile" 
               className="w-full h-full rounded-full bg-slate-100 dark:bg-[#1e293b]"
             />
           </div>

           {/* Dropdown */}
           <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
              <div className="p-2">
                 <button 
                   onClick={onLogout}
                   className="w-full flex items-center gap-2 px-3 py-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
                 >
                   <LogOut size={16} /> Sign Out
                 </button>
              </div>
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;