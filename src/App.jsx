import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import Labour from './pages/Labour';
import Updates from './pages/Updates';
import Budget from './pages/Budget';
import Warranty from './pages/Warranty';
import HumanResources from './pages/HumanResources';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="materials" element={<Materials />} />
          <Route path="labour" element={<Labour />} />
          <Route path="updates" element={<Updates />} />
          <Route path="budget" element={<Budget />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="resources" element={<HumanResources />} />
          <Route path="profile" element={<Profile onLogout={() => setIsAuthenticated(false)} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
