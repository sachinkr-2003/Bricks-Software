import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Shield, Trash2, Key, Loader, ImagePlus, Eye, Edit2 } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../services/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

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
    if (!name || !phone) {
      Swal.fire({ icon: 'warning', title: 'Incomplete', text: 'Please fill name and phone', confirmButtonColor: '#ea580c' });
      return;
    }
    if (!editMode && !pin) {
      Swal.fire({ icon: 'warning', title: 'Incomplete', text: 'Please provide a login PIN for new user', confirmButtonColor: '#ea580c' });
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      if (editMode) {
        const payload = { name, phone, role, profileImage };
        if (pin) payload.pin = pin;
        const { data: updatedUser } = await api.put(`/auth/${editingUserId}`, payload);
        // Optimistically update local state immediately
        setUsers(prev => prev.map(u => u._id === editingUserId ? { ...u, ...updatedUser } : u));
        Swal.fire({ icon: 'success', title: 'Updated!', text: 'User successfully updated.', confirmButtonColor: '#ea580c', timer: 2000 });
      } else {
        const { data: newUser } = await api.post('/auth/register', { name, phone, pin, role, profileImage });
        // Optimistically add new user to the top of the list immediately
        setUsers(prev => [newUser, ...prev]);
        Swal.fire({ icon: 'success', title: 'Created!', text: 'User successfully registered.', confirmButtonColor: '#ea580c', timer: 2000 });
      }
      resetForm();
      setIsModalOpen(false);
      fetchUsers(); // Sync in background
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error saving user', confirmButtonColor: '#ea580c' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName(''); setPhone(''); setPin(''); setRole('customer'); setProfileImage('');
    setEditMode(false); setEditingUserId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This user's login access will be permanently revoked!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#f1f5f9',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: '<span style="color: black">Cancel</span>'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/auth/${id}`);
        setUsers(users.filter(u => u._id !== id));
        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'User has been removed.', confirmButtonColor: '#ea580c', timer: 1500 });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error deleting user', confirmButtonColor: '#ea580c' });
      }
    }
  };

  const handleViewUser = (user) => {
    Swal.fire({
      title: 'User Details',
      html: `
        <div style="text-align: left; padding: 10px; font-family: sans-serif;">
          ${user.profileImage ? `<div style="text-align:center; margin-bottom: 20px;"><img src="${user.profileImage}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid #ea580c;" /></div>` : ''}
          <p style="margin-bottom: 8px;"><strong>Full Name:</strong> ${user.name}</p>
          <p style="margin-bottom: 8px;"><strong>Phone:</strong> ${user.phone}</p>
          <p><strong>Designation:</strong> <span style="text-transform: uppercase; font-weight: bold; background: #f8fafc; padding: 2px 6px; border: 1px solid #e2e8f0;">${user.role}</span></p>
        </div>
      `,
      confirmButtonColor: '#ea580c'
    });
  };

  const handleEditUser = (user) => {
    setEditMode(true);
    setEditingUserId(user._id);
    setName(user.name);
    setPhone(user.phone);
    setRole(user.role);
    setPin(''); // Do not display original PIN
    setProfileImage(user.profileImage || '');
    setIsModalOpen(true);
  };


  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-none shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest">App Users</h1>
            <p className="text-slate-500 text-sm mt-1">Manage personnel access and client accounts.</p>
          </div>
          <button 
            onClick={openCreateModal}
            className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-none font-bold uppercase text-xs tracking-widest transition-colors flex items-center gap-2"
          >
            + New User
          </button>
        </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 text-sm flex justify-between items-center">
          <span>⚠ {error}</span>
          <button onClick={fetchUsers} className="text-xs font-bold underline">Retry</button>
        </div>
      )}

      <div className="w-full">
            
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-2xl max-w-md w-full relative flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                {editMode ? 'Edit User' : 'Register User'}
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
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    {editMode ? 'Reset Login PIN (Optional)' : 'Login PIN (4-Digits)'}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-none focus:outline-none focus:border-slate-800 text-slate-900 font-medium" placeholder={editMode ? 'Type new PIN or leave blank' : 'e.g. 1234'} />
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
                    {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : editMode ? 'Save Changes' : 'Create'}
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
                 <table className="w-full text-left border-collapse border border-slate-300">
                   <thead>
                     <tr className="bg-slate-100">
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300">Name & Profile</th>
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300">Mobile</th>
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300">Role</th>
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest text-center border border-slate-300">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {users.map(user => (
                       <tr key={user._id} className="hover:bg-orange-50/30 transition-colors">
                         <td className="px-6 py-4 border border-slate-300">
                           <div className="flex items-center gap-4">
                             {user.profileImage ? (
                               <img src={user.profileImage} alt={user.name} className="w-9 h-9 rounded-none object-cover border border-slate-300 shadow-sm" />
                             ) : (
                               <div className="w-9 h-9 rounded-none bg-slate-200 flex justify-center items-center text-slate-700 font-black text-sm uppercase shadow-sm border border-slate-300">
                                 {user.name.charAt(0)}
                               </div>
                             )}
                             <div className="font-bold text-slate-900">{user.name}</div>
                           </div>
                         </td>
                         <td className="px-6 py-4 text-sm font-medium text-slate-700 border border-slate-300">
                            {user.phone}
                         </td>
                         <td className="px-6 py-4 border border-slate-300">
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
                         <td className="px-6 py-4 border border-slate-300 text-center">
                           <div className="flex items-center justify-center gap-2">
                             <button onClick={() => handleViewUser(user)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors border border-transparent hover:border-sky-200" title="View Details">
                               <Eye className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleEditUser(user)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200" title="Edit User">
                               <Edit2 className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleDeleteUser(user._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200" title="Delete User">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
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
