import React, { useState } from 'react';
import { Mail, MessageSquare, Plus, Edit3, Trash2 } from 'lucide-react';
import { CommunicationTemplate } from '../types';

const MOCK_TEMPLATES: CommunicationTemplate[] = [
    { id: '1', name: 'Welcome Email', type: 'email', subject: 'Welcome to VidFind+!', content: '<h1>Welcome {{name}}!</h1><p>Thanks for joining...</p>', lastUpdated: '2023-10-20' },
    { id: '2', name: 'Password Reset', type: 'email', subject: 'Reset your password', content: '<p>Click here to reset...</p>', lastUpdated: '2023-09-15' },
    { id: '3', name: 'OTP Verification', type: 'sms', content: 'Your VidFind+ code is {{code}}. Do not share.', lastUpdated: '2023-10-01' },
    { id: '4', name: 'Subscription Success', type: 'email', subject: 'Payment Received', content: 'Thanks for upgrading to Premium!', lastUpdated: '2023-10-22' },
];

const Communication: React.FC = () => {
    const [templates, setTemplates] = useState<CommunicationTemplate[]>(MOCK_TEMPLATES);
    const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Communication Center</h1>
                    <p className="text-dark-muted">Manage Email and SMS templates.</p>
                </div>
                <button className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-600/20">
                    <Plus size={20} /> Create Template
                </button>
            </div>

            <div className="flex gap-4 border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('email')}
                  className={`px-6 py-3 border-b-2 font-medium flex items-center gap-2 transition-colors ${activeTab === 'email' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <Mail size={18} /> Email Templates
                </button>
                <button 
                  onClick={() => setActiveTab('sms')}
                  className={`px-6 py-3 border-b-2 font-medium flex items-center gap-2 transition-colors ${activeTab === 'sms' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <MessageSquare size={18} /> SMS Templates
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.filter(t => t.type === activeTab).map(tpl => (
                    <div key={tpl.id} className="bg-dark-card border border-white/5 rounded-2xl p-6 group hover:border-brand-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-brand-500/20 transition-colors">
                                {tpl.type === 'email' ? <Mail className="group-hover:text-brand-400" size={24} /> : <MessageSquare className="group-hover:text-brand-400" size={24} />}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                    <Edit3 size={16} />
                                </button>
                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2">{tpl.name}</h3>
                        {tpl.subject && <p className="text-sm text-gray-400 mb-4 italic">Sub: {tpl.subject}</p>}
                        
                        <div className="bg-black/30 rounded-lg p-3 h-32 overflow-hidden relative mb-4">
                            <code className="text-xs text-gray-500 font-mono break-all">
                                {tpl.content}
                            </code>
                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>

                        <div className="text-xs text-dark-muted">Last updated: {tpl.lastUpdated}</div>
                    </div>
                ))}
                
                {/* Add New Card */}
                <button className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/10 hover:border-white/20 transition-all text-gray-500 hover:text-white min-h-[300px]">
                    <div className="p-4 bg-white/5 rounded-full">
                        <Plus size={32} />
                    </div>
                    <span className="font-medium">Create New {activeTab === 'email' ? 'Email' : 'SMS'} Template</span>
                </button>
            </div>
        </div>
    );
};

export default Communication;