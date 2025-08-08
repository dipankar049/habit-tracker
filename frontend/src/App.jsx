import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      <div className="h-[100vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/calender" element={<Calender />} />
          <Route path="/routine" element={<SetRoutine />} />
          <Route path="/weeklySummery" element={<WeeklySummery />} />
          <Route path="/monthlySummery" element={<MonthlyAnnualSummery />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </AuthProvider>
  );
}
