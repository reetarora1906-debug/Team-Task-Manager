import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineFolder,
  HiOutlineUserGroup,
  HiOutlineLightningBolt,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineX,
} from 'react-icons/hi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { path: '/projects', label: 'Projects', icon: HiOutlineFolder },
  { path: '/team', label: 'Team', icon: HiOutlineUserGroup },
  { path: '/activity', label: 'Activity', icon: HiOutlineLightningBolt },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-[var(--color-surface)] border-r border-[var(--color-outline)]/20 z-50 
          flex flex-col transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-[var(--color-outline-variant)]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[var(--radius-default)] bg-[var(--color-primary)] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-[17px] font-bold text-[var(--color-on-surface)] tracking-tight leading-tight">Syncro</h1>
              <p className="text-[9px] text-[var(--color-on-surface-variant)] font-semibold tracking-widest uppercase">Team Task Manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-[var(--radius-default)] hover:bg-[var(--color-surface-container)] transition-colors"
          >
            <HiOutlineX className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-default)] text-[14px] font-medium  duration-200
                ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-md)]'
                    : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)]'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-[var(--color-outline-variant)]/20 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary-dark)] font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-[var(--color-on-surface-variant)] truncate">
                {user?.role || 'Member'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-[var(--radius-default)] text-sm font-medium
              text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)]  duration-200 cursor-pointer"
          >
            <HiOutlineLogout className="w-4.5 h-4.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
