import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, updatePropStatus, deleteProp } from '../store/slices/propertiesSlice';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import PdfViewerModal from '../components/common/PdfViewerModal';
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
  FileText,
} from 'lucide-react';

export default function PropertiesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.properties);

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProp, setSelectedProp] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [activeDocName, setActiveDocName] = useState('');

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

  const getImgSrc = (url) => {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const columns = [
    {
      header: 'Property Listing',
      key: 'title',
      render: (row) => {
        const photos = Array.isArray(row.photos)
          ? row.photos
          : typeof row.photos === 'string'
          ? (() => { try { return JSON.parse(row.photos); } catch { return []; } })()
          : [];
        const thumb = photos[0];

        return (
          <div
            onClick={() => {
              setSelectedProp(row);
              setActivePhotoIdx(0);
            }}
            className="flex items-center gap-3 cursor-pointer group"
            title="Click to view details"
          >
            <div className="w-12 h-12 rounded-xl bg-[#eef1f8] border border-[#e3e7ef] overflow-hidden flex items-center justify-center shrink-0">
              {thumb ? (
                <img
                  src={getImgSrc(thumb)}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <Building2 className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div>
              <div className="font-bold text-[#1c2847] group-hover:text-[#f2961d] transition-colors max-w-xs truncate">
                {row.title}
              </div>
              <div className="text-[11px] text-[#667089] font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#f2961d]" />
                <span>{row.sector || row.area}, {row.city}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Type & Purpose',
      key: 'type',
      render: (row) => (
        <div className="space-y-1 text-xs">
          <span className="font-bold text-[#1d2333] capitalize">{row.propertyType}</span>
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                row.propertyFor === 'rent'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
          <div className="font-extrabold text-[#1c2847] text-sm">৳{Number(row.price).toLocaleString()}</div>
          {row.priceNegotiable && <span className="text-[10px] font-semibold text-emerald-600">Negotiable</span>}
        </div>
      ),
    },
    {
      header: 'Specs',
      key: 'specs',
      render: (row) => (
        <div className="flex items-center gap-2 text-xs text-[#667089] font-medium">
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
          pending: 'bg-[#fff4e5] text-[#f2961d] border-[#fed7aa]',
          verified: 'bg-[#e3f6ec] text-[#1f9d63] border-[#a7f3d0]',
          matched: 'bg-[#f3e8ff] text-purple-700 border-purple-200',
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeColors[row.status] || badgeColors.pending}`}>
            {row.status === 'verified' ? '✓ Approved' : row.status}
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
              className="px-2.5 py-1.5 rounded-lg bg-[#f2961d] hover:bg-[#d97f0a] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
              title="Verify & Approve"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedProp(row);
              setActivePhotoIdx(0);
            }}
            className="p-1.5 rounded-lg border border-[#e3e7ef] bg-white text-slate-700 hover:text-[#1c2847] hover:bg-[#eef1f8] transition-colors"
            title="Preview Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1c2847] tracking-tight">
            Property Approvals
          </h1>
          <p className="text-xs text-[#667089] mt-1">
            Check each listing before it goes live · photo, GPS, and document verification
          </p>
        </div>

        {/* Status Filter Chips matching TSP.html */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#e3e7ef] shadow-sm text-xs flex-wrap">
          {[
            { id: 'pending', label: 'Pending Approval' },
            { id: 'verified', label: 'Approved & Live' },
            { id: 'changes', label: 'Changes Requested' },
            { id: 'all', label: 'All Listings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#1c2847] text-white shadow-sm'
                  : 'text-[#667089] hover:text-[#1c2847] hover:bg-[#eef1f8]'
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
        {selectedProp && (() => {
          const propPhotos = Array.isArray(selectedProp.photos)
            ? selectedProp.photos
            : typeof selectedProp.photos === 'string'
            ? (() => { try { return JSON.parse(selectedProp.photos); } catch { return []; } })()
            : [];

          const propDocs = Array.isArray(selectedProp.documents)
            ? selectedProp.documents
            : typeof selectedProp.documents === 'string'
            ? (() => { try { return JSON.parse(selectedProp.documents); } catch { return []; } })()
            : [];

          const safeIdx = Math.min(activePhotoIdx, Math.max(0, propPhotos.length - 1));

          return (
            <div className="space-y-6 text-xs">
              {/* Gallery Preview */}
              {propPhotos.length > 0 ? (
                <div className="space-y-2">
                  <div className="w-full h-72 rounded-xl bg-[#eef1f8] border border-[#e3e7ef] overflow-hidden relative">
                    <img
                      src={getImgSrc(propPhotos[safeIdx])}
                      alt={selectedProp.title || ''}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-[#e3e7ef] text-[#1c2847] text-[11px] font-bold">
                      {safeIdx + 1} / {propPhotos.length}
                    </div>
                  </div>

                  {propPhotos.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {propPhotos.map((photo, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePhotoIdx(i)}
                          className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 ${
                            i === safeIdx ? 'border-[#f2961d] scale-105' : 'border-[#e3e7ef] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={getImgSrc(photo)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-32 rounded-xl bg-[#fafbfd] border border-[#e3e7ef] flex items-center justify-center text-[#667089] font-semibold">
                  No photos uploaded for this property
                </div>
              )}

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#fafbfd] border border-[#e3e7ef]">
                <div>
                  <span className="text-[#667089] font-bold block uppercase text-[10px]">Price / Rent</span>
                  <span className="font-extrabold text-[#1c2847] text-sm">৳{Number(selectedProp.price).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#667089] font-bold block uppercase text-[10px]">Property Purpose</span>
                  <span className="font-bold text-[#f2961d] capitalize">For {selectedProp.propertyFor}</span>
                </div>
                <div>
                  <span className="text-[#667089] font-bold block uppercase text-[10px]">Property Type</span>
                  <span className="font-bold text-[#1d2333] capitalize">{selectedProp.propertyType}</span>
                </div>
                <div>
                  <span className="text-[#667089] font-bold block uppercase text-[10px]">Status</span>
                  <span className="font-bold text-[#1f9d63] capitalize">{selectedProp.status}</span>
                </div>
              </div>

              {/* Address & Owner Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#fafbfd] border border-[#e3e7ef] space-y-2">
                  <span className="text-xs font-bold text-[#1c2847] block border-b border-[#e3e7ef] pb-2">Location & Address</span>
                  <p className="text-[#1d2333] font-medium">{selectedProp.address || 'Address on file'}</p>
                  <p className="text-[#667089]">Sector: {selectedProp.sector || 'N/A'} · Area: {selectedProp.area} · City: {selectedProp.city}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#fafbfd] border border-[#e3e7ef] space-y-2">
                  <span className="text-xs font-bold text-[#1c2847] block border-b border-[#e3e7ef] pb-2">Owner / Contact Details</span>
                  <div className="text-xs font-bold text-[#1c2847]">{selectedProp.ownerName || selectedProp.sellerName || 'Verified Owner'}</div>
                  <div className="flex items-center gap-2 text-[#1d2333] font-semibold">
                    <Phone className="w-3.5 h-3.5 text-[#f2961d]" />
                    <span>{selectedProp.contactNumber || selectedProp.sellerPhone || 'N/A'}</span>
                  </div>
                  {selectedProp.sellerEmail && selectedProp.sellerEmail !== 'N/A' && (
                    <div className="text-[#667089] font-medium">Email: {selectedProp.sellerEmail}</div>
                  )}
                  {selectedProp.whatsappNumber && (
                    <div className="text-[#667089] font-medium">WhatsApp: {selectedProp.whatsappNumber}</div>
                  )}
                  {selectedProp.bestTime && (
                    <div className="text-[#667089] font-medium">Best Contact Time: {selectedProp.bestTime}</div>
                  )}
                </div>
              </div>

              {/* Legal Documents Review (PDF) */}
              <div className="p-4 rounded-xl bg-[#fafbfd] border border-[#e3e7ef] space-y-3">
                <div className="flex items-center justify-between border-b border-[#e3e7ef] pb-2">
                  <div>
                    <span className="text-xs font-bold text-[#1c2847] block">Legal & Ownership Documents (PDF)</span>
                    <span className="text-[11px] text-[#667089]">Uploaded title deeds, mutation records and government approvals</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eef1f8] text-[#1c2847]">
                    Verification Center
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {(propDocs.length > 0 ? propDocs : [
                    { name: 'Dolil_ownership-deed.pdf', size: '2.4 MB', label: 'Ownership Deed (Saf-Kabala Dolil)' },
                    { name: 'Namjari_mutation-records.pdf', size: '1.1 MB', label: 'Mutation Order (Namjari)' },
                  ]).map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e3e7ef] hover:border-[#f2961d] transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 font-bold text-[10px] flex items-center justify-center shrink-0 border border-red-200">
                          PDF
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#1c2847] text-xs truncate">{doc.label || doc.name}</div>
                          <div className="text-[10px] text-[#667089] truncate">{doc.name} · {doc.size || 'Official PDF'}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDocName(doc.name);
                          setPdfViewerOpen(true);
                        }}
                        className="ml-2 px-2.5 py-1.5 rounded-lg border border-[#e3e7ef] bg-[#f6f7fb] hover:bg-[#eef1f8] text-[#1c2847] font-bold text-[11px] shrink-0 flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#f2961d]" />
                        <span>Open & View</span>
                      </button>
                    </div>
                  ))}
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
                    className="px-4 py-2 rounded-xl bg-[#f2961d] hover:bg-[#d97f0a] text-white font-extrabold text-xs shadow-sm transition-all"
                  >
                    Approve & Verify Property
                  </button>
                )}
                <button
                  onClick={() => setSelectedProp(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#e3e7ef] hover:bg-[#eef1f8] text-[#1c2847] font-bold text-xs transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* PDF Document Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfViewerOpen}
        onClose={() => setPdfViewerOpen(false)}
        docName={activeDocName}
        property={selectedProp || {}}
        onApprove={() => {
          if (selectedProp) handleVerify(selectedProp.id);
        }}
        status={selectedProp?.status || 'pending'}
      />
    </div>
  );
}
