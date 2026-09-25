import React, { useState, useEffect } from 'react';
import { User, Phone, Building, LogOut, Shield, Bell, Key, Briefcase, Camera, RefreshCw } from 'lucide-react';
import api from '../services/api';

const Profile = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPin, setEditPin] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      // First load from localStorage (instant)
      const raw = localStorage.getItem('user');
      if (raw) {
        const local = JSON.parse(raw);
        setUser(local);
        setEditName(local.name || '');
      }
      // Then fetch fresh from backend
      const { data } = await api.get('/auth/profile');
      setUser(data);
      setEditName(data.name || '');
      // Update local storage too
      const existing = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...existing, ...data }));
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMsg('');
    try {
      const payload = { name: editName };
      if (editPin.trim()) payload.pin = editPin;
      const { data } = await api.put('/auth/profile', payload);
      setUser(data);
      // Update localStorage
      const existing = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...existing, ...data }));
      setSaveMsg('Profile updated successfully!');
      setEditPin('');
      setIsEditing(false);
      // Force navbar to re-read by dispatching event
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setSaveMsg('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const name = user?.name || '—';
  const role = (user?.role || '—').toUpperCase();
  const phone = user?.phone || '—';
  const profileImage = user?.profileImage;

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Banner Header */}
      <div className="h-32 bg-slate-900 border border-slate-950 relative overflow-hidden flex items-center px-8 shadow-sm">
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: '0.2' }}></div>
         <div className="relative z-10 flex justify-between w-full items-center">
            <div>
              <h1 className="text-3xl font-serif font-black text-white tracking-tight">Account Settings</h1>
              <p className="text-orange-500 font-bold tracking-widest uppercase text-[10px] mt-1">Brick By Brick • Management Profile</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadProfile}
                className="bg-slate-800 border border-slate-700 text-slate-300 font-bold py-2 px-4 hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button 
                onClick={onLogout}
                className="bg-red-600 text-white font-bold py-2 px-6 hover:bg-red-700 transition-colors flex items-center gap-2 shadow-xl border border-red-800"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-6 gap-6">
         
         {/* Left Settings Sidebar */}
         <div className="lg:w-1/4 shrink-0 flex flex-col gap-1">
            <button onClick={() => setActiveTab('account')} className={`text-left px-4 py-3 font-bold text-sm transition-colors border-l-4 ${activeTab === 'account' ? 'bg-white border-orange-600 text-slate-900 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-200'}`}>
               <span className="flex items-center gap-2"><User className="w-4 h-4"/>Personal Details</span>
            </button>
            <button onClick={() => setActiveTab('security')} className={`text-left px-4 py-3 font-bold text-sm transition-colors border-l-4 ${activeTab === 'security' ? 'bg-white border-orange-600 text-slate-900 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-200'}`}>
               <span className="flex items-center gap-2"><Key className="w-4 h-4"/>Login & Security</span>
            </button>
         </div>

         {/* Right Main Content */}
         <div className="lg:w-3/4 flex-1">
            
            {activeTab === 'account' && (
              <div className="bg-white border border-slate-300 shadow-sm">
                 {/* Profile Header */}
                 <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-6">
                    <div className="relative w-20 h-20 bg-slate-900 flex items-center justify-center p-1 shadow-md shrink-0">
                       <div className="w-full h-full border border-slate-700 flex items-center justify-center bg-slate-800 overflow-hidden">
                          {profileImage
                            ? <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                            : <User className="w-8 h-8 text-orange-500" />
                          }
                       </div>
                    </div>
                    <div>
                       {isLoading
                         ? <div className="h-7 w-40 bg-slate-200 animate-pulse rounded mb-2" />
                         : <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{name}</h2>
                       }
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 mb-2">{role}</p>
                       <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 font-bold uppercase tracking-widest">Active Status</span>
                    </div>
                 </div>

                 <div className="p-6 space-y-6">

                   {saveMsg && (
                     <div className={`p-3 text-sm font-bold border ${saveMsg.includes('Error') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                       {saveMsg}
                     </div>
                   )}

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                          {isEditing
                            ? <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="w-full border border-orange-400 bg-white px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-orange-600"
                              />
                            : <div className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold">
                                {isLoading ? <span className="text-slate-300">Loading...</span> : name}
                              </div>
                          }
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role / Access Level</label>
                          <div className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 font-bold">
                            {isLoading ? <span className="text-slate-300">Loading...</span> : role}
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Mobile</label>
                          <div className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            {isLoading ? <span className="text-slate-300">Loading...</span> : phone}
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Since</label>
                          <div className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium">
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                              : '—'
                            }
                          </div>
                       </div>
                    </div>

                 </div>

                 <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    {isEditing ? (
                      <>
                        <button onClick={() => { setIsEditing(false); setSaveMsg(''); }} className="bg-white text-slate-700 font-bold py-2 px-6 border border-slate-300 hover:bg-slate-100 transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={isSaving} className="bg-orange-600 text-white font-bold py-2 px-6 hover:bg-slate-900 transition-colors disabled:opacity-60">
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white font-bold py-2 px-6 border border-slate-900 hover:bg-slate-800 transition-colors">
                        Edit Profile
                      </button>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white border border-slate-300 shadow-sm">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900">Change PIN</h3>
                  <p className="text-sm text-slate-500 mt-1">Update your secure login PIN</p>
                </div>
                <div className="p-6 space-y-4">
                  {saveMsg && (
                    <div className={`p-3 text-sm font-bold border ${saveMsg.includes('Error') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                      {saveMsg}
                    </div>
                  )}
                  <div className="space-y-1 max-w-sm">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New PIN</label>
                    <input
                      type="password"
                      value={editPin}
                      onChange={e => setEditPin(e.target.value)}
                      placeholder="Enter new PIN (numbers only)"
                      className="w-full border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={!editPin.trim() || isSaving}
                    className="bg-orange-600 text-white font-bold py-2 px-6 hover:bg-slate-900 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Update PIN'}
                  </button>
                </div>
              </div>
            )}

         </div>
      </div>
    </div>
  );
};

export default Profile;
