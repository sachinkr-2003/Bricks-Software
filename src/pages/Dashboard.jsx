import React, { useState, useEffect } from 'react';
import { Target, Activity, CalendarCheck, CalendarDays, CheckCircle2, Clock, Camera, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({ totalProjects: 0, totalActiveWorkers: 0 });
  const [budgetStats, setBudgetStats] = useState({ materialCost: 0, amountPaid: 0 });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const fetchData = async () => {
    try {
      const [dashRes, budgetRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/budget')
      ]);
      setDashboardStats(dashRes.data);
      setBudgetStats(budgetRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    try {
      await api.put('/projects/config', {
        totalBudget: Number(newBudget),
        approvedAdditional: Number(newLimit)
      });
      alert('Project Configuration Updated');
      setIsSettingsModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Error updating configuration');
    }
  };

  const materialUsageChartData = [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* 6. TRANSPARENCY: DAILY SNAPSHOT */}
      <div className="bg-slate-900 border border-slate-800 rounded-none shadow-sm p-6 text-white flex flex-col lg:flex-row justify-between items-center gap-6">
         <div className="shrink-0 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
               <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">Live Transparency Engine</p>
               <h2 className="text-2xl font-serif font-bold text-white leading-tight">Today's Snapshot</h2>
            </div>
            <button 
              onClick={() => setIsSettingsModalOpen(true)}
              className="ml-4 bg-slate-800 text-xs font-bold px-3 py-1 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Admin Settings
            </button>
         </div>
         
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="bg-slate-800 p-4 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Projects</span>
               <span className="font-bold text-white text-sm line-clamp-2">{dashboardStats.totalProjects} Active</span>
            </div>
            <div className="bg-slate-800 p-4 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Material Expenditure</span>
               <span className="font-bold text-white text-sm">₹{budgetStats.materialCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-800 p-4 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Workforce Deployed</span>
               <span className="font-bold text-white text-sm">{dashboardStats.totalActiveWorkers} Active Labour</span>
            </div>
            <div className="bg-slate-800 p-4 border-t-4 border-t-orange-500 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Expenditure</span>
               <span className="font-bold text-green-400 text-xl tracking-tight">₹{budgetStats.amountPaid.toLocaleString('en-IN')}</span>
            </div>
         </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Overall Completion */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Overall Completion</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">0%</h2>
            </div>
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-none">
            <div className="bg-orange-600 h-full w-[0%] rounded-none"></div>
          </div>
        </div>

        {/* 2. Current Stage */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Current Stage</p>
              <h2 className="text-xl font-bold text-slate-900 mt-2">Not Started</h2>
            </div>
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* 3. Start Date */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Start Date</p>
              <h2 className="text-xl font-bold text-slate-900 mt-2">-</h2>
            </div>
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* 3. Expected Completion */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Expected Completion</p>
              <h2 className="text-xl font-bold text-slate-900 mt-2">-</h2>
            </div>
            <CalendarDays className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </div>

      {/* MATERIAL TRACKING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Material Chart */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-orange-600" /> Overall Material Chart
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={materialUsageChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} width={80} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip cursor={{ stroke: '#cbd5e1' }} contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="amount" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Material Usage List */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6">
           <h2 className="text-lg font-bold text-slate-900 mb-6">Overall Material Details</h2>
           <div className="overflow-x-auto border border-slate-200">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-600">Date</th>
                    <th className="px-4 py-3 font-bold text-slate-600">Item</th>
                    <th className="px-4 py-3 font-bold text-slate-600">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-slate-500 font-medium">No materials logged yet.</td>
                  </tr>
                </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* TODAY'S WORK, UPCOMING TASKS, PHOTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 4. Today's Work */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Today's Work
          </h2>
          <ul className="space-y-3">
             <li className="text-slate-500 text-sm font-medium text-center py-4">No tasks logged for today</li>
          </ul>
        </div>

        {/* 6. Upcoming Tasks */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-blue-600" /> Upcoming Tasks
          </h2>
          <ul className="space-y-3">
             <li className="text-slate-500 text-sm font-medium text-center py-4">No upcoming tasks scheduled</li>
          </ul>
        </div>

        {/* 5. Site Photos */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Camera className="w-5 h-5 text-slate-900" /> Site Photos
          </h2>
          <div className="flex-1 flex items-center justify-center bg-slate-50 border border-dashed border-slate-300 min-h-[120px]">
             <span className="text-slate-500 text-sm font-medium">No photos uploaded</span>
          </div>
        </div>

      </div>

      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h2 className="font-bold text-sm uppercase tracking-wider">Project Configuration</h2>
              <button 
                onClick={() => setIsSettingsModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors">
                  ✕
              </button>
            </div>
            <form onSubmit={handleUpdateConfig} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Contract Value (₹)</label>
                <input 
                  type="number" 
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Approved Additional Limit (₹)</label>
                <input 
                  type="number" 
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 hover:bg-slate-900 transition-colors uppercase">Save Settings</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
