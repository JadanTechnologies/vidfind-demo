import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, Music2, Search } from 'lucide-react';
import { Reel } from '../types';

const MOCK_REELS: Reel[] = [
  {
    id: '1',
    user: 'cinemalovers',
    videoUrl: '', // Mock
    thumbnail: 'https://picsum.photos/300/533',
    likes: 1205,
    description: "The cinematography in this scene is unmatched 🎥 #movies #cinema",
    tags: ['cinema', 'art', 'dune']
  },
  {
    id: '2',
    user: 'filmmaker_joe',
    videoUrl: '', 
    thumbnail: 'https://picsum.photos/301/533',
    likes: 850,
    description: "Behind the scenes of my latest short film! 🎬",
    tags: ['indie', 'filmmaking', 'bts']
  },
  {
    id: '3',
    user: 'retro_vibes',
    videoUrl: '', 
    thumbnail: 'https://picsum.photos/302/533',
    likes: 3400,
    description: "Can you guess this 80s classic? 🕹️",
    tags: ['80s', 'retro', 'quiz']
  },
];

const ReelCard: React.FC<{ reel: Reel }> = ({ reel }) => (
  <div className="relative bg-dark-card rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] w-full max-w-sm mx-auto group">
    {/* Image acting as video thumbnail for demo */}
    <img src={reel.thumbnail} alt="Reel" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
    
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 flex flex-col justify-end p-4">
      
      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
        <button className="flex flex-col items-center gap-1 group/btn">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-pink-500/20 transition-colors">
            <Heart className="text-white group-hover/btn:text-pink-500 transition-colors" size={28} />
          </div>
          <span className="text-xs font-medium text-white shadow-black drop-shadow-md">{reel.likes}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group/btn">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover/btn:bg-brand-500/20 transition-colors">
             <MessageCircle className="text-white group-hover/btn:text-brand-500 transition-colors" size={28} />
          </div>
          <span className="text-xs font-medium text-white shadow-black drop-shadow-md">45</span>
        </button>

        <button className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
           <Share2 className="text-white" size={28} />
        </button>
      </div>

      {/* Bottom Info */}
      <div className="pr-16">
        <div className="flex items-center gap-2 mb-2">
           <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 ring-2 ring-white/20"></div>
           <span className="font-bold text-white shadow-black drop-shadow-md">@{reel.user}</span>
        </div>
        <p className="text-sm text-gray-100 mb-3 line-clamp-2 shadow-black drop-shadow-md leading-relaxed">{reel.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
            {reel.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 backdrop-blur-sm text-gray-200">#{tag}</span>
            ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-white/80">
          <Music2 size={12} />
          <span className="truncate">Original Audio • Trending</span>
        </div>
      </div>
    </div>
  </div>
);

const Reels: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Combine mock data with duplicates to simulate more content
  const allReels = [
    ...MOCK_REELS,
    ...MOCK_REELS.map(r => ({...r, id: r.id + '_dup'})),
    ...MOCK_REELS.map(r => ({...r, id: r.id + '_dup2'}))
  ];

  const filteredReels = allReels.filter(reel => {
      const term = searchTerm.toLowerCase();
      return reel.description.toLowerCase().includes(term) || 
             reel.tags.some(tag => tag.toLowerCase().includes(term));
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <h2 className="text-2xl font-bold text-white">Trending Reels</h2>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-brand-600 text-white rounded-full text-sm font-medium shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-colors">For You</button>
            <button className="px-4 py-2 bg-dark-card text-dark-muted hover:text-white rounded-full text-sm font-medium border border-white/5 hover:bg-white/5 transition-colors">Following</button>
         </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
         </div>
         <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reels by #tags, description, or mood..."
            className="w-full bg-dark-card border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-xl placeholder:text-gray-600"
         />
         {searchTerm && (
             <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
             >
                 <span className="text-xs font-bold uppercase">Clear</span>
             </button>
         )}
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredReels.length > 0 ? (
            filteredReels.map(reel => (
              <ReelCard key={reel.id} reel={reel} />
            ))
        ) : (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No reels found</h3>
                <p className="text-gray-400">We couldn't find any reels matching "{searchTerm}".</p>
                <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-6 px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-500 transition-colors"
                >
                    Clear Search
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Reels;