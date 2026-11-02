import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  FileText,
  CheckCircle2,
  XCircle,
  Download,
} from 'lucide-react';

const PDFW = 540;
const PDFH = 764;

// Sample legal document content generators matching Prototype v39
export function getPdfDocumentPages(docName, property = {}) {
  const n = String(docName || '').toLowerCase();
  const own = property.owner || property.contactName || 'Md. Sabbir Ahmed';
  const loc = property.area || property.sector || 'Banani, Dhaka';
  const ttl = property.title || 'Residential Apartment in Block-C';
  const ar = (String(loc).split(',')[0] || 'Dhaka').trim();

  const SAMPLE_NOTE = {
    type: 'note',
    text: 'Prototype sample. TrueSpace generated this page to show how a submitted PDF is reviewed. It is not a real legal document.',
  };

  if (/deed|dolil/.test(n)) {
    return [
      [
        { type: 'gov', text: "Government of the People's Republic of Bangladesh" },
        { type: 'sub', text: 'Non-judicial stamp · Tk 300 · Registered deed' },
        { type: 'h1', text: 'Deed of Sale (Saf-Kabala Dolil)' },
        {
          type: 'kv',
          items: [
            ['Deed no.', '4127 of 2019'],
            ['Registration office', `Sub-Registry Office, ${ar}, Dhaka`],
            ['Date of registration', '14 March 2019'],
            ['Book / volume / pages', 'Book I · Vol. 212 · pp. 81-96'],
          ],
        },
        { type: 'h2', text: 'Parties' },
        {
          type: 'kv',
          items: [
            ['Vendor (seller)', `Md. Abdul Karim, ${loc}`],
            ['Vendee (buyer)', own],
            ['Property', ttl],
            ['Location', `Block-C, ${loc}`],
          ],
        },
        {
          type: 'p',
          text: 'This deed of sale is made between the vendor and the vendee named above. The vendor transfers full ownership of the property described in the schedule, free of any charge, lien or claim, for the consideration stated on page 3.',
        },
        SAMPLE_NOTE,
      ],
      [
        { type: 'h2', text: 'Schedule of the property' },
        {
          type: 'tbl',
          headers: ['District', 'Thana', 'Mouza', 'Khatian', 'Dag'],
          rows: [
            ['Dhaka', ar, ar, 'RS 1021', '2213'],
            ['Dhaka', ar, ar, 'BS 3315', '4407'],
          ],
        },
        {
          type: 'p',
          text: 'One residential apartment in Block-C, with an undivided and undemarcated share of the land beneath the building, one car parking space and the right to use common stairs, lift and roof.',
        },
        { type: 'h2', text: 'Boundaries' },
        {
          type: 'kv',
          items: [
            ['North', '20 ft public road'],
            ['South', 'Plot C-18'],
            ['East', 'Plot C-15'],
            ['West', 'Plot C-17'],
          ],
        },
        { type: 'h2', text: 'Floor area' },
        {
          type: 'kv',
          items: [
            ['Apartment', `${property.sizeSqFt || '1,850'} sq ft as stated in the listing`],
            ['Land share', 'Proportionate share of 5 katha'],
          ],
        },
        SAMPLE_NOTE,
      ],
      [
        { type: 'h2', text: 'Consideration and declarations' },
        {
          type: 'p',
          text: 'The full consideration has been paid by the vendee and received by the vendor in the presence of the witnesses. The vendor declares that the property has no mortgage, lease or pending case, and that the mutation will be made in the vendee\'s name.',
        },
        {
          type: 'kv',
          items: [
            ['Consideration', 'Paid in full (amount on the registered copy)'],
            ['Stamp duty and fees', 'Paid · challan 77810'],
          ],
        },
        { type: 'sig', signers: ['Signature of vendor', 'Signature of vendee'] },
        { type: 'sig', signers: ['Witness 1', 'Witness 2'] },
        { type: 'stamp', text: `Registered · Sub-Registrar, ${ar}` },
        SAMPLE_NOTE,
      ],
    ];
  }

  if (/namjari|mutation/.test(n)) {
    return [
      [
        { type: 'gov', text: `Office of the Assistant Commissioner (Land), ${ar} Circle, Dhaka` },
        { type: 'h1', text: 'Mutation (Namjari) Order' },
        {
          type: 'kv',
          items: [
            ['Mutation case no.', '1187 / 2024-25'],
            ['Date of order', '9 February 2025'],
            ['Applicant', own],
            ['Mouza / JL no.', `${ar} / 41`],
            ['Previous khatian', '2984'],
            ['New khatian', '3315'],
          ],
        },
        { type: 'h2', text: 'Order' },
        {
          type: 'p',
          text: 'After hearing the applicant and checking the registered deed no. 4127 of 2019, the record of rights is corrected and a new khatian is opened in the applicant\'s name for the land described below. The applicant must pay land development tax (khajna) under the new khatian.',
        },
        SAMPLE_NOTE,
      ],
      [
        { type: 'h2', text: 'Land under the new khatian' },
        {
          type: 'tbl',
          headers: ['Dag', 'Class', 'Share', 'Area'],
          rows: [
            ['4407', 'Residential', 'Undivided share', 'As per deed'],
            ['2213', 'Residential', 'Undivided share', 'As per deed'],
          ],
        },
        {
          type: 'kv',
          items: [
            ['DCR (fee receipt) no.', '552190'],
            ['Fee paid', 'Tk 1,170'],
            ['Linked deed', `4127 of 2019 (${ar})`],
          ],
        },
        { type: 'sig', signers: ['Revenue officer', 'Assistant Commissioner (Land)'] },
        { type: 'stamp', text: `Approved · AC Land, ${ar}` },
        SAMPLE_NOTE,
      ],
    ];
  }

  if (/nid/.test(n)) {
    return [
      [
        { type: 'gov', text: 'Bangladesh Election Commission' },
        { type: 'h1', text: 'National ID card (front and back)' },
        {
          type: 'card',
          items: [
            ['Name', own],
            ['Date of birth', '12 Aug 1986'],
            ['NID no.', '1986 2692 4471 0002 (verified)'],
            ['Address', loc],
          ],
        },
        {
          type: 'p',
          text: 'The seller uploaded both sides of the card in one PDF. Check that the name matches the seller account and the ownership papers.',
        },
        SAMPLE_NOTE,
      ],
    ];
  }

  if (/trade/.test(n)) {
    return [
      [
        { type: 'gov', text: 'Dhaka North City Corporation' },
        { type: 'h1', text: 'Trade Licence 2026-27' },
        {
          type: 'kv',
          items: [
            ['Licence no.', 'DNCC-TL-0458821'],
            ['Business name', own],
            ['Business type', 'Real estate developer / owner'],
            ['Address', `${ar}, Dhaka`],
            ['Valid until', '30 June 2027'],
          ],
        },
        { type: 'stamp', text: 'Issued · DNCC Revenue Department' },
        SAMPLE_NOTE,
      ],
    ];
  }

  if (/rajuk/.test(n)) {
    return [
      [
        { type: 'gov', text: 'Rajdhani Unnayan Kartripakkha (RAJUK)' },
        { type: 'h1', text: 'Building Plan Approval Letter' },
        {
          type: 'kv',
          items: [
            ['Memo no.', 'RAJUK/DC-3/2023/1442'],
            ['Date', '16 May 2023'],
            ['Applicant', own],
            ['Property', ttl],
            ['Location', loc],
          ],
        },
        {
          type: 'p',
          text: 'The building plan submitted by the applicant is approved for the number of floors and use stated in the schedule, under the Dhaka Building Construction Rules. Construction must follow the approved drawings.',
        },
        SAMPLE_NOTE,
      ],
      [
        { type: 'h2', text: 'Approval schedule' },
        {
          type: 'tbl',
          headers: ['Item', 'Approved specification'],
          rows: [
            ['Use', 'Residential Apartment'],
            ['Floors', 'Ground + 8'],
            ['Basement', '1 (parking & utilities)'],
            ['FAR', 'As per DAP guidelines'],
          ],
        },
        { type: 'sig', signers: ['Authorised Officer', 'Development Control'] },
        { type: 'stamp', text: 'Approved · RAJUK Planning Wing' },
        SAMPLE_NOTE,
      ],
    ];
  }

  // Fallback generic doc
  return [
    [
      { type: 'gov', text: 'TrueSpace Document Repository' },
      { type: 'h1', text: docName || 'Submitted Document' },
      {
        type: 'kv',
        items: [
          ['File Name', docName || 'Document.pdf'],
          ['Submitted by', own],
          ['Property', ttl],
          ['Date Submitted', new Date().toLocaleDateString('en-GB')],
        ],
      },
      {
        type: 'p',
        text: 'This document was submitted as part of the listing verification procedure. Review all terms and confirm authenticity before approving the listing.',
      },
      SAMPLE_NOTE,
    ],
  ];
}

