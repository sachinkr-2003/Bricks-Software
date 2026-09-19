import React, { useState } from 'react';
import { Plus, Filter, Search, Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Updates = () => {
  const [filterType, setFilterType] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Initial Updates List
  const [updatesList, setUpdatesList] = useState([
    {
      id: 1,
      date: '19 Sep 2026',
      type: 'Daily',
      completed: 'Completed wooden shuttering for the ground floor hall area.',
      inProgress: 'Steel mesh binding is 50% done on the north side.',
      nextPlan: 'Complete the steel mesh binding tomorrow so concrete can be poured the day after.',
      issues: 'None',
      photos: [
        'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?ixlib=rb-4.0.3&w=400&q=80',
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&w=400&q=80'
      ]
    },
    {
      id: 2,
      date: '12 Sep 2026',
      type: 'Weekly',
      completed: 'All brickwork for ground floor interior walls finished. Water curing completed.',
      inProgress: 'Plumbing rough-ins in bathrooms.',
      nextPlan: 'Start shuttering process for the slab next week.',
      issues: 'Slight delay in plumbing materials delivery (expected tomorrow morning).',
      photos: []
    }
  ]);

  const [formData, setFormData] = useState({
    type: 'Daily',
    completed: '',
    inProgress: '',
    nextPlan: '',
    issues: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: updatesList.length + 1,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...formData,
      photos: []
    };
    
    setUpdatesList([newEntry, ...updatesList]);
    setIsAddModalOpen(false);
    
    // Reset Form
    setFormData({
      type: 'Daily',
      completed: '',
      inProgress: '',
      nextPlan: '',
      issues: '',
    });
  };

  const filteredUpdates = filterType === 'All' ? updatesList : updatesList.filter(u => u.type === filterType);

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Header & Advanced Filters (One Line) */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-6 border border-slate-300 rounded-none shadow-sm">
        
        <div className="shrink-0">
          <h1 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Site Updates</h1>
          <p className="text-sm text-slate-500 mt-1">Daily / Weekly logs, photos, and next plans</p>
        </div>

        <div className="flex flex-wrap xl:flex-nowrap items-center gap-3 w-full xl:w-auto">
          
          <button 
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`border px-3 py-2 text-sm font-medium transition-colors rounded-none flex items-center gap-2 shrink-0 ${notificationsEnabled ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'}`}
          >
            <Bell className={`w-4 h-4 ${notificationsEnabled ? 'fill-orange-600 text-orange-600' : ''}`} /> 
            {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
          </button>

          {/* Type Filter */}
          <div className="relative w-full xl:w-48 shrink-0">
             <select 
               className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-700 font-medium py-2 pl-4 pr-9 rounded-none focus:outline-none focus:border-slate-900"
               value={filterType}
               onChange={(e) => setFilterType(e.target.value)}
             >
               <option value="All">All Updates</option>
               <option value="Daily">Daily Updates</option>
               <option value="Weekly">Weekly Updates</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
               <Filter className="w-3.5 h-3.5" />
             </div>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-900 text-white font-medium py-2 px-5 rounded-none hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shrink-0 border border-slate-900 w-full xl:w-auto"
          >
            <Plus className="w-4 h-4" /> Add Update
          </button>
          
        </div>
      </div>

      {/* Updates Timeline/List */}
      <div className="space-y-6">
        {filteredUpdates.map((update) => (
          <div key={update.id} className="bg-white border border-slate-300 shadow-sm p-0 rounded-none overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Box: Date and Type */}
            <div className="bg-slate-50 md:w-48 shrink-0 p-6 border-b md:border-b-0 md:border-r border-slate-300 flex flex-col justify-center items-center text-center">
               <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">{update.type} Update</p>
               <h2 className="text-xl font-bold text-slate-900 leading-tight">
                 {update.date.split(' ')[0]} <br/> {update.date.split(' ')[1]} {update.date.split(' ')[2]}
               </h2>
            </div>
            
            {/* Right Box: Content */}
            <div className="flex-1 p-6 space-y-5">
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                   <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase mb-2">
                     <CheckCircle className="w-4 h-4 text-green-600" /> Work Completed
                   </h3>
                   <p className="text-slate-700 text-sm">{update.completed}</p>
                 </div>
                 <div>
                   <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase mb-2">
                     <Clock className="w-4 h-4 text-blue-600" /> In Progress
                   </h3>
                   <p className="text-slate-700 text-sm">{update.inProgress}</p>
                 </div>
               </div>

               <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                   <h3 className="text-sm font-bold text-slate-900 uppercase mb-2">Next Planned Work</h3>
                   <p className="text-slate-700 text-sm">{update.nextPlan}</p>
                 </div>
                 <div>
                   <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase mb-2">
                     <AlertTriangle className={`w-4 h-4 ${update.issues.toLowerCase() !== 'none' ? 'text-red-600' : 'text-slate-400'}`} /> 
                     Issues / Delays
                   </h3>
                   <p className={`text-sm ${update.issues.toLowerCase() !== 'none' ? 'text-red-600 font-medium' : 'text-slate-500'}`}>{update.issues}</p>
                 </div>
               </div>

               {/* Photos Section */}
               {update.photos && update.photos.length > 0 && (
                 <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase mb-3">Live Photos / Videos</h3>
                    <div className="flex flex-wrap gap-3">
                      {update.photos.map((img, i) => (
                        <div key={i} className="w-24 h-24 bg-slate-200 border border-slate-300 relative group cursor-pointer overflow-hidden">
                          <img src={img} alt="Update" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                      ))}
                    </div>
                 </div>
               )}

            </div>
          </div>
        ))}
      </div>

      {/* ADD UPDATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-300 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Upload Site Update</h2>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-5 text-sm text-slate-900">
              
              <div className="space-y-1.5">
                <label className="font-bold">Update Type</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="type" checked={formData.type === 'Daily'} onChange={() => setFormData({ ...formData, type: 'Daily' })} className="accent-slate-900 w-4 h-4" />
                    <span className="font-medium">Daily</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="type" checked={formData.type === 'Weekly'} onChange={() => setFormData({ ...formData, type: 'Weekly' })} className="accent-slate-900 w-4 h-4" />
                    <span className="font-medium">Weekly</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold">Work Completed</label>
                <textarea name="completed" required rows="2" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900 bg-white" 
                  value={formData.completed} onChange={handleInputChange} placeholder="What work was finished fully?"></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold">Work In Progress</label>
                <textarea name="inProgress" required rows="2" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900 bg-white" 
                  value={formData.inProgress} onChange={handleInputChange} placeholder="What is currently being worked on?"></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold">Next Planned Work</label>
                <textarea name="nextPlan" required rows="2" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900 bg-white" 
                  value={formData.nextPlan} onChange={handleInputChange} placeholder="What is planned for tomorrow/next week?"></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold">Issues / Delays (If any)</label>
                <textarea name="issues" rows="1" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900 bg-white" 
                  value={formData.issues} onChange={handleInputChange} placeholder="e.g. None, or Delay in material delivery"></textarea>
              </div>
              
              <div className="space-y-1.5">
                <label className="font-bold">Upload Photos / Videos</label>
                <input type="file" multiple name="fileUpload" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900 bg-slate-50 text-slate-500" />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 mt-4 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-none hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Post Update
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Updates;
