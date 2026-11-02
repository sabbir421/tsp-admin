import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  XCircle,
  Building2,
  User,
  FileCheck,
  Eye,
  Filter,
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import PdfViewerModal from '../components/common/PdfViewerModal';

const BADGE_CATEGORIES = {
  property: [
    { k: 'photo', name: 'Verified Photos & Layout', price: 'Free', desc: 'TrueSpace photographer or GPS-verified photos' },
    { k: 'video', name: 'Video Walkthrough', price: 'Free', desc: '1080p continuous interior walkthrough' },
    { k: 'docs', name: 'Ownership Title Deed Checked', price: 'Paid · ৳1,500', desc: 'Deed of Sale & Mutation reviewed by legal analyst' },
    { k: 'rajuk', name: 'Building Plan & RAJUK Approved', price: 'Paid · ৳2,000', desc: 'RAJUK / DAP approved construction drawings' },
    { k: 'inspect', name: 'Physical Inspection Certified', price: 'Paid · ৳2,500', desc: 'On-site engineering inspection & floor check' },
  ],
  user: [
    { k: 'nid', name: 'NID Verified', price: 'Free', desc: 'National ID card smart verification' },
    { k: 'card', name: 'Business Card Verified', price: 'Free', desc: 'Verified employment / business affiliation' },
    { k: 'trade', name: 'Trade License Verified', price: 'Free', desc: 'Trade license of commercial / developer entity' },
  ],
};

const INITIAL_REQUESTS = [];

export default function BadgesPage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [typeFilter, setTypeFilter] = useState('all');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleDecision = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filteredRequests = requests.filter((r) => {
    if (typeFilter === 'all') return true;
    return r.targetType === typeFilter;
  });

  const columns = [
    {
      header: 'For Target',
      key: 'targetTitle',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-bold text-[#1c2847] flex items-center gap-1.5">
            {row.targetType === 'property' ? (
              <Building2 className="w-3.5 h-3.5 text-[#f2961d] shrink-0" />
            ) : (
              <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            )}
            <span>{row.targetTitle}</span>
          </div>
          <div className="text-[11px] text-[#667089]">
            {row.targetId} · Owner: <b>{row.owner}</b>
          </div>
        </div>
      ),
    },
    {
      header: 'Badge Category',
      key: 'badgeName',
      render: (row) => (
        <div>
          <div className="font-bold text-[#1c2847] text-xs flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{row.badgeName}</span>
          </div>
          <div className="text-[11px] font-semibold text-[#f2961d]">{row.price}</div>
        </div>
      ),
    },
    {
      header: 'Proof Evidence',
      key: 'proofFile',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#1d2333] font-medium truncate max-w-[160px]">
            {row.proofFile}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedDoc(row);
              setPdfModalOpen(true);
            }}
            className="p-1 rounded-md border border-[#e3e7ef] bg-[#f6f7fb] hover:bg-[#eef1f8] text-[#1c2847] transition-colors"
            title="Inspect submitted evidence"
          >
            <Eye className="w-3.5 h-3.5 text-[#f2961d]" />
          </button>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
            row.status === 'approved'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : row.status === 'rejected'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {row.status === 'approved'
            ? '✓ Verified'
            : row.status === 'rejected'
            ? 'Rejected'
            : 'Pending'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status !== 'approved' && (
            <button
              type="button"
              onClick={() => handleDecision(row.id, 'approved')}
              className="px-2.5 py-1 rounded-lg bg-[#1f9d63] hover:bg-[#168150] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
          )}

          {row.status !== 'rejected' && (
            <button
              type="button"
              onClick={() => handleDecision(row.id, 'rejected')}
              className="px-2.5 py-1 rounded-lg border border-[#e3e7ef] bg-white hover:bg-rose-50 hover:text-rose-600 text-[#667089] font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{row.status === 'approved' ? 'Revoke' : 'Reject'}</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1c2847] tracking-tight">
          Verification Badges & Certificates
        </h1>
        <p className="text-xs text-[#667089] mt-1">
          Review and certify optional property features and user identity badges (Prototype v39)
        </p>
      </div>

      {/* Available Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Property Badges */}
        <div className="p-4 bg-white rounded-2xl border border-[#e3e7ef] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#e3e7ef] pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#f2961d]" />
              <h2 className="text-xs font-bold text-[#1c2847] uppercase tracking-wider">
                Property Verification Badges
              </h2>
            </div>
            <span className="text-[11px] text-[#667089] font-medium">5 badge tiers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BADGE_CATEGORIES.property.map((b) => (
              <div key={b.k} className="p-2.5 rounded-xl bg-[#f6f7fb] border border-[#e3e7ef]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1c2847] text-xs">{b.name}</span>
                  <span className="text-[10px] font-bold text-[#f2961d]">{b.price}</span>
                </div>
                <p className="text-[10px] text-[#667089] mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Badges */}
        <div className="p-4 bg-white rounded-2xl border border-[#e3e7ef] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#e3e7ef] pb-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-[#1c2847] uppercase tracking-wider">
                User Identity Badges
              </h2>
            </div>
            <span className="text-[11px] text-[#667089] font-medium">3 trust credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BADGE_CATEGORIES.user.map((b) => (
              <div key={b.k} className="p-2.5 rounded-xl bg-[#f6f7fb] border border-[#e3e7ef]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1c2847] text-xs">{b.name}</span>
                  <span className="text-[10px] font-bold text-emerald-600">{b.price}</span>
                </div>
                <p className="text-[10px] text-[#667089] mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1c2847]">Badge Approval Queue</h2>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#e3e7ef] text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'property', label: 'Properties' },
              { id: 'user', label: 'Users' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  typeFilter === tab.id
                    ? 'bg-[#1c2847] text-white shadow-sm'
                    : 'text-[#667089] hover:text-[#1c2847]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredRequests}
          searchPlaceholder="Search badge requests by target, badge name, or owner..."
        />
      </div>

      {/* PDF Document Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        docName={selectedDoc?.proofFile}
        property={{
          title: selectedDoc?.targetTitle,
          owner: selectedDoc?.owner,
        }}
        status={selectedDoc?.status}
        onApprove={() => {
          if (selectedDoc) handleDecision(selectedDoc.id, 'approved');
        }}
        onReject={() => {
          if (selectedDoc) handleDecision(selectedDoc.id, 'rejected');
        }}
      />
    </div>
  );
}
