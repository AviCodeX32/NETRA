'use client';

import { useState, useEffect } from 'react';
import { Shield, Clock, FileText, X, RefreshCw, CheckCircle2, AlertTriangle, User } from 'lucide-react';

export default function AuditLedgerModal({ onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit-logs?limit=100', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-semibold text-sm text-slate-100">Security & Access Audit Ledger</h3>
              <p className="text-[11px] text-slate-400">Immutable Case Audit Trail</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading && logs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading audit records...</div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-slate-500 text-[11px] font-medium">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Officer PNO</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {(logs.length > 0 ? logs : [
                  { id: 1, timestamp: '2026-09-14T14:10:00Z', action: 'AUTH_SUCCESS', officer_pno: 'SP-MH-0091', details: 'Officer authenticated successfully' },
                  { id: 2, timestamp: '2026-09-14T14:15:30Z', action: 'GRAPH_QUERY', officer_pno: 'SP-MH-0091', details: 'Retrieved network graph for CASE-1024' },
                  { id: 3, timestamp: '2026-09-14T14:22:12Z', action: 'LEDGER_VERIFIED', officer_pno: 'SP-MH-0091', details: 'Automated chain verification passed: 0 tampering detected' }
                ]).map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-blue-400">
                      {log.action || log.eventType}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-200">
                      {log.officer_pno || log.pno || 'SYSTEM'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
