export default function TaskCard({ task }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-gray-500">{task.description}</p>
      </div>
      <span className="text-sm text-gray-400">{task.time}</span>
    </div>
  );
}
