import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LogIn, UserPlus, Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
    const { user, logout } = useAuth();

    return (
        <div className="h-14 w-full flex justify-between items-center px-4 sm:px-8 fixed z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">

            {/* Left — hamburger + logo */}
            <div className="flex items-center gap-3">

                <button
                    className="md:hidden text-gray-400 hover:text-white transition-colors"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <Menu size={22} />
                </button>

                <Link to="/" className="flex items-center gap-2.5 select-none">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
                        H
                    </div>
                    <span className="text-white font-extrabold text-xl tracking-tight">
                        HabitTracker
                    </span>
                </Link>

            </div>

            {/* Right — auth controls */}
            {user ? (
                <div className="flex items-center gap-3">

                    <button
                        onClick={() => { logout(); window.location.href = "/login"; }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>

                    <Link
                        to="/profile"
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 transition-all"
                    >
                        {user.username.slice(0, 1).toUpperCase()}
                    </Link>

                </div>
            ) : (
                <div className="flex items-center gap-2 sm:gap-3">

                    <Link
                        to="/login"
                        className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                    >
                        <LogIn size={16} />
                        <span className="hidden sm:inline">Login</span>
                    </Link>

                    <Link
                        to="/register"
                        className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                    >
                        <UserPlus size={16} />
                        <span className="hidden sm:inline">Register</span>
                    </Link>

                </div>
            )}

        </div>
    );
}