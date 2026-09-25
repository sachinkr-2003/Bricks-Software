import React, { useState, useEffect } from 'react';
import { IndianRupee, HardHat, Hammer, FileText, CheckCircle, Clock, Loader2 } from 'lucide-react';
import api from '../services/api';

const Budget = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isLoading, setIsLoading] = useState(true);
  const [finances, setFinances] = useState({
    totalContractValue: 5000000, // Fixed baseline
    amountPaid: 0,
    materialCost: 0,
    labourCost: 0,
    otherExpenses: 0,
    approvedAdditional: 0,
  });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', paidTo: '', remarks: '' });

  const fetchBudget = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/analytics/budget');
      setFinances(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newExpense, amount: Number(newExpense.amount) };
      await api.post('/expenses', payload);
      alert('Expense request submitted');
      setIsExpenseModalOpen(false);
      setNewExpense({ title: '', amount: '', paidTo: '', remarks: '' });
      fetchBudget();
    } catch (error) {
      console.error('Error submitting expense:', error);
      alert('Failed to submit expense');
    }
  };

  const amountRemaining = finances.totalContractValue - finances.amountPaid;
  const utilizedPercentage = Math.round((finances.amountPaid / finances.totalContractValue) * 100) || 0;

  // Example Milestones
  const milestones = [];

  return (
    <div className="max-w-7xl mx-auto space-y-4 relative text-sm">
      
      {/* Header */}
      <div className="bg-white p-4 border border-slate-300 rounded-none shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900 leading-tight">Cost & Budget Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">Track contract value, payments, and expense limits</p>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="bg-slate-100 text-slate-700 font-bold py-1.5 px-4 rounded-none transition-colors text-xs border border-slate-300 hover:bg-slate-200">
            Export / Print
          </button>
          <div className="flex border border-slate-300 bg-slate-50 p-1">
          <button 
            onClick={() => setActiveTab('Overview')}
            className={`px-4 py-1.5 font-bold transition-colors ${activeTab === 'Overview' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Financial Overview
          </button>
          <button 
             onClick={() => setActiveTab('Milestones')}
            className={`px-4 py-1.5 font-bold transition-colors ${activeTab === 'Milestones' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Payments History
          </button>
        </div>
        </div>
      </div>

      {activeTab === 'Overview' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* Main Financials (Total, Paid, Remaining) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white border border-slate-300 shadow-sm p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Contract Value</span>
                <span className="text-3xl font-extrabold text-slate-900">₹{finances.totalContractValue.toLocaleString('en-IN')}</span>
             </div>
             
             <div className="bg-white border border-slate-300 shadow-sm p-4 flex flex-col justify-between border-t-4 border-t-green-500">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Amount Paid</span>
                <span className="text-3xl font-extrabold text-slate-900">₹{finances.amountPaid.toLocaleString('en-IN')}</span>
             </div>

             <div className="bg-white border border-slate-300 shadow-sm p-4 flex flex-col justify-between border-t-4 border-t-orange-500">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Amount Remaining</span>
                <span className="text-3xl font-extrabold text-slate-900">₹{amountRemaining.toLocaleString('en-IN')}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Detailed Expense Breakdown */}
            <div className="lg:col-span-2 bg-white overflow-hidden shadow-sm border border-slate-300 flex flex-col">
              <div className="p-3 border-b border-slate-300 bg-slate-50">
                <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Cost Breakdown (Internal)</h2>
              </div>
              <div className="p-0 flex-1">
                <table className="w-full text-left whitespace-nowrap border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 w-10 text-slate-400"><Hammer className="w-5 h-5" /></td>
                      <td className="px-5 py-4 font-bold text-slate-800 border-r border-slate-200">Material Cost</td>
                      <td className="px-5 py-4 font-extrabold text-slate-900 text-right">₹{finances.materialCost.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 w-10 text-slate-400"><HardHat className="w-5 h-5" /></td>
                      <td className="px-5 py-4 font-bold text-slate-800 border-r border-slate-200">Labour Cost</td>
                      <td className="px-5 py-4 font-extrabold text-slate-900 text-right">₹{finances.labourCost.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 w-10 text-slate-400"><FileText className="w-5 h-5" /></td>
                      <td className="px-5 py-4 font-bold text-slate-800 border-r border-slate-200">Other Expenses (Transport, etc.)</td>
                      <td className="px-5 py-4 font-extrabold text-slate-900 text-right">₹{finances.otherExpenses.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Approved Additional Expenses & Requests */}
            <div className="bg-slate-900 border border-slate-800 text-white shadow-sm flex flex-col">
              <div className="p-4 border-b border-slate-700">
                <h2 className="font-bold text-white uppercase tracking-wider text-xs flex items-center justify-between">
                   Additional Expenses
                   <span className="text-[10px] bg-slate-700 px-2 py-0.5 font-bold">STRICT</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">Requires Customer Approval</p>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-center">
                 <div className="text-center mb-6">
                    <span className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Approved</span>
                    <span className="text-3xl font-extrabold text-white">₹{finances.approvedAdditional.toLocaleString('en-IN')}</span>
                 </div>
                 
                 <div className="space-y-3">
                   <button onClick={() => setIsExpenseModalOpen(true)} className="w-full py-2 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
                     Request New Expense
                   </button>
                 </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'Milestones' && (
        <div className="bg-white overflow-hidden shadow-sm border border-slate-300 animate-in fade-in duration-300">
           <div className="p-4 border-b border-slate-300 bg-slate-50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 uppercase">Contract Payment Schedule</h2>
           </div>
           
           <div className="p-4 lg:p-6">
             <div className="relative border-l border-slate-300 ml-4 space-y-4 pb-2">
                {milestones.map((ms, index) => (
                  <div key={ms.id} className="relative ml-6">
                    {/* Timeline Node */}
                    <span className={`absolute -left-8 top-2 w-4 h-4 border-2 flex items-center justify-center bg-white ${ms.status === 'Paid' ? 'border-green-500' : 'border-slate-300'}`}>
                      {ms.status === 'Paid' && <div className="w-1.5 h-1.5 bg-green-500"></div>}
                    </span>
                    
                    <div className={`px-4 py-3 border ${ms.status === 'Paid' ? 'border-green-300 bg-green-50/20' : 'border-slate-200 bg-white'} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-1`}>
                       
                       <div className="flex flex-col">
                         <h3 className="text-sm font-bold text-slate-900">
                           {index + 1}. {ms.stage}
                         </h3>
                         <div className="flex items-center gap-2 mt-1">
                           <span className="bg-slate-100 text-slate-500 px-1.5 text-[11px] font-bold">{ms.percent} Cost</span>
                           {ms.status === 'Paid' ? (
                             <span className="flex items-center gap-1 text-green-700 font-bold bg-green-100 px-1.5 text-[11px]">
                               <CheckCircle className="w-3 h-3" /> Received {ms.date}
                             </span>
                           ) : (
                             <span className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-1.5 text-[11px] border border-orange-200">
                               <Clock className="w-3 h-3" /> Due {ms.date}
                             </span>
                           )}
                         </div>
                       </div>

                       <div className="mt-2 md:mt-0">
                         <span className="font-mono text-lg font-extrabold text-slate-900">{ms.amount}</span>
                       </div>

                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h2 className="font-bold text-sm uppercase tracking-wider">Request New Expense</h2>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expense Title</label>
                <input 
                  type="text" 
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                  placeholder="e.g. Extra Sand Delivery"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Paid To / Supplier</label>
                <input 
                  type="text" 
                  value={newExpense.paidTo}
                  onChange={(e) => setNewExpense({...newExpense, paidTo: e.target.value})}
                  className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                  placeholder="e.g. Ramesh Traders"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Remarks (Optional)</label>
                <input 
                  type="text" 
                  value={newExpense.remarks}
                  onChange={(e) => setNewExpense({...newExpense, remarks: e.target.value})}
                  className="w-full p-2 border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                  placeholder="..."
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-orange-600 text-white font-bold py-3 hover:bg-slate-900 transition-colors uppercase tracking-widest text-sm"
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

export default Budget;
