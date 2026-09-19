import React, { useState } from 'react';
import { Plus, Filter, X } from 'lucide-react';

const Materials = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State to hold the bills
  const [bills, setBills] = useState([
    { id: 1, material: 'Ultratech Cement', quantity: '100 Bags', supplier: 'Gupta Traders', date: '18 Sep 2026', amount: '₹38,000', status: 'Paid', photo: true },
    { id: 2, material: 'Tata Tiscon Steel', quantity: '2 Tonne', supplier: 'Sharma Steels', date: '16 Sep 2026', amount: '₹1,20,000', status: 'Pending', photo: true },
    { id: 3, material: 'Red Bricks', quantity: '5000 Pcs', supplier: 'Rao Brick Kiln', date: '12 Sep 2026', amount: '₹35,000', status: 'Paid', photo: false },
    { id: 4, material: 'River Sand', quantity: '4 Trucks', supplier: 'Delhi Sands Co.', date: '10 Sep 2026', amount: '₹18,000', status: 'Paid', photo: true },
    { id: 5, material: 'Crushed Stone', quantity: '1 Truck', supplier: 'Gitti Suppliers', date: '08 Sep 2026', amount: '₹9,500', status: 'Pending', photo: false },
  ]);

  // State for new bill form
  const [formData, setFormData] = useState({
    date: '',
    material: '',
    quantity: '',
    supplier: '',
    amount: '',
    status: 'Pending',
    photo: false,
  });

  // Filter bills based on current selection
  const filteredBills = bills.filter(bill => {
    if (filterStatus === 'All') return true;
    return bill.status === filterStatus;
  });

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' || type === 'file' ? (type === 'file' ? !!e.target.files.length : checked) : value
    }));
  };

  // Submit handler
  const handleAddBill = (e) => {
    e.preventDefault();
    const newEntry = {
      id: bills.length + 1,
      ...formData,
      amount: `₹${formData.amount}` // Formatting basic amount
    };
    
    setBills([newEntry, ...bills]);
    setIsAddModalOpen(false);
    
    // Reset Form
    setFormData({
      date: '',
      material: '',
      quantity: '',
      supplier: '',
      amount: '',
      status: 'Pending',
      photo: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-300 rounded-none shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Material & Bills</h1>
          <p className="text-sm text-slate-500 mt-1">Track your site's material purchases and invoices</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
             <select 
               className="appearance-none bg-white border border-slate-300 text-slate-900 font-medium py-2 pl-4 pr-10 rounded-none focus:outline-none"
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
             >
               <option value="All">All Bills</option>
               <option value="Paid">Status: Paid</option>
               <option value="Pending">Status: Pending</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
               <Filter className="w-4 h-4" />
             </div>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-900 text-white font-medium py-2 px-5 rounded-none hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Bill
          </button>
        </div>
      </div>

      {/* Classic Simple Table */}
      <div className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse border border-slate-300">
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th className="px-4 py-3 font-bold border border-slate-300">Date</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Material Name</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Quantity</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Supplier</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Amount</th>
                <th className="px-4 py-3 font-bold border border-slate-300">Payment Status</th>
                <th className="px-4 py-3 font-bold border border-slate-300 text-center">Bill Photo</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 border border-slate-300">{bill.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 border border-slate-300">{bill.material}</td>
                    <td className="px-4 py-3 text-slate-900 border border-slate-300">{bill.quantity}</td>
                    <td className="px-4 py-3 text-slate-900 border border-slate-300">{bill.supplier}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 border border-slate-300">{bill.amount}</td>
                    <td className="px-4 py-3 font-medium border border-slate-300">
                      {bill.status === 'Paid' ? (
                        <span className="text-green-600 font-bold">Paid</span>
                      ) : (
                        <span className="text-orange-600 font-bold">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center border border-slate-300">
                      {bill.photo ? (
                        <button className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer">
                          View
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500 font-medium border border-slate-300">
                    No bills found for the selected status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD NEW BILL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Add New Material / Bill</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddBill} className="p-6 space-y-4 text-sm text-slate-800">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold">Date</label>
                  <input type="text" name="date" required placeholder="e.g. 19 Sep 2026" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900" 
                    value={formData.date} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Material Name</label>
                  <input type="text" name="material" required placeholder="e.g. Ultratech Cement" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900" 
                    value={formData.material} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold">Quantity</label>
                  <input type="text" name="quantity" required placeholder="e.g. 100 Bags" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900" 
                    value={formData.quantity} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Amount (₹)</label>
                  <input type="number" name="amount" required placeholder="e.g. 35000" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900" 
                    value={formData.amount} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Supplier Name</label>
                <input type="text" name="supplier" required placeholder="e.g. Gupta Traders" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900" 
                  value={formData.supplier} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold">Payment Status</label>
                  <select name="status" className="w-full border border-slate-300 px-3 py-2 rounded-none focus:outline-none focus:border-slate-900"
                    value={formData.status} onChange={handleInputChange}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Upload Bill / Invoice</label>
                  <input type="file" name="photo" className="w-full border border-slate-300 px-3 py-1.5 rounded-none focus:outline-none focus:border-slate-900 text-slate-600 bg-slate-50" 
                    onChange={handleInputChange} />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 mt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2 font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-slate-900 text-white font-bold rounded-none hover:bg-slate-800 transition-colors"
                >
                  Save Bill Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Materials;
