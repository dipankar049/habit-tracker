import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Calender from './pages/Calender';
import SetRoutine from './pages/SetRoutine';
import WeeklySummery from './pages/WeeklySummery';
import Summery from './pages/Summery';
import Profile from './pages/Profile';
import Menubar from './components/Menubar';
import { useState } from 'react';

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];

  const ProtectedRoutes = () => {
    const { token } = useAuth();
    return token ? <Outlet /> : <Navigate to="/login" />
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar toggleSidebar={toggleSidebar} />}

      <div className="h-[100vh] pt-12 flex">
        {!hideNavbarPaths.includes(location.pathname) && <Menubar isOpen={sidebarOpen} closeSidebar={closeSidebar} />}
          <div className='w-full md:ml-[20%] p-2 sm:p-4'>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/calender" element={<Calender />} />
                <Route path="/routine" element={<SetRoutine />} />
                <Route path="/weeklySummery" element={<WeeklySummery />} />
                <Route path="/summery" element={<Summery />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </div>
      </div>
    </>
  );
}

export default function App() {
  return (
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
  );
}
