import React, { useState, useMemo, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

const INITIAL_LOG_ENTRIES = [];

const AREAS = [
  'All areas',
  'Property approvals',
  'Users',
  'Reports',
  'Content',
  'Permissions',
  'Visits',
  'Requirements',
  'Team & admins',
];

export default function ActivityLogPage() {
  const [logs, setLogs] = useState(() => {
    try {
      const stored = localStorage.getItem('tsp_activity_v36');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All areas');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    try {
      localStorage.setItem('tsp_activity_v36', JSON.stringify(logs));
    } catch (e) {
      // ignore
    }
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return logs.filter((item) => {
      const matchArea = selectedArea === 'All areas' || item.area === selectedArea;
      if (!matchArea) return false;
      if (!q) return true;
      const combined = [
        item.who,
        item.area,
        item.rec,
        item.f,
        item.from,
        item.to,
        item.why,
      ]
        .join(' ')
        .toLowerCase();
      return combined.includes(q);
    });
  }, [logs, searchQuery, selectedArea]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const formatWhen = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportCSV = () => {
    const escapeCsv = (val) => `"${String(val == null ? '' : val).replace(/"/g, '""')}"`;
    const headers = ['When', 'Admin', 'Area', 'Record', 'Field', 'Before', 'After', 'Reason'];
    const rows = filteredLogs.map((item) => [
      formatWhen(item.t),
      item.who,
      item.area,
      item.rec,
      item.f,
      item.from,
      item.to,
      item.why || '—',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `truespace-activity-log-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1c2847] tracking-tight">
            Activity Log & Audit Trail
          </h1>
          <p className="text-xs text-[#667089] mt-1">
            Who changed what, when, and reason tracking · Immutable audit trail of administrative decisions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e3e7ef] text-[#1c2847] hover:bg-[#eef1f8] font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#f2961d]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-[#e3e7ef] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by admin name, record, field, or decision reason..."
            className="w-full pl-9 pr-4 py-2 border border-[#e3e7ef] rounded-xl text-xs focus:border-[#f2961d] outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-semibold text-[#667089] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Area:
          </span>
          <select
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 border border-[#e3e7ef] rounded-xl text-xs font-semibold text-[#1c2847] bg-white focus:border-[#f2961d] outline-none"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <span className="text-xs text-[#667089] font-medium ml-2">
            Showing <b className="text-[#1c2847]">{filteredLogs.length}</b> events
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-[#e3e7ef] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f6f7fb] border-b border-[#e3e7ef] text-[#667089] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">When</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Target Record</th>
                <th className="py-3 px-4">State Transition</th>
                <th className="py-3 px-4">Decision Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e7ef]">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fafbfd] transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap text-[#667089]">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatWhen(item.t)}</span>
                      </div>
                    </td>

                    {/* Admin */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#1c2847]">{item.who}</div>
                    </td>

                    {/* Area Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eef1f8] text-[#1c2847] border border-[#d6ddeb]">
                        {item.area}
                      </span>
                    </td>

                    {/* Target Record */}
                    <td className="py-3 px-4 min-w-[200px]">
                      <div className="font-bold text-[#1c2847]">{item.rec}</div>
                      <div className="text-[11px] text-[#667089] font-medium">{item.f}</div>
                    </td>

                    {/* Change Diff */}
                    <td className="py-3 px-4 min-w-[200px]">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#fafbfd] border border-[#e3e7ef]">
                        <span className="line-through text-slate-400 font-medium">{item.from}</span>
                        <ArrowRight className="w-3 h-3 text-[#f2961d]" />
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          {item.to}
                        </span>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="py-3 px-4 min-w-[240px] text-[#1d2333]">
                      {item.why ? (
                        <span className="italic text-[#46506b]">{item.why}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-[#667089]">
                    No activity logs match your search or area criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#e3e7ef] bg-[#fafbfd] text-xs">
            <span className="text-[#667089]">
              Page <b className="text-[#1c2847]">{currentPage}</b> of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#e3e7ef] bg-white text-[#1c2847] hover:bg-[#eef1f8] disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#e3e7ef] bg-white text-[#1c2847] hover:bg-[#eef1f8] disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
