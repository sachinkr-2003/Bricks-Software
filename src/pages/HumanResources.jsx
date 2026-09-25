import React, { useState } from 'react';
import { Users, Truck, Plus, Search, Building2 } from 'lucide-react';
import api from '../services/api';

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState('Labours');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isLabourModalOpen, setIsLabourModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  // Mock Master Data
  const [labours, setLabours] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/resources');
      setLabours(data.filter(r => r.type === 'labour'));
      setVendors(data.filter(r => r.type === 'vendor'));
    } catch(e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Add Form
  const handleAddSubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    
    try {
      if (type === 'labour') {
        const payload = {
          name: formData.get('name'),
          category: formData.get('category'),
          type: 'labour',
          defaultCost: Number(formData.get('wage') || 0)
        };
        await api.post('/resources', payload);
        setIsLabourModalOpen(false);
      } else {
        const payload = {
          name: formData.get('name'),
          category: 'Vendor/Supplier', // Fixed for vendor according to backend model enum
          phone: formData.get('contact'),
          type: 'vendor',
          defaultCost: 0
        };
        await api.post('/resources', payload);
        setIsVendorModalOpen(false);
      }
      fetchResources();
    } catch(err) {
      console.error(err);
      alert('Error creating resource');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLabours = labours.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.id.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 border border-slate-300 rounded-none shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Human & Resources Management</h1>
          <p className="text-sm text-slate-500 mt-1">Master database for all site workers, staff, and material suppliers.</p>
        </div>
        <div className="flex bg-slate-100 p-1 border border-slate-200">
           <button 
             onClick={() => setActiveTab('Labours')}
             className={`px-6 py-2 text-sm font-bold transition-colors ${activeTab === 'Labours' ? 'bg-white text-slate-900 border border-slate-300 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
           >
             Site Labours
           </button>
           <button 
             onClick={() => setActiveTab('Vendors')}
             className={`px-6 py-2 text-sm font-bold transition-colors ${activeTab === 'Vendors' ? 'bg-white text-slate-900 border border-slate-300 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
           >
             Material Vendors
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-300 shadow-sm">
         
         <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            
            <div className="relative w-72">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                 <Search className="w-4 h-4" />
               </div>
               <input 
                 type="search" 
                 placeholder={`Search ${activeTab.toLowerCase()}...`}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white border border-slate-300 text-slate-900 font-medium py-2 pl-9 pr-4 focus:outline-none focus:border-slate-900"
               />
            </div>

            <button 
              onClick={() => activeTab === 'Labours' ? setIsLabourModalOpen(true) : setIsVendorModalOpen(true)}
              className="bg-slate-900 text-white font-bold py-2 px-5 hover:bg-slate-800 transition-colors flex items-center gap-2 border border-slate-900"
            >
              <Plus className="w-4 h-4" /> Register New {activeTab === 'Labours' ? 'Labour' : 'Vendor'}
            </button>
         </div>

         {/* Tables */}
         <div className="overflow-x-auto">
            {activeTab === 'Labours' ? (
              <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-bold border-b border-r border-slate-200">Labour ID</th>
                    <th className="px-5 py-3 font-bold border-b border-r border-slate-200">Full Name</th>
                    <th className="px-5 py-3 font-bold border-b border-r border-slate-200">Trade / Category</th>
                    <th className="px-5 py-3 font-bold border-b border-slate-200">Fixed Daily Wage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabours.map(labour => (
                    <tr key={labour._id} className="hover:bg-slate-50 border-b border-slate-200">
                      <td className="px-5 py-3 font-bold text-slate-500 border-r border-slate-200">{labour._id.slice(-6).toUpperCase()}</td>
                      <td className="px-5 py-3 font-bold text-slate-900 border-r border-slate-200">{labour.name}</td>
                      <td className="px-5 py-3 text-slate-700 border-r border-slate-200">{labour.category}</td>
                      <td className="px-5 py-3 font-bold text-green-700">₹{labour.defaultCost} / day</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-bold border-b border-r border-slate-200">Vendor ID</th>
                    <th className="px-5 py-3 font-bold border-b border-r border-slate-200">Supplier Name</th>
                    <th className="px-5 py-3 font-bold border-b border-r border-slate-200">Material Category</th>
                    <th className="px-5 py-3 font-bold border-b border-slate-200">Contact / Location</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map(vendor => (
                    <tr key={vendor._id} className="hover:bg-slate-50 border-b border-slate-200">
                      <td className="px-5 py-3 font-bold text-slate-500 border-r border-slate-200">{vendor._id.slice(-6).toUpperCase()}</td>
                      <td className="px-5 py-3 font-bold text-slate-900 border-r border-slate-200 flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400"/> {vendor.name}</td>
                      <td className="px-5 py-3 text-slate-700 border-r border-slate-200">{vendor.category}</td>
                      <td className="px-5 py-3 font-medium text-slate-600">{vendor.phone || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
         </div>
      </div>

      {/* LABOUR MODAL */}
      {isLabourModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-xl w-full max-w-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Add New Labour / Worker</h2>
            </div>
            <form onSubmit={(e) => handleAddSubmit(e, 'labour')} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Full Name</label>
                <input name="name" required className="w-full border border-slate-300 p-2 focus:outline-none focus:border-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Category</label>
                <select name="category" className="w-full border border-slate-300 p-2 focus:outline-none focus:border-slate-900">
                  <option>Mistri (Mason)</option>
                  <option>Mazdoor (Helper)</option>
                  <option>Plumber</option>
                  <option>Electrician</option>
                  <option>Carpenter</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Daily Wage (₹)</label>
                <input type="number" name="wage" required className="w-full border border-slate-300 p-2 focus:outline-none focus:border-slate-900" />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsLabourModalOpen(false)} className="flex-1 py-2 font-bold bg-slate-100 text-slate-600 border border-slate-200">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-slate-900 text-white font-bold border border-slate-900">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VENDOR MODAL */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-xl w-full max-w-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Register Material Supplier</h2>
            </div>
            <form onSubmit={(e) => handleAddSubmit(e, 'vendor')} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Supplier / Shop Name</label>
                <input name="name" required className="w-full border border-slate-300 p-2 focus:outline-none focus:border-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Material Type Category</label>
                <input name="category" placeholder="e.g. Cement & Sand" required className="w-full border border-slate-300 p-2 focus:outline-none focus:border-slate-900" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Contact / Phone Number</label>
                <input name="contact" required className="w-full border border-slate-300 p-2 focus:outline-none focus:border-slate-900" />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsVendorModalOpen(false)} className="flex-1 py-2 font-bold bg-slate-100 text-slate-600 border border-slate-200">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-slate-900 text-white font-bold border border-slate-900">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default HumanResources;
