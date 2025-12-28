import React from "react";


const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo + Intro */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
  <img
    src="/citiedge-logo.png"
    alt="CITI EDGE Logo"
    className="w-full h-full object-cover"
  />
</div>

              <span className="font-bold text-xl">CITIEDGE</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering education through technology and innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Programs</a></li>
              <li><a href="#" className="hover:text-white transition">Admissions</a></li>
              <li><a href="#" className="hover:text-white transition">Campus Life</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="font-bold mb-4">Resources</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Library</a></li>
              <li><a href="#" className="hover:text-white transition">Support Center</a></li>
              <li><a href="#" className="hover:text-white transition">IT Services</a></li>
              <li><a href="#" className="hover:text-white transition">Career Services</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-bold mb-4">Contact</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: enquiry@citiedgecollege.co.uk </li>
              <li>Phone/WhatsApp: +44 (0)7454 289604</li>
              <li>
                Campus Address: 2-16 Bayford Street, E8 3SE <br />
                <span className="italic">(Proposed for March 2026 Academic Session)</span>
              </li>
              <li>
                Registered Address: No.1-2 Craven Road, Ealing, London W5 2UA
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 CITIEDGE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;