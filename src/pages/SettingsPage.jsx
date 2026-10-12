import React, { useState } from 'react';
import { Settings, ShieldCheck, Server, Database, KeyRound, Clock, CheckCircle2, Save } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    otpValidityMinutes: 10,
    sessionValidityDays: 90,
    maxPhotoUploads: 10,
    allowGuestBrowsing: true,
    enableSmsNotifications: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            System & Platform Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure authentication rules, session validity, property upload limits, and live API parameters.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>System configuration updated successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Settings Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security & Session Config */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <KeyRound className="w-4 h-4 text-brand-500" />
              <span>Authentication & Session Security</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
                  JWT Session Duration (Days)
                </label>
                <input
                  type="number"
                  value={config.sessionValidityDays}
                  onChange={(e) => setConfig({ ...config, sessionValidityDays: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-brand-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Current production token validity set to 90 days.</span>
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
                  OTP Code Validity (Minutes)
                </label>
                <input
                  type="number"
                  value={config.otpValidityMinutes}
                  onChange={(e) => setConfig({ ...config, otpValidityMinutes: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-brand-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">OTP codes expire after specified time limit.</span>
              </div>
            </div>
          </div>

          {/* Uploads & Media Limits */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="w-4 h-4 text-blue-400" />
              <span>Property Upload Limits & Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
                  Max Photos Per Property
                </label>
                <input
                  type="number"
                  value={config.maxPhotoUploads}
                  onChange={(e) => setConfig({ ...config, maxPhotoUploads: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-brand-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Maximum property image gallery files allowed.</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Environment Information</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Node Environment</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Production</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Database Dialect</span>
                <span className="font-bold text-blue-400">MySQL 8.0 (Sequelize)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">API Base URL</span>
                <span className="font-mono text-[11px] text-slate-300">http://localhost:8000/api</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Domain Host</span>
                <span className="font-semibold text-slate-200">api.truespaceproperty.com</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
