import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LogIn, UserPlus } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
    const { user, logout } = useAuth();

    return (
        <div className='h-12 w-[100vw] flex justify-between items-center py-2 sm:px-4 shadow-xl fixed'>
            {/* Hamburger menu - visible on small screens */}
            <div className='flex items-center'>
                <button
                    className="md:hidden text-2xl"
                    onClick={toggleSidebar}
                >
                    ☰
                </button>
                <p className='font-bold sm:font-extrabold text-2xl text-shadow-lg'>
                    <span className='text-blue-500'>Habit</span>
                    <span className='text-gray-800'>Tracker</span>
                </p>
            </div>
            {user ?
                <div className='flex justify-between text-lg font-bold gap-1 sm:gap-4'>
                    <Link to="/profile" className='text-white bg-blue-500 rounded-full size-8 text-center mt-[2px] sm:mt-[6px] pt-[2px]'>
                        {user.username.slice(0, 1).toUpperCase()}
                    </Link>
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = "/login";
                        }}
                        className="flex items-center gap-2 text-red-600 cursor-pointer"
                    >
                        {/* Icon - Always visible */}
                        <LogOut size={20} />

                        {/* Text - Hidden below sm */}
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
                : <div className="flex justify-between sm:text-lg font-bold gap-1 sm:gap-4">
                    {/* Login */}
                    <Link
                        to="/login"
                        className="text-blue-600 flex items-center gap-1 sm:gap-2"
                    >
                        <LogIn size={20} />
                        <span className="hidden sm:inline">Login</span>
                    </Link>

                    {/* Signup */}
                    <Link
                        to="/register"
                        className="text-blue-600 bg-blue-100 flex items-center py-1 px-2 sm:px-4 rounded-md gap-1 sm:gap-2"
                    >
                        <UserPlus size={20} />
                        <span className="hidden sm:inline">Signup</span>
                    </Link>
                </div>
            }
        </div>
    )
}
