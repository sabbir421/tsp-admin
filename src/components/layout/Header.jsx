import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Search, Bell, Shield, User, LogOut, CheckCircle2 } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

export default function Header({ onMenuClick, title = 'Overview Dashboard' }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <header className="h-16 border-b border-[#e3e7ef] bg-white sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Left Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-[#1c2847] tracking-tight hidden sm:block">
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
            className="w-full pl-10 pr-4 py-1.5 text-xs rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f2961d] transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>System Healthy</span>
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdown(!userDropdown)}
            className="flex items-center gap-2.5 py-1 px-2.5 rounded-full bg-white border border-[#e3e7ef] hover:border-slate-300 shadow-sm transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-[#f2961d] flex items-center justify-center font-bold text-white text-xs shadow-sm">
              A
            </div>
            <div className="text-left hidden lg:block pr-1">
              <div className="text-xs font-bold text-[#1c2847] leading-snug">
                {user?.fullName || 'Super Admin'}
              </div>
              <div className="text-[10px] text-slate-400 leading-none">
                {user?.email || 'admin@truespaceproperty.com'}
              </div>
            </div>
          </button>

          {userDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#e3e7ef] shadow-xl py-1 z-50 text-xs text-slate-700">
              <div className="px-4 py-2.5 border-b border-[#e3e7ef]">
                <p className="font-bold text-[#1c2847]">{user?.fullName || 'Super Admin'}</p>
                <p className="text-slate-400 text-[11px] truncate">{user?.email || 'admin@truespaceproperty.com'}</p>
              </div>

              <div className="p-1">
                <div className="flex items-center gap-2 px-3 py-2 text-slate-600">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-slate-800">Super Administrator</span>
                </div>
                <button
                  onClick={() => dispatch(logout())}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
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
