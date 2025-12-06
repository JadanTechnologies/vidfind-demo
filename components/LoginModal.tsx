
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Shield, User as UserIcon, Lock, X, ArrowRight, Video } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = () => {
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      let mockUser: User;
      
      if (selectedRole === UserRole.SUPER_ADMIN) {
        mockUser = {
            id: 'sa_001',
            name: 'Jabir Dangaskiya', // Hausa Super Admin
            email: 'jabir@vidfind.ng',
            role: UserRole.SUPER_ADMIN,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Jabir`
        };
      } else if (selectedRole === UserRole.ADMIN) {
        mockUser = {
            id: 'adm_001',
            name: 'Yakubu Musa', // Hausa Admin
            email: 'yakubu@vidfind.ng',
            role: UserRole.ADMIN,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Yakubu`
        };
      } else {
        mockUser = {
            id: 'usr_001',
            name: 'Maryam Abba', // Hausa User
            email: 'maryam@vidfind.ng',
            role: UserRole.USER,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Maryam`
        };
      }

      onLogin(mockUser);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#0f172a] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg shadow-brand-500/30 mb-4">
              <Video className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-1">Select your access level to continue</p>
          </div>

          <div className="space-y-3 mb-8">
            <button
              onClick={() => setSelectedRole(UserRole.USER)}
              className={`w-full flex items-center p-4 rounded-xl border transition-all ${
                selectedRole === UserRole.USER 
                  ? 'bg-brand-500/10 border-brand-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
                  : 'bg-white/5 border-transparent hover:bg-white/10'
              }`}
            >
              <div className={`p-2 rounded-lg mr-4 ${selectedRole === UserRole.USER ? 'bg-brand-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                <UserIcon size={20} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${selectedRole === UserRole.USER ? 'text-white' : 'text-gray-300'}`}>Standard User</div>
                <div className="text-xs text-gray-500">Access to search, reels, and chat</div>
              </div>
              {selectedRole === UserRole.USER && <div className="ml-auto w-3 h-3 bg-brand-500 rounded-full shadow-[0_0_10px_#0ea5e9]"></div>}
            </button>

            <button
              onClick={() => setSelectedRole(UserRole.ADMIN)}
              className={`w-full flex items-center p-4 rounded-xl border transition-all ${
                selectedRole === UserRole.ADMIN 
                  ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                  : 'bg-white/5 border-transparent hover:bg-white/10'
              }`}
            >
              <div className={`p-2 rounded-lg mr-4 ${selectedRole === UserRole.ADMIN ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                <Lock size={20} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${selectedRole === UserRole.ADMIN ? 'text-white' : 'text-gray-300'}`}>Admin</div>
                <div className="text-xs text-gray-500">Manage content, users, and ads</div>
              </div>
              {selectedRole === UserRole.ADMIN && <div className="ml-auto w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></div>}
            </button>

            <button
              onClick={() => setSelectedRole(UserRole.SUPER_ADMIN)}
              className={`w-full flex items-center p-4 rounded-xl border transition-all ${
                selectedRole === UserRole.SUPER_ADMIN 
                  ? 'bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'bg-white/5 border-transparent hover:bg-white/10'
              }`}
            >
              <div className={`p-2 rounded-lg mr-4 ${selectedRole === UserRole.SUPER_ADMIN ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                <Shield size={20} />
              </div>
              <div className="text-left">
                <div className={`font-semibold ${selectedRole === UserRole.SUPER_ADMIN ? 'text-white' : 'text-gray-300'}`}>Super Admin</div>
                <div className="text-xs text-gray-500">Full system control & API keys</div>
              </div>
              {selectedRole === UserRole.SUPER_ADMIN && <div className="ml-auto w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></div>}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              <>
                Continue to Dashboard <ArrowRight size={20} />
              </>
            )}
          </button>
          
          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
