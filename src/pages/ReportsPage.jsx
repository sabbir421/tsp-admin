import React, { useState } from 'react';
import { RPT } from '../utils/prototypeData';
import { AlertTriangle, CheckCircle2, Trash2, Eye, ShieldAlert } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState(RPT);
  const [sevFilter, setSevFilter] = useState('All');

  const handleResolve = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const filtered = reports.filter((r) => sevFilter === 'All' || r.sev === sevFilter);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e3e7ef] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1c2847] tracking-tight">
            Reports & Moderation Queue
          </h1>
          <p className="text-sm text-[#667089] mt-1">
            Review reported properties, suspicious user behavior, and flagged content across Dhaka City.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {['All', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                sevFilter === sev
                  ? 'bg-[#1c2847] text-white border-[#1c2847] shadow-sm'
                  : 'bg-white text-slate-700 border-[#e3e7ef] hover:border-slate-400'
              }`}
              onClick={() => setSevFilter(sev)}
            >
              {sev === 'All' ? 'All Reports' : `${sev} Severity`}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl border border-[#e3e7ef] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e3e7ef] flex items-center justify-between">
          <span className="text-sm font-bold text-[#1c2847]">
            Active Reports ({filtered.length})
          </span>
          <span className="text-xs text-[#667089]">
            Sorted by highest severity
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="divide-y divide-[#e3e7ef]">
            {filtered.map((r) => (
              <div key={r.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#f6f7fb] transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#1c2847]">{r.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      r.sev === 'High'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : r.sev === 'Medium'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {r.sev} Severity
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#f6f7fb] text-slate-700 border border-[#e3e7ef]">
                      Target: {r.type} · {r.target}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#1d2333]">
                    Reason: {r.reason}
                  </p>

                  <div className="text-xs text-[#667089] flex gap-4">
                    <span>Reported by: <b className="text-slate-800">{r.by}</b></span>
                    <span>Date: {r.at}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => handleResolve(r.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1f9d63] text-white hover:bg-emerald-600 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolve(r.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Take down</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-[#1f9d63]" />
            <p className="font-semibold text-slate-800">All reports resolved</p>
            <p className="text-xs text-[#667089]">No open moderation flags pending review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
