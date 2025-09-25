import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import SetRoutine from './pages/SetRoutine';
import WeeklySummery from './pages/WeeklySummery';
import Summery from './pages/Summery';
import Profile from './pages/Profile';
import ContactUs from './pages/ContactUs';
import Template from './components/hierarchy/template';
import ErrorBoundary from './components/hierarchy/ErrorBoundary';
import Loading from './components/hierarchy/Loading';
import NotFound from './components/hierarchy/NotFound';
import React from 'react';
import Layout from './components/hierarchy/layout';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';

export default function App() {

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const ProtectedRoutes = () => {
    const { token, loading } = useAuth();

    if (loading) return <Loading message="Please wait..." />;

    return token ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <>
      <BrowserRouter>
      <ToastContainer
        autoClose={3000}
      />
        <Layout>
          <Template>
            <ErrorBoundary>
              <React.Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<Home isFirstLoad={isFirstLoad} setIsFirstLoad={setIsFirstLoad} />} />
                    <Route path="/calender" element={<CalendarPage />} />
                    <Route path="/routine" element={<SetRoutine />} />
                    <Route path="/weeklySummery" element={<WeeklySummery />} />
                    <Route path="/summery" element={<Summery />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path='*' element={<NotFound />} />
                  </Route>
                </Routes>
              </React.Suspense>
            </ErrorBoundary>
          </Template>
        </Layout>
      </BrowserRouter>
    </>
  );
}
