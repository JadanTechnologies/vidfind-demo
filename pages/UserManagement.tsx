
import React, { useState } from 'react';
import { MoreVertical, Search, Shield, Ban, CheckCircle, Mail, MapPin, Monitor, Smartphone, Activity, Eye, Trash2, Edit } from 'lucide-react';
import { User, UserRole, UserActivity } from '../types';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Ibrahim Sani', email: 'ibrahim@example.com', role: UserRole.USER, status: 'active', subscription: 'Premium', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim', ip: '102.168.1.1', country: 'Nigeria', region: 'Kano', os: 'Windows 11', device: 'Desktop', lastLogin: '2 mins ago' },
  { id: '2', name: 'Zainab Bello', email: 'zainab@example.com', role: UserRole.USER, status: 'blocked', subscription: 'Free', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab', ip: '197.22.19.12', country: 'Nigeria', region: 'Kaduna', os: 'iOS 17', device: 'iPhone 14', lastLogin: '2 days ago' },
  { id: '3', name: 'Abdullahi Umar', email: 'abdullahi@example.com', role: UserRole.ADMIN, status: 'active', subscription: 'VIP', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullahi', ip: '10.0.0.55', country: 'Nigeria', region: 'Abuja', os: 'MacOS', device: 'MacBook Pro', lastLogin: '1 hour ago' },
  { id: '4', name: 'Fatima Yusuf', email: 'fatima@example.com', role: UserRole.USER, status: 'active', subscription: 'Free', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima', ip: '41.11.22.33', country: 'Nigeria', region: 'Lagos', os: 'Android 14', device: 'Samsung S23', lastLogin: '5 mins ago' },
];

const MOCK_ACTIVITY: UserActivity[] = [
    { id: 'a1', action: 'Login', timestamp: '2023-10-25 10:00:00', details: 'Logged in from 192.168.1.1' },
    { id: 'a2', action: 'Video Scan', timestamp: '2023-10-25 10:05:00', details: 'Identified "Inception" (Confidence 98%)' },
    { id: 'a3', action: 'Viewed Reel', timestamp: '2023-10-25 10:12:00', details: 'Watched reel #4922' },
    { id: 'a4', action: 'Subscription', timestamp: '2023-10-24 14:00:00', details: 'Upgraded to Premium' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const handleStatusToggle = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    ));
  };

  const handleDelete = (id: string) => {
      if(confirm('Are you sure you want to delete this user? This cannot be undone.')) {
          setUsers(users.filter(u => u.id !== id));
      }
  };

  const openActivity = (user: User) => {
      setSelectedUser(user);
      setShowActivityModal(true);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Intelligence</h1>
          <p className="text-dark-muted">Monitor activity, location, and manage access.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-dark-card border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-500 w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-300 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role & Status</th>
                <th className="px-6 py-4">Location & IP</th>
                <th className="px-6 py-4">Device Info</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-white/10" />
                      <div>
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-gray-500 flex items-center gap-1 text-xs"><Mail size={10}/> {user.email}</div>
                        <div className="text-brand-400 text-xs mt-1">{user.subscription} Plan</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                        <span className={`w-fit px-2 py-1 rounded text-xs font-bold ${
                        user.role === UserRole.ADMIN ? 'bg-purple-500/20 text-purple-400' :
                        user.role === UserRole.SUPER_ADMIN ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-700 text-gray-300'
                        }`}>
                        {user.role}
                        </span>
                        <span className={`w-fit inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                        {user.status === 'active' ? <CheckCircle size={10} /> : <Ban size={10} />}
                        {user.status === 'active' ? 'Active' : 'Blocked'}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-gray-300 text-xs">
                          <div className="flex items-center gap-1"><MapPin size={12} className="text-gray-500"/> {user.country}, {user.region}</div>
                          <div className="font-mono text-gray-500">{user.ip}</div>
                      </div>
                  </td>
                  <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-gray-300 text-xs">
                          <div className="flex items-center gap-1">
                              {user.os?.includes('iOS') || user.os?.includes('Android') ? <Smartphone size={12} /> : <Monitor size={12} />}
                              {user.device}
                          </div>
                          <div className="text-gray-500">{user.os}</div>
                          <div className="text-gray-500 mt-1">Last seen: {user.lastLogin}</div>
                      </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => openActivity(user)}
                         className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                         title="View Activity Log"
                       >
                           <Activity size={18} />
                       </button>
                       <button 
                         onClick={() => handleStatusToggle(user.id)}
                         className={`p-2 rounded-lg transition-colors ${
                           user.status === 'active' 
                             ? 'text-red-400 hover:bg-red-500/10' 
                             : 'text-green-400 hover:bg-green-500/10'
                         }`}
                         title={user.status === 'active' ? "Block User" : "Unblock User"}
                       >
                         {user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                       </button>
                       <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        title="Delete User"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Modal */}
      {showActivityModal && selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-dark-card border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <img src={selectedUser.avatar} className="w-12 h-12 rounded-full" />
                          <div>
                              <h3 className="text-xl font-bold text-white">Activity Log</h3>
                              <p className="text-sm text-gray-400">Spying on: <span className="text-brand-400">{selectedUser.name}</span></p>
                          </div>
                      </div>
                      <button onClick={() => setShowActivityModal(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white">X</button>
                  </div>
                  <div className="p-0 max-h-[400px] overflow-y-auto">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-black/20 text-gray-400">
                              <tr>
                                  <th className="px-6 py-3">Timestamp</th>
                                  <th className="px-6 py-3">Action</th>
                                  <th className="px-6 py-3">Details</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                              {MOCK_ACTIVITY.map(act => (
                                  <tr key={act.id} className="hover:bg-white/5">
                                      <td className="px-6 py-3 text-gray-500 font-mono text-xs">{act.timestamp}</td>
                                      <td className="px-6 py-3 font-bold text-white">{act.action}</td>
                                      <td className="px-6 py-3 text-gray-300">{act.details}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <div className="p-4 border-t border-white/5 bg-white/5 text-center">
                      <button className="text-brand-400 text-sm font-bold hover:underline">Download Full Report</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default UserManagement;
