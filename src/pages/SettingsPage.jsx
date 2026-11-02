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
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1c2847] tracking-tight">
            System & Platform Settings
          </h1>
          <p className="text-xs text-[#667089] mt-1">
            Configure authentication rules, session validity, property upload limits, and live API parameters.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration updated successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Settings Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security & Session Config */}
          <div className="p-6 rounded-2xl bg-white border border-[#e3e7ef] shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#1c2847] flex items-center gap-2 border-b border-[#e3e7ef] pb-3">
              <KeyRound className="w-4 h-4 text-[#f2961d]" />
              <span>Authentication & Session Security</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#667089] uppercase tracking-wider text-[10px] mb-1.5">
                  JWT Session Duration (Days)
                </label>
                <input
                  type="number"
                  value={config.sessionValidityDays}
                  onChange={(e) => setConfig({ ...config, sessionValidityDays: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] font-bold focus:outline-none focus:border-[#f2961d]"
                />
                <span className="text-[10px] text-[#667089] mt-1 block">Current production token validity set to 90 days.</span>
              </div>

              <div>
                <label className="block font-bold text-[#667089] uppercase tracking-wider text-[10px] mb-1.5">
                  OTP Code Validity (Minutes)
                </label>
                <input
                  type="number"
                  value={config.otpValidityMinutes}
                  onChange={(e) => setConfig({ ...config, otpValidityMinutes: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] font-bold focus:outline-none focus:border-[#f2961d]"
                />
                <span className="text-[10px] text-[#667089] mt-1 block">OTP codes expire after specified time limit.</span>
              </div>
            </div>
          </div>

          {/* Uploads & Media Limits */}
          <div className="p-6 rounded-2xl bg-white border border-[#e3e7ef] shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#1c2847] flex items-center gap-2 border-b border-[#e3e7ef] pb-3">
              <Settings className="w-4 h-4 text-[#1c2847]" />
              <span>Property Upload Limits & Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#667089] uppercase tracking-wider text-[10px] mb-1.5">
                  Max Photos Per Property
                </label>
                <input
                  type="number"
                  value={config.maxPhotoUploads}
                  onChange={(e) => setConfig({ ...config, maxPhotoUploads: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] font-bold focus:outline-none focus:border-[#f2961d]"
                />
                <span className="text-[10px] text-[#667089] mt-1 block">Maximum property image gallery files allowed.</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#f2961d] hover:bg-[#d97f0a] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#e3e7ef] shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#1c2847] flex items-center gap-2 border-b border-[#e3e7ef] pb-3">
              <Server className="w-4 h-4 text-[#1f9d63]" />
              <span>Environment Information</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e3e7ef]">
                <span className="text-[#667089] font-medium">Node Environment</span>
                <span className="font-bold text-[#1f9d63] bg-[#e3f6ec] px-2 py-0.5 rounded border border-[#a7f3d0]">Production</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#e3e7ef]">
                <span className="text-[#667089] font-medium">Database Dialect</span>
                <span className="font-bold text-[#1c2847]">MySQL 8.0 (Sequelize)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#e3e7ef]">
                <span className="text-[#667089] font-medium">API Base URL</span>
                <span className="font-mono text-[11px] text-[#1d2333]">http://localhost:8000/api</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#667089] font-medium">Domain Host</span>
                <span className="font-semibold text-[#1d2333]">api.truespaceproperty.com</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
