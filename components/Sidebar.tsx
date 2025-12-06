
import React from 'react';
import { Home, Search, Film, Music, MessageSquare, CreditCard, Shield, Settings, LayoutDashboard, Database, Server, Activity, Users, DollarSign, FileText, Globe, Bell, Lock, Radio, Key } from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  user: User;
  language: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, user, language }) => {
  
  // Translation Dictionary
  const t: Record<string, Record<string, string>> = {
    en: {
      mainMenu: 'Main Menu',
      admin: 'Administration',
      system: 'System & Settings',
      home: 'Home',
      identify: 'Identify',
      reels: 'Film Reels',
      music: 'Music Discovery',
      chat: 'AI Assistant',
      premium: 'Premium',
      dashboard: 'Dashboard',
      content: 'Content Manager',
      users: 'User Intelligence',
      subs: 'Subscriptions',
      plans: 'Pricing Plans',
      comm: 'Templates & Comm',
      control: 'System Control',
      roles: 'Roles & Staff',
      ads: 'Ad Monetization',
      security: 'Security & Access',
      settings: 'Platform Settings',
      upgrade: 'Upgrade Now',
      proPlan: 'Pro Plan',
      proDesc: 'Unlock 4K quality & unlimited AI scans.'
    },
    es: {
      mainMenu: 'Menú Principal',
      admin: 'Administración',
      system: 'Sistema y Ajustes',
      home: 'Inicio',
      identify: 'Identificar',
      reels: 'Reels de Películas',
      music: 'Descubrir Música',
      chat: 'Asistente IA',
      premium: 'Premium',
      dashboard: 'Panel',
      content: 'Gestor de Contenido',
      users: 'Inteligencia de Usuarios',
      subs: 'Suscripciones',
      plans: 'Planes de Precios',
      comm: 'Plantillas y Com.',
      control: 'Control del Sistema',
      roles: 'Roles y Personal',
      ads: 'Monetización',
      security: 'Seguridad y Acceso',
      settings: 'Ajustes de Plataforma',
      upgrade: 'Mejorar Ahora',
      proPlan: 'Plan Pro',
      proDesc: 'Desbloquea calidad 4K y escaneos ilimitados.'
    },
    fr: {
      mainMenu: 'Menu Principal',
      admin: 'Administration',
      system: 'Système et Paramètres',
      home: 'Accueil',
      identify: 'Identifier',
      reels: 'Bobines de Films',
      music: 'Découverte Musicale',
      chat: 'Assistant IA',
      premium: 'Premium',
      dashboard: 'Tableau de Bord',
      content: 'Gestionnaire de Contenu',
      users: 'Intelligence Utilisateur',
      subs: 'Abonnements',
      plans: 'Plans Tarifaires',
      comm: 'Modèles et Comm.',
      control: 'Contrôle Système',
      roles: 'Rôles et Personnel',
      ads: 'Publicité',
      security: 'Sécurité et Accès',
      settings: 'Paramètres Plateforme',
      upgrade: 'Mettre à Niveau',
      proPlan: 'Plan Pro',
      proDesc: 'Débloquez la qualité 4K et des scans illimités.'
    },
    de: {
      mainMenu: 'Hauptmenü',
      admin: 'Verwaltung',
      system: 'System & Einstellungen',
      home: 'Startseite',
      identify: 'Identifizieren',
      reels: 'Filmrollen',
      music: 'Musikentdeckung',
      chat: 'KI-Assistent',
      premium: 'Premium',
      dashboard: 'Instrumententafel',
      content: 'Inhaltsmanager',
      users: 'Benutzerintelligenz',
      subs: 'Abonnements',
      plans: 'Preispläne',
      comm: 'Vorlagen & Komm.',
      control: 'Systemsteuerung',
      roles: 'Rollen & Personal',
      ads: 'Werbemonetarisierung',
      security: 'Sicherheit & Zugang',
      settings: 'Plattformeinstellungen',
      upgrade: 'Jetzt Upgraden',
      proPlan: 'Pro-Plan',
      proDesc: 'Freischalten von 4K-Qualität & unbegrenzten Scans.'
    }
  };

  const labels = t[language] || t['en'];

  // Consumer Features - Only for USER
  const menuItems = [
    { id: 'home', label: labels.home, icon: Home, roles: [UserRole.USER] },
    { id: 'identify', label: labels.identify, icon: Search, roles: [UserRole.USER] },
    { id: 'reels', label: labels.reels, icon: Film, roles: [UserRole.USER] },
    { id: 'music', label: labels.music, icon: Music, roles: [UserRole.USER] },
    { id: 'chat', label: labels.chat, icon: MessageSquare, roles: [UserRole.USER] },
    { id: 'pricing', label: labels.premium, icon: CreditCard, roles: [UserRole.USER] },
  ];

  // Admin Features - For ADMIN and SUPER_ADMIN
  const adminItems = [
    { id: 'admin', label: labels.dashboard, icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    { id: 'content', label: labels.content, icon: Database, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    { id: 'users', label: labels.users, icon: Users, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    { id: 'subscriptions', label: labels.subs, icon: DollarSign, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    { id: 'plans', label: labels.plans, icon: FileText, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    { id: 'communication', label: labels.comm, icon: Bell, roles: [UserRole.SUPER_ADMIN] },
  ];

  // System Features - Only for SUPER_ADMIN (or Settings for both)
  const systemItems = [
    { id: 'superadmin', label: labels.control, icon: Server, roles: [UserRole.SUPER_ADMIN] },
    { id: 'roles', label: labels.roles, icon: Key, roles: [UserRole.SUPER_ADMIN] },
    { id: 'ads', label: labels.ads, icon: Radio, roles: [UserRole.SUPER_ADMIN] },
    { id: 'security', label: labels.security, icon: Lock, roles: [UserRole.SUPER_ADMIN] },
    { id: 'settings', label: labels.settings, icon: Settings, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
  ];

  const filterItems = (items: typeof menuItems) => items.filter(item => item.roles.includes(user.role));

  const hasUserMenu = filterItems(menuItems).length > 0;
  const hasAdminMenu = filterItems(adminItems).length > 0;
  const hasSystemMenu = filterItems(systemItems).length > 0;

  return (
    <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-[#0f172a] border-r border-white/5 transform transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="p-4 space-y-2 overflow-y-auto h-full scrollbar-hide">
        
        {hasUserMenu && (
          <div className="mb-8 animate-fade-in">
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{labels.mainMenu}</p>
            <div className="space-y-1">
              {filterItems(menuItems).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activePage === item.id 
                      ? 'bg-gradient-to-r from-brand-600/90 to-brand-500/90 text-white shadow-lg shadow-brand-500/20 border border-white/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} className={activePage === item.id ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {hasAdminMenu && (
          <div className="mb-8 animate-fade-in">
            <p className="px-4 text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">{labels.admin}</p>
            <div className="space-y-1">
              {filterItems(adminItems).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activePage === item.id 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} className={activePage === item.id ? 'text-white' : 'text-purple-400/70 group-hover:text-purple-400'} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {hasSystemMenu && (
           <div className="mb-8 animate-fade-in">
             <p className="px-4 text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3">{labels.system}</p>
             <div className="space-y-1">
               {filterItems(systemItems).map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setActivePage(item.id)}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                     activePage === item.id 
                       ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/20' 
                       : 'text-gray-400 hover:text-white hover:bg-white/5'
                   }`}
                 >
                   <item.icon size={20} className={activePage === item.id ? 'text-white' : 'text-red-400/70 group-hover:text-red-400'} />
                   <span className="font-medium text-sm">{item.label}</span>
                 </button>
               ))}
             </div>
           </div>
        )}
        
        {/* Only show Pro Plan upsell to Users */}
        {user.role === UserRole.USER && (
          <div className="mt-auto pt-6 px-2">
               <div className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-colors"></div>
                  <h4 className="text-sm font-bold text-white mb-1 relative z-10">{labels.proPlan}</h4>
                  <p className="text-xs text-gray-400 mb-3 relative z-10 leading-relaxed">{labels.proDesc}</p>
                  <button 
                    onClick={() => setActivePage('pricing')}
                    className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors relative z-10"
                  >
                      {labels.upgrade}
                  </button>
               </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
