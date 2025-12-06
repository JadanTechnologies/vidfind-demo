import React, { useState } from 'react';
import { Check, X, Play, AlertTriangle, Filter } from 'lucide-react';

interface PendingContent {
  id: number;
  user: string;
  type: 'Reel' | 'Music Video' | 'Short';
  thumbnail: string;
  flags: number;
  uploaded: string;
}

const mockPending: PendingContent[] = [
  { id: 1, user: 'movie_buff_99', type: 'Reel', thumbnail: 'https://picsum.photos/seed/reel1/300/200', flags: 0, uploaded: '2 mins ago' },
  { id: 2, user: 'troll_account', type: 'Short', thumbnail: 'https://picsum.photos/seed/reel2/300/200', flags: 3, uploaded: '15 mins ago' },
  { id: 3, user: 'music_lover', type: 'Music Video', thumbnail: 'https://picsum.photos/seed/reel3/300/200', flags: 0, uploaded: '1 hour ago' },
  { id: 4, user: 'unknown_user', type: 'Reel', thumbnail: 'https://picsum.photos/seed/reel4/300/200', flags: 1, uploaded: '2 hours ago' },
];

const ContentManager: React.FC = () => {
  const [items, setItems] = useState<PendingContent[]>(mockPending);
  const [activeTab, setActiveTab] = useState<'pending' | 'reported'>('pending');

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    // Optimistic UI update
    setItems(prev => prev.filter(item => item.id !== id));
    // In real app, call API here
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Content Moderation</h1>
            <p className="text-dark-muted">Review incoming uploads and flagged content.</p>
          </div>
          
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 w-fit">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'pending' ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                  Pending Approval
              </button>
              <button 
                onClick={() => setActiveTab('reported')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'reported' ? 'bg-red-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                  Reported Items
              </button>
          </div>
       </div>

       {/* Filters */}
       <div className="flex gap-4 items-center pb-4 border-b border-white/5">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10">
              <Filter size={14} /> Filter by Type
          </button>
          <div className="h-4 w-px bg-white/10"></div>
          <span className="text-sm text-dark-muted">{items.length} items remaining</span>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map(item => (
              <div key={item.id} className="bg-dark-card border border-white/5 rounded-xl overflow-hidden group hover:border-white/20 transition-all">
                  <div className="relative aspect-video bg-black">
                      <img src={item.thumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                          <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                              <Play size={24} fill="currentColor" />
                          </button>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs text-white font-medium">
                          {item.type}
                      </div>
                      {item.flags > 0 && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/90 rounded text-xs text-white font-bold flex items-center gap-1">
                              <AlertTriangle size={12} /> {item.flags} Flags
                          </div>
                      )}
                  </div>
                  
                  <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h4 className="font-bold text-white text-sm">Upload #{item.id}293</h4>
                              <p className="text-xs text-dark-muted">by @{item.user} • {item.uploaded}</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => handleAction(item.id, 'reject')}
                            className="py-2 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-bold transition-colors"
                          >
                              <X size={16} /> Reject
                          </button>
                          <button 
                            onClick={() => handleAction(item.id, 'approve')}
                            className="py-2 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg text-sm font-bold transition-colors"
                          >
                              <Check size={16} /> Approve
                          </button>
                      </div>
                  </div>
              </div>
          ))}

          {items.length === 0 && (
              <div className="col-span-full py-20 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">All Caught Up!</h3>
                  <p className="text-dark-muted">No pending content to review.</p>
              </div>
          )}
       </div>
    </div>
  );
};

export default ContentManager;