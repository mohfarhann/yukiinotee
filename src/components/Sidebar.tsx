import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: "/", icon: "📖", label: "Dictionary" },
    { to: "/quiz", icon: "📝", label: "Quiz" },
    { to: "/history", icon: "📜", label: "History" },
  ];

  const DesktopSidebar = () => (
    <aside className="hidden lg:flex fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 flex-col">
      <div className="p-8 border-b border-rose-100 flex items-center gap-3">
        <span className="text-4xl">🌸</span>
        <div>
          <h1 className="text-xl font-bold text-rose-500">Yuki Note</h1>
          <p className="text-xs text-gray-400">Dictionary & Quiz</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 ${isActive(item.to)
              ? 'bg-rose-50 text-rose-600 border-r-4 border-rose-500'
              : 'text-gray-600 hover:bg-rose-50 hover:text-rose-500'
              }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-semibold">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* copyright or extra info for desktop */}
      <div className="p-6 border-t border-rose-100 text-center text-xs text-gray-400">
        © 2025 Yuki Note
      </div>
    </aside>
  );

  const MobileBottomBar = () => (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 border-t border-rose-100 pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${isActive(item.to)
              ? 'text-rose-500'
              : 'text-gray-400 hover:text-rose-400'
              }`}
          >
            <span className={`text-2xl mb-0.5 transition-transform duration-300 ${isActive(item.to) ? '-translate-y-1 scale-110' : ''}`}>{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileBottomBar />
    </>
  );
};

export default Sidebar;
