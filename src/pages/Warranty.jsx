import React, { useState } from 'react';
import { ShieldCheck, Calendar, Info, Clock, Plus, PenTool, CheckCircle } from 'lucide-react';

const Warranty = () => {
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  // Warranty Details
  const warrantyPeriod = "11 Years";
  const startDate = "01 Jan 2027";
  const endDate = "01 Jan 2038";

  // Service History
  const [serviceHistory, setServiceHistory] = useState([
    { id: 1, date: '15 Mar 2027', issue: 'Minor seepage near bathroom window', status: 'Resolved', technician: 'Ramesh Plumbers' },
    { id: 2, date: '10 Aug 2028', issue: 'Annual Structural Inspection', status: 'Completed', technician: 'Brick By Brick Engineers' },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    issueType: 'Seepage',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: serviceHistory.length + 1,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      issue: formData.description,
      status: 'Pending Review',
      technician: 'Unassigned',
    };
    
    setServiceHistory([newRequest, ...serviceHistory]);
    setIsComplaintModalOpen(false);
    setFormData({ issueType: 'Seepage', description: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 relative">
      
      {/* Header */}
      <div className="bg-white p-4 border border-slate-300 rounded-none shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900 leading-tight">Warranty Hub</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your 11-Year Structural Warranty & Service History</p>
        </div>
        
        <button 
          onClick={() => setIsComplaintModalOpen(true)}
          className="bg-orange-600 text-white font-bold py-2 px-5 rounded-none hover:bg-slate-900 transition-colors flex items-center gap-2 text-sm shadow-sm border-b-2 border-slate-900"
        >
          <PenTool className="w-4 h-4" /> Request Service / Complaint
        </button>
      </div>

      {/* Main Warranty Overview Card */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white flex items-center justify-center p-3 shrink-0">
               <ShieldCheck className="w-full h-full text-orange-600 stroke-[1.5]" />
            </div>
            <div>
               <h2 className="text-3xl font-serif font-bold text-white tracking-tight">11-Year Structural Warranty</h2>
               <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mt-1">Active Guarentee by Brick By Brick</p>
            </div>
         </div>
         
         <div className="flex items-center gap-6 border-l border-slate-700 pl-6 w-full md:w-auto">
            <div>
               <span className="block text-slate-400 uppercase tracking-widest text-[10px] font-bold">Start Date</span>
               <span className="text-lg font-bold text-white mt-0.5 block flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400" /> {startDate}</span>
            </div>
            <div>
               <span className="block text-slate-400 uppercase tracking-widest text-[10px] font-bold">End Date</span>
               <span className="text-lg font-bold text-white mt-0.5 block flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400" /> {endDate}</span>
            </div>
         </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Coverage Details */}
        <div className="bg-white border border-slate-300 shadow-sm p-5">
           <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Warranty Coverage</h3>
           <ul className="space-y-3">
             <li className="flex gap-2">
               <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
               <div>
                  <span className="block font-bold text-slate-800 text-sm">Structural Integrity</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Cracks in columns, beams, or main load-bearing walls.</span>
               </div>
             </li>
             <li className="flex gap-2">
               <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
               <div>
                  <span className="block font-bold text-slate-800 text-sm">Seepage & Leakage</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Water seepage from internal plumbing or roof slab (Covered for first 5 years).</span>
               </div>
             </li>
             <li className="flex gap-2">
               <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
               <div>
                  <span className="block font-bold text-slate-800 text-sm">Electrical & Plumbing Systems</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Major failure in concealed PVC pipes and primary wiring circuits.</span>
               </div>
             </li>
           </ul>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-slate-50 border border-slate-300 shadow-sm p-5">
           <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
             <Info className="w-4 h-4 text-slate-500" /> Terms & Conditions
           </h3>
           <ul className="space-y-2 list-disc list-inside text-xs text-slate-600 font-medium px-1">
             <li>Warranty is void if structural changes are made without informing the company.</li>
             <li>Damage due to natural disasters (earthquake, floods) is not covered under this warranty.</li>
             <li>Regular maintenance of external paint and exposed plumbing is the owner's responsibility.</li>
             <li>Requests raised will be inspected within 48 to 72 working hours.</li>
             <li>Cosmetic cracks (hairline plaster cracks) settling within the first year are repaired free of charge as a courtesy.</li>
           </ul>
        </div>
      </div>

      {/* Service History Table */}
      <div className="bg-white overflow-hidden shadow-sm border border-slate-300">
        <div className="p-4 border-b border-slate-300 bg-slate-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Service & Complaint History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-bold border-b border-r border-slate-300 text-xs">Date Raised</th>
                <th className="px-4 py-2 font-bold border-b border-r border-slate-300 text-xs">Issue Description</th>
                <th className="px-4 py-2 font-bold border-b border-r border-slate-300 text-xs">Assigned Technician</th>
                <th className="px-4 py-2 font-bold border-b border-slate-300 text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {serviceHistory.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 border-b border-r border-slate-200 font-medium text-sm">{service.date}</td>
                  <td className="px-4 py-3 font-bold text-slate-900 border-b border-r border-slate-200 truncate max-w-[250px]">{service.issue}</td>
                  <td className="px-4 py-3 text-slate-600 border-b border-r border-slate-200">{service.technician}</td>
                  <td className="px-4 py-3 border-b border-slate-200 font-bold">
                    {service.status === 'Resolved' && <span className="text-green-600">{service.status}</span>}
                    {service.status === 'Completed' && <span className="text-blue-600">{service.status}</span>}
                    {service.status === 'Pending Review' && <span className="text-orange-600 flex items-center gap-1"><Clock className="w-3 h-3"/> {service.status}</span>}
                  </td>
                </tr>
              ))}
              {serviceHistory.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-slate-500">No service requests raised yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REQUEST MODAL */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-lg">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900 uppercase">Lodge a Request / Complaint</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm text-slate-900">
              
              <div className="space-y-1.5">
                <label className="font-bold">Type of Issue</label>
                <select 
                  name="issueType" 
                  value={formData.issueType} 
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900 bg-white"
                >
                  <option value="Seepage">Seepage / Water Leakage</option>
                  <option value="Structural">Structural Crack</option>
                  <option value="Plumbing">Plumbing Failure</option>
                  <option value="Electrical">Electrical Failure</option>
                  <option value="Other">Other / General Maintenance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold">Issue Details (Please describe the problem)</label>
                <textarea 
                  name="description" 
                  required 
                  rows="4" 
                  className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900 bg-white" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="e.g. There is water leaking from the ceiling in the master bedroom bathroom."
                ></textarea>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
                Our support engineer will review this request and contact you within 48 hours for an inspection scheduling.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 mt-2 top-2">
                <button 
                  type="button" 
                  onClick={() => setIsComplaintModalOpen(false)}
                  className="px-5 py-2 font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white font-bold rounded-none hover:bg-slate-900 transition-colors shadow-sm"
                >
                  Submit Request
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Warranty;
