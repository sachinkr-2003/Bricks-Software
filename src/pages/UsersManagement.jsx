import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Shield, Trash2, Key, Loader, ImagePlus } from 'lucide-react';
import api from '../services/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState('Client');
  const [profileImage, setProfileImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth'); // Assuming /api/auth returns list of users
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users. Ensure you have admin access.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('images', file);
    
    try {
      // Assuming /upload returns { urls: ['url1'] }
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.urls && res.data.urls.length > 0) {
        setProfileImage(res.data.urls[0]);
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name || !phone || !pin) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/register', { name, phone, pin, role, profileImage });
      setName(''); setPhone(''); setPin(''); setRole('Client'); setProfileImage('');
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/auth/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Error deleting user');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">App Users / Clients</h1>
          <p className="text-slate-500 font-medium mt-1">Manage who can access the mobile application.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 font-bold text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create User Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Register New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              
              {/* Profile Image Pick */}
              <div className="flex flex-col items-center mb-4">
                <div 
                  className="w-20 h-20 bg-slate-100 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-200 transition-colors relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader className="w-6 h-6 animate-spin text-slate-500" />
                  ) : profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Avatar</span>
                <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-800 font-medium text-slate-700" placeholder="e.g. Amit Sharma" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-800 font-medium text-slate-700" placeholder="e.g. 9876543210" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Login PIN (4-Digits)</label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-800 font-medium text-slate-700" placeholder="e.g. 1234" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Role / Access Level</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-800 font-medium text-slate-700 appearance-none">
                    <option value="Client">Client</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-slate-900 text-white font-bold tracking-wide hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 mt-2">
                {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : 'GENERATE LOGIN'}
              </button>

            </form>
          </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
             <div className="p-4 bg-slate-50 border-b border-slate-200">
               <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Active Accounts</h2>
             </div>
             
             <div className="flex-1 overflow-auto">
               {isLoading ? (
                 <div className="p-8 text-center text-slate-500 font-medium">Loading users...</div>
               ) : users.length === 0 ? (
                 <div className="p-8 text-center text-slate-500 font-medium">No users created yet.</div>
               ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50 border-b border-slate-200">
                       <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                       <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile</th>
                       <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                       <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {users.map(user => (
                       <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                         <td className="p-3">
                           <div className="flex items-center gap-3">
                             {user.profileImage ? (
                               <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                             ) : (
                               <div className="w-8 h-8 rounded-full bg-slate-200 flex flex-col justify-center items-center text-slate-500 font-bold text-xs uppercase">
                                 {user.name.charAt(0)}
                               </div>
                             )}
                             <div className="font-bold text-slate-800">{user.name}</div>
                           </div>
                         </td>
                         <td className="p-3 text-sm font-medium text-slate-600">{user.phone}</td>
                         <td className="p-3">
                           <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider ${
                             user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                             user.role === 'Manager' ? 'bg-blue-100 text-blue-700' : 
                             'bg-emerald-100 text-emerald-700'
                           }`}>
                             {user.role}
                           </span>
                         </td>
                         <td className="p-3 text-right">
                           <button onClick={() => handleDeleteUser(user._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UsersManagement;
