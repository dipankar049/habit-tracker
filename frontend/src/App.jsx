import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import SetRoutine from './pages/SetRoutine';
import WeeklySummery from './pages/WeeklySummery';
import Summery from './pages/Summery';
import Profile from './pages/Profile';
import Menubar from './components/Menubar';
import { useState } from 'react';
import ContactUs from './pages/ContactUs';

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

      <div className="min-h-[100vh] pt-12 flex">
        {!hideNavbarPaths.includes(location.pathname) && <Menubar isOpen={sidebarOpen} closeSidebar={closeSidebar} />}
          <div className='w-full md:ml-[20%] p-4 bg-linear-to-br from-gray-200 via-white to-gray-400 sm:p-8'>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/calender" element={<CalendarPage />} />
                <Route path="/routine" element={<SetRoutine />} />
                <Route path="/weeklySummery" element={<WeeklySummery />} />
                <Route path="/summery" element={<Summery />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<ContactUs />} />
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
