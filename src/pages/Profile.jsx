import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, LogOut, Shield, Bell, Key, Briefcase, Camera } from 'lucide-react';

const Profile = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('account');

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
            <button 
              onClick={onLogout}
              className="bg-red-600 text-white font-bold py-2 px-6 hover:bg-red-700 transition-colors flex items-center gap-2 shadow-xl border border-red-800"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-6 gap-6">
         
         {/* Left Settings Sidebar */}
         <div className="lg:w-1/4 shrink-0 flex flex-col gap-1">
            <button onClick={() => setActiveTab('account')} className={`text-left px-4 py-3 font-bold text-sm transition-colors border-l-4 ${activeTab === 'account' ? 'bg-white border-orange-600 text-slate-900 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-200'}`}>
               <span className="flex items-center gap-2"><User className="w-4 h-4"/> Personal Details</span>
            </button>
            <button onClick={() => setActiveTab('security')} className={`text-left px-4 py-3 font-bold text-sm transition-colors border-l-4 ${activeTab === 'security' ? 'bg-white border-orange-600 text-slate-900 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-200'}`}>
               <span className="flex items-center gap-2"><Key className="w-4 h-4"/> Login & Security</span>
            </button>
            <button onClick={() => setActiveTab('projects')} className={`text-left px-4 py-3 font-bold text-sm transition-colors border-l-4 ${activeTab === 'projects' ? 'bg-white border-orange-600 text-slate-900 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-200'}`}>
               <span className="flex items-center gap-2"><Briefcase className="w-4 h-4"/> Assigned Projects</span>
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`text-left px-4 py-3 font-bold text-sm transition-colors border-l-4 ${activeTab === 'notifications' ? 'bg-white border-orange-600 text-slate-900 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-200'}`}>
               <span className="flex items-center gap-2"><Bell className="w-4 h-4"/> Alerts & Notifications</span>
            </button>
         </div>

         {/* Right Main Content */}
         <div className="lg:w-3/4 flex-1">
            
            {activeTab === 'account' && (
              <div className="bg-white border border-slate-300 shadow-sm">
                 <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-6">
                    <div className="relative group cursor-pointer w-20 h-20 bg-slate-900 flex items-center justify-center p-1 shadow-md shrink-0">
                       <div className="w-full h-full border border-slate-700 flex items-center justify-center bg-slate-800 overflow-hidden relative">
                          {/* Image Placeholder */}
                          <User className="w-8 h-8 text-orange-500" />
                          
                          {/* Upload Overlay (Hover) */}
                          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[9px] text-white font-bold uppercase tracking-widest text-center">Update<br/>Photo</span>
                          </div>
                          
                          {/* Hidden File Input */}
                          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                       </div>
                       
                       {/* Camera Badge */}
                       <div className="absolute -bottom-2 -right-2 bg-orange-600 w-7 h-7 flex items-center justify-center shadow-lg border-2 border-slate-50 pointer-events-none">
                          <Camera className="w-3.5 h-3.5 text-white" />
                       </div>
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Amit Sharma</h2>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 mb-2">Senior Site Manager</p>
                       <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 font-bold uppercase tracking-widest">Active Status</span>
                    </div>
                 </div>

                 <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                          <input type="text" value="Amit Sharma" readOnly className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:outline-none" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee ID</label>
                          <input type="text" value="EMP-2084" readOnly className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 font-bold focus:outline-none" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Email</label>
                          <input type="email" value="amit.sharma@brickbybrick.in" readOnly className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium focus:outline-none" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Number</label>
                          <input type="text" value="+91 98765 43210" readOnly className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium focus:outline-none" />
                       </div>
                    </div>
                    
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Posting</label>
                       <div className="w-full border border-slate-200 bg-slate-50 px-3 py-2 pb-3">
                          <p className="text-slate-900 font-bold flex items-center gap-2"><Building className="w-4 h-4 text-slate-400" /> DLF Phase 3 Villa Project</p>
                          <p className="text-xs text-slate-500 mt-1 pl-6">Sector 24, Gurgaon, Haryana 122002</p>
                       </div>
                    </div>
                 </div>
                 <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <button className="bg-slate-900 text-white font-bold py-2 px-6 border border-slate-900 hover:bg-slate-800 transition-colors">Edit Personal Info</button>
                 </div>
              </div>
            )}

            {/* Empty States for other tabs */}
            {activeTab !== 'account' && (
              <div className="bg-white border border-slate-300 shadow-sm p-16 flex flex-col items-center justify-center text-center">
                 <Shield className="w-16 h-16 text-slate-200 mb-4" />
                 <h3 className="text-xl font-bold text-slate-900 capitalize">{activeTab} Settings</h3>
                 <p className="text-sm text-slate-500 mt-2 max-w-sm">Use this configuration panel to manage your platform preferences and security tokens.</p>
              </div>
            )}

         </div>
      </div>
    </div>
  );
};

export default Profile;
