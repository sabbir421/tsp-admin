import React, { useCallback, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ children, title }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen bg-[#eef1f7] text-[#1d2333] flex">
      {/* Navigation Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={closeMenu} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Header onMenuClick={() => setMobileOpen(true)} menuOpen={mobileOpen} title={title} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
