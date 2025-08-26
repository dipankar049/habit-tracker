export default function TaskCard({ task, setTasks, markLoading = false, handleToggleStatus }) {
  return (
    <div
      key={task._id}
      className="bg-white shadow-lg/30 rounded-lg py-2 px-4 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200"
    >
      <h2 className="text-lg font-semibold">{task.title}</h2>

      <div className="flex items-center justify-between gap-1 sm:gap-3 mt-1 sm:mt-3 md:mt-0">
        <input
          type="number"
          min="1"
          className="border border-gray-300 rounded px-2 py-1 w-20"
          value={task.defaultDuration}
          disabled={task.completed || markLoading}
          onChange={(e) =>
            setTasks((prev) =>
              prev.map((t) =>
                t._id === task._id
                  ? { ...t, defaultDuration: Number(e.target.value) }
                  : t
              )
            )
          }
        />

        <button
          onClick={() =>
            handleToggleStatus(
              task._id,
              !task.completed,
              task.defaultDuration
            )
          }
          disabled={markLoading}
          className={`px-3 py-1 text-sm sm:text-md rounded text-white shadow-lg/30 ${task.completed
            ? "bg-gray-500 hover:bg-gray-600"
            : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {task.completed ? "✅ Completed" : "⌛ Pending"}
        </button>
      </div>
    </div>
  )
}