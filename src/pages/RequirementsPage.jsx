import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequirements, deleteReq } from '../store/slices/requirementsSlice';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { ClipboardList, Trash2, Eye, MapPin, Tag, DollarSign } from 'lucide-react';

export default function RequirementsPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.requirements);
  const [selectedReq, setSelectedReq] = useState(null);

  useEffect(() => {
    dispatch(fetchRequirements());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this requirement post?')) {
      await dispatch(deleteReq(id));
    }
  };

  const columns = [
    {
      header: 'Requirement Title',
      key: 'title',
      render: (row) => (
        <div
          onClick={() => setSelectedReq(row)}
          className="cursor-pointer group"
          title="Click to view full details"
        >
          <div className="font-bold text-[#1c2847] group-hover:text-[#f2961d] transition-colors max-w-xs truncate">
            {row.title || 'Property Requirement'}
          </div>
          <div className="text-[11px] text-[#667089] font-medium flex items-center gap-1.5 mt-0.5">
            <span className="font-semibold text-slate-700">{row.buyerName || `Buyer #${row.buyerId}`}</span>
            {row.buyerPhone && row.buyerPhone !== 'N/A' && (
              <span className="text-slate-400">• {row.buyerPhone}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Category & Subtype',
      key: 'category',
      render: (row) => (
        <div className="space-y-1 text-xs">
          <span className="font-bold text-[#f2961d] capitalize">{row.category}</span>
          {row.subType && <div className="text-[#667089] text-[11px] font-medium">{row.subType}</div>}
        </div>
      ),
    },
    {
      header: 'Desired Specs',
      key: 'specs',
      render: (row) => (
        <div className="text-xs text-[#1d2333] font-medium">
          {row.bedrooms ? `${row.bedrooms} Bed · ` : ''}
          {row.sizeSqFt ? `${row.sizeSqFt} sqft` : 'Specs flexible'}
        </div>
      ),
    },
    {
      header: 'Location / Sector',
      key: 'area',
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-[#1d2333]">
          <MapPin className="w-3.5 h-3.5 text-[#f2961d]" />
          <span>{row.area || row.sector || row.zone || 'Dhaka'}</span>
        </div>
      ),
    },
    {
      header: 'Max Budget',
      key: 'maxBudget',
      render: (row) => (
        <div className="font-extrabold text-[#1f9d63] text-sm">
          {row.maxBudget ? `৳${Number(row.maxBudget).toLocaleString()}` : 'Flexible'}
        </div>
      ),
    },
    {
      header: 'Posted Date',
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedReq(row)}
            className="p-1.5 rounded-lg border border-[#e3e7ef] bg-white text-slate-700 hover:text-[#1c2847] hover:bg-[#eef1f8] transition-colors"
            title="View Requirement Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Delete Requirement"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1c2847] tracking-tight">
            Buyer & Tenant Requirements
          </h1>
          <p className="text-xs text-[#667089] mt-1">
            Monitor real-time buyer demand posts and requirement details across Dhaka sectors.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={list}
        loading={loading}
        searchPlaceholder="Search requirements by title, sector, area, category..."
      />

      {/* Requirement Detail Modal */}
      <Modal
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title={selectedReq?.title || 'Requirement Details'}
        subtitle={`Requirement REQ-${selectedReq?.id} · Posted on ${selectedReq?.createdAt ? new Date(selectedReq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}`}
        maxWidth="max-w-2xl"
      >
        {selectedReq && (
          <div className="space-y-4 text-xs">
            {/* Buyer Contact Card */}
            <div className="p-4 rounded-xl bg-[#eef1f8]/60 border border-[#c5cce0]">
              <span className="text-[#1c2847] font-bold block uppercase text-[10px] tracking-wider mb-2">
                Buyer / Poster Profile
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[#667089] block text-[11px]">Full Name</span>
                  <span className="font-bold text-[#1c2847] text-sm">
                    {selectedReq.buyerName || selectedReq.buyer?.fullName || `Buyer #${selectedReq.buyerId}`}
                  </span>
                </div>
                <div>
                  <span className="text-[#667089] block text-[11px]">Phone Number</span>
                  <span className="font-bold text-[#1c2847] text-sm">
                    {selectedReq.buyerPhone || selectedReq.buyer?.phone || 'Not available'}
                  </span>
                </div>
                <div>
                  <span className="text-[#667089] block text-[11px]">Email Address</span>
                  <span className="font-semibold text-[#1c2847] truncate block">
                    {selectedReq.buyerEmail || selectedReq.buyer?.email || 'Not available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Requirement Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#fafbfd] border border-[#e3e7ef]">
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Category</span>
                <span className="font-bold text-[#f2961d] capitalize">{selectedReq.category}</span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Property Subtype</span>
                <span className="font-bold text-[#1d2333] capitalize">{selectedReq.subType || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Max Budget</span>
                <span className="font-extrabold text-[#1f9d63] text-sm">
                  {selectedReq.maxBudget ? `৳${Number(selectedReq.maxBudget).toLocaleString()}` : 'Flexible'}
                </span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Preferred Area / Sector</span>
                <span className="font-semibold text-[#1d2333]">{selectedReq.area || selectedReq.sector || selectedReq.zone || selectedReq.city || 'Dhaka'}</span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Desired Bedrooms</span>
                <span className="font-semibold text-[#1d2333]">{selectedReq.bedrooms ? `${selectedReq.bedrooms} Bedrooms` : 'Flexible'}</span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Minimum Size</span>
                <span className="font-semibold text-[#1d2333]">{selectedReq.sizeSqFt ? `${selectedReq.sizeSqFt} sqft` : 'Flexible'}</span>
              </div>
              {selectedReq.floor && (
                <div>
                  <span className="text-[#667089] font-bold block uppercase text-[10px]">Preferred Floor</span>
                  <span className="font-semibold text-[#1d2333]">{selectedReq.floor} {selectedReq.totalFloors ? `of ${selectedReq.totalFloors}` : ''}</span>
                </div>
              )}
              <div>
                <span className="text-[#667089] font-bold block uppercase text-[10px]">Status</span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  {selectedReq.status || 'Active'}
                </span>
              </div>
            </div>

            {/* Notes / Must-Haves */}
            <div className="p-4 rounded-xl bg-[#fafbfd] border border-[#e3e7ef] space-y-1">
              <span className="text-xs font-bold text-[#1c2847] block border-b border-[#e3e7ef] pb-2">Description / Specific Details</span>
              <p className="text-[#1d2333] leading-relaxed pt-1">
                {selectedReq.mustIncludeDetails || selectedReq.residentialNotes || selectedReq.description || 'No additional notes provided.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this requirement post?')) {
                    await handleDelete(selectedReq.id);
                    setSelectedReq(null);
                  }
                }}
                className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Requirement
              </button>

              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="px-5 py-2 rounded-xl bg-white border border-[#e3e7ef] hover:bg-[#eef1f8] text-[#1c2847] font-bold text-xs transition-colors"
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
