import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 ${isActive(to)
        ? 'bg-rose-50 text-rose-600 border-r-4 border-rose-500'
        : 'text-gray-600 hover:bg-rose-50 hover:text-rose-500'
        }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md shadow-sm z-40 flex items-center px-4 justify-between">
        <button
          onClick={toggleSidebar}
          className="p-2 text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
        </button>
        <span className="font-bold text-rose-500 text-lg">Yuki Dictionary</span>
        <div className="w-10"></div> {/* Spacer for centering if needed, or just empty */}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-8 border-b border-rose-100 flex items-center gap-3">
          <span className="text-4xl">🌸</span>
          <div>
            <h1 className="text-xl font-bold text-rose-500">Yuki Note</h1>
            <p className="text-xs text-gray-400">Dictionary & Quiz</p>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          <NavItem to="/" icon="📖" label="Dictionary" />
          <NavItem to="/quiz" icon="📝" label="Quiz Practice" />
          <NavItem to="/history" icon="📜" label="History" />
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-rose-100 bg-rose-50/50">
          <button className="flex items-center gap-3 text-gray-500 hover:text-rose-500 transition-colors w-full">
            <span className="text-xl">⚙️</span>
            <span className="font-semibold">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
