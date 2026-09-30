import React from "react";
import { Link } from "react-router-dom";

const OpenNavbar = () => {
  return (
    <div className="bg-white shadow h-12 flex items-center justify-between px-4 md:px-6 border-b border-gray-200">
      {/* Logo HMS ở phía trái */}
      <div className="flex items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200 no-underline"
        >
          HMS
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center justify-end space-x-4">
        <Link to="/login" className="text-gray-700 hover:text-gray-900">
          Login
        </Link>
        <Link
          to="/patient/register"
          className="text-gray-700 hover:text-gray-900"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default OpenNavbar;
