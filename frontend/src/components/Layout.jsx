import React from 'react';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col">
      {/* Sky Blue Navbar */}
      <nav className="bg-gradient-to-r from-sky-500 to-sky-700 text-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo / App Name */}
          <div className="text-2xl font-bold tracking-tight font-['Poppins']">
            Smart Playground Monitor
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-8 list-none">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-800 text-yellow-300"
                      : "hover:bg-sky-600 hover:text-white"
                  }`
                }
              >
                Today's Log
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/all-logs"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-800 text-yellow-300"
                      : "hover:bg-sky-600 hover:text-white"
                  }`
                }
              >
                All Logs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/real-time-monitoring"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-800 text-yellow-300"
                      : "hover:bg-sky-600 hover:text-white"
                  }`
                }
              >
                Real-Time Count
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/upload-video"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-800 text-yellow-300"
                      : "hover:bg-sky-600 hover:text-white"
                  }`
                }
              >
                Upload Video
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;