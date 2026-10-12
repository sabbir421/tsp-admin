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
        <div>
          <div className="font-bold text-slate-100 max-w-xs truncate">{row.title || 'Property Requirement'}</div>
          <div className="text-[11px] text-slate-400 font-medium">Buyer ID: #{row.buyerId}</div>
        </div>
      ),
    },
    {
      header: 'Category & Subtype',
      key: 'category',
      render: (row) => (
        <div className="space-y-1 text-xs">
          <span className="font-bold text-brand-400 capitalize">{row.category}</span>
          {row.subType && <div className="text-slate-400 text-[11px] font-medium">{row.subType}</div>}
        </div>
      ),
    },
    {
      header: 'Desired Specs',
      key: 'specs',
      render: (row) => (
        <div className="text-xs text-slate-300 font-medium">
          {row.bedrooms ? `${row.bedrooms} Bed · ` : ''}
          {row.sizeSqFt ? `${row.sizeSqFt} sqft` : ''}
        </div>
      ),
    },
    {
      header: 'Location / Sector',
      key: 'area',
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-brand-500" />
          <span>{row.area || row.sector || row.zone || 'Dhaka'}</span>
        </div>
      ),
    },
    {
      header: 'Max Budget',
      key: 'maxBudget',
      render: (row) => (
        <div className="font-extrabold text-emerald-400 text-sm">
          {row.maxBudget ? `৳${Number(row.maxBudget).toLocaleString()}` : 'Flexible'}
        </div>
      ),
    },
    {
      header: 'Posted Date',
      key: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-400 font-medium">
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
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="View Requirement Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Buyer & Tenant Requirements
          </h1>
          <p className="text-xs text-slate-400 mt-1">
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
        subtitle={`Requirement ID #${selectedReq?.id} · Posted by Buyer #${selectedReq?.buyerId}`}
      >
        {selectedReq && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Category</span>
                <span className="font-bold text-brand-400 capitalize">{selectedReq.category}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Property Subtype</span>
                <span className="font-bold text-slate-200 capitalize">{selectedReq.subType || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Max Budget</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  {selectedReq.maxBudget ? `৳${Number(selectedReq.maxBudget).toLocaleString()}` : 'Flexible'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Preferred Area</span>
                <span className="font-semibold text-slate-200">{selectedReq.area || selectedReq.city || 'Dhaka'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Desired Bedrooms</span>
                <span className="font-semibold text-slate-200">{selectedReq.bedrooms || 'Flexible'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Minimum Size</span>
                <span className="font-semibold text-slate-200">{selectedReq.sizeSqFt ? `${selectedReq.sizeSqFt} sqft` : 'Flexible'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-white block border-b border-slate-800 pb-2">Description / Notes</span>
              <p className="text-slate-300 leading-relaxed">{selectedReq.description || selectedReq.title || 'No extra notes provided.'}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
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
