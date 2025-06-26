import React, { useState } from "react";
import { Calendar, FileText, MessageSquare, User, Stethoscope, HomeIcon, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const DoctorNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/doctor-dashboard", icon: HomeIcon },
    { label: "All Appointments", path: "/doctor-appointment", icon: Calendar },
    { label: "Prescriptions", path: "/doctor-prescriptions", icon: FileText },
    { label: "Feedback", path: "/doctor/feedback", icon: MessageSquare },
    { label: "Profile", path: "/doctor/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the session by removing the token
    navigate("/"); // Navigate to the home page
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105">
            <Stethoscope className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-wide">MediTrack</span>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation and Logout (Desktop and Mobile Dropdown) */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 absolute md:static top-16 right-4 md:right-auto bg-white md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none rounded-lg md:rounded-none w-48 md:w-auto`}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on click
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false); // Close mobile menu on logout
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-100 transition-all duration-300 mt-2 md:mt-0"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;