'use client';

import { useState } from 'react';
import { FolderPlus, Shield, X, AlertCircle, CheckCircle2, Loader2, User, Building, FileText } from 'lucide-react';
import { api } from '@/lib/api-client';

const CRIME_CATEGORIES = [
  'Maritime Hawala & Contraband',
  'Automated Ransomware Syndicate',
  'Synthetic Narcotics Distribution',
  'Commercial Financial Fraud & Cyber Money-Mule',
  'Critical Infrastructure Cyber Espionage'
];

export default function CreateCaseModal({ onClose, onCaseCreated, defaultStation = 'MUM-AND-04' }) {
  const [formData, setFormData] = useState({
    caseNumber: `FIR-2026-${defaultStation}-${Math.floor(1000 + Math.random() * 9000)}`,
    title: '',
    category: CRIME_CATEGORIES[0],
    stationCode: defaultStation,
    assignedOfficerPno: 'IO-MH-7723',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        caseNumber: formData.caseNumber.trim(),
        title: formData.title.trim(),
        category: formData.category,
        stationCode: formData.stationCode.trim(),
        assignedOfficerPno: formData.assignedOfficerPno,
        description: formData.description.trim()
      };

      const res = await api.createCase(payload);
      if (res && res.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onCaseCreated) onCaseCreated(res.case);
          onClose();
        }, 1200);
      } else {
        setError(res?.error || 'Failed to open case docket.');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with case registry authority.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100 tracking-tight">Register New Investigation Docket (FIR)</h3>
              <p className="text-[11px] text-slate-400 font-mono">Supervisor Authorization Required (SP Clearance)</p>
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

          {success && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Case Docket Registered Successfully. Initializing isolated graph canvas...</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">FIR / Docket ID</label>
              <input
                type="text"
                required
                value={formData.caseNumber}
                onChange={(e) => setFormData(p => ({ ...p, caseNumber: e.target.value.toUpperCase() }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Police Station Jurisdiction</label>
              <input
                type="text"
                required
                value={formData.stationCode}
                onChange={(e) => setFormData(p => ({ ...p, stationCode: e.target.value.toUpperCase() }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Investigation / Operation Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Inter-State Hawala & Container Terminal Syndicate"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Crime Classification</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {CRIME_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Investigating Officer</label>
              <select
                value={formData.assignedOfficerPno}
                onChange={(e) => setFormData(p => ({ ...p, assignedOfficerPno: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="IO-MH-7723">Sub-Inspector Vikram Shinde (IO-MH-7723)</option>
                <option value="IO-MH-8841">Inspector Rajesh Kulkarni (IO-MH-8841)</option>
                <option value="IO-MH-9999">Sub-Inspector Amit Patil (IO-MH-9999)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Initial FIR Synopsis & Modus Operandi</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Brief summary of intercepted intelligence, complainants, initial suspect numbers..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 resize-none"
            />
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
              disabled={loading || success}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Registering Docket...</span>
                </>
              ) : (
                <span>Register & Open Case</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
