import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import HorizontalBarChart from "../components/HorizontalBarChart";
import VerticalBarChart from "../components/VerticalBarChart";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklySummary() {
  const [summary, setSummary] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const { token } = useAuth();

  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URI}/logTask/weekly`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formattedData = res.data.map((item) => {
        const dateObj = new Date(item.date);
        return {
          ...item,
          dayName: dayNames[dateObj.getDay()],
        };
      });

      setSummary(formattedData);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (token) fetchSummary();
  }, [token]);

  const selectedDayData = summary.find((item) => item.date === selectedDate);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Weekly Summary
      </h2>

      <div className="w-full h-64 sm:h-80">
        <HorizontalBarChart
          data={summary}
          selectedDate={selectedDate}
          onBarClick={setSelectedDate}
        />
      </div>

      <p className="text-center mt-4 text-gray-600 mb-8">
        Total time spent per day on your tasks.
      </p>

      <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
        Task Breakdown for {selectedDayData ? selectedDayData.dayName : ""}
      </h3>

      <div className="w-full h-64 sm:h-80 -ml-14">
        {selectedDayData && selectedDayData.tasks.length > 0 ? (
          <VerticalBarChart tasks={selectedDayData.tasks} />
        ) : (
          <p className="text-center text-gray-500">No tasks logged for this day.</p>
        )}
      </div>
    </div>
  );
}