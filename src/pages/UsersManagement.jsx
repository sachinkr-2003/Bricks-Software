import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Shield, Trash2, Key, Loader, ImagePlus } from 'lucide-react';
import api from '../services/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(false);
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-none shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest">App Users</h1>
            <p className="text-slate-500 text-sm mt-1">Manage personnel access and client accounts.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-none font-bold uppercase text-xs tracking-widest transition-colors flex items-center gap-2"
          >
            + New User
          </button>
        </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 font-bold text-sm">
          {error}
        </div>
      )}

      <div className="w-full">
            
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-2xl max-w-md w-full relative flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                Register User
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleCreateUser} className="space-y-6">
                
                {/* Profile Image Pick */}
                <div className="flex flex-col items-center mb-2">
                  <div 
                    className="w-20 h-20 bg-slate-50 border border-dashed border-slate-300 rounded-none flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <Loader className="w-5 h-5 animate-spin text-slate-500" />
                    ) : profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <span className="text-xs text-slate-500 mt-3 font-semibold uppercase tracking-widest">Avatar (Optional)</span>
                  <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-none focus:outline-none focus:border-slate-800 text-slate-900 font-medium" placeholder="e.g. Amit Sharma" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-none focus:outline-none focus:border-slate-800 text-slate-900 font-medium" placeholder="e.g. 9876543210" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Login PIN (4-Digits)</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-none focus:outline-none focus:border-slate-800 text-slate-900 font-medium" placeholder="e.g. 1234" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Role / Access Level</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-none focus:outline-none focus:border-slate-800 text-slate-900 font-medium appearance-none">
                      <option value="customer">Client</option>
                      <option value="manager">Manager</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="engineer">Engineer</option>
                      <option value="accountant">Accountant</option>
                      <option value="contractor">Contractor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold uppercase text-xs tracking-widest rounded-none hover:bg-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-orange-600 text-white font-bold uppercase text-xs tracking-widest rounded-none hover:bg-orange-700 transition-colors flex justify-center items-center gap-2">
                    {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

        {/* Users List */}
        <div>
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden flex flex-col">
             <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
               <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Active Accounts</h2>
               <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-none border border-slate-200 uppercase tracking-widest">{users.length} Total</span>
             </div>
             
             <div className="flex-1 overflow-auto max-h-[600px]">
               {isLoading ? (
                 <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                    <Loader className="w-8 h-8 animate-spin mb-3 text-slate-400" />
                    <span className="font-bold tracking-widest uppercase text-xs">Loading accounts...</span>
                 </div>
               ) : users.length === 0 ? (
                 <div className="p-16 text-center text-slate-500 font-bold uppercase tracking-widest text-sm">No accounts found.</div>
               ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-white border-b border-slate-200">
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Name & Profile</th>
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Mobile</th>
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {users.map(user => (
                       <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-4">
                             {user.profileImage ? (
                               <img src={user.profileImage} alt={user.name} className="w-9 h-9 rounded-none object-cover border border-slate-200 shadow-sm" />
                             ) : (
                               <div className="w-9 h-9 rounded-none bg-slate-200 flex justify-center items-center text-slate-700 font-black text-sm uppercase shadow-sm">
                                 {user.name.charAt(0)}
                               </div>
                             )}
                             <div className="font-bold text-slate-900">{user.name}</div>
                           </div>
                         </td>
                         <td className="px-6 py-4 text-sm font-medium text-slate-700">
                            {user.phone}
                         </td>
                         <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none border ${
                             user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                             user.role === 'manager' ? 'bg-sky-50 text-sky-700 border-sky-200' : 
                             user.role === 'supervisor' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                             user.role === 'engineer' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                             user.role === 'contractor' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                             user.role === 'accountant' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                             'bg-emerald-50 text-emerald-700 border-emerald-200'
                           }`}>
                             {user.role}
                           </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <button onClick={() => handleDeleteUser(user._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200">
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
