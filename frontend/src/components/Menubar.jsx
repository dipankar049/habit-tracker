import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, House, FileSliders, CalendarCog, TextSearch, CalendarDays, UserRound } from "lucide-react";

export default function Menubar({ isOpen, closeSidebar }) {

  const { logout } = useAuth();

  const menuItems = [
    { icon: <House />, label: "Home", to: "/" },
    { icon: <FileSliders />, label: "Set Routine", to: "/routine" },
    { icon: <CalendarCog />, label: "Calender", to: "/calender" },
    { icon: <TextSearch />, label: "Weekly Summery", to: "/weeklySummery" },
    { icon: <CalendarDays />, label: "Summery", to: "/summery" },
    // { label: "Restore", to: "/restore" },
    { icon: <UserRound />, label: "Contact Us", to: "/contact" },
    { icon: <LogOut />, label: "Logout", to: "/login" },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden overflow-y-auto md:text-lg md:block fixed w-1/5 h-screen bg-white pt-4 pl-3 border-r-2 border-gray-300 drop-shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="p-2 space-y-1">
          {menuItems.map(({ label, to, icon }) => (
            <MenuItem key={to} label={label} to={to} logout={logout} icon={icon} />
          ))}
        </div>
      </div>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="fixed z-40 top-12 left-0 w-4/5 max-w-xs h-full bg-white border-r border-gray-300 shadow-lg md:hidden dark:bg-gray-800 dark:text-white transition-all">
          <div className="p-2 space-y-1">
            {menuItems.map(({ label, to, icon }) => (
              <MenuItem key={to} label={label} to={to} onClick={closeSidebar} logout={logout} icon={icon} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const MenuItem = ({ label, to, onClick, logout, icon }) => (
  <>
    <Link
      to={to}
      className="flex items-center gap-3 w-full p-2 pl-4 text-gray-800 dark:text-white rounded-r-3xl rounded-l-md hover:text-xl hover:font-bold hover:text-blue-600 dark:hover:text-blue-600 transition-all duration-200 ease-in-out"
      onClick={() => {
        if(label === "Logout") logout();
        else onClick();
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
    <hr className="border-gray-300 mx-3 my-1" />
  </>
);
