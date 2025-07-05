import React, { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  MessageSquare,
  User,
  Stethoscope,
  HomeIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const DoctorNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/doctor-dashboard", icon: HomeIcon },
    { label: "All Appointments", path: "/doctor-appointment", icon: Calendar },
    { label: "Prescriptions", path: "/doctor-prescriptions", icon: FileText },
    { label: "Feedback", path: "/doctor-feedback", icon: MessageSquare },
  ];

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/", { replace: true }); // ✅ replaces history entry
};


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
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

        {/* Navigation (Desktop) */}
        <div className="hidden md:flex md:space-x-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Profile dropdown (desktop only) */}
          <div className="relative">
            <div className="flex items-center space-x-4">
          <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-100"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
              <Link
                to="/doctor-profile"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>

            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 right-4 bg-white p-4 shadow-md rounded-lg w-56 space-y-2 z-30">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.label}</span>
              </Link>
            ))}

            <hr className="my-2" />

            <Link
              to="/doctor-profile"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-100 w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DoctorNavbar;