export default function PdfViewerModal({
  isOpen,
  onClose,
  docName,
  property = {},
  onApprove,
  onReject,
  status = 'pending',
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (isOpen && docName) {
      const generated = getPdfDocumentPages(docName, property);
      setPages(generated);
      setCurrentPage(1);
      setZoom(1);
    }
  }, [isOpen, docName, property]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((p) => Math.min(pages.length, p + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((p) => Math.max(1, p - 1));
      } else if (e.key === '+' || e.key === '=') {
        setZoom((z) => Math.min(2.5, Math.round((z + 0.2) * 10) / 10));
      } else if (e.key === '-') {
        setZoom((z) => Math.max(0.5, Math.round((z - 0.2) * 10) / 10));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pages.length, onClose]);

  if (!isOpen) return null;

  const totalPages = pages.length;
  const currentContent = pages[currentPage - 1] || [];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0a0f1e]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-[#e3e7ef]">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#e3e7ef] bg-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-lg bg-red-50 text-red-600 font-extrabold text-xs flex items-center justify-center shrink-0 border border-red-200">
              PDF
            </span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#1c2847] truncate">
                {docName || 'Property Verification Document.pdf'}
              </h2>
              <div className="text-[11px] text-[#667089] truncate">
                {property.title || 'Listing'} · Submitted by {property.owner || property.contactName || 'Owner'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[#e3e7ef] bg-[#f6f7fb] text-[#1c2847] hover:bg-[#eef1f8] flex items-center justify-center transition-colors"
              aria-label="Close PDF viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Meta Row */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 bg-[#f6f7fb] border-b border-[#e3e7ef] text-xs shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#e3e7ef] text-[#1c2847] font-semibold text-[11px]">
            <span className="text-[#667089] font-normal">Type:</span> PDF Official Record
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#e3e7ef] text-[#1c2847] font-semibold text-[11px]">
            <span className="text-[#667089] font-normal">Pages:</span> {totalPages}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#e3e7ef] text-[#1c2847] font-semibold text-[11px]">
            <span className="text-[#667089] font-normal">Status:</span>
            <span
              className={`font-bold ${
                status === 'verified' || status === 'approved'
                  ? 'text-emerald-700'
                  : status === 'rejected'
                  ? 'text-rose-700'
                  : 'text-[#f2961d]'
              }`}
            >
              {status === 'verified' || status === 'approved'
                ? 'Approved'
                : status === 'rejected'
                ? 'Rejected'
                : 'Under Review'}
            </span>
          </span>
          <span className="text-[11px] text-[#667089] ml-auto">
            Review all pages before certifying ownership authenticity
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2 border-b border-[#e3e7ef] bg-white shrink-0 text-xs">
          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-[#e3e7ef] bg-white text-[#1c2847] hover:bg-[#eef1f8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 font-semibold text-[#1c2847]">
              <span>Page</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (val >= 1 && val <= totalPages) setCurrentPage(val);
                }}
                className="w-12 text-center py-1 border border-[#e3e7ef] rounded-md text-xs font-bold focus:border-[#f2961d] outline-none"
              />
              <span className="text-[#667089]">of {totalPages}</span>
            </div>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-[#e3e7ef] bg-white text-[#1c2847] hover:bg-[#eef1f8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.2) * 10) / 10))}
              className="p-1.5 rounded-lg border border-[#e3e7ef] bg-white text-[#1c2847] hover:bg-[#eef1f8] transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-bold text-[#1c2847]">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.2, Math.round((z + 0.2) * 10) / 10))}
              className="p-1.5 rounded-lg border border-[#e3e7ef] bg-white text-[#1c2847] hover:bg-[#eef1f8] transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="px-2.5 py-1 rounded-lg border border-[#e3e7ef] bg-white text-[#1c2847] hover:bg-[#eef1f8] font-semibold text-[11px] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Document Rendering Canvas */}
        <div className="flex-1 bg-[#5b6377] p-6 overflow-auto flex justify-center items-start select-text">
          <div
            className="bg-white shadow-2xl rounded-sm transition-transform duration-150 origin-top"
            style={{
              width: `${PDFW * zoom}px`,
              minHeight: `${PDFH * zoom}px`,
            }}
          >
            <div
              className="p-10 font-serif text-[#1b1b1b] relative min-h-[764px] flex flex-col justify-between"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                width: `${PDFW}px`,
                height: `${PDFH}px`,
              }}
            >
              <div className="space-y-4">
                {currentContent.map((item, idx) => {
                  if (item.type === 'gov') {
                    return (
                      <div
                        key={idx}
                        className="text-center font-bold text-xs uppercase tracking-wide text-[#1c2847] border-b border-[#e3e7ef] pb-1.5"
                      >
                        {item.text}
                      </div>
                    );
                  }
                  if (item.type === 'sub') {
                    return (
                      <div key={idx} className="text-center text-[11px] text-[#667089] -mt-2">
                        {item.text}
                      </div>
                    );
                  }
                  if (item.type === 'h1') {
                    return (
                      <h1
                        key={idx}
                        className="text-center font-extrabold text-lg text-[#111] my-3 uppercase tracking-tight"
                      >
                        {item.text}
                      </h1>
                    );
                  }
                  if (item.type === 'h2') {
                    return (
                      <h2
                        key={idx}
                        className="text-sm font-bold text-[#111] mt-4 mb-2 border-b border-gray-300 pb-1"
                      >
                        {item.text}
                      </h2>
                    );
                  }
                  if (item.type === 'p') {
                    return (
                      <p key={idx} className="text-xs leading-relaxed text-justify text-[#222]">
                        {item.text}
                      </p>
                    );
                  }
                  if (item.type === 'kv') {
                    return (
                      <table key={idx} className="w-full text-xs border-collapse my-2">
                        <tbody>
                          {item.items.map(([k, v], rIdx) => (
                            <tr key={rIdx} className="border-b border-gray-100">
                              <td className="w-2/5 font-bold text-gray-700 py-1.5 pr-2 align-top">{k}</td>
                              <td className="text-gray-900 py-1.5 align-top font-medium">{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  }
                  if (item.type === 'tbl') {
                    return (
                      <table key={idx} className="w-full text-xs border-collapse my-2 border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            {item.headers.map((h, hIdx) => (
                              <th
                                key={hIdx}
                                className="border border-gray-300 px-2 py-1.5 text-left font-bold text-gray-700"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.rows.map((r, rIdx) => (
                            <tr key={rIdx}>
                              {r.map((cell, cIdx) => (
                                <td key={cIdx} className="border border-gray-300 px-2 py-1 text-gray-900">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  }
                  if (item.type === 'card') {
                    return (
                      <div key={idx} className="p-3 bg-gray-50 border border-emerald-300 rounded-lg space-y-2">
                        <div className="flex gap-4 items-center">
                          <div className="w-16 h-20 bg-gray-300 rounded border border-gray-400 flex items-center justify-center text-[10px] text-gray-600 font-bold shrink-0">
                            PHOTO
                          </div>
                          <table className="w-full text-xs">
                            <tbody>
                              {item.items.map(([k, v], rIdx) => (
                                <tr key={rIdx}>
                                  <td className="font-bold text-gray-600 pr-2 py-0.5">{k}:</td>
                                  <td className="text-gray-900 font-semibold">{v}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }
                  if (item.type === 'sig') {
                    return (
                      <div key={idx} className="flex justify-between items-center gap-8 pt-6 pb-2">
                        {item.signers.map((s, sIdx) => (
                          <div key={sIdx} className="flex-1 text-center text-xs">
                            <div className="border-t border-gray-800 w-full mb-1"></div>
                            <span className="text-gray-700 font-serif italic">{s}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  if (item.type === 'stamp') {
                    return (
                      <div
                        key={idx}
                        className="inline-block border-2 border-emerald-700 text-emerald-800 font-bold text-xs uppercase px-3 py-1.5 rounded -rotate-2 my-2 font-mono"
                      >
                        {item.text}
                      </div>
                    );
                  }
                  if (item.type === 'note') {
                    return (
                      <div
                        key={idx}
                        className="p-2 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] rounded font-sans leading-tight mt-auto"
                      >
                        {item.text}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Page Footer */}
              <div className="border-t border-gray-200 pt-3 text-[10px] text-gray-500 font-sans flex justify-between items-center">
                <span>{docName || 'Property Record'}</span>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-[#e3e7ef] bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#e3e7ef] hover:bg-[#eef1f8] text-[#1c2847] font-bold text-xs transition-colors"
          >
            ‹ Back to listing
          </button>

          <div className="flex items-center gap-2">
            {onReject && (
              <button
                type="button"
                onClick={() => {
                  onReject();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Document</span>
              </button>
            )}

            {onApprove && (
              <button
                type="button"
                onClick={() => {
                  onApprove();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-[#1f9d63] hover:bg-[#168150] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Document</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
