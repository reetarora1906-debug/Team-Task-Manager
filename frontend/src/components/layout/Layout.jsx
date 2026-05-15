import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { HiOutlineMenu, HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:ml-[260px] min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-[var(--color-outline-variant)]/20">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[64px]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-[var(--radius-default)] hover:bg-[var(--color-surface-container)] transition-colors"
              >
                <HiOutlineMenu className="w-5 h-5 text-[var(--color-on-surface)]" />
              </button>

              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-[var(--radius-default)] bg-[var(--color-primary)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <span className="font-bold text-[var(--color-on-surface)] text-sm">Syncro</span>
              </div>

              {/* Search bar */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[var(--color-surface-container)] rounded-[var(--radius-default)] w-[300px]
                border border-transparent focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-light)] ">
                <HiOutlineSearch className="w-4 h-4 text-[var(--color-outline)]" />
                <input
                  type="text"
                  placeholder="Search projects, tasks..."
                  className="bg-transparent outline-none text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-[var(--radius-default)] hover:bg-[var(--color-surface-container)] transition-colors">
                <HiOutlineBell className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary)] rounded-full" />
              </button>

              {/* User avatar */}
              <div className="flex items-center gap-2 pl-3 border-l border-[var(--color-outline-variant)]/30">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary-dark)] font-semibold text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-[var(--color-on-surface)] leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
