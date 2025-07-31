import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Calender from "./pages/Calender";
import SetRoutine from "./pages/SetRoutine";
import WeeklySummery from "./pages/WeeklySummery";
import MonthlyAnnualSummery from "./pages/MonthlyAnnualSummery";
import Profile from "./pages/Profile";

function App() {
  
  const ProtectedRoutes = ({children}) => {

  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/calender' element={<Calender />} />
          <Route path='/routine' element={<SetRoutine />} />
          <Route path='/weeklySummery' element={<WeeklySummery />} />
          <Route path='/monthlySummery' element={<MonthlyAnnualSummery />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
