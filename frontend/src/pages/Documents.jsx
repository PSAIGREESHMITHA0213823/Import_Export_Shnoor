

import { useState, useRef, useEffect, useCallback } from "react";
import { api } from "../utils/api";
const Icon = ({ d, size = 16, className = "", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>{d}</svg>
);

const SearchIcon = <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>;
const UploadIcon = <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>;
const FileIcon = <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>;
const ChevronL = <polyline points="15 18 9 12 15 6"/>;
const ChevronR = <polyline points="9 18 15 12 9 6"/>;
const ClockIcon = <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>;
const TrashIcon = <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>;
const CheckIcon = <polyline points="20 6 9 17 4 12"/>;

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

function UploadTab({ onUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const doUpload = async (file) => {
    setError("");
    setResult(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.uploadDoc(fd);
      setResult(res);
      onUploaded?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  };

  const onSelect = (e) => {
    const file = e.target.files[0];
    if (file) doUpload(file);
    e.target.value = "";
  };

  const conf = result ? Math.round(result.ocr_confidence * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Document OCR Upload</h2>
            <p className="text-xs text-slate-400 mt-0.5">AI extracts invoice data with high accuracy</p>
          </div>
          <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-full">
            AI-Powered OCR
          </span>
        </div>

        <div className="p-6">
          {/* Drop zone */}
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
              ${dragging
                ? "border-blue-400 bg-blue-50"
                : uploading
                ? "border-slate-200 bg-slate-50 cursor-wait"
                : "border-slate-200 bg-slate-50/30 hover:border-blue-300 hover:bg-blue-50"
              }`}
          >
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
              onChange={onSelect}
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm font-semibold text-slate-600">Processing document…</p>
                <p className="text-xs text-slate-400">Extracting data with OCR</p>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon d={UploadIcon} size={22} className="text-blue-500" />
                </div>
                <p className="font-semibold text-slate-700 mb-1">Drop files here or click to browse</p>
                <p className="text-xs text-slate-400">PDF, PNG, JPG, XLSX, CSV — max 10MB</p>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <span className="mt-0.5">⚠️</span>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Extracted Data</h3>
          </div>

          <div className="p-6 space-y-5">
            {/* Confidence Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    conf >= 80 ? "bg-emerald-500" : conf >= 60 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${conf}%` }}
                />
              </div>
              <span className={`text-sm font-bold tabular-nums ${
                conf >= 80 ? "text-emerald-600" : conf >= 60 ? "text-amber-600" : "text-rose-600"
              }`}>
                {conf}%
              </span>
            </div>

            {/* Extracted Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Document ID</p>
                <p className="text-sm font-semibold text-slate-600 font-mono">{result.document_id}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Filename</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{result.filename}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Invoice Number</p>
                <p className="text-base font-extrabold text-slate-900">{result.extracted_data.invoice_number || "—"}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Invoice Date</p>
                <p className="text-base font-bold text-slate-700">{result.extracted_data.date || "—"}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
                <p className="text-2xl font-black text-blue-600">${fmt(result.extracted_data.total_amount)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Currency</p>
                <p className="text-base font-bold text-slate-700">{result.extracted_data.currency || "USD"}</p>
              </div>
            </div>

            {/* Raw JSON */}
            <div className="mt-2 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Raw extracted data (JSON)</p>
              <pre className="text-xs text-slate-600 bg-slate-50 rounded-xl p-4 overflow-auto max-h-48 border border-slate-100">
                {JSON.stringify(result.extracted_data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── History Tab Component ─────────────────────────────────────────────────
function HistoryTab({ refresh }) {
  const [documents, setDocuments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const PAGE_SIZE = 10;

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listDocuments(PAGE_SIZE, page * PAGE_SIZE);
      setDocuments(data.documents || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refresh]);

  const filtered = search.trim()
    ? documents.filter(
        (doc) =>
          doc.filename?.toLowerCase().includes(search.toLowerCase()) ||
          doc.document_id?.toLowerCase().includes(search.toLowerCase()) ||
          doc.extracted_data?.invoice_number?.toLowerCase().includes(search.toLowerCase())
      )
    : documents;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleDelete = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.deleteDocument(docId);
      fetchDocuments();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-sm">Document History</h2>
          <p className="text-xs text-slate-400 mt-0.5">{total} total documents processed</p>
        </div>
      </div>

      <div className="px-6 pt-4 pb-3">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
            <Icon d={SearchIcon} size={14} />
          </div>
          <input type="text" placeholder="Search by filename, document ID, or invoice number…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition" />
        </div>
      </div>

      {error && (
        <div className="mx-6 mb-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 px-6">
          <div className="text-4xl mb-3">📂</div>
          <p className="text-sm font-semibold">{search ? "No results match your search" : "No documents uploaded yet"}</p>
          {!search && <p className="text-xs mt-1">Use the Upload tab to process documents</p>}
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map((doc) => {
            const conf = doc.ocr_confidence ? Math.round(doc.ocr_confidence * 100) : 0;
            return (
              <div key={doc.document_id} className="px-6 py-4 hover:bg-slate-50/50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon d={FileIcon} size={14} className="text-blue-500" />
                      </div>
                      <p className="font-semibold text-slate-900">{doc.filename}</p>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {doc.document_id?.slice(-8)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                      <Icon d={ClockIcon} size={11} />
                      Uploaded: {new Date(doc.created_at).toLocaleString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>

                    {doc.extracted_data && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Invoice #</p>
                          <p className="text-sm font-bold text-slate-800">{doc.extracted_data.invoice_number || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date</p>
                          <p className="text-sm text-slate-600">{doc.extracted_data.date || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Amount</p>
                          <p className="text-sm font-extrabold text-blue-600">
                            {doc.extracted_data.total_amount ? `$${fmt(doc.extracted_data.total_amount)}` : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Confidence</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[60px]">
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${conf >= 80 ? "bg-emerald-500" : conf >= 60 ? "bg-amber-500" : "bg-rose-500"}`} 
                                  style={{ width: `${conf}%` }} />
                              </div>
                            </div>
                            <span className={`text-xs font-bold ${conf >= 80 ? "text-emerald-600" : conf >= 60 ? "text-amber-600" : "text-rose-600"}`}>
                              {conf}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedDoc(selectedDoc?.document_id === doc.document_id ? null : doc)}
                      className="mt-3 text-xs font-semibold text-blue-500 hover:text-blue-600"
                    >
                      {selectedDoc?.document_id === doc.document_id ? "Hide raw data" : "Show raw data"}
                    </button>

                    {selectedDoc?.document_id === doc.document_id && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <pre className="text-xs text-slate-600 overflow-auto max-h-48">
                          {JSON.stringify(doc.extracted_data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(doc.document_id)}
                    className="text-slate-300 hover:text-rose-500 transition p-1"
                    title="Delete"
                  >
                    <Icon d={TrashIcon} size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !search && (
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-400">Page {page + 1} of {totalPages} · {total} records</p>
          <div className="flex items-center gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition">
              <Icon d={ChevronL} size={12} /> Prev
            </button>
            <span className="text-xs font-semibold text-slate-500 px-1">{page + 1}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition">
              Next <Icon d={ChevronR} size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════════════════════
export default function Documents() {
  const [activeTab, setActiveTab] = useState("upload");
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    { id: "upload", label: "Upload", icon: UploadIcon },
    { id: "history", label: "History", icon: ClockIcon },
  ];

  return (
    <div className="p-6 space-y-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Page header */}
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Documents</h1>
        <p className="text-xs text-slate-400 mt-0.5">Upload and manage documents with AI-powered OCR extraction</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === t.id
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}>
            <Icon d={t.icon} size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "upload" && <UploadTab onUploaded={() => setRefreshKey(k => k + 1)} />}
      {activeTab === "history" && <HistoryTab refresh={refreshKey} />}
    </div>
  );
}