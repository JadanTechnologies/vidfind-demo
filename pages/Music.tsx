import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, Music2, Share2, Mic2, Disc, Headphones, History, Clock, ChevronRight, Trash2, Check, Bookmark, AlertCircle, RefreshCw } from 'lucide-react';
import { identifyMusic } from '../services/gemini';
import { MusicResult } from '../types';

interface MusicHistoryItem {
  id: number;
  title: string;
  thumbnail: string;
  timestamp: string;
  result: MusicResult;
}

const Music: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MusicResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // History State
  const [history, setHistory] = useState<MusicHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('vidfind_music_history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load music history", e);
    }
  }, []);

  const addToHistory = (scanResult: MusicResult, mediaPreview: string) => {
    const newItem: MusicHistoryItem = {
      id: Date.now(),
      title: scanResult.title,
      thumbnail: mediaPreview, // Store the uploaded preview as thumbnail
      timestamp: new Date().toISOString(),
      result: scanResult
    };

    const updatedHistory = [newItem, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem('vidfind_music_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (confirm('Clear all music search history?')) {
      setHistory([]);
      localStorage.removeItem('vidfind_music_history');
    }
  };

  const loadFromHistory = (item: MusicHistoryItem) => {
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
        alert("Please upload a video clip or cover art image.");
        return;
    }

    setMimeType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setResult(null);
      setError(null);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleIdentify = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);
    setSaved(false);
    
    // Extract base64 (remove data:image/xyz;base64, prefix)
    const base64 = preview.split(',')[1];
    
    try {
        const data = await identifyMusic(base64, mimeType);
        if (data) {
            setResult(data);
            addToHistory(data, preview);
        } else {
            setError("Could not identify the song. Try a clearer clip or image.");
        }
    } catch (err) {
        setError("An error occurred during identification.");
    } finally {
        setLoading(false);
    }
  };

  const handleSaveToLibrary = () => {
    setSaved(true);
    // Persist to library in a real app
  };

  const clear = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isVideoFile = mimeType.startsWith('video/');

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12 relative">
      
      {/* Header with History Toggle */}
      <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-pink-500/10 mb-2">
                <Music2 size={32} className="text-pink-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            Music Discovery
            </h1>
            <p className="text-slate-600 dark:text-dark-muted text-lg max-w-2xl">
            Upload a snippet of a music video or album art. AI will identify the track, artist, and lyrics.
            </p>
          </div>

          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-gray-300 shadow-sm"
        >
            <History size={18} />
            <span className="font-medium hidden sm:inline">History</span>
            {history.length > 0 && (
                <span className="bg-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
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
            ${isDragging ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-500/10' : 'border-slate-300 dark:border-white/10 hover:border-pink-400 dark:hover:border-white/30 hover:bg-slate-50 dark:hover:bg-white/5'}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*"
          />
          <div className="bg-pink-100 dark:bg-pink-500/20 p-4 rounded-full mb-4">
            <Upload className="w-8 h-8 text-pink-600 dark:text-pink-500" />
          </div>
          <p className="text-xl font-medium text-slate-800 dark:text-white mb-2">Drop a clip or cover here</p>
          <p className="text-sm text-slate-500 dark:text-dark-muted">Video or Image supported</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
           <div className="grid md:grid-cols-2 gap-0">
              {/* Preview Side */}
              <div className="relative h-80 md:h-auto bg-black flex items-center justify-center p-4">
                 {isVideoFile ? (
                     <video src={preview} controls className="max-h-full max-w-full rounded-lg shadow-lg" />
                 ) : (
                     <img src={preview} alt="Upload preview" className="max-h-full max-w-full object-contain rounded-lg shadow-lg" />
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
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Analysis Failed</h3>
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
                      <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 dark:bg-pink-500/10 flex items-center justify-center">
                        {loading ? <Loader2 className="animate-spin text-pink-600 dark:text-pink-500" size={32} /> : <Disc className="text-pink-600 dark:text-pink-500" size={32} />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Listening...</h3>
                        <p className="text-slate-500 dark:text-dark-muted">Analyzing audio and visual patterns.</p>
                      </div>
                      <button 
                        onClick={handleIdentify}
                        disabled={loading}
                        className="w-full py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Scanning...' : 'Identify Song'}
                      </button>
                   </div>
                 ) : (
                   <div className="space-y-6 animate-fade-in">
                      <div className="flex items-start justify-between">
                         <div>
                            <span className="px-2 py-0.5 bg-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold rounded mb-2 inline-block">MUSIC MATCH</span>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{result.title}</h2>
                            <p className="text-xl text-slate-500 dark:text-gray-400">{result.artist}</p>
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
                                title={saved ? "Saved" : "Save to Library"}
                            >
                                {saved ? <Check size={24} /> : <Bookmark size={24} />}
                            </button>
                            <button className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-pink-500 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                                <Share2 size={24} />
                            </button>
                         </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 relative overflow-hidden">
                          <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                              <Mic2 size={100} />
                          </div>
                          <p className="text-sm font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-2">Famous Lyrics</p>
                          <p className="text-slate-800 dark:text-white italic font-serif text-lg leading-relaxed">
                              "{result.lyricsSnippet}"
                          </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-dark-muted uppercase font-bold mb-1">Album</p>
                            <p className="text-slate-900 dark:text-white font-medium truncate">{result.album}</p>
                         </div>
                         <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-dark-muted uppercase font-bold mb-1">Genre</p>
                            <p className="text-slate-900 dark:text-white font-medium">{result.genre}</p>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                         <p className="text-xs text-slate-500 dark:text-dark-muted uppercase font-bold mb-3">Listen On</p>
                         <div className="flex gap-3">
                            {result.streaming.map(service => (
                               <button key={service} className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors font-medium text-sm">
                                  <Headphones size={16} /> {service}
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

      {/* Music History Drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-[#1e293b] h-full shadow-2xl p-6 overflow-y-auto animate-fade-in-up md:animate-slide-left border-l border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <History size={24} /> Song History
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
                                className="group flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer border border-transparent hover:border-pink-500 transition-all"
                            >
                                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-black border border-white/5 relative">
                                    {item.thumbnail.startsWith('data:video') ? (
                                         <video src={item.thumbnail} className="w-full h-full object-cover opacity-50" />
                                    ) : (
                                         <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                         <Music2 size={16} className="text-white opacity-70" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-2 truncate">{item.result.artist}</p>
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <Clock size={12} />
                                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div className="mt-2 text-pink-600 dark:text-pink-400 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Details <ChevronRight size={12} />
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
                        <p>No songs scanned yet.</p>
                        <p className="text-sm mt-2">Identify a track to save it here.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Music;