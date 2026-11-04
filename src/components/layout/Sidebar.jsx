import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  GitCompare,
  AlertTriangle,
  FileText,
  ShieldCheck,
  LogOut,
  X,
  ExternalLink,
  BarChart3,
  History,
  Send,
  Award,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Property Approvals', path: '/properties', icon: Building2 },
  { label: 'Users & Verification', path: '/users', icon: Users },
  { label: 'Verification Badges', path: '/badges', icon: Award },
  { label: 'Requirements Feed', path: '/requirements', icon: ClipboardList },
  { label: 'Property Suggestions', path: '/suggestions', icon: Send },
  { label: 'Matches & Visits', path: '/matches', icon: GitCompare },
  { label: 'Reports Moderation', path: '/reports', icon: AlertTriangle },
  { label: 'Content (Blog & SEO)', path: '/content', icon: FileText },
  { label: 'Research & Market Analysis', path: '/research', icon: BarChart3 },
  { label: 'Activity Log & Audits', path: '/activity-log', icon: History },
  { label: 'Admin Team', path: '/admins', icon: ShieldCheck },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const dispatch = useDispatch();

  const content = (
    <div className="flex flex-col h-full bg-[#0f1730] border-r border-[#1c2847] w-64 text-[#b9c2da] select-none">
      {/* Sidebar Header / Brand with white logo pill */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <a
            href="http://localhost:3000"
            className="flex-1 bg-white rounded-xl p-2 flex items-center justify-center hover:opacity-95 transition-opacity"
          >
            <img src="/logo.png" alt="TrueSpace Property" className="h-9 w-auto object-contain" onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'block';
            }} />
            <span className="hidden font-extrabold text-[#1c2847] text-base">TrueSpace</span>
          </a>

          {mobileOpen && (
            <button
              onClick={onClose}
              className="p-1.5 ml-2 rounded-lg text-[#b9c2da] hover:text-white hover:bg-white/10 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#f2961d] pt-3 px-1">
          ADMIN PANEL
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#f2961d] text-white shadow-sm'
                    : 'text-[#b9c2da] hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Shortcuts */}
      <div className="p-3 border-t border-white/10 space-y-1.5">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#b9c2da] hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block fixed inset-y-0 left-0 z-30">
        {content}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
}
