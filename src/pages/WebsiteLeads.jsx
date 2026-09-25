import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Loader, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../services/api';

const WebsiteLeads = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/leads');
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      Swal.fire({ icon: 'success', title: 'Updated!', text: `Lead marked as ${newStatus}`, confirmButtonColor: '#ea580c', timer: 1500 });
      fetchLeads();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update lead status.', confirmButtonColor: '#ea580c' });
    }
  };

  const handleActionPlaceholder = (actionName) => {
    Swal.fire({
      icon: 'info',
      title: `${actionName} Lead`,
      text: `The ${actionName.toLowerCase()} feature is coming in the next update.`,
      confirmButtonColor: '#ea580c'
    });
  };

  const handleViewLead = (lead) => {
    Swal.fire({
      title: 'Inquiry Details',
      html: `
        <div style="text-align: left; padding: 10px; font-family: sans-serif;">
          <p style="margin-bottom: 8px;"><strong>Date:</strong> ${new Date(lead.createdAt).toLocaleString()}</p>
          <p style="margin-bottom: 8px;"><strong>Name:</strong> ${lead.name}</p>
          <p style="margin-bottom: 8px;"><strong>Phone:</strong> ${lead.phone}</p>
          <p style="margin-bottom: 8px;"><strong>Email:</strong> ${lead.email}</p>
          <p style="margin-bottom: 8px;"><strong>Status:</strong> ${lead.status}</p>
          <hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"/>
          <p style="margin-bottom: 5px;"><strong>Message:</strong></p>
          <p style="background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 14px;">${lead.message || 'No message provided.'}</p>
        </div>
      `,
      confirmButtonColor: '#ea580c',
      width: '600px'
    });
  };

  const handleEditLead = async (lead) => {
     const { value: newStatus } = await Swal.fire({
      title: 'Edit Lead Status',
      input: 'select',
      inputOptions: {
        'New': 'New',
        'Contacted': 'Contacted',
        'Converted': 'Converted (Green)'
      },
      inputPlaceholder: 'Select status',
      inputValue: lead.status,
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) resolve();
          else resolve('You need to select a status');
        });
      }
    });

    if (newStatus && newStatus !== lead.status) {
      // Actually sending whatever status is mapped
      handleUpdateStatus(lead._id, newStatus.includes('Converted') ? 'Converted' : newStatus);
    }
  };

  const handleDeleteLead = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This lead inquiry will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#f1f5f9',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: '<span style="color: black">Cancel</span>'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/leads/${id}`);
          setLeads(leads.filter(l => l._id !== id));
          Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Lead has been removed.', confirmButtonColor: '#ea580c', timer: 1500 });
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Error deleting lead', confirmButtonColor: '#ea580c' });
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-300 rounded-none shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest">Leads</h1>
          <p className="text-slate-500 text-sm mt-1">Manage contact inquiries coming from your public landing page</p>
        </div>
      </div>

      <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden flex flex-col">
         <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
           <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Inquiry List</h2>
           <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-none border border-slate-200 uppercase tracking-widest">{leads.length} Total</span>
         </div>
         
         <div className="flex-1 overflow-auto max-h-[700px]">
          <table className="w-full text-left text-sm border-collapse border border-slate-300">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300">Client Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300">Phone</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300">Email</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300 w-1/3">Message</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300 text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-slate-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Loader className="w-8 h-8 animate-spin mb-3 text-slate-400" />
                      <span className="font-bold tracking-widest uppercase text-xs">Loading leads...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead._id} className="bg-white hover:bg-orange-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 border border-slate-300 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 border border-slate-300 min-w-[150px]">{lead.name}</td>
                    <td className="px-6 py-4 font-medium text-slate-700 border border-slate-300 whitespace-nowrap">{lead.phone}</td>
                    <td className="px-6 py-4 font-medium text-slate-700 border border-slate-300">{lead.email}</td>
                    <td className="px-6 py-4 font-medium text-slate-700 border border-slate-300 break-words min-w-[250px]" title={lead.message}>
                      {lead.message}
                    </td>
                    <td className="px-6 py-4 text-center border border-slate-300">
                      <span className={`inline-flex px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-none border ${lead.status === 'New' ? 'bg-sky-50 text-sky-700 border-sky-200' : lead.status === 'Contacted' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border border-slate-300 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {lead.status === 'New' && (
                           <button onClick={() => handleUpdateStatus(lead._id, 'Contacted')} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-200" title="Mark Contacted">
                             <CheckCircle className="w-4 h-4" />
                           </button>
                        )}
                        <button onClick={() => handleViewLead(lead)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors border border-transparent hover:border-sky-200" title="View Lead">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEditLead(lead)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200" title="Edit Lead">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteLead(lead._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200" title="Delete Lead">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-500 font-bold uppercase tracking-widest text-sm border border-slate-300">
                    No leads found from the website yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WebsiteLeads;
