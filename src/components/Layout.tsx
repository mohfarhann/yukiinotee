import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
 children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
 return (
  <div className="min-h-screen bg-cream flex">
   <Sidebar />
   <main className="flex-1 lg:ml-72 transition-all duration-300 w-full pt-16 lg:pt-0">
    {children}
   </main>
  </div>
 );
};

export default Layout;
