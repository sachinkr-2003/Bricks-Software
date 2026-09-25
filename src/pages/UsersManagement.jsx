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
  const [role, setRole] = useState('customer');
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
      setName(''); setPhone(''); setPin(''); setRole('customer'); setProfileImage('');
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
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-serif">App Users & Clients</h1>
          <p className="text-slate-500 font-medium mt-2">Manage personnel access and client accounts for the mobile application.</p>
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
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-bl-full -z-0"></div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
              <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm">
                <Shield className="w-4 h-4" />
              </span>
              Register New User
            </h2>
            
            <form onSubmit={handleCreateUser} className="space-y-5 relative z-10">
              
              {/* Profile Image Pick */}
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 transition-all shadow-inner relative group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader className="w-6 h-6 animate-spin text-orange-500" />
                  ) : profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus className="w-8 h-8 text-slate-300 group-hover:text-orange-400 transition-colors" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Avatar</span>
                <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-bold text-slate-700 transition-all" placeholder="e.g. Amit Sharma" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Mobile Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-bold text-slate-700 transition-all" placeholder="e.g. 9876543210" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Login PIN (4-Digits)</label>
                <div className="relative group">
                  <Key className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-bold text-slate-700 transition-all" placeholder="e.g. 1234" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Role / Access Level</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 font-bold text-slate-700 appearance-none transition-all cursor-pointer">
                    <option value="customer">Client</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute right-4 top-4 pointer-events-none">
                    <div className="w-2 h-2 border-b-2 border-r-2 border-slate-400 rotate-45"></div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-4 bg-orange-600 text-white font-black tracking-widest uppercase hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/30 rounded-xl flex justify-center items-center gap-2 hover:shadow-orange-600/50 hover:-translate-y-0.5 active:translate-y-0">
                {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : 'GENERATE LOGIN'}
              </button>

            </form>
          </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden h-full flex flex-col pt-1">
             <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md">
               <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 Active Accounts
               </h2>
               <span className="text-xs font-bold text-slate-400">{users.length} Users Found</span>
             </div>
             
             <div className="flex-1 overflow-auto bg-slate-50/30">
               {isLoading ? (
                 <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                    <Loader className="w-8 h-8 animate-spin mb-4 text-orange-500" />
                    <span className="font-bold tracking-widest uppercase text-xs">Loading database...</span>
                 </div>
               ) : users.length === 0 ? (
                 <div className="p-16 text-center text-slate-400 font-medium">No users created yet.</div>
               ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-white border-b border-slate-200 shadow-sm">
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name & Profile</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {users.map(user => (
                       <tr key={user._id} className="hover:bg-white transition-colors group">
                         <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                             <div className="relative">
                               {user.profileImage ? (
                                 <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md" />
                               ) : (
                                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 ring-2 ring-white shadow-md flex justify-center items-center text-slate-500 font-black text-sm uppercase">
                                   {user.name.charAt(0)}
                                 </div>
                               )}
                               <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                             </div>
                             <div className="font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">{user.name}</div>
                           </div>
                         </td>
                         <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 font-bold text-slate-600 text-sm bg-slate-100/50 px-3 py-1 rounded-lg">
                               <Phone className="w-3 h-3 text-slate-400" /> {user.phone}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                           <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                             user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                             user.role === 'manager' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                             'bg-emerald-50 text-emerald-600 border-emerald-200'
                           }`}>
                             {user.role}
                           </span>
                         </td>
                         <td className="px-8 py-5 text-right">
                           <button onClick={() => handleDeleteUser(user._id)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100 hover:border-red-100 hover:shadow-md">
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
