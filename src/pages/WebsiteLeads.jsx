import React, { useState, useEffect } from 'react';
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
      fetchLeads();
    } catch (error) {
      alert('Error updating status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-300 rounded-none shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Website Admin (Leads)</h1>
          <p className="text-sm text-slate-500 mt-1">Manage contact inquiries coming from your public landing page</p>
        </div>
      </div>

      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse border border-slate-300">
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th className="px-4 py-3 font-bold border border-slate-300">Date</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Client Name</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Phone</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Email</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Message</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Status</th>
                <th className="px-4 py-3 font-bold border border-slate-300 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead._id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 border border-slate-300">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 border border-slate-300">{lead.name}</td>
                    <td className="px-4 py-3 text-slate-900 border border-slate-300">{lead.phone}</td>
                    <td className="px-4 py-3 text-slate-900 border border-slate-300">{lead.email}</td>
                    <td className="px-4 py-3 text-slate-900 border border-slate-300 max-w-xs truncate" title={lead.message}>
                      {lead.message}
                    </td>
                    <td className="px-4 py-3 font-medium border border-slate-300">
                      <span className={`px-2 py-1 text-xs font-bold ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' : lead.status === 'Contacted' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center border border-slate-300 flex items-center justify-center gap-2">
                       <button onClick={() => handleUpdateStatus(lead._id, 'Contacted')} className="bg-slate-900 text-white px-3 py-1 text-xs font-bold hover:bg-slate-800">
                         Mark Contacted
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500 font-medium border border-slate-300">
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
