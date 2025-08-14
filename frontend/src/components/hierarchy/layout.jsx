import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Menubar from "../Menubar";

export default function Layout({ children }) {
    const location = useLocation();
    const hideNavbarPaths = ['/login', '/register'];

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            {!hideNavbarPaths.includes(location.pathname) && <Navbar toggleSidebar={toggleSidebar} />}
            <div className="min-h-[100vh] pt-12 flex">
                {!hideNavbarPaths.includes(location.pathname) && <Menubar isOpen={sidebarOpen} closeSidebar={closeSidebar} />}
                <main className="w-full md:ml-[20%] bg-linear-to-br from-gray-200 via-white to-gray-400 min-h-[calc(100vh-3rem)] p-4 sm:p-8">{children}</main>
            </div>
        </>
    );
}
