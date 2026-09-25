import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Receipt, Briefcase, Bell, Menu, X, 
  HardHat, FileText, Settings, ShieldCheck, FilePlus, 
  UserCheck, Image as ImageIcon, IndianRupee, AlertCircle, Search, User, Clock
} from 'lucide-react';
import api from '../services/api';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  // ✅ Real user from localStorage
  const [loggedUser, setLoggedUser] = useState({ name: '', role: '', profileImage: '' });
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setLoggedUser({
          name: u.name || 'User',
          role: (u.role || 'staff').toUpperCase(),
          profileImage: u.profileImage || '',
        });
      }
    } catch (_) {}
  }, []);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Tick the clock every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const fetchNotifications = async () => {
       try {
         const { data } = await api.get('/leads');
         const lastViewed = localStorage.getItem('lastViewedNotifications');
         
         const newNotifications = data
           .filter(lead => {
             if (!lastViewed) return true;
             return new Date(lead.createdAt) > new Date(lastViewed);
           })
           .slice(0, 5)
           .map(lead => ({
             id: lead._id,
             type: 'lead',
             title: `New Lead: ${lead.name}`,
             desc: lead.message.length > 50 ? lead.message.substring(0, 50) + '...' : lead.message,
             time: new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
             icon: UserCheck,
             color: 'text-blue-600 bg-blue-50 border-blue-200'
           }));
           
         setNotifications(newNotifications);
       } catch (error) {
         console.error('Error fetching notifications:', error);
       }
    };
    fetchNotifications();

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const formattedTime = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Materials & Bills', href: '/materials', icon: Receipt },
    { name: 'Labour', href: '/labour', icon: Users },
    { name: 'Cost & Budget', href: '/budget', icon: Briefcase },
    { name: 'Updates', href: '/updates', icon: FileText },
    { name: 'Warranty', href: '/warranty', icon: ShieldCheck },
    { name: 'App Users', href: '/users', icon: UserCheck },
    { name: 'Website Admin', href: '/leads', icon: Users },
  ];



  const handleOpenNotifications = () => {
    setIsNotificationsOpen(true);
    localStorage.setItem('lastViewedNotifications', new Date().toISOString());
  };

  const handleCloseNotifications = () => {
    setIsNotificationsOpen(false);
    setNotifications([]);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      
      {/* PERFECT MATCHING DARK NAVBAR */}
      <nav className="w-full h-16 bg-slate-900 border-b border-slate-950 flex items-center justify-between px-4 lg:px-6 shrink-0 z-30 shadow-md">
        
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center gap-3 w-48"> {/* Fixed width to align with sidebar */}
            <div className="w-8 h-8 bg-orange-600 flex items-center justify-center shadow-sm">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <div className="hidden lg:block">
              <span className="text-white font-serif font-black tracking-wider text-lg leading-none block">BRICK BY BRICK</span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
             <Search className="w-4 h-4" />
           </div>
           <input 
             type="text" 
             placeholder="Search projects, materials, or bills..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-slate-800 border border-slate-700 text-slate-200 font-medium py-2 pl-9 pr-4 focus:outline-none focus:border-slate-500 focus:bg-slate-700 transition-colors placeholder:text-slate-500 text-sm"
           />
           {/* Shortcut Hint */}
           <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
             <span className="text-[10px] font-bold text-slate-500 border border-slate-600 px-1.5 py-0.5 rounded-sm">CTRL+K</span>
           </div>
        </div>

        {/* Right: Actions, Time, Profile */}
        <div className="flex items-center gap-4 lg:gap-6">
          
          {/* Live Date & Time */}
          <div className="hidden xl:flex items-center gap-2 text-slate-400 border-r border-slate-700 pr-6 mr-1">
             <Clock className="w-4 h-4 text-orange-500" />
             <div className="flex flex-col text-right">
                <span className="text-white text-[11px] font-bold tracking-widest">{formattedTime}</span>
                <span className="text-[9px] uppercase tracking-widest font-medium">{formattedDate}</span>
             </div>
          </div>

          {/* Notifications */}
          <button 
            onClick={handleOpenNotifications}
            className="w-10 h-10 flex items-center justify-center bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors relative border border-slate-700"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-600 rounded-full border border-slate-800"></span>
            )}
          </button>
          
          {/* Profile Button */}
          <Link to="/profile" className="hidden sm:flex items-center gap-3 hover:bg-slate-800 p-1.5 border border-transparent hover:border-slate-700 transition-colors">
             <div className="text-right">
                <span className="block text-white text-sm font-bold leading-tight">{loggedUser.name || 'Loading...'}</span>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">{loggedUser.role}</span>
             </div>
             <div className="w-9 h-9 bg-slate-700 flex items-center justify-center shadow-sm overflow-hidden">
                {loggedUser.profileImage
                  ? <img src={loggedUser.profileImage} alt="profile" className="w-full h-full object-cover" />
                  : <User className="w-5 h-5 text-white" />
                }
             </div>
          </Link>

        </div>
      </nav>

      {/* BODY (SIDEBAR + MAIN CONTENT) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR - Matching dark slate */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}
        
        <aside className={`
          absolute lg:static inset-y-0 left-0 z-20
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out
          w-64 bg-slate-900 border-r border-slate-950 flex flex-col shrink-0 h-[calc(100vh-4rem)] shadow-lg
        `}>
          <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">Main Menu</p>
            
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-none
                    ${isActive 
                      ? 'bg-orange-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-800">
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <Settings className="w-5 h-5" /> Settings & Profile
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto bg-slate-50 p-4 lg:p-8 relative">
          <Outlet />
        </main>

      </div>

      {/* NOTIFICATION SLIDEOVER */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseNotifications}></div>
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                 <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Update Center</h2>
                 <p className="text-xs text-slate-500 font-medium mt-1">Recent client & manager activity</p>
              </div>
              <button onClick={handleCloseNotifications} className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-4 h-4 text-slate-900" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-3 space-y-3 bg-slate-100">
              {notifications.length > 0 ? notifications.map(notif => (
                <div key={notif.id} className={`p-4 bg-white border shadow-sm ${notif.color} rounded-none`}>
                   <div className="flex gap-3">
                      <div className="mt-1">
                        <notif.icon className="w-5 h-5" />
                      </div>
                      <div>
                         <span className="text-xs font-bold uppercase tracking-widest mb-1 block relative top-0.5">{notif.title}</span>
                         <p className="text-sm font-medium text-slate-800 leading-snug">{notif.desc}</p>
                         <p className="text-[10px] font-bold text-slate-400 mt-2">{notif.time}</p>
                      </div>
                   </div>
                </div>
              )) : (
                 <div className="text-center p-8 text-slate-500 font-medium text-sm">
                    No new notifications.
                 </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardLayout;
