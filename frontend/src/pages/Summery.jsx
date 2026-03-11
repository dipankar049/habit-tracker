import { useState, useEffect } from "react";
import axios from "axios";
import MonthlyTaskMatrix from "../components/MonthlyTaskMatrix";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/hierarchy/Loading";

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
    <div className="space-y-5">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1.5 text-sm font-medium
bg-gray-100 text-gray-700
rounded-lg border border-gray-200
hover:bg-gray-200 transition"
        >
          ❮❮
          <span className="hidden sm:inline"> Prev</span>
        </button>
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
          {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
        </h1>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <span className="hidden sm:inline">Next </span>
          ❯❯
        </button>
      </div>

      {/* Loading */}
      {loading && <Loading message="Loading summery..." />}

      {/* Matrix */}
      {summaryData?.tasks.length === 0 ? 
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-gray-600 font-medium">
            No task logs found
          </p>
          <p className="text-gray-400 text-sm">
            Start completing your routine to see progress here.
          </p>
        </div>
        : summaryData && 
        <>
          <MonthlyTaskMatrix data={summaryData} />
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-gray-600 mt-4 ">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-200 rounded-sm border border-1 border-black"></div>
              No data
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-300 rounded-sm"></div>
              Light
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
              Medium
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-700 rounded-sm"></div>
              High
            </div>
          </div>
        </>
      }
    </div>
  );
}
