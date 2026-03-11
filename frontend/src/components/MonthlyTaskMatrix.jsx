import React from "react";

export default function MonthlyTaskMatrix({ data }) {
  const { year, month, tasks, days } = data;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto">
      <div
        className="inline-grid border rounded-md"
        style={{
          gridTemplateColumns: `120px repeat(${daysInMonth}, minmax(24px, 1fr))`,
        }}
      >
        {/* Header row */}
        <div className="bg-gray-100 font-semibold px-2 py-1 text-xs sm:text-sm
sticky left-0 z-20 border-r">
          Task
        </div>
        {daysArray.map((day) => (
          <div
            key={day}
            className="bg-gray-100 text-center text-[10px] sm:text-xs 
font-medium border-l sticky top-0 z-10"
          >
            {day}
          </div>
        ))}

        {/* Task rows */}
        {tasks.map((task) => (
          <React.Fragment key={task.taskId}>
            {/* Task name */}
            <div className="bg-gray-50 border-t px-2 py-1 text-[11px] sm:text-xs 
sticky left-0 z-10 border-r truncate">
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
                  className={`border-t border-l 
                    w-6 h-6 sm:w-7 sm:h-7 
                    flex items-center justify-center
                    cursor-pointer
                    ${intensity}
                    hover:scale-110 transition-transform duration-150`}
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
