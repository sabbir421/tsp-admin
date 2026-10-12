import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Search, Bell, Shield, User, LogOut, CheckCircle2 } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

export default function Header({ onMenuClick, title = 'Overview Dashboard' }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
      {/* Left Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-white tracking-tight hidden sm:block">
          {title}
        </h2>
      </div>

      {/* Center Search Simulation */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search across properties, users, requirements..."
            className="w-full pl-10 pr-4 py-1.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>System Healthy</span>
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdown(!userDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800/80 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              AD
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-white leading-snug">
                {user?.fullName || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-400 leading-none">
                {user?.email || 'admin@truespaceproperty.com'}
              </div>
            </div>
          </button>

          {userDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1 z-50 text-xs text-slate-300">
              <div className="px-4 py-2.5 border-b border-slate-800">
                <p className="font-bold text-white">{user?.fullName || 'Administrator'}</p>
                <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
              </div>

              <div className="p-1">
                <div className="flex items-center gap-2 px-3 py-2 text-slate-400">
                  <Shield className="w-4 h-4 text-brand-500" />
                  <span className="font-medium text-slate-300">Super Administrator</span>
                </div>
                <button
                  onClick={() => dispatch(logout())}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
