import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Calender from './pages/Calender';
import SetRoutine from './pages/SetRoutine';
import WeeklySummery from './pages/WeeklySummery';
import MonthlyAnnualSummery from './pages/MonthlyAnnualSummery';
import Profile from './pages/Profile';

function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];

  const ProtectedRoutes = () => {
    const { token } = useAuth();
    return token ? <Outlet /> : <Navigate to="/login" />
  }

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      <div className="h-[100vh]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/calender" element={<Calender />} />
            <Route path="/routine" element={<SetRoutine />} />
            <Route path="/weeklySummery" element={<WeeklySummery />} />
            <Route path="/monthlySummery" element={<MonthlyAnnualSummery />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
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
