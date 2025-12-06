
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Identify from './pages/Identify';
import Reels from './pages/Reels';
import MusicPage from './pages/Music';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ContentManager from './pages/ContentManager';
import UserManagement from './pages/UserManagement';
import SubscriptionManagement from './pages/SubscriptionManagement';
import PlanManagement from './pages/PlanManagement';
import Settings from './pages/Settings';
import AdManager from './pages/AdManager';
import Communication from './pages/Communication';
import Security from './pages/Security';
import Chat from './pages/Chat';
import Pricing from './pages/Pricing';
import Landing from './pages/Landing';
import Maintenance from './pages/Maintenance';
import RoleManagement from './pages/RoleManagement';
import LoginModal from './components/LoginModal';
import { User, UserRole, SiteContent } from './types';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // App Global State
  const [activePage, setActivePage] = useState('identify'); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [isMaintenanceMode, setMaintenanceMode] = useState(false);
  
  // Initialize Dark Mode based on System Preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark
  });

  // Handle Dark Mode
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Site Content State (CMS)
  const [siteContent, setSiteContent] = useState<SiteContent>({
    aboutUs: "VidFind+ is the world's leading video identification platform. Founded in Nigeria by Jadan Technologies, we use advanced AI to help you discover movies, series, and music videos from short clips.",
    contactUs: "Email: support@vidfind.ng\nPhone: 07061511390\nAddress: Abuja, Nigeria",
    termsOfService: "1. Acceptance of Terms\nBy accessing and using VidFind+, you accept and agree to be bound by the terms and provision of this agreement.\n\n2. Use License\nPermission is granted to temporarily download one copy of the materials...",
    privacyPolicy: "Your privacy is important to us. It is VidFind+'s policy to respect your privacy regarding any information we may collect from you across our website.",
    refundPolicy: "We offer a full money-back guarantee for all purchases made on our website. If you are not satisfied with the product that you have purchased from us, you can get your money back no questions asked.",
    hologramUrl: "https://picsum.photos/seed/cyberpunk/600/800" // Default image
  });

  // --- Maintenance Gate ---
  const isAdminOrSuper = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  
  if (isMaintenanceMode && !isAdminOrSuper) {
      if (!user) {
         return (
             <>
                <Maintenance onLogin={() => setShowLoginModal(true)} />
                <LoginModal 
                    isOpen={showLoginModal} 
                    onClose={() => setShowLoginModal(false)}
                    onLogin={(userData) => {
                        setUser(userData);
                        setShowLoginModal(false);
                    }}
                />
             </>
         );
      }
      
      if (user.role === UserRole.USER) {
          return (
              <div className="relative">
                  <div className="absolute top-4 right-4 z-50">
                      <button onClick={() => setUser(null)} className="text-white underline font-bold px-4 py-2 bg-black/50 rounded-full">Logout</button>
                  </div>
                  <Maintenance onLogin={() => {}} />
              </div>
          );
      }
  }

  // --- Logic Gate ---
  if (!user) {
    return (
      <>
        <Landing 
          onGetStarted={() => setShowLoginModal(true)} 
          onLogin={() => setShowLoginModal(true)} 
          siteContent={siteContent}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          onLogin={(userData) => {
            setUser(userData);
            setShowLoginModal(false);
            
            if (userData.role === UserRole.SUPER_ADMIN) {
                setActivePage('superadmin');
            } else if (userData.role === UserRole.ADMIN) {
                setActivePage('admin');
            } else {
                setActivePage('identify');
            }
          }}
        />
      </>
    );
  }

  // --- Protected App Layout ---
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (activePage) {
      // User Pages
      case 'home':
      case 'identify':
        return <Identify />;
      case 'reels':
        return <Reels />;
      case 'music':
        return <MusicPage />;
      case 'chat':
        return <Chat />;
      case 'pricing':
        return <Pricing currency={currency} />;
      
      // Admin Pages
      case 'admin':
        return <AdminDashboard currency={currency} />;
      case 'content':
        return <ContentManager />;
      case 'users':
        return <UserManagement />;
      case 'subscriptions':
        return <SubscriptionManagement currency={currency} />;
      case 'plans':
        return <PlanManagement currency={currency} />;
      
      // Super Admin Pages
      case 'superadmin':
        return <SuperAdminDashboard isMaintenanceMode={isMaintenanceMode} setMaintenanceMode={setMaintenanceMode} />;
      case 'ads':
        return <AdManager currency={currency} />;
      case 'communication':
        return <Communication />;
      case 'security':
        return <Security />;
      case 'roles':
        return <RoleManagement />;

      // Shared / Settings
      case 'settings':
        return <Settings user={user} siteContent={siteContent} onUpdateContent={setSiteContent} />;
      
      default:
        return <Identify />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar 
        user={user} 
        onLogout={() => setUser(null)} 
        toggleSidebar={toggleSidebar}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <Sidebar 
        activePage={activePage} 
        setActivePage={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
        }} 
        isOpen={sidebarOpen}
        user={user}
        language={language}
      />

      <main className={`pt-24 px-4 pb-8 transition-all duration-300 lg:ml-64`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
