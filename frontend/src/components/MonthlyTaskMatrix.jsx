import React from "react";

export default function MonthlyTaskMatrix({ data }) {
  const { year, month, tasks, days } = data;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto p-2">
      <div
        className="inline-grid border rounded-md"
        style={{
          gridTemplateColumns: `140px repeat(${daysInMonth}, minmax(20px, 1fr))`,
        }}
      >
        {/* Header row */}
        <div className="bg-gray-200 font-bold px-2 py-1 text-xs sm:text-base sticky left-0 z-20">
          Task
        </div>
        {daysArray.map((day) => (
          <div
            key={day}
            className="bg-gray-200 text-center font-semibold text-[10px] sm:text-xs border-l sticky top-0 z-10"
          >
            {day}
          </div>
        ))}

        {/* Task rows */}
        {tasks.map((task) => (
          <React.Fragment key={task.taskId}>
            {/* Task name */}
            <div className="bg-gray-50 border-t px-2 py-1 text-[11px] sm:text-xs sticky left-0 z-10 truncate">
              {task.title}
            </div>

            {daysArray.map((day) => {
              const dateKey = new Date(year, month, day)
                .toISOString()
                .split("T")[0];
              const logEntry = days[dateKey]?.find(
                (entry) => entry.taskId === task.taskId
              );

              const isCompleted = logEntry?.completed ?? false;
              const minutes = logEntry?.timeSpent ?? 0;

              // Heatmap intensity
              const intensity = isCompleted
                ? minutes >= 60
                  ? "bg-green-700"
                  : minutes >= 30
                  ? "bg-green-500"
                  : "bg-green-300"
                : "bg-gray-100";

              return (
                <div
                  key={day}
                  className={`border-t border-l w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center cursor-pointer ${intensity} hover:scale-105 transition-transform duration-150`}
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
