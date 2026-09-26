'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X, Shield, Lock } from 'lucide-react';
import { api } from '@/lib/api-client';

const EVIDENCE_CATEGORIES = [
  'Call Detail Records (CDR)',
  'Banking RTGS & UPI Ledger',
  'Encrypted Messaging Intercept',
  'CCTV / Physical Surveillance Scan',
  'Digital Device Forensic Dump',
  'Hawala Token & Slip Exhibit'
];

export default function AddEvidenceModal({ 
  targetCaseId = 'CASE-1024', 
  cases = [], 
  onClose, 
  onEvidenceUploaded 
}) {
  const [caseId, setCaseId] = useState(targetCaseId);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(EVIDENCE_CATEGORIES[0]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an evidence file to upload.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caseId', caseId);
      formData.append('category', category);

      const res = await api.uploadEvidence(formData);
      if (res && res.success) {
        setResult(res.evidence);
        setTimeout(() => {
          if (onEvidenceUploaded) onEvidenceUploaded(res.evidence);
          onClose();
        }, 1500);
      } else {
        setError(res?.error || 'Evidence ingestion failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload evidence file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100 tracking-tight">Ingest Case Evidence Exhibit</h3>
              <p className="text-[11px] text-slate-400 font-mono">Cyber Forensics & Supervisor Ingestion Authority</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Exhibit Anchored into Custody Chain (Block #{result.blockHeight})</span>
              </div>
              <div className="font-mono text-[10px] text-slate-400 truncate">SHA-256: {result.sha256Hash}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Case Docket</label>
            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber || c.id} · {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Evidence Classification</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {EVIDENCE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Select Exhibit File</label>
            <div className="p-5 border-2 border-dashed border-slate-700/80 hover:border-emerald-500/60 rounded-xl text-center bg-slate-900/50 transition-colors">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                {file ? (
                  <div className="text-xs">
                    <span className="font-semibold text-emerald-400">{file.name}</span>
                    <span className="text-slate-500 block mt-0.5 font-mono">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-medium text-slate-300 block">Click to select exhibit file</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Supports CSV, PDF, JPG, PNG, TXT, JSON (Max 50MB)</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file || Boolean(result)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Hash & Ingesting...</span>
                </>
              ) : (
                <span>Ingest & Anchor Exhibit</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
