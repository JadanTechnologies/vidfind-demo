
import React, { useState } from 'react';
import { Save, Copy, Eye, EyeOff, Layout, Terminal, Palette, Globe, HardDrive, CreditCard, Mail, MessageSquare, Bell, Server, FileText, Film } from 'lucide-react';
import { User, UserRole, ApiConfig, SiteContent } from '../types';

interface SettingsProps {
    user: User;
    siteContent?: SiteContent;
    onUpdateContent?: (content: SiteContent) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, siteContent, onUpdateContent }) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'payment' | 'storage' | 'notifications' | 'ai' | 'content'>('branding');
  
  // Branding State
  const [appName, setAppName] = useState('VidFind+');
  const [primaryColor, setPrimaryColor] = useState('#0ea5e9');
  const [logoUrl, setLogoUrl] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [defaultLang, setDefaultLang] = useState('en');

  // Manual Bank Details State
  const [manualBankDetails, setManualBankDetails] = useState('Bank Name: \nAccount Number: \nSwift Code: ');

  // Content CMS State (Local state to edit before saving)
  const [cmsContent, setCmsContent] = useState<SiteContent>(siteContent || {
      aboutUs: '', contactUs: '', termsOfService: '', privacyPolicy: '', refundPolicy: '', hologramUrl: ''
  });

  const handleCmsChange = (field: keyof SiteContent, value: string) => {
      setCmsContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCms = () => {
      if (onUpdateContent) {
          onUpdateContent(cmsContent);
          alert('Content updated successfully!');
      }
  };

  // API Configuration Mock
  const [configs, setConfigs] = useState<ApiConfig[]>([
      // AI
      { key: 'gemini', label: 'Google Gemini', provider: 'AI', value: 'AIzaSy...7x9s', category: 'ai' },
      
      // Payment
      { key: 'stripe', label: 'Stripe Secret Key', provider: 'Payment', value: 'sk_live...9283', category: 'payment' },
      { key: 'paystack', label: 'Paystack Secret', provider: 'Payment', value: 'sk_test...1234', category: 'payment' },
      { key: 'flutterwave', label: 'Flutterwave Key', provider: 'Payment', value: 'FLWSECK...999', category: 'payment' },

      // Storage
      { key: 'aws_s3', label: 'AWS Access Key', provider: 'Storage', value: 'AKIA...', extra: 'us-east-1', category: 'storage' },
      { key: 'digitalocean', label: 'DigitalOcean Spaces Key', provider: 'Storage', value: 'DO...', extra: 'nyc3', category: 'storage' },
      { key: 'wasabi', label: 'Wasabi Access Key', provider: 'Storage', value: 'WA...', extra: 'us-west-1', category: 'storage' },
      { key: 'gcp_storage', label: 'Google Cloud JSON', provider: 'Storage', value: '{ "type": "service_account" ... }', category: 'storage' },

      // Notifications
      { key: 'firebase', label: 'Firebase Server Key', provider: 'Push', value: 'AAAA...', category: 'notification' },
      { key: 'twilio', label: 'Twilio Auth Token', provider: 'SMS', value: 'AC...', extra: '+15550000', category: 'notification' },
      { key: 'resend', label: 'Resend API Key', provider: 'Email', value: 're_123...', category: 'notification' },
      { key: 'smtp', label: 'SMTP Connection String', provider: 'Email', value: 'smtp://user:pass@smtp.host:587', category: 'notification' },
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const toggleVisibility = (key: string) => {
      setVisibleKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfigChange = (key: string, field: 'value' | 'extra', newValue: string) => {
      setConfigs(configs.map(c => c.key === key ? { ...c, [field]: newValue } : c));
  };

  const renderConfigSection = (category: string) => {
      const categoryConfigs = configs.filter(c => c.category === category);
      return (
          <div className="space-y-6 animate-fade-in">
              {categoryConfigs.map((config) => (
                  <div key={config.key} className="bg-black/20 rounded-xl p-6 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/5 rounded-lg">
                                 {category === 'payment' && <CreditCard size={18} />}
                                 {category === 'storage' && <HardDrive size={18} />}
                                 {category === 'notification' && <Bell size={18} />}
                                 {category === 'ai' && <Terminal size={18} />}
                              </div>
                              <div>
                                  <label className="text-sm font-bold text-white block">{config.label}</label>
                                  <span className="text-xs text-dark-muted">{config.provider}</span>
                              </div>
                          </div>
                          <span className="text-[10px] bg-brand-900/20 text-brand-400 px-2 py-0.5 rounded font-mono border border-brand-500/20">
                              {config.key.toUpperCase()}
                          </span>
                      </div>
                      
                      <div className="space-y-3">
                          <div className="flex gap-2">
                              <div className="relative flex-1">
                                  <input 
                                    type={visibleKeys[config.key] ? "text" : "password"}
                                    value={config.value}
                                    onChange={(e) => handleConfigChange(config.key, 'value', e.target.value)}
                                    placeholder="API Key / Secret / Connection String"
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-lg py-3 pl-4 pr-10 text-gray-300 font-mono text-sm focus:border-brand-500 focus:outline-none"
                                  />
                                  <button 
                                    onClick={() => toggleVisibility(config.key)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                  >
                                      {visibleKeys[config.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                                  </button>
                              </div>
                              <button 
                                className="p-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg border border-white/5 transition-colors"
                                title="Copy"
                                onClick={() => navigator.clipboard.writeText(config.value)}
                              >
                                  <Copy size={18} />
                              </button>
                          </div>

                          {(config.key.includes('aws') || config.key.includes('wasabi') || config.key.includes('digitalocean') || config.key === 'twilio') && (
                              <div className="relative">
                                  <input 
                                    type="text"
                                    value={config.extra || ''}
                                    onChange={(e) => handleConfigChange(config.key, 'extra', e.target.value)}
                                    placeholder={config.key === 'twilio' ? "Sender Phone Number" : "Region (e.g., us-east-1)"}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-lg py-2 px-4 text-gray-300 font-mono text-xs focus:border-brand-500 focus:outline-none"
                                  />
                              </div>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      );
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation for Settings */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
              <h1 className="text-2xl font-bold text-white px-4 mb-6">Settings</h1>
              
              <button 
                onClick={() => setActiveTab('branding')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'branding' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-gray-400 hover:bg-white/5'}`}
              >
                  <Palette size={18} /> General & Brand
              </button>
              
              {user.role === UserRole.SUPER_ADMIN && (
                <>
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase mt-4">Integrations</div>
                    
                    <button 
                        onClick={() => setActiveTab('payment')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'payment' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <CreditCard size={18} /> Payments
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('storage')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'storage' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <Server size={18} /> Cloud Storage
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'notifications' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <MessageSquare size={18} /> Notification
                    </button>

                    <button 
                        onClick={() => setActiveTab('ai')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'ai' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <Terminal size={18} /> AI & Models
                    </button>

                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase mt-4">CMS</div>

                    <button 
                        onClick={() => setActiveTab('content')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'content' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                        <FileText size={18} /> Content & Legal
                    </button>
                </>
              )}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-dark-card border border-white/5 rounded-2xl p-8 min-h-[600px]">
              
              {activeTab === 'branding' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="flex items-center gap-4 mb-6">
                           <div className="p-3 bg-brand-500/20 rounded-xl">
                               <Palette className="text-brand-500" size={24} />
                           </div>
                           <div>
                               <h2 className="text-xl font-bold text-white">Look & Feel</h2>
                               <p className="text-sm text-dark-muted">Customize the appearance of the application.</p>
                           </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <label className="block text-sm font-bold text-gray-400 mb-2">Application Name</label>
                              <div className="relative">
                                  <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                  <input 
                                    type="text" 
                                    value={appName}
                                    onChange={(e) => setAppName(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500 focus:outline-none transition-colors"
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="block text-sm font-bold text-gray-400 mb-2">Primary Color</label>
                              <div className="flex gap-4">
                                  <input 
                                    type="color" 
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="h-12 w-12 rounded cursor-pointer bg-transparent border-none p-0"
                                  />
                                  <input 
                                    type="text" 
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white font-mono uppercase focus:border-brand-500 focus:outline-none"
                                  />
                              </div>
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-bold text-gray-400 mb-2">Logo URL</label>
                          <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                              <input 
                                type="text" 
                                value={logoUrl}
                                onChange={(e) => setLogoUrl(e.target.value)}
                                placeholder="https://example.com/logo.png"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand-500 focus:outline-none transition-colors"
                              />
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <label className="block text-sm font-bold text-gray-400 mb-2">Default Currency</label>
                              <select 
                                value={defaultCurrency}
                                onChange={(e) => setDefaultCurrency(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-500 outline-none"
                              >
                                  <option value="USD">USD ($)</option>
                                  <option value="NGN">NGN (₦)</option>
                                  <option value="EUR">EUR (€)</option>
                                  <option value="GBP">GBP (£)</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-400 mb-2">Default Language</label>
                              <select 
                                value={defaultLang}
                                onChange={(e) => setDefaultLang(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-500 outline-none"
                              >
                                  <option value="en">English</option>
                                  <option value="fr">French</option>
                                  <option value="es">Spanish</option>
                                  <option value="de">German</option>
                              </select>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'payment' && (
                  <div className="animate-fade-in">
                       <div className="flex items-center gap-4 mb-8">
                           <div className="p-3 bg-green-500/20 rounded-xl">
                               <CreditCard className="text-green-500" size={24} />
                           </div>
                           <div>
                               <h2 className="text-xl font-bold text-white">Payment Gateways</h2>
                               <p className="text-sm text-dark-muted">Configure Stripe, Paystack, Flutterwave.</p>
                           </div>
                      </div>
                      
                      {renderConfigSection('payment')}

                      <div className="mt-8 pt-8 border-t border-white/5">
                          <label className="block text-sm font-bold text-white mb-2">Manual Payment Instructions (Bank Transfer)</label>
                          <p className="text-xs text-gray-500 mb-2">This text will be shown to users who select "Bank Transfer".</p>
                          <textarea 
                             value={manualBankDetails}
                             onChange={(e) => setManualBankDetails(e.target.value)}
                             rows={4}
                             className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-500 focus:outline-none font-mono text-sm"
                          />
                      </div>
                  </div>
              )}

              {activeTab === 'storage' && (
                  <div className="animate-fade-in">
                       <div className="flex items-center gap-4 mb-8">
                           <div className="p-3 bg-blue-500/20 rounded-xl">
                               <HardDrive className="text-blue-500" size={24} />
                           </div>
                           <div>
                               <h2 className="text-xl font-bold text-white">Storage Providers</h2>
                               <p className="text-sm text-dark-muted">Connect S3, DigitalOcean Spaces, Wasabi, or GCP.</p>
                           </div>
                      </div>
                      {renderConfigSection('storage')}
                  </div>
              )}

              {activeTab === 'notifications' && (
                  <div className="animate-fade-in">
                       <div className="flex items-center gap-4 mb-8">
                           <div className="p-3 bg-purple-500/20 rounded-xl">
                               <Bell className="text-purple-500" size={24} />
                           </div>
                           <div>
                               <h2 className="text-xl font-bold text-white">Notifications</h2>
                               <p className="text-sm text-dark-muted">Setup Email (SMTP/Resend), SMS (Twilio), and Push (Firebase).</p>
                           </div>
                      </div>
                      {renderConfigSection('notification')}
                  </div>
              )}

              {activeTab === 'ai' && (
                  <div className="animate-fade-in">
                       <div className="flex items-center gap-4 mb-8">
                           <div className="p-3 bg-yellow-500/20 rounded-xl">
                               <Terminal className="text-yellow-500" size={24} />
                           </div>
                           <div>
                               <h2 className="text-xl font-bold text-white">AI Configuration</h2>
                               <p className="text-sm text-dark-muted">Manage LLM keys and Model thresholds.</p>
                           </div>
                      </div>
                      {renderConfigSection('ai')}
                  </div>
              )}

              {activeTab === 'content' && (
                  <div className="animate-fade-in space-y-8">
                       <div className="flex items-center gap-4 mb-8">
                           <div className="p-3 bg-pink-500/20 rounded-xl">
                               <FileText className="text-pink-500" size={24} />
                           </div>
                           <div>
                               <h2 className="text-xl font-bold text-white">Content & Legal</h2>
                               <p className="text-sm text-dark-muted">Manage text for legal pages, about us, and contact info.</p>
                           </div>
                      </div>

                      {/* Hologram Trailer Input */}
                      <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                          <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                             <Film size={16} className="text-brand-400" /> Landing Page Hologram/Trailer
                          </label>
                          <p className="text-xs text-gray-500 mb-3">Paste a URL to an image or video (.mp4) to be displayed in the 3D card on the landing page.</p>
                          <input 
                              type="text" 
                              value={cmsContent.hologramUrl || ''}
                              onChange={(e) => handleCmsChange('hologramUrl', e.target.value)}
                              placeholder="https://example.com/video.mp4"
                              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand-500 focus:outline-none"
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-bold text-gray-400 mb-2">About Us</label>
                          <textarea 
                             value={cmsContent.aboutUs}
                             onChange={(e) => handleCmsChange('aboutUs', e.target.value)}
                             rows={4}
                             className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-500 focus:outline-none"
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-bold text-gray-400 mb-2">Contact Us Details</label>
                          <textarea 
                             value={cmsContent.contactUs}
                             onChange={(e) => handleCmsChange('contactUs', e.target.value)}
                             rows={4}
                             className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-500 focus:outline-none"
                          />
                      </div>

                       <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Terms of Service</label>
                                <textarea 
                                    value={cmsContent.termsOfService}
                                    onChange={(e) => handleCmsChange('termsOfService', e.target.value)}
                                    rows={6}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-500 focus:outline-none font-mono text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Privacy Policy</label>
                                <textarea 
                                    value={cmsContent.privacyPolicy}
                                    onChange={(e) => handleCmsChange('privacyPolicy', e.target.value)}
                                    rows={6}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-500 focus:outline-none font-mono text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Refund Policy</label>
                                <textarea 
                                    value={cmsContent.refundPolicy}
                                    onChange={(e) => handleCmsChange('refundPolicy', e.target.value)}
                                    rows={6}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-brand-500 focus:outline-none font-mono text-xs"
                                />
                            </div>
                       </div>
                  </div>
              )}

              {/* Universal Save Button */}
              <div className="mt-12 pt-6 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={activeTab === 'content' ? handleSaveCms : undefined}
                    className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-brand-600/20 hover:scale-105 transition-transform"
                  >
                      <Save size={20} /> Save Configuration
                  </button>
              </div>

          </div>
      </div>
    </div>
  );
};

export default Settings;
