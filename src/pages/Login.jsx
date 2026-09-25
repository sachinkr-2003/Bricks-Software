import React, { useState } from 'react';
import { AlignRight, HardHat, Lock, Phone } from 'lucide-react';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      // ✅ Use software-specific login - blocks customer accounts
      const response = await api.post('/auth/login/software', { phone, pin: password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      onLogin();
    } catch (error) {
      setIsLoading(false);
      setErrorMsg(error.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
       {/* Left Brand Panel */}
       <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative overflow-hidden bg-[#0a0f18]">
          {/* Decorative Blueprint Background Grid */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: '0.1' }}></div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen" />
          
          <div className="relative z-10 space-y-5 mt-10">
             <div className="w-16 h-16 bg-orange-600 flex items-center justify-center shadow-xl">
                <HardHat className="w-9 h-9 text-white" />
             </div>
             <h1 className="text-white text-6xl font-black tracking-tight leading-[1.1] pt-8 font-serif">
                BRICK BY <br /> BRICK
             </h1>
             <div className="h-1 w-20 bg-orange-600 mt-2"></div>
             <p className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs mt-4">
                Enterprise Construction Management
             </p>
          </div>

          <div className="relative z-10 border-t border-slate-800 pt-8 mt-16 pb-8">
             <div className="flex gap-12 text-slate-400">
               <div>
                 <p className="text-white font-black text-2xl font-serif">100%</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Transparency</p>
               </div>
               <div>
                 <p className="text-white font-black text-2xl font-serif">A+</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Grade Quality</p>
               </div>
             </div>
          </div>
       </div>

       {/* Right Login Panel */}
       <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-16">
          <div className="w-full max-w-md space-y-10">
             
             {/* Mobile Logo Fallback */}
             <div className="lg:hidden flex flex-col items-start gap-4 mb-10">
               <div className="w-12 h-12 bg-orange-600 flex items-center justify-center">
                  <HardHat className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-slate-900 font-serif">BRICK BY BRICK</h1>
                  <p className="text-orange-600 font-bold uppercase text-[10px] tracking-widest mt-1">Management Portal</p>
               </div>
             </div>

             <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Manager Login</h2>
                <p className="text-slate-500 font-medium">Enter your credentials to access the site database.</p>
             </div>

             {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                  {errorMsg}
                </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <Phone className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-none text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                        placeholder="e.g. 9876543210"
                      />
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                   </div>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-none text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                        placeholder="••••••••"
                      />
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-none hover:bg-orange-600 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      Authenticating...
                    </span>
                  ) : (
                    'Secure Login'
                  )}
                </button>
             </form>
             
             <div className="pt-8 text-center text-xs text-slate-500 font-medium">
               Protected by Brick By Brick Internal Security Systems.
             </div>

          </div>
       </div>
    </div>
  );
};

export default Login;
