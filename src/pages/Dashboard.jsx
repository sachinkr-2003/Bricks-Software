import React from 'react';
import { Target, Activity, CalendarCheck, CalendarDays, CheckCircle2, Clock, Camera, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const materialUsageChartData = [
    { date: '12 Sep', amount: 15000 },
    { date: '13 Sep', amount: 28000 },
    { date: '14 Sep', amount: 42000 },
    { date: '15 Sep', amount: 38000 },
    { date: '16 Sep', amount: 25000 },
    { date: '17 Sep', amount: 55000 },
    { date: '18 Sep', amount: 41000 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* 6. TRANSPARENCY: DAILY SNAPSHOT */}
      <div className="bg-slate-900 border border-slate-800 rounded-none shadow-sm p-6 text-white flex flex-col lg:flex-row justify-between items-center gap-6">
         <div className="shrink-0 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
               <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">100% Transparency Guarantee</p>
               <h2 className="text-2xl font-serif font-bold text-white leading-tight">Today's Snapshot</h2>
            </div>
         </div>
         
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="bg-slate-800 p-4 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tasks Accomplished</span>
               <span className="font-bold text-white text-sm line-clamp-2">Slab Shuttering & Steel Binding</span>
            </div>
            <div className="bg-slate-800 p-4 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Material Utilized</span>
               <span className="font-bold text-white text-sm">45 Bags Cement, 800 Kg Steel</span>
            </div>
            <div className="bg-slate-800 p-4 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Workforce Deployed</span>
               <span className="font-bold text-white text-sm">4 Labour Present</span>
            </div>
            <div className="bg-slate-800 p-4 border-t-4 border-t-orange-500 border border-slate-700">
               <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Expenditure</span>
               <span className="font-bold text-green-400 text-xl tracking-tight">₹41,000</span>
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
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">62%</h2>
            </div>
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-none">
            <div className="bg-orange-600 h-full w-[62%] rounded-none"></div>
          </div>
        </div>

        {/* 2. Current Stage */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Current Stage</p>
              <h2 className="text-xl font-bold text-slate-900 mt-2">Roof Slab Casting</h2>
            </div>
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* 3. Start Date */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Start Date</p>
              <h2 className="text-xl font-bold text-slate-900 mt-2">12 August 2026</h2>
            </div>
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* 3. Expected Completion */}
        <div className="bg-white p-6 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Expected Completion</p>
              <h2 className="text-xl font-bold text-slate-900 mt-2">28 Feb 2027</h2>
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
                    <td className="px-4 py-3 text-slate-800">18 Sep, 10:00 AM</td>
                    <td className="px-4 py-3 text-slate-600">Ultratech Cement</td>
                    <td className="px-4 py-3 font-bold text-slate-800">45 Bags</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-800">18 Sep, 08:30 AM</td>
                    <td className="px-4 py-3 text-slate-600">Steel (12mm)</td>
                    <td className="px-4 py-3 font-bold text-slate-800">800 Kg</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-800">17 Sep</td>
                    <td className="px-4 py-3 text-slate-600">Red Bricks</td>
                    <td className="px-4 py-3 font-bold text-slate-800">4,500 Pcs</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-800">16 Sep</td>
                    <td className="px-4 py-3 text-slate-600">River Sand</td>
                    <td className="px-4 py-3 font-bold text-slate-800">2 Trucks</td>
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
             <li className="flex items-start gap-2">
               <div className="mt-1.5 w-1.5 h-1.5 bg-slate-900 rounded-none shrink-0"></div>
               <span className="text-slate-700 text-sm font-medium">Shuttering for 1st Floor Roof</span>
             </li>
             <li className="flex items-start gap-2">
               <div className="mt-1.5 w-1.5 h-1.5 bg-slate-900 rounded-none shrink-0"></div>
               <span className="text-slate-700 text-sm font-medium">Steel mesh reinforcement binding</span>
             </li>
             <li className="flex items-start gap-2">
               <div className="mt-1.5 w-1.5 h-1.5 bg-slate-900 rounded-none shrink-0"></div>
               <span className="text-slate-700 text-sm font-medium">Water curing on yesterday's brickwork</span>
             </li>
          </ul>
        </div>

        {/* 6. Upcoming Tasks */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-blue-600" /> Upcoming Tasks
          </h2>
          <ul className="space-y-3">
             <li className="flex items-start justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-700 text-sm font-medium">Complete Steel Binding</span>
               <span className="text-xs font-bold text-slate-400">Tomorrow</span>
             </li>
             <li className="flex items-start justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-700 text-sm font-medium">Electrical Conduit Laying</span>
               <span className="text-xs font-bold text-slate-400">In 2 Days</span>
             </li>
             <li className="flex items-start justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-700 text-sm font-medium">Concrete Pouring (Slab)</span>
               <span className="text-xs font-bold text-slate-400">In 4 Days</span>
             </li>
          </ul>
        </div>

        {/* 5. Site Photos */}
        <div className="bg-white border border-slate-200 rounded-none shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Camera className="w-5 h-5 text-slate-900" /> Site Photos
          </h2>
          <div className="grid grid-cols-2 gap-2 flex-1">
            <div className="bg-slate-100 overflow-hidden h-[120px] rounded-none">
              <img src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Site Photo" className="w-full h-full object-cover" />
            </div>
            <div className="bg-slate-100 overflow-hidden h-[120px] rounded-none">
              <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Material" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
