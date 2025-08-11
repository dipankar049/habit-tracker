import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({toggleSidebar}) {
    const { user, logout } = useAuth();

    return (
        <div className='h-12 w-[100vw] flex justify-between items-center py-2 px-4 shadow-xl fixed'>
            {/* Hamburger menu - visible on small screens */}
            <button
                className="md:hidden mr-4 text-2xl"
                onClick={toggleSidebar}
            >
                ☰
            </button>
            <p className='font-bold sm:font-extrabold text-2xl text-shadow-lg'>
                <span className='text-blue-500'>Habit</span>
                <span className='text-gray-800'>Tracker</span>
            </p>
            { user ? 
                <div className='flex justify-between sm:text-lg font-bold gap-2 sm:gap-4'>
                    <Link to="/profile" className='text-blue-600'>
                        Profile
                    </Link>
                    <button 
                        onClick={() => {
                            logout();
                            window.location.href = '/login';
                        }}
                     className='text-blue-600 bg-blue-100 flex justify-between items-center py-1 px-2 sm:px-4 rounded-md'>
                        Logout
                    </button>
                </div>
                : <div className='flex justify-between sm:text-lg font-bold gap-2 sm:gap-4'>
                    <Link to="/login" className='text-blue-600'>
                        Login
                    </Link>
                    <Link to="/register" className='text-blue-600 bg-blue-100 flex justify-between items-center py-1 px-2 sm:px-4 rounded-md'>
                        Signup
                    </Link>
                </div>
            }
        </div>
    )
}
