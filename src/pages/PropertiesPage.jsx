import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, updatePropStatus, deleteProp } from '../store/slices/propertiesSlice';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import {
  Building2,
  ShieldCheck,
  Trash2,
  Eye,
  MapPin,
  Tag,
  BedDouble,
  Bath,
  Maximize2,
  Phone,
} from 'lucide-react';

export default function PropertiesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.properties);

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProp, setSelectedProp] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    dispatch(fetchProperties({ status: statusFilter }));
  }, [dispatch, statusFilter]);

  const handleVerify = async (id) => {
    await dispatch(updatePropStatus({ id, status: 'verified' }));
    dispatch(fetchProperties({ status: statusFilter }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property listing?')) {
      await dispatch(deleteProp(id));
    }
  };

  const columns = [
    {
      header: 'Property Listing',
      key: 'title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
            {row.photos && row.photos[0] ? (
              <img
                src={row.photos[0].startsWith('http') ? row.photos[0] : `http://localhost:8000${row.photos[0]}`}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-5 h-5 text-slate-600" />
            )}
          </div>
          <div>
            <div className="font-bold text-slate-100 max-w-xs truncate">{row.title}</div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-brand-500" />
              <span>{row.sector || row.area}, {row.city}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Type & Purpose',
      key: 'type',
      render: (row) => (
        <div className="space-y-1 text-xs">
          <span className="font-bold text-slate-200 capitalize">{row.propertyType}</span>
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                row.propertyFor === 'rent'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              For {row.propertyFor}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Price / Rent',
      key: 'price',
      render: (row) => (
        <div>
          <div className="font-extrabold text-white text-sm">৳{Number(row.price).toLocaleString()}</div>
          {row.priceNegotiable && <span className="text-[10px] font-semibold text-emerald-400">Negotiable</span>}
        </div>
      ),
    },
    {
      header: 'Specs',
      key: 'specs',
      render: (row) => (
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          {row.bedrooms && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" />
              {row.bedrooms}
            </span>
          )}
          {row.sizeSqFt && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />
              {row.sizeSqFt} sqft
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => {
        const badgeColors = {
          pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          matched: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeColors[row.status] || badgeColors.pending}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' && (
            <button
              onClick={() => handleVerify(row.id)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
              title="Verify & Approve"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedProp(row);
              setActivePhotoIdx(0);
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Preview Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            title="Delete Property"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Properties Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, verify, and manage all property listings across the platform.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'pending', label: 'Pending Approval' },
            { id: 'verified', label: 'Verified' },
            { id: 'matched', label: 'Matched' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={list}
        loading={loading}
        searchPlaceholder="Search properties by title, sector, area, city..."
      />

      {/* Property Detail Modal */}
      <Modal
        isOpen={!!selectedProp}
        onClose={() => setSelectedProp(null)}
        title={selectedProp?.title || 'Property Details'}
        subtitle={`${selectedProp?.sector || selectedProp?.area}, ${selectedProp?.city} · Listing ID #${selectedProp?.id}`}
        maxWidth="max-w-4xl"
      >
        {selectedProp && (
          <div className="space-y-6 text-xs">
            {/* Gallery Preview */}
            {selectedProp.photos && selectedProp.photos.length > 0 ? (
              <div className="space-y-2">
                <div className="w-full h-72 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative">
                  <img
                    src={selectedProp.photos[activePhotoIdx]?.startsWith('http') ? selectedProp.photos[activePhotoIdx] : `http://localhost:8000${selectedProp.photos[activePhotoIdx]}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-white text-[11px] font-bold">
                    {activePhotoIdx + 1} / {selectedProp.photos.length}
                  </div>
                </div>

                {selectedProp.photos.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {selectedProp.photos.map((photo, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhotoIdx(i)}
                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 ${
                          i === activePhotoIdx ? 'border-brand-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={photo.startsWith('http') ? photo : `http://localhost:8000${photo}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-32 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 font-semibold">
                No photos uploaded for this property
              </div>
            )}

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Price / Rent</span>
                <span className="font-extrabold text-white text-sm">৳{Number(selectedProp.price).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Property Purpose</span>
                <span className="font-bold text-brand-400 capitalize">For {selectedProp.propertyFor}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Property Type</span>
                <span className="font-bold text-slate-200 capitalize">{selectedProp.propertyType}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Status</span>
                <span className="font-bold text-emerald-400 capitalize">{selectedProp.status}</span>
              </div>
            </div>

            {/* Address & Owner Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block border-b border-slate-800 pb-2">Location & Address</span>
                <p className="text-slate-300 font-medium">{selectedProp.address}</p>
                <p className="text-slate-400">Sector: {selectedProp.sector || 'N/A'} · Area: {selectedProp.area} · City: {selectedProp.city}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block border-b border-slate-800 pb-2">Owner / Contact Details</span>
                <div className="flex items-center gap-2 text-slate-200 font-semibold">
                  <Phone className="w-3.5 h-3.5 text-brand-500" />
                  <span>{selectedProp.contactNumber}</span>
                </div>
                {selectedProp.whatsappNumber && (
                  <div className="text-slate-400 font-medium">WhatsApp: {selectedProp.whatsappNumber}</div>
                )}
                {selectedProp.bestTime && (
                  <div className="text-slate-400 font-medium">Best Contact Time: {selectedProp.bestTime}</div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              {selectedProp.status === 'pending' && (
                <button
                  onClick={() => {
                    handleVerify(selectedProp.id);
                    setSelectedProp(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20"
                >
                  Approve & Verify Property
                </button>
              )}
              <button
                onClick={() => setSelectedProp(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
