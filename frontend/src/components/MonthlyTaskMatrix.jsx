import React from "react";

export default function MonthlyTaskMatrix({ data }) {
  const { year, month, tasks, days } = data;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto">
      <div
        className="inline-grid border"
        style={{ gridTemplateColumns: `200px repeat(${daysInMonth}, 1fr)` }}
      >
        {/* Header row */}
        <div className="bg-gray-200 font-semibold px-2 py-1">Task</div>
        {daysArray.map((day) => (
          <div
            key={day}
            className="bg-gray-200 text-center font-semibold px-1 py-1 border-l"
          >
            {day}
          </div>
        ))}

        {/* Task rows */}
        {tasks.map((task) => (
          <React.Fragment key={task.taskId}>
            {/* Task name */}
            <div className="bg-gray-50 border-t px-2 py-1 text-sm">
              {task.title}
            </div>

            {daysArray.map((day) => {
              const dateKey = new Date(year, month, day).toISOString().split("T")[0];
              const logEntry = days[dateKey]?.find((entry) => entry.taskId === task.taskId);

              const isCompleted = logEntry?.completed ?? false;
              const minutes = logEntry?.timeSpent ?? 0;

              return (
                <div
                  key={day}
                  className={`border-t border-l h-8 flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                    isCompleted
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  title={
                    isCompleted
                      ? `${minutes} min spent`
                      : logEntry
                        ? `${minutes} min (not completed)`
                        : "No data"
                  }
                ></div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
