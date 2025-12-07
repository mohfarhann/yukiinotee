import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-rose-400 to-rose-300 shadow-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white hover:text-rose-50 transition-all duration-300 flex items-center gap-2">
          <span className="text-3xl">🌸</span>
          <span>Yuki Dictionary</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-white hover:text-rose-50 transition-all duration-300 font-medium">
            📖 Dictionary
          </Link>
          <Link to="/quiz" className="text-white hover:text-rose-50 transition-all duration-300 font-medium">
            📝 Quiz
          </Link>
          <Link to="/history" className="text-white hover:text-rose-50 transition-all duration-300 font-medium">
            📜 History
          </Link>
          <button className="px-6 py-2 rounded-full bg-white text-rose-500 font-semibold hover:shadow-lg transition-all duration-300">
            ⚙️ 設定 (Settings)
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
