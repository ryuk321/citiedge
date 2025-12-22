import React from "react";


const Header: React.FC = () => {
  return (
 <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
  <img
    src="citiedge-logo.jpg"
    alt="CITI EDGE Logo"
    className="w-full h-full object-cover"
  />
</div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">CITIEDGE</h1>
              <p className="text-xs text-gray-500">Educational Portal</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition">About</a>
            <a href="#services" className="text-gray-600 hover:text-blue-600 transition">Services</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
          </nav>
        </div>
      </header>
  );
};

export default Header;