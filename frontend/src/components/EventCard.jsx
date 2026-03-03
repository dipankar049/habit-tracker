import { CalendarCheck, CalendarClock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
    const navigate = useNavigate();
    return (
        <div
            key={event?._id}
            onClick={() => { navigate('/calender') }}
            // className="bg-white shadow rounded-lg px-4 py-2 flex items-center justify-between border border-gray-200"
            className={`relative bg-white rounded-2xl flex items-center justify-between px-4 py-3 
                transition-all duration-200 border border-1 border-violet-400
                shadow-sm hover:shadow-md cursor-pointer
                ${event?.completed
                    ? "bg-green-50/40"
                    : "hover:border-violet-300"
                }`}
        >
            <span
                className="absolute top-0 right-0 text-[10px] sm:text-xs 
                px-2 py-0.5 rounded-tr-2xl rounded-bl-lg
                bg-sky-600 text-sky-100
                font-medium tracking-wide"
            >
                Calendar Task
            </span>
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                {event?.completed ? (
                    <CalendarCheck
                    size={18} 
                    className="text-green-500 shrink-0" 
                    />
                ) : (
                    <CalendarClock
                    size={18} 
                    className="text-yellow-500 shrink-0" 
                    />
                )}

                <h2
                    className={`text-base sm:text-lg font-semibold truncate transition-all
                    ${event?.completed
                        ? "text-gray-500"
                        : "text-gray-800"
                    }`}
                >
                    {event?.title}
                </h2>
            </div>
            <div className="flex items-center">
                <button
                    onClick={() => { navigate('/calender') }}
                    className={`text-sm sm:text-base ${!event?.completed
                        ? "text-gray-500"
                        : "text-green-600"
                        }`
                    }
                >
                    {event?.completed ? "Completed" : "Pending"}
                </button>

                <ChevronRight
                    size={19}
                    className="text-gray-500 shrink-0" 
                />
            </div>

        </div>
    )
}