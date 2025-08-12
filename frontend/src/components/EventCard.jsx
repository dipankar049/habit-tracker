export default function EventCard({ event }) {
    return (
        <div
            key={event?._id}
            className="bg-white shadow rounded-lg px-4 py-2 flex items-center justify-between border border-gray-200"
        >
            <h2 className="text-lg text-center text-black font-semibold">{event?.title}</h2>
            <button
                className={`px-3 text-md sm:text-lg ${!event?.completed
                    ? "text-gray-500"
                    : "text-green-600"
                    }`
                }
                disabled={true}
            >
                {event?.completed ? "Completed" : "Pending"}
            </button>

        </div>
    )
}