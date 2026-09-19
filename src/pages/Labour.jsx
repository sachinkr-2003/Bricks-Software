import React, { useState, useMemo } from 'react';
import { Plus, Filter, Users, Search, X } from 'lucide-react';
import Swal from 'sweetalert2';

// Initial pre-added master list of all labours
const initialMasterLabours = [
  { id: 'L-101', name: 'Raju', category: 'Mistri (Mason)', defaultCost: 800 },
  { id: 'L-102', name: 'Ramesh', category: 'Mistri (Mason)', defaultCost: 800 },
  { id: 'L-103', name: 'Suresh', category: 'Mazdoor (Helper)', defaultCost: 500 },
  { id: 'L-104', name: 'Dinesh', category: 'Mazdoor (Helper)', defaultCost: 500 },
  { id: 'L-105', name: 'Kamlesh', category: 'Plumber', defaultCost: 600 },
  { id: 'L-106', name: 'Mohan', category: 'Electrician', defaultCost: 700 },
  { id: 'L-107', name: 'Suraj', category: 'Mazdoor (Helper)', defaultCost: 500 },
];

const Labour = () => {
  const [filterDate, setFilterDate] = useState('Today');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [masterLabours, setMasterLabours] = useState(initialMasterLabours);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Initial Attendance Records
  const [labourRecords, setLabourRecords] = useState([
    { id: 1, date: '19 Sep 2026', name: 'Raju (L-101)', category: 'Mistri (Mason)', present: true, hours: '8', cost: '₹800' },
    { id: 2, name: 'Ramesh (L-102)', date: '19 Sep 2026', category: 'Mistri (Mason)', present: true, hours: '8', cost: '₹800' },
    { id: 3, name: 'Suresh (L-103)', date: '19 Sep 2026', category: 'Mazdoor (Helper)', present: true, hours: '8', cost: '₹500' },
    { id: 4, name: 'Dinesh (L-104)', date: '19 Sep 2026', category: 'Mazdoor (Helper)', present: false, hours: '-', cost: '₹0' },
    { id: 5, name: 'Kamlesh (L-105)', date: '19 Sep 2026', category: 'Plumber', present: true, hours: '4', cost: '₹600' },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    date: '19 Sep 2026',
    selectedLabourId: '', // Added this
    name: '',
    category: '',
    present: true,
    hours: '8',
    cost: '',
  });

  // Handle Dropdown selection for Labour Name
  const handleLabourSelect = (e) => {
    const selectedId = e.target.value;
    const labour = masterLabours.find(l => l.id === selectedId);
    
    if (labour) {
      setFormData(prev => ({
        ...prev,
        selectedLabourId: selectedId,
        name: `${labour.name} (${labour.id})`,
        category: labour.category,
        cost: labour.defaultCost.toString(),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedLabourId: '',
        name: '',
        category: '',
        cost: '',
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [registerForm, setRegisterForm] = useState({ name: '', category: 'Mazdoor (Helper)', defaultCost: '' });
  
  const handleRegisterInput = (e) => setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newId = `L-${100 + masterLabours.length + 1}`;
    setMasterLabours([...masterLabours, { id: newId, name: registerForm.name, category: registerForm.category, defaultCost: Number(registerForm.defaultCost) }]);
    
    setIsRegisterModalOpen(false);
    setRegisterForm({ name: '', category: 'Mazdoor (Helper)', defaultCost: '' });
    
    Swal.fire({
        title: 'Registered',
        text: 'New Labour has been added to the master list.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.selectedLabourId) {
      Swal.fire({
        title: 'Selection Required',
        text: 'Please select a labour from the dropdown first.',
        icon: 'warning',
        confirmButtonColor: '#0f172a',
        shape: 'square'
      });
      return;
    }
    
    const newEntry = {
      id: labourRecords.length + 1,
      date: formData.date,
      name: formData.name,
      category: formData.category,
      present: formData.present,
      cost: formData.present ? `₹${formData.cost}` : '₹0',
      hours: formData.present ? formData.hours : '-'
    };
    
    setLabourRecords([newEntry, ...labourRecords]);
    setIsAddModalOpen(false);

    Swal.fire({
        title: 'Marked!',
        text: 'Attendance has been successfully recorded.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
    
    // Reset Form
    setFormData({
      date: '19 Sep 2026',
      selectedLabourId: '',
      name: '',
      category: '',
      present: true,
      hours: '8',
      cost: '',
    });
  };

  // Filter Logic Component
  const filteredRecords = useMemo(() => {
    return labourRecords.filter(record => {
      // Date filter (Mock logic - exact string match for demo)
      const dateMatch = filterDate === 'All' ? true : (filterDate === 'Today' ? record.date === '19 Sep 2026' : record.date !== '19 Sep 2026');
      
      // Category filter
      const catMatch = filterCategory === 'All' ? true : record.category.includes(filterCategory);
      
      // Search filter
      const searchStr = searchQuery.toLowerCase();
      const searchMatch = searchQuery === '' ? true : (record.name.toLowerCase().includes(searchStr) || record.category.toLowerCase().includes(searchStr));

      return dateMatch && catMatch && searchMatch;
    });
  }, [labourRecords, filterDate, filterCategory, searchQuery]);

  // Calculate Today's Stats dynamically
  const todaysRecords = labourRecords.filter(r => r.date === '19 Sep 2026');
  const presentCount = todaysRecords.filter(r => r.present).length;
  const totalCost = todaysRecords.reduce((sum, r) => {
    const cleanNum = parseInt(r.cost.replace('₹', '').replace(',', '')) || 0;
    return sum + cleanNum;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Top Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-slate-300 rounded-none shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Today's Attendance</p>
             <h2 className="text-3xl font-extrabold text-slate-900 mt-1">{presentCount} <span className="text-lg font-bold text-slate-400">/ {todaysRecords.length} Present</span></h2>
           </div>
           <Users className="w-10 h-10 text-orange-600" />
        </div>
        <div className="bg-white p-6 border border-slate-300 rounded-none shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Today's Labour Cost</p>
             <h2 className="text-3xl font-extrabold text-slate-900 mt-1">₹{totalCost.toLocaleString()}</h2>
           </div>
           <p className="text-xs font-bold text-green-600 uppercase">Within Budget</p>
        </div>
      </div>

      {/* Header & Advanced Filters (One Line) */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-6 border border-slate-300 rounded-none shadow-sm">
        
        <div className="shrink-0">
          <h1 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Labour Attendance</h1>
          <p className="text-sm text-slate-500 mt-1">Track daily workforce and expenses</p>
        </div>

        <div className="flex flex-wrap xl:flex-nowrap items-center gap-3 w-full xl:w-auto">
          
          {/* Search Bar */}
          <div className="relative w-full xl:w-56 grow">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
               <Search className="w-4 h-4" />
             </div>
             <input 
               type="search" 
               placeholder="Search name/ID..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-medium py-2 pl-9 pr-4 rounded-none focus:outline-none focus:border-slate-900"
             />
          </div>

          {/* Category Filter */}
          <div className="relative w-full xl:w-40 shrink-0">
             <select 
               className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-700 font-medium py-2 pl-4 pr-9 rounded-none focus:outline-none focus:border-slate-900"
               value={filterCategory}
               onChange={(e) => setFilterCategory(e.target.value)}
             >
               <option value="All">All Categories</option>
               <option value="Mistri">Mistri (Mason)</option>
               <option value="Mazdoor">Mazdoor (Helper)</option>
               <option value="Plumber">Plumber</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
               <Filter className="w-3.5 h-3.5" />
             </div>
          </div>

          {/* Date Filter */}
          <div className="relative w-full xl:w-36 shrink-0">
             <select 
               className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-700 font-medium py-2 pl-4 pr-9 rounded-none focus:outline-none focus:border-slate-900"
               value={filterDate}
               onChange={(e) => setFilterDate(e.target.value)}
             >
               <option value="Today">Date: Today</option>
               <option value="Yesterday">Yesterday</option>
               <option value="All">All Dates</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
               <Filter className="w-3.5 h-3.5" />
             </div>
          </div>

          <div className="flex items-center gap-2 w-full xl:w-auto">
            <button 
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-white text-slate-900 font-medium py-2 px-4 rounded-none hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shrink-0 border border-slate-300 w-full xl:w-auto shadow-sm"
            >
              <Users className="w-4 h-4" /> Add Labour
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-slate-900 text-white font-medium py-2 px-5 rounded-none hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shrink-0 border border-slate-900 w-full xl:w-auto shadow-sm"
            >
              <Plus className="w-4 h-4" /> Mark
            </button>
          </div>
          
        </div>
      </div>

      {/* Classic Simple Table */}
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse border border-slate-300">
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th className="px-4 py-3 font-bold border border-slate-300">Date</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Labour Name & ID</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Category</th>
                <th className="px-4 py-3 font-bold border border-slate-300 text-center">Status</th>
                <th className="px-4 py-3 font-bold border border-slate-300 text-center">Working Hrs</th>
                <th className="px-4 py-3 font-bold border border-slate-300 text-right">Daily Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 border border-slate-300">{record.date}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 border border-slate-300">{record.name}</td>
                    <td className="px-4 py-3 text-slate-900 border border-slate-300">{record.category}</td>
                    <td className="px-4 py-3 text-center font-bold border border-slate-300">
                      {record.present ? (
                        <span className="text-green-600">Present</span>
                      ) : (
                        <span className="text-red-600">Absent</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-900 border border-slate-300">
                      {record.hours}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 border border-slate-300 text-right">
                      {record.cost}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-medium border border-slate-300">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/MARK ATTENDANCE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Mark Labour Attendance</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-red-600 transition-colors"
                title="Close"
              >
                <X className="w-6 h-6 stroke-2" /> 
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-5 space-y-5 text-sm text-slate-900 bg-slate-50/50">
              
              <div className="space-y-1.5">
                <label className="font-bold">Select Labour (Pre-added List)</label>
                <select 
                  className="w-full border border-slate-300 px-3 py-2.5 rounded-none focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white shadow-sm font-medium"
                  value={formData.selectedLabourId}
                  onChange={handleLabourSelect}
                  required
                >
                  <option value="" disabled>-- Select Labour from existing --</option>
                  {masterLabours.map(lab => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name} ({lab.id}) - {lab.category}
                    </option>
                  ))}
                </select>
              </div>

              {formData.selectedLabourId && (
                <div className="grid grid-cols-2 gap-4 p-4 border border-slate-200 bg-white">
                  <div>
                    <span className="block text-xs uppercase font-bold text-slate-400 tracking-wider">Category</span>
                    <span className="block font-bold mt-1 text-slate-800">{formData.category}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase font-bold text-slate-400 tracking-wider">Default Wage</span>
                    <span className="block font-bold mt-1 text-slate-800">₹{formData.cost}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-bold">Date</label>
                  <input type="text" name="date" required className="w-full border border-slate-300 px-3 py-2.5 rounded-none focus:outline-none focus:border-slate-900 bg-white shadow-sm" 
                    value={formData.date} onChange={handleInputChange} />
                </div>
                
                <div className="space-y-1.5">
                  <label className="font-bold">Attendance Status</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="present" checked={formData.present === true} onChange={() => setFormData({ ...formData, present: true })} className="accent-slate-900 w-4 h-4" />
                      <span className="font-medium">Present</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-red-600 font-bold">
                      <input type="radio" name="present" checked={formData.present === false} onChange={() => setFormData({ ...formData, present: false })} className="accent-red-600 w-4 h-4" />
                      <span>Absent</span>
                    </label>
                  </div>
                </div>
              </div>

              {formData.present && (
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold">Working Hours</label>
                    <input type="number" name="hours" placeholder="e.g. 8" className="w-full border border-slate-300 px-3 py-2.5 rounded-none focus:outline-none focus:border-slate-900 bg-white shadow-sm" 
                      value={formData.hours} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold flex justify-between">
                       <span>Total Cost (₹)</span>
                       <span className="text-xs text-slate-400 font-normal mt-0.5">Editable</span>
                    </label>
                    <input type="number" name="cost" required className="w-full border border-slate-300 px-3 py-2.5 rounded-none focus:outline-none focus:border-slate-900 bg-white shadow-sm" 
                      value={formData.cost} onChange={handleInputChange} />
                  </div>
                </div>
              )}

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
                  disabled={!formData.selectedLabourId}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-none hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Save Attendance
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* REGISTER NEW LABOUR MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Register New Labour</h2>
            </div>
            
            <form onSubmit={handleRegisterSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-sm">Full Name</label>
                <input type="text" name="name" required className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900" 
                  value={registerForm.name} onChange={handleRegisterInput} placeholder="e.g. Shyam" />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-sm">Category / Role</label>
                <select name="category" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900"
                  value={registerForm.category} onChange={handleRegisterInput}>
                  <option value="Mistri (Mason)">Mistri (Mason)</option>
                  <option value="Mazdoor (Helper)">Mazdoor (Helper)</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Electrician">Electrician</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-sm">Default Daily Wage (₹)</label>
                <input type="number" name="defaultCost" required className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900" 
                  value={registerForm.defaultCost} onChange={handleRegisterInput} placeholder="e.g. 500" />
              </div>

              <div className="pt-4 flex items-center gap-3 border-t border-slate-200 mt-2">
                <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="flex-1 py-2 font-bold text-slate-600 border border-slate-300">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-slate-900 text-white font-bold border border-slate-900">
                  Add Labour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Labour;
