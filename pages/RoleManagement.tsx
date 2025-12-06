
import React, { useState } from 'react';
import { User, UserRole, Permission } from '../types';
import { Shield, Plus, Lock, Check, X, Trash2, Edit } from 'lucide-react';

const INITIAL_STAFF: User[] = [
  { 
    id: 'admin1', 
    name: 'Sarah Connor', 
    email: 'sarah@vidfind.com', 
    role: UserRole.ADMIN, 
    permissions: [Permission.MANAGE_CONTENT, Permission.VIEW_ANALYTICS],
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  { 
    id: 'admin2', 
    name: 'John Wick', 
    email: 'john@vidfind.com', 
    role: UserRole.ADMIN, 
    permissions: [Permission.MANAGE_USERS, Permission.MANAGE_CONTENT, Permission.MANAGE_ADS],
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  }
];

const RoleManagement: React.FC = () => {
  const [staff, setStaff] = useState<User[]>(INITIAL_STAFF);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<Permission[]>([]);

  const allPermissions = Object.values(Permission);

  const togglePerm = (perm: Permission) => {
    if (selectedPerms.includes(perm)) {
      setSelectedPerms(selectedPerms.filter(p => p !== perm));
    } else {
      setSelectedPerms([...selectedPerms, perm]);
    }
  };

  const handleAddStaff = () => {
    if (!newName || !newEmail) return;
    
    const newUser: User = {
      id: Date.now().toString(),
      name: newName,
      email: newEmail,
      role: UserRole.ADMIN,
      permissions: selectedPerms,
      status: 'active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName}`
    };

    setStaff([...staff, newUser]);
    setShowModal(false);
    setNewName('');
    setNewEmail('');
    setSelectedPerms([]);
  };

  const removeStaff = (id: string) => {
    if (confirm('Remove this staff member?')) {
      setStaff(staff.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Staff & Permissions</h1>
          <p className="text-dark-muted">Manage admins, moderators, and access levels.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-600/20"
        >
          <Plus size={20} /> Add New Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {staff.map(user => (
          <div key={user.id} className="bg-dark-card border border-white/5 rounded-2xl p-6 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => removeStaff(user.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 size={16} />
                </button>
             </div>

             <div className="flex items-center gap-4 mb-6">
                <img src={user.avatar} className="w-16 h-16 rounded-full bg-white/10" alt={user.name} />
                <div>
                   <h3 className="text-lg font-bold text-white">{user.name}</h3>
                   <p className="text-sm text-gray-400">{user.email}</p>
                   <span className="inline-block mt-2 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded uppercase">
                     {user.role}
                   </span>
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Access Rights</p>
                <div className="flex flex-wrap gap-2">
                   {user.permissions?.map(perm => (
                      <span key={perm} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300 flex items-center gap-1">
                        <Check size={10} className="text-green-500" />
                        {perm.replace('MANAGE_', '').replace('VIEW_', '')}
                      </span>
                   ))}
                   {(!user.permissions || user.permissions.length === 0) && (
                     <span className="text-xs text-red-400 italic">No specific permissions</span>
                   )}
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
             <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Add Staff Member</h3>
                <button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-white" /></button>
             </div>
             
             <div className="p-6 space-y-6">
                <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Full Name</label>
                   <input 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none"
                      placeholder="Jane Doe"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Email Address</label>
                   <input 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none"
                      placeholder="jane@vidfind.com"
                   />
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-400 mb-3">Permissions</label>
                   <div className="grid grid-cols-2 gap-3">
                      {allPermissions.map(perm => (
                         <button
                           key={perm}
                           onClick={() => togglePerm(perm)}
                           className={`px-3 py-2 rounded-lg text-xs font-bold text-left flex items-center gap-2 transition-all ${
                             selectedPerms.includes(perm) 
                               ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                               : 'bg-white/5 text-gray-400 hover:bg-white/10'
                           }`}
                         >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedPerms.includes(perm) ? 'border-white bg-white/20' : 'border-gray-500'}`}>
                               {selectedPerms.includes(perm) && <Check size={10} />}
                            </div>
                            {perm.replace('_', ' ')}
                         </button>
                      ))}
                   </div>
                </div>

                <button 
                  onClick={handleAddStaff}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 mt-4"
                >
                  Create Account
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
