import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
 children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
 return (
  <div className="min-h-screen bg-rose-50/30 flex">
   <Sidebar />
   <main className="flex-1 lg:ml-72 transition-all duration-300 w-full pt-4 pb-24 lg:py-0">
    {children}
   </main>
  </div>
 );
};

export default Layout;
