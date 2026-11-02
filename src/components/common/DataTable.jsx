import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  searchPlaceholder = 'Search records...',
  emptyMessage = 'No items found matching your criteria',
  actions,
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter((row) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return Object.values(row).some(
      (val) => val && String(val).toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="rounded-2xl bg-white border border-[#e3e7ef] shadow-sm overflow-hidden">
      {/* Search Header */}
      <div className="p-4 sm:p-5 border-b border-[#e3e7ef] flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] placeholder-slate-400 focus:outline-none focus:border-[#f2961d] transition-all"
          />
        </div>

        {actions && <div className="flex items-center gap-2 w-full sm:w-auto">{actions}</div>}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#fafbfd] border-b border-[#e3e7ef] text-[#667089] uppercase tracking-wider text-[11px] font-semibold">
            <tr>
              {columns.map((col) => (
                <th key={col.key || col.header} className="px-5 py-3.5">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e7ef] text-[#1d2333]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-7 h-7 border-2 border-[#f2961d] border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium text-xs text-slate-500">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-slate-400" />
                    <span className="font-semibold text-slate-600">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={
                    row.userRole && row.id
                      ? `${row.userRole}-${row.id}`
                      : row.id
                      ? `item-${row.id}`
                      : `row-${idx}`
                  }
                  className="hover:bg-[#f8fafd] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key || col.header} className="px-5 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#e3e7ef] flex items-center justify-between text-xs text-[#667089] bg-white">
        <div>
          Showing <span className="font-bold text-[#1c2847]">{filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{' '}
          <span className="font-bold text-[#1c2847]">{Math.min(page * pageSize, filteredData.length)}</span> of{' '}
          <span className="font-bold text-[#1c2847]">{filteredData.length}</span> entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-[#e3e7ef] text-slate-600 hover:text-[#1c2847] hover:bg-[#eef1f8] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-[#1c2847] px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-[#e3e7ef] text-slate-600 hover:text-[#1c2847] hover:bg-[#eef1f8] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
