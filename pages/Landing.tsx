
import React, { useState } from 'react';
import { Play, Zap, Shield, Search, ArrowRight, Film, Globe, Video, Phone, X, FileText, Moon, Sun } from 'lucide-react';
import { SiteContent } from '../types';

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
  siteContent: SiteContent;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted, onLogin, siteContent, isDarkMode, toggleTheme }) => {
  const [modalContent, setModalContent] = useState<{ title: string, text: string } | null>(null);
  
  // 3D Tilt State
  const [rotation, setRotation] = useState({ x: 5, y: -5 });
  const [isHovering, setIsHovering] = useState(false);

  const openModal = (title: string, text: string) => {
    setModalContent({ title, text });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const isVideo = (url?: string) => {
      return url?.match(/\.(mp4|webm|ogg)$/i);
  };

  // 3D Card Event Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on cursor position relative to center
    // Max rotation: +/- 12 degrees
    const rotateX = ((y - centerY) / centerY) * -12; // Invert Y for natural tilt
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 5, y: -5 }); // Return to default resting angle
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">
      
      {/* Landing Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center gap-2 text-brand-500">
          <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-1.5 rounded-lg shadow-lg shadow-brand-500/20">
             <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">VidFind<span className="text-brand-500">+</span></span>
        </div>
        <div className="flex items-center gap-4">
           {/* Dark Mode Toggle */}
           <button 
             onClick={toggleTheme}
             className="p-2 rounded-full text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
           >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
           
           <button onClick={onLogin} className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block">Sign In</button>
           <button 
             onClick={onLogin}
             className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors shadow-lg shadow-brand-500/10"
           >
             Get Started
           </button>
        </div>
      </nav>

      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow opacity-50" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-4 pt-24 lg:pt-0">
        {/* Text Content */}
        <div className="flex-1 max-w-2xl space-y-8 text-center lg:text-left mt-12 lg:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 backdrop-blur-md animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse"></span>
            <span className="text-xs font-bold text-brand-700 dark:text-brand-100 uppercase tracking-wide">AI Video Recognition 2.0 Live</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight text-slate-900 dark:text-white">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">Shazam</span> for <br/>
            Video is Here.
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Instantly identify movies, series, and music videos from a single frame. 
            Powered by next-gen Gemini AI computer vision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button 
              onClick={onLogin}
              className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(14,165,233,0.3)] flex items-center gap-2 group"
            >
              Start Identifying <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
            <button className="px-8 py-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-full font-bold text-lg transition-all backdrop-blur-md flex items-center gap-2 shadow-lg dark:shadow-none">
              <Play size={20} className="fill-current" /> Watch Demo
            </button>
          </div>
        </div>

        {/* 3D Visual with Interactive Tilt */}
        <div 
          className="flex-1 w-full max-w-lg perspective-1000"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
           <div 
             className={`relative w-full aspect-[4/5] transform-style-3d transition-transform ease-out will-change-transform ${isHovering ? 'duration-100' : 'duration-700'}`}
             style={{
               transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
             }}
           >
              
              {/* Floating Back Cards (Parallax Effect) */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-200 to-slate-200 dark:from-purple-900 dark:to-black rounded-3xl border border-white/10 opacity-60 animate-float-delayed"
                style={{ transform: 'translateZ(-50px) translateX(20px) translateY(20px)' }}
              ></div>
              
              {/* Main Card */}
              <div className="absolute inset-0 bg-white dark:bg-[#1e293b] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-300/50 dark:shadow-black/50 transform translate-z-0 animate-float">
                  {/* Video Mockup UI */}
                  <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/60 to-transparent">
                     <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                     </div>
                     <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded border border-white/10 text-[10px] text-white font-mono">REC • 00:12:34</div>
                  </div>

                  {/* Dynamic Hologram / Trailer Content */}
                  <div className="w-full h-full relative bg-slate-900">
                      {isVideo(siteContent.hologramUrl) ? (
                          <video 
                            src={siteContent.hologramUrl} 
                            className="w-full h-full object-cover opacity-90"
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                          />
                      ) : (
                          <img 
                            src={siteContent.hologramUrl} 
                            alt="Movie Scene" 
                            className="w-full h-full object-cover opacity-90" 
                          />
                      )}
                      
                      {/* Scanning Overlay */}
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-400 shadow-[0_0_20px_rgba(56,189,248,1)] z-30 animate-scan"></div>
                      <div className="absolute inset-0 bg-brand-500/10 z-10 mix-blend-overlay"></div>
                  </div>

                  {/* Result Pop-up (Floating on top of card with 3D translation) */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-4 rounded-xl shadow-xl" style={{ transform: 'translateZ(60px)' }}>
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 border border-brand-500/30">
                              <Film size={24} />
                          </div>
                          <div>
                              <div className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider mb-0.5">Match Found (99%)</div>
                              <div className="text-slate-900 dark:text-white font-bold text-lg">Blade Runner 2049</div>
                              <div className="text-xs text-slate-500 dark:text-gray-400">Dir. Denis Villeneuve • 2017</div>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-32 px-4 bg-slate-50/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">Future of Discovery</h2>
              <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Built with advanced neural networks to understand context, faces, scenes, and audio in real-time.
              </p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Search}
                title="Visual Search Engine"
                desc="Upload any frame or clip. Our engine breaks down millions of pixels to find the exact source in milliseconds."
                delay={0}
              />
               <FeatureCard 
                icon={Zap}
                title="Smart Auto-Tagging"
                desc="Creators, rejoice. Upload your reels and let AI generate viral tags, descriptions, and audience ratings."
                delay={100}
              />
               <FeatureCard 
                icon={Shield}
                title="Content Safety"
                desc="Enterprise-grade moderation automatically flags copyrighted or sensitive content before it goes public."
                delay={200}
              />
           </div>
        </div>
      </section>

      {/* Social Proof / Marquee */}
      <section className="py-16 border-y border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02]">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
             <p className="text-slate-500 dark:text-gray-400 font-medium whitespace-nowrap uppercase tracking-wider text-sm">Trusted by creators from</p>
             <div className="flex items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 overflow-x-auto pb-2 md:pb-0 w-full justify-end">
                 {['Netflix', 'Hulu', 'Prime Video', 'Disney+', 'HBO Max'].map(brand => (
                    <span key={brand} className="text-xl font-bold text-slate-800 dark:text-white px-2 cursor-default">{brand}</span>
                 ))}
             </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 text-center">
         <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900 to-slate-800 dark:from-[#1e293b] dark:to-[#0f172a] border border-white/10 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent"></div>
             
             <div className="relative z-10 space-y-8">
                <Globe className="w-20 h-20 text-brand-500 mx-auto animate-pulse-slow" />
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">Ready to explore the <br/> cinematic universe?</h2>
                <p className="text-lg text-gray-400">Join thousands of users discovering new favorites every day.</p>
                <button 
                  onClick={onLogin}
                  className="px-12 py-5 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-xl transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  Launch App
                </button>
             </div>
         </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f172a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                  <div className="flex items-center gap-2 text-brand-500 mb-4">
                      <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-1 rounded-lg">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">VidFind<span className="text-brand-500">+</span></span>
                  </div>
                  <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
                    The ultimate video discovery platform powered by advanced AI. Identify, discover, and share cinematic moments.
                  </p>
              </div>

              <div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm text-slate-500 dark:text-gray-400">
                      <li><button onClick={() => openModal('About Us', siteContent.aboutUs)} className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">About Us</button></li>
                      <li><button onClick={() => openModal('Contact Us', siteContent.contactUs)} className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Contact Us</button></li>
                  </ul>
              </div>

              <div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-slate-500 dark:text-gray-400">
                      <li><button onClick={() => openModal('Terms of Service', siteContent.termsOfService)} className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Terms of Service</button></li>
                      <li><button onClick={() => openModal('Privacy Policy', siteContent.privacyPolicy)} className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Privacy Policy</button></li>
                      <li><button onClick={() => openModal('Refund Policy', siteContent.refundPolicy)} className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">Refund Policy</button></li>
                  </ul>
              </div>

              <div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-4">Contact</h4>
                  <div className="text-sm text-slate-500 dark:text-gray-400 space-y-2">
                      <a href="tel:07061511390" className="flex items-center gap-2 hover:text-brand-500 dark:hover:text-white transition-colors">
                        <Phone size={14} /> 07061511390
                      </a>
                  </div>
              </div>
           </div>

           <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="text-slate-500 dark:text-gray-500 text-sm">
                  <p>&copy; {new Date().getFullYear()} VidFind+. All rights reserved.</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                  <span>Developed by <span className="text-brand-600 dark:text-brand-400 font-bold">Jadan Technologies</span></span>
                  <span className="hidden md:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Phone size={12} /> 07061511390
                  </span>
              </div>
           </div>
        </div>
      </footer>

      {/* Full Screen Content Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
           <div className="relative bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-white/5 rounded-t-2xl">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={24} className="text-brand-500" />
                    {modalContent.title}
                 </h2>
                 <button onClick={closeModal} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white" />
                 </button>
              </div>
              <div className="p-8 overflow-y-auto whitespace-pre-wrap text-slate-600 dark:text-gray-300 leading-relaxed font-light text-sm md:text-base">
                  {modalContent.text}
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 rounded-b-2xl text-right">
                  <button onClick={closeModal} className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold transition-colors">
                      Close
                  </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, desc: string, delay: number }> = ({ icon: Icon, title, desc, delay }) => (
    <div 
      className="group p-8 rounded-3xl bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-white/5 hover:border-brand-500 dark:hover:border-brand-500/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent dark:from-brand-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 flex items-center justify-center text-brand-600 dark:text-brand-500 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                {desc}
            </p>
        </div>
    </div>
);

export default Landing;
