import React, { useState, useEffect } from 'react';
import { Target, Activity, CalendarCheck, CalendarDays, CheckCircle2, Clock, Camera, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({ totalProjects: 0, totalActiveWorkers: 0 });
  const [budgetStats, setBudgetStats] = useState({ materialCost: 0, amountPaid: 0, totalContractValue: 0, labourCost: 0, otherExpenses: 0 });
  const [project, setProject] = useState(null);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [materialChartData, setMaterialChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, budgetRes, projectsRes, updatesRes, materialsRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/budget'),
        api.get('/projects'),
        api.get('/updates'),
        api.get('/materials'),
      ]);

      setDashboardStats(dashRes.data);
      setBudgetStats(budgetRes.data);

      // Set first project info
      if (projectsRes.data && projectsRes.data.length > 0) {
        setProject(projectsRes.data[0]);
      }

      // Recent updates (today's work & upcoming)
      if (updatesRes.data) {
        setRecentUpdates(updatesRes.data.slice(0, 5));
      }

      // Recent materials for table
      if (materialsRes.data) {
        const mats = materialsRes.data.slice(0, 5);
        setRecentMaterials(mats);

        // Build chart data — group by date field (MaterialBill has a 'date' field)
        const grouped = {};
        materialsRes.data.forEach(m => {
          const rawDate = m.date || m.createdAt || null;
          const dateKey = rawDate ? rawDate.substring(0, 10) : 'Unknown';
          grouped[dateKey] = (grouped[dateKey] || 0) + (m.totalCost || 0);
        });
        const chartArr = Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-10)
          .map(([date, amount]) => ({
            date: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            amount
          }));
        setMaterialChartData(chartArr);
      }

    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch photos from updates that have images
  useEffect(() => {
    const photos = recentUpdates
      .flatMap(u => u.photos || [])
      .filter(Boolean)
      .slice(0, 4);
    setRecentPhotos(photos);
  }, [recentUpdates]);

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      if (!project) {
        // Create a brand new project
        const payload = {
          name: formData.get('name') || 'My Project',
          address: formData.get('address') || 'Site Address',
          startDate: formData.get('startDate') || undefined,
          expectedEndDate: formData.get('expectedEndDate') || undefined,
          currentStage: formData.get('currentStage') || 'Planning',
          completionPercentage: Number(formData.get('completionPercentage')) || 0,
          totalBudget: Number(newBudget) || 0,
          approvedAdditional: Number(newLimit) || 0,
        };
        await api.post('/projects', payload);
        alert('✅ Project created successfully!');
      } else {
        // Update existing project
        const payload = {
          startDate: formData.get('startDate') || undefined,
          expectedEndDate: formData.get('expectedEndDate') || undefined,
          currentStage: formData.get('currentStage') || project.currentStage,
          completionPercentage: Number(formData.get('completionPercentage')),
          totalBudget: Number(newBudget) || budgetStats.totalContractValue,
          approvedAdditional: Number(newLimit) || budgetStats.approvedAdditional,
        };
        await api.put(`/projects/${project._id}`, payload);
        alert('✅ Project updated successfully!');
      }
      setIsSettingsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error saving project. Please try again.');
    }
  };

  const formatINR = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

  const completionPct = project?.completionPercentage || 0;
  const currentStage = project?.currentStage || 'Not Started';
  const startDate = project?.startDate
    ? new Date(project.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const endDate = project?.expectedEndDate
    ? new Date(project.expectedEndDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* LIVE SNAPSHOT HEADER */}
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
               <span className="font-bold text-white text-sm">{dashboardStats.totalProjects} Active</span>
            </div>
            <div className="bg-slate-800 p-4 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Material Expenditure</span>
               <span className="font-bold text-white text-sm">{formatINR(budgetStats.materialCost)}</span>
            </div>
            <div className="bg-slate-800 p-4 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Workforce Deployed</span>
               <span className="font-bold text-white text-sm">{dashboardStats.totalActiveWorkers} Active Labour</span>
            </div>
            <div className="bg-slate-800 p-4 border-t-4 border-t-orange-500 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Expenditure</span>
               <span className="font-bold text-green-400 text-xl tracking-tight">{formatINR(budgetStats.amountPaid)}</span>
            </div>
         </div>
      </div>

      {/* KPI METRICS — Live from DB */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Overall Completion */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Overall Completion</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{completionPct}%</h2>
            </div>
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-none">
            <div className="bg-orange-600 h-full rounded-none transition-all duration-700" style={{ width: `${completionPct}%` }}></div>
          </div>
        </div>

        {/* 2. Current Stage */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Current Stage</p>
              <h2 className="text-xl font-bold text-slate-900 mt-2">{isLoading ? '...' : currentStage}</h2>
            </div>
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* 3. Start Date */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Start Date</p>
              <h2 className="text-xl font-bold text-slate-900 mt-2">{isLoading ? '...' : startDate}</h2>
            </div>
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* 4. Expected Completion */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Expected Completion</p>
              <h2 className="text-xl font-bold text-slate-900 mt-2">{isLoading ? '...' : endDate}</h2>
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
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">Loading chart...</div>
            ) : materialChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">No material data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={materialChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} width={80} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip cursor={{ stroke: '#cbd5e1' }} contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0' }} formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']} />
                  <Area type="monotone" dataKey="amount" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Material Details Table */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6">
           <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Material Entries</h2>
           <div className="overflow-x-auto border border-slate-200">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-600">Date</th>
                    <th className="px-4 py-3 font-bold text-slate-600">Item</th>
                    <th className="px-4 py-3 font-bold text-slate-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-400 font-medium">Loading...</td></tr>
                  ) : recentMaterials.length === 0 ? (
                    <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-500 font-medium">No materials logged yet.</td></tr>
                  ) : (
                    recentMaterials.map((mat, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-600">{mat.date ? new Date(mat.date).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          <div className="font-bold text-slate-900">{mat.materialName || '—'}</div>
                          <div className="text-xs text-slate-400">{mat.supplierName || ''}</div>
                        </td>
                        <td className="px-4 py-3 text-orange-600 font-bold">{formatINR(mat.totalCost)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* TODAY'S WORK, UPCOMING TASKS, PHOTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Work */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Today's Work
          </h2>
          <ul className="space-y-3">
            {isLoading ? (
              <li className="text-slate-400 text-sm font-medium text-center py-4">Loading...</li>
            ) : recentUpdates.filter(u => {
              const d = new Date(u.createdAt);
              const today = new Date();
              return d.toDateString() === today.toDateString();
            }).length === 0 ? (
              <li className="text-slate-500 text-sm font-medium text-center py-4">No tasks logged for today</li>
            ) : (
              recentUpdates
                .filter(u => {
                  const d = new Date(u.createdAt);
                  return d.toDateString() === new Date().toDateString();
                })
                .map((u, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700 font-medium">{u.workCompleted || u.workInProgress || 'Update logged'}</span>
                  </li>
                ))
            )}
          </ul>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-blue-600" /> Recent Updates
          </h2>
          <ul className="space-y-3">
            {isLoading ? (
              <li className="text-slate-400 text-sm font-medium text-center py-4">Loading...</li>
            ) : recentUpdates.length === 0 ? (
              <li className="text-slate-500 text-sm font-medium text-center py-4">No updates yet</li>
            ) : (
              recentUpdates.slice(0, 4).map((u, i) => (
                <li key={i} className="flex items-start gap-3 text-sm border-b border-slate-50 pb-2 last:border-0">
                  <Clock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-700 font-medium line-clamp-1">{u.workCompleted || u.workInProgress || 'Update'}</p>
                    <p className="text-slate-400 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : ''}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Site Photos */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Camera className="w-5 h-5 text-slate-900" /> Site Photos
          </h2>
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading...</div>
          ) : recentPhotos.length === 0 ? (
            <div className="flex-1 flex items-center justify-center bg-slate-50 border border-dashed border-slate-300 min-h-[120px]">
               <span className="text-slate-500 text-sm font-medium">No photos uploaded</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {recentPhotos.map((url, i) => (
                <img key={i} src={url} alt={`Site photo ${i+1}`} className="w-full h-24 object-cover border border-slate-200" />
              ))}
            </div>
          )}
        </div>

      </div>

      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-lg w-full shadow-2xl">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h2 className="font-bold text-sm uppercase tracking-wider">
                {project ? 'Edit Project Configuration' : '+ Create New Project'}
              </h2>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleUpdateConfig} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {!project && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Project Name *</label>
                    <input type="text" name="name" required placeholder="e.g. DLF Phase 3 Villa"
                      className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Site Address *</label>
                    <input type="text" name="address" required placeholder="e.g. Sector 24, Gurgaon"
                      className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500" />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Start Date</label>
                  <input type="date" name="startDate" defaultValue={project?.startDate?.substring(0, 10) || ''}
                    className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expected End Date</label>
                  <input type="date" name="expectedEndDate" defaultValue={project?.expectedEndDate?.substring(0, 10) || ''}
                    className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Stage</label>
                <select name="currentStage" defaultValue={project?.currentStage || 'Planning'}
                  className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500">
                  {['Planning','Site Preparation','Foundation','Framing','Roofing','Plumbing','Electrical','Finishing','Handover'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Completion % (0–100)</label>
                <input type="number" min="0" max="100" name="completionPercentage"
                  defaultValue={project?.completionPercentage || 0}
                  className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Contract Value (₹) *</label>
                <input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} required
                  placeholder={project ? `Current: ${formatINR(budgetStats.totalContractValue)}` : 'e.g. 5000000'}
                  className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Approved Additional Limit (₹)</label>
                <input type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)}
                  placeholder={project ? `Current: ${formatINR(budgetStats.approvedAdditional)}` : '0'}
                  className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500" />
              </div>

              <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 hover:bg-slate-900 transition-colors uppercase tracking-wider">
                {project ? 'Update Project' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

