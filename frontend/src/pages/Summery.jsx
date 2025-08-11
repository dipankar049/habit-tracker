import { useState, useEffect } from "react";
import axios from "axios";
import MonthlyTaskMatrix from "../components/MonthlyTaskMatrix";
import { useAuth } from "../contexts/AuthContext";

export default function Summary() {
  const { token } = useAuth();

  // Default to current year/month
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchMonthlySummary();
  }, [year, month, token]);

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URI}/logTask/monthly?year=${year}&month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummaryData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching monthly summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinedDate = new Date(summaryData?.userCreatedAt); 
  const joinedYear = joinedDate.getFullYear();
  const joinedMonth = joinedDate.getMonth(); // 0-indexed

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const handlePrevMonth = () => {
    setMonth((prev) => {
      const newMonth = prev === 0 ? 11 : prev - 1;
      const newYear = prev === 0 ? year - 1 : year;

      // Block going before join date
      if (newYear < joinedYear || (newYear === joinedYear && newMonth < joinedMonth)) {
        return prev; // Don't change
      }

      if (prev === 0) setYear((y) => y - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setMonth((prev) => {
      const newMonth = prev === 11 ? 0 : prev + 1;
      const newYear = prev === 11 ? year + 1 : year;

      // Block going beyond current month
      if (newYear > currentYear || (newYear === currentYear && newMonth > currentMonth)) {
        return prev; // Don't change
      }

      if (prev === 11) setYear((y) => y + 1);
      return newMonth;
    });
  };


  return (
    <div className="p-4">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ◀ Prev
        </button>
        <h1 className="text-2xl font-bold">
          {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
        </h1>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next ▶
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Loading summary...</p>}

      {/* Matrix */}
      {summaryData && <MonthlyTaskMatrix data={summaryData} />}
    </div>
  );
}
