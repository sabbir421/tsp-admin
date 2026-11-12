import React, { useState, useEffect } from 'react';
import {
  Send,
  Building2,
  User,
  Trash2,
  RotateCcw,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import { adminApi } from '../api/adminApi';

const INITIAL_SUGGESTIONS = [];

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminApi.getMatches()
      .then((res) => {
        const matches = res.data || [];
        setSuggestions(matches.map((m) => ({
          id: `SG-${m.id}`,
          rawId: m.id,
          rid: `REQ-${m.requirementId || m.requirement_id}`,
          reqTitle: m.Requirement ? `${m.Requirement.bedrooms || ''} ${m.Requirement.subType || m.Requirement.category || ''} · max ৳${Number(m.Requirement.maxBudget || m.Requirement.max_budget || 0).toLocaleString()}` : 'Requirement',
          reqArea: m.Requirement?.area || 'Dhaka',
          pid: m.propertyId || m.property_id,
          propTitle: m.Property?.title || 'Property',
          propPrice: m.Property?.price ? `৳${Number(m.Property.price).toLocaleString()}` : '',
          propArea: m.Property?.area || 'Dhaka',
          by: m.Property?.provider ? `${m.Property.provider}` : 'Seller',
          at: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '',
          note: m.visitNotes || m.visit_notes || '',
          status: m.status || 'sent',
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusToggle = (id, newStatus) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const filtered = suggestions.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const activeCount = suggestions.filter((s) => s.status !== 'rejected').length;
  const removedCount = suggestions.filter((s) => s.status === 'rejected').length;

  const columns = [
    {
      header: 'Suggested Property',
      key: 'propTitle',
      render: (row) => (
        <div className="space-y-0.5 max-w-xs">
          <div className="font-bold text-[#1c2847] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#f2961d] shrink-0" />
            <span className="truncate">{row.propTitle}</span>
          </div>
          <div className="text-[11px] text-[#667089]">
            TSP-{row.pid} · {row.propArea} · <b className="text-[#1c2847]">{row.propPrice}</b>
          </div>
          {row.note && (
            <div className="text-[11px] italic text-[#46506b] bg-[#f6f7fb] p-1.5 rounded border border-[#e3e7ef]">
              “{row.note}”
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'For Requirement',
      key: 'rid',
      render: (row) => (
        <div className="space-y-0.5 max-w-xs">
          <div className="font-semibold text-[#f2961d] text-xs flex items-center gap-1">
            <Send className="w-3 h-3 shrink-0" />
            <span>{row.rid}</span>
          </div>
          <div className="font-bold text-[#1c2847] text-xs truncate">{row.reqTitle}</div>
          <div className="text-[11px] text-[#667089]">📍 {row.reqArea}</div>
        </div>
      ),
    },
    {
      header: 'Proposed By',
      key: 'by',
      render: (row) => (
        <div>
          <div className="font-semibold text-[#1c2847] text-xs">{row.by}</div>
          <div className="text-[11px] text-[#667089]">{row.at}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
            row.status === 'rejected'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {row.status === 'rejected' ? 'Removed' : 'Active with Buyer'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div>
          {row.status === 'rejected' ? (
            <button
              type="button"
              onClick={() => handleStatusToggle(row.id, 'sent')}
              className="px-2.5 py-1.5 rounded-lg bg-[#f2961d] hover:bg-[#d97f0a] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleStatusToggle(row.id, 'rejected')}
              className="px-2.5 py-1.5 rounded-lg border border-[#e3e7ef] bg-white hover:bg-rose-50 hover:text-rose-600 text-[#667089] font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1c2847] tracking-tight">
            Property Suggestions
          </h1>
          <p className="text-xs text-[#667089] mt-1">
            {suggestions.length} total suggestions · {activeCount} active with buyers / tenants · {removedCount} removed
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#e3e7ef] shadow-sm text-xs">
          {[
            { id: 'all', label: `All (${suggestions.length})` },
            { id: 'sent', label: `Active (${activeCount})` },
            { id: 'rejected', label: `Removed (${removedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterStatus === tab.id
                  ? 'bg-[#1c2847] text-white shadow-sm'
                  : 'text-[#667089] hover:text-[#1c2847] hover:bg-[#eef1f8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
        <b>Admin Note:</b> Suggestions are submitted by verified property owners directly to public buyer requirements. No prior approval is required; use <b>Remove</b> only if a suggestion violates terms or is completely mismatched.
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search suggestions by property title, requirement ID, seller name..."
      />
    </div>
  );
}
