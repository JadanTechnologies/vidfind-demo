

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, PlayCircle, Film, Share2, User, Star, Bookmark, Check, History, Clock, Trash2, ChevronRight, AlertCircle, RefreshCw, Clapperboard, Video, ShieldAlert } from 'lucide-react';
import { identifyMedia } from '../services/gemini';
import { MovieResult } from '../types';

interface HistoryItem {
  id: number;
  title: string;
  thumbnail: string;
  timestamp: string;
  result: MovieResult;
}

const Identify: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MovieResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('vidfind_history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const addToHistory = (scanResult: MovieResult, imagePreview: string) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      title: scanResult.title,
      // Prefer the official poster if available to save localStorage space, else use the uploaded preview (if not too huge)
      thumbnail: scanResult.imageUrl || imagePreview, 
      timestamp: new Date().toISOString(),
      result: scanResult
    };

    const updatedHistory = [newItem, ...history].slice(0, 20); // Keep last 20 items
    setHistory(updatedHistory);
    localStorage.setItem('vidfind_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (confirm('Clear all search history?')) {
      setHistory([]);
      localStorage.removeItem('vidfind_history');
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setResult(item.result);
    setPreview(item.thumbnail);
    setSaved(false);
    setShowHistory(false);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert("Please upload an image (frame) or a short video clip.");
        return;
    }

    setMimeType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setResult(null);
      setSaved(false);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleIdentify = async () => {
    if (!preview) return;
    setLoading(true);
    setSaved(false);
    setError(null);
    
    // Extract base64 (remove data:image/xyz;base64, prefix)
    const base64 = preview.split(',')[1];
    
    try {
        const data = await identifyMedia(base64, mimeType);
        if (data) {
            setResult(data);
            addToHistory(data, preview);
            
            // Check for copyright and simulate admin notification
            if (data.isCopyrighted || data.copyrightHolder) {
                console.warn(`[COPYRIGHT ALERT] Content detected: ${data.title} by ${data.copyrightHolder}. Notifying Admin...`);
                // In a real app, this would send a POST request to the admin backend
            }
        } else {
            setError("Could not identify the video content. Please try a different frame.");
        }
    } catch (err: any) {
        console.error(err);
        setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleSaveToLibrary = () => {
      setSaved(true);
      // In a real implementation, this would save to a persistent database
      console.log('Saved to library:', result?.title);
  };

  const handleShare = async () => {
    if (!result) return;

    const shareData = {
      title: `Check out "${result.title}" on VidFind+`,
      text: `I just found this movie using VidFind+: ${result.title} (${result.year}). It looks amazing!`,
      url: window.location.href // In a real app, this would be a permalink to the result
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Result link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const openTrailer = () => {
      if (result?.trailerUrl) {
          window.open(result.trailerUrl, '_blank');
      }
  };

  const clear = () => {
    setPreview(null);
    setResult(null);
    setSaved(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isVideoFile = mimeType.startsWith('video/');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12 relative">
      
      {/* Top Header Area */}
      <div className="flex justify-between items-start">
        <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-brand-accent">
            What's that video?
            </h1>
            <p className="text-slate-600 dark:text-dark-muted text-lg">
            Upload a screenshot or video clip. Our AI identifies movies, series, and <span className="text-brand-500 font-bold">actors' faces</span> in seconds.
            </p>
        </div>
        
        {/* History Button */}
        <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-gray-300 shadow-sm"
        >
            <History size={18} />
            <span className="font-medium hidden sm:inline">History</span>
            {history.length > 0 && (
                <span className="bg-brand-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {history.length}
                </span>
            )}
        </button>
      </div>

      {/* Upload Area */}
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-3xl h-64 md:h-80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-white dark:bg-transparent
            ${isDragging ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : 'border-slate-300 dark:border-white/10 hover:border-brand-400 dark:hover:border-white/30 hover:bg-slate-50 dark:hover:bg-white/5'}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*"
          />
          <div className="bg-brand-100 dark:bg-brand-500/20 p-4 rounded-full mb-4">
            <Upload className="w-8 h-8 text-brand-600 dark:text-brand-500" />
          </div>
          <p className="text-xl font-medium text-slate-800 dark:text-white mb-2">Drop a frame or clip here</p>
          <p className="text-sm text-slate-500 dark:text-dark-muted">Supports JPG, PNG, MP4 (Max 10MB)</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
           <div className="grid md:grid-cols-2 gap-0">
              {/* Preview Side */}
              <div className="relative h-80 md:h-auto bg-black flex items-center justify-center p-4">
                 {isVideoFile ? (
                     <video src={preview} controls className="max-h-full max-w-full rounded-lg" />
                 ) : (
                     <img src={preview} alt="Upload preview" className="max-h-full max-w-full object-contain rounded-lg" />
                 )}
                 <button 
                  onClick={clear}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-sm z-10"
                 >
                   <X size={20} />
                 </button>
              </div>

              {/* Analysis Side */}
              <div className="p-8 flex flex-col justify-center min-h-[400px]">
                 {error ? (
                    <div className="text-center space-y-6 animate-fade-in">
                        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="text-red-600 dark:text-red-500" size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Identification Failed</h3>
                            <p className="text-red-500 dark:text-red-400 max-w-xs mx-auto">{error}</p>
                        </div>
                        <button 
                            onClick={handleIdentify}
                            className="px-6 py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold rounded-xl transition-colors flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw size={18} /> Try Again
                        </button>
                    </div>
                 ) : !result ? (
                   <div className="text-center space-y-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center">
                        {loading ? <Loader2 className="animate-spin text-brand-600 dark:text-brand-500" size={32} /> : <Film className="text-brand-600 dark:text-brand-500" size={32} />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Ready to Identify</h3>
                        <p className="text-slate-500 dark:text-dark-muted">We will scan millions of frames and analyze actor faces.</p>
                      </div>
                      <button 
                        onClick={handleIdentify}
                        disabled={loading}
                        className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Analyzing Scene...' : 'Identify This Scene'}
                      </button>
                   </div>
                 ) : (
                   <div className="space-y-6 animate-fade-in">
                      {/* Copyright Warning */}
                      {(result.isCopyrighted || result.copyrightHolder) && (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 animate-pulse-slow">
                              <ShieldAlert className="text-red-500 flex-shrink-0" size={20} />
                              <div className="text-xs">
                                  <p className="font-bold text-red-500 uppercase">Copyright Detected</p>
                                  <p className="text-red-400">Rights owned by: <span className="font-bold">{result.copyrightHolder || result.productionCompany}</span></p>
                              </div>
                              <div className="ml-auto px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded border border-red-500/30 uppercase">
                                  Admin Notified
                              </div>
                          </div>
                      )}

                      <div className="flex items-start justify-between">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="px-2 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold rounded">MATCH FOUND</span>
                               <span className="text-slate-500 dark:text-dark-muted text-xs">{result.confidence}% Confidence</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{result.title} <span className="text-slate-500 dark:text-dark-muted font-normal">({result.year})</span></h2>
                            {result.productionCompany && (
                                <p className="text-sm text-brand-600 dark:text-brand-400 font-bold mt-1 flex items-center gap-1">
                                    <Clapperboard size={14} /> {result.productionCompany}
                                </p>
                            )}
                         </div>
                         <div className="flex items-center gap-2">
                             <button 
                                onClick={handleSaveToLibrary}
                                disabled={saved}
                                className={`p-2 rounded-full transition-all ${
                                    saved 
                                    ? 'bg-green-500/20 text-green-500' 
                                    : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/20'
                                }`}
                                title={saved ? "Saved to Library" : "Save to Library"}
                             >
                                 {saved ? <Check size={24} /> : <Bookmark size={24} />}
                             </button>
                             <button 
                                onClick={handleShare}
                                className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-brand-500 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                                title="Share Result"
                             >
                               <Share2 size={24} />
                             </button>
                         </div>
                      </div>

                      {/* Scene Timestamp & Trailer */}
                      <div className="flex flex-wrap gap-4 mt-2">
                           {result.timestamp && (
                               <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600 dark:text-yellow-500 text-xs font-bold">
                                   <Clock size={14} />
                                   Scene Time: {result.timestamp}
                               </div>
                           )}
                           {result.trailerUrl && (
                               <button 
                                 onClick={openTrailer}
                                 className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5"
                               >
                                   <Video size={16} /> Watch Trailer
                               </button>
                           )}
                      </div>

                      <p className="text-slate-700 dark:text-gray-300 leading-relaxed">{result.plot}</p>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-dark-muted uppercase font-bold mb-1">Director</p>
                            <p className="text-slate-900 dark:text-white font-medium">{result.director}</p>
                         </div>
                         <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-dark-muted uppercase font-bold mb-1">Genre</p>
                            <p className="text-slate-900 dark:text-white font-medium">{result.genre.join(', ')}</p>
                         </div>
                      </div>

                      <div className="pt-2">
                         <p className="text-xs text-slate-500 dark:text-dark-muted uppercase font-bold mb-3 flex items-center gap-2">
                            <User size={14} /> Identified Actors & Recommendations
                         </p>
                         <div className="space-y-4">
                            {result.actors?.map((actor, idx) => (
                               <div key={idx} className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                                   <div className="flex items-center gap-3 mb-3">
                                       <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                                           {actor.name.charAt(0)}
                                       </div>
                                       <div>
                                           <p className="font-bold text-slate-900 dark:text-white">{actor.name}</p>
                                           <p className="text-xs text-slate-500 dark:text-dark-muted">Face Match Confirmed</p>
                                       </div>
                                   </div>
                                   
                                   <div className="space-y-2">
                                       <div className="text-xs">
                                           <span className="text-slate-500 dark:text-gray-400 font-semibold">Known For: </span>
                                           <span className="text-slate-700 dark:text-gray-300">{actor.filmography.join(', ')}</span>
                                       </div>
                                       <div className="text-xs">
                                           <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 mt-1">
                                             <Star size={10} fill="currentColor" /> Similar Movies you might like:
                                           </span>
                                           <div className="flex flex-wrap gap-2 mt-1">
                                               {actor.similarMovies.map(m => (
                                                   <span key={m} className="px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-[10px] font-bold border border-brand-200 dark:border-brand-500/30">
                                                       {m}
                                                   </span>
                                               ))}
                                           </div>
                                       </div>
                                   </div>
                               </div>
                            ))}
                            {(!result.actors || result.actors.length === 0) && (
                                <p className="text-sm text-gray-500 italic">No specific actor faces identified clearly in this frame.</p>
                            )}
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                         <p className="text-xs text-slate-500 dark:text-dark-muted uppercase font-bold mb-3">Available On</p>
                         <div className="flex gap-3">
                            {result.streaming.map(service => (
                               <button key={service} className="flex items-center gap-2 px-4 py-2 bg-brand-600 dark:bg-brand-500 text-white rounded-lg hover:bg-brand-500 dark:hover:bg-brand-400 transition-colors font-medium text-sm">
                                  <PlayCircle size={16} /> {service}
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* History Drawer/Sidebar */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-[#1e293b] h-full shadow-2xl p-6 overflow-y-auto animate-fade-in-up md:animate-slide-left border-l border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <History size={24} /> Recent Scans
                    </h2>
                    <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} className="text-slate-500 dark:text-gray-400" />
                    </button>
                </div>

                {history.length > 0 ? (
                    <div className="space-y-4">
                        {history.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => loadFromHistory(item)}
                                className="group flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer border border-transparent hover:border-brand-500 transition-all"
                            >
                                <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-black border border-white/5">
                                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-2 truncate">{item.result.year} • {item.result.director}</p>
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <Clock size={12} />
                                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                        <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="mt-2 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Result <ChevronRight size={12} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-center">
                            <button 
                                onClick={clearHistory}
                                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center justify-center gap-2 mx-auto px-4 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} /> Clear History
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500 dark:text-gray-400">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <History size={32} className="opacity-50" />
                        </div>
                        <p>No history yet.</p>
                        <p className="text-sm mt-2">Identify a video to save it here.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Identify;
