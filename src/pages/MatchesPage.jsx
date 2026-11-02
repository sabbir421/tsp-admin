import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatches } from '../store/slices/matchesSlice';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { GitCompare, Eye, CheckCircle2, Clock, Calendar, MessageSquare } from 'lucide-react';

export default function MatchesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.matches);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const columns = [
    {
      header: 'Match ID',
      key: 'id',
      render: (row) => <span className="font-bold text-[#1c2847]">#MATCH-{row.id}</span>,
    },
    {
      header: 'Requirement Ref',
      key: 'requirementId',
      render: (row) => (
        <span className="font-semibold text-[#f2961d]">Requirement #{row.requirementId}</span>
      ),
    },
    {
      header: 'Matched Property',
      key: 'propertyId',
      render: (row) => (
        <span className="font-semibold text-[#1c2847]">Property #{row.propertyId}</span>
      ),
    },
    {
      header: 'Match Status',
      key: 'status',
      render: (row) => {
        const badgeColors = {
          pending: 'bg-[#fff4e5] text-[#f2961d] border-[#fed7aa]',
          accepted: 'bg-[#e3f6ec] text-[#1f9d63] border-[#a7f3d0]',
          rejected: 'bg-[#fde8e8] text-[#d64545] border-[#fecaca]',
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeColors[row.status] || badgeColors.pending}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Site Visit Status',
      key: 'siteVisitStatus',
      render: (row) => (
        <span className="text-xs font-bold text-[#1d2333] capitalize">
          {row.siteVisitStatus || 'None Scheduled'}
        </span>
      ),
    },
    {
      header: 'Sent Date',
      key: 'createdAt',
      render: (row) => (
        <span className="text-xs text-[#667089] font-medium">
          {new Date(row.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => setSelectedMatch(row)}
          className="p-1.5 rounded-lg border border-[#e3e7ef] bg-white text-slate-700 hover:text-[#1c2847] hover:bg-[#eef1f8] transition-colors"
          title="View Match Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1c2847] tracking-tight">
            Matches & Site Visits
          </h1>
          <p className="text-xs text-[#667089] mt-1">
            Track property suggestions sent by sellers to buyers and monitor site visit completions.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={list}
        loading={loading}
        searchPlaceholder="Search matches by ID, status, seller note..."
      />

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title={`Match Record #MATCH-${selectedMatch?.id}`}
        subtitle={`Sent on ${selectedMatch ? new Date(selectedMatch.createdAt).toLocaleString() : ''}`}
      >
        {selectedMatch && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#fafbfd] border border-[#e3e7ef]">
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Requirement ID</span>
                <span className="font-bold text-[#f2961d] text-sm">#{selectedMatch.requirementId}</span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Matched Property ID</span>
                <span className="font-bold text-[#1c2847] text-sm">#{selectedMatch.propertyId}</span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Buyer Acceptance Status</span>
                <span className="font-bold text-[#1f9d63] uppercase">{selectedMatch.status}</span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Site Visit Status</span>
                <span className="font-bold text-[#1d2333] capitalize">{selectedMatch.siteVisitStatus || 'None'}</span>
              </div>
            </div>

            {selectedMatch.sellerNote && (
              <div className="p-4 rounded-xl bg-[#fafbfd] border border-[#e3e7ef] space-y-1">
                <span className="text-xs font-bold text-[#1c2847] block border-b border-[#e3e7ef] pb-2">Seller Note to Buyer</span>
                <p className="text-[#1d2333]">{selectedMatch.sellerNote}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#e3e7ef] hover:bg-[#eef1f8] text-[#1c2847] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
